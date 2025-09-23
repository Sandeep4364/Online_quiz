import React, { useState, useCallback } from 'react';
import { Brain, Settings, Trophy, BarChart3 } from 'lucide-react';
import { QuizSetup } from './components/QuizSetup';
import { QuizQuestion } from './components/QuizQuestion';
import { QuizResults } from './components/QuizResults';
import { QuizProgress } from './components/QuizProgress';
import { QuizTimer } from './components/QuizTimer';
import { QuizSettings } from './components/QuizSettings';
import { Leaderboard } from './components/Leaderboard';
import { Statistics } from './components/Statistics';
import { useQuizTimer } from './hooks/useQuizTimer';
import { TriviaAPI } from './services/triviaApi';
import { StorageService } from './services/storageService';
import { SoundService } from './services/soundService';
import { transformTriviaQuestions } from './utils/quizHelpers';
import { QuizConfig, QuizState, QuizQuestion as QuizQuestionType } from './types/quiz';
import { themes } from './data/themes';
import { achievements } from './data/achievements';

function App() {
  const [gameState, setGameState] = useState<'setup' | 'playing' | 'results'>('setup');
  const [loading, setLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showStatistics, setShowStatistics] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(StorageService.getTheme());
  const [playerName, setPlayerName] = useState('');
  const [quiz, setQuiz] = useState<QuizState>({
    questions: [],
    currentQuestionIndex: 0,
    score: 0,
    timeLeft: 0,
    isActive: false,
    isCompleted: false,
    showResults: false,
    streak: 0,
    hintsUsed: 0,
    totalTime: 0,
    startTime: undefined
  });
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | undefined>();
  const [hintUsed, setHintUsed] = useState(false);

  const theme = themes.find(t => t.id === currentTheme) || themes[0];
  const settings = StorageService.getSettings();

  // Initialize sound service
  React.useEffect(() => {
    SoundService.setEnabled(settings.soundEnabled);
  }, [settings.soundEnabled]);

  const handleTimeUp = useCallback(() => {
    if (gameState === 'playing' && !showFeedback) {
      SoundService.playWarning();
      handleAnswer(''); // Empty string represents no answer
    }
  }, [gameState, showFeedback]);

  const { timeLeft, isActive, startTimer, pauseTimer, resetTimer } = useQuizTimer({
    initialTime: 30,
    onTimeUp: handleTimeUp
  });

  const startQuiz = async (config: QuizConfig) => {
    setLoading(true);
    try {
      const triviaQuestions = await TriviaAPI.fetchQuestions(config);
      
      // Validate we got the requested number of questions
      if (triviaQuestions.length < config.amount) {
        throw new Error(`Only ${triviaQuestions.length} questions available for this category/difficulty. Please try different settings.`);
      }
      
      // Ensure we only use the exact number requested
      const questions = transformTriviaQuestions(triviaQuestions);
      const limitedQuestions = questions.slice(0, config.amount);
      
      setQuiz({
        questions: limitedQuestions,
        currentQuestionIndex: 0,
        score: 0,
        timeLeft: config.timer,
        isActive: false,
        isCompleted: false,
        showResults: false,
        streak: 0,
        hintsUsed: 0,
        totalTime: 0,
        startTime: Date.now()
      });

      resetTimer(config.timer);
      setGameState('playing');
      setShowFeedback(false);
      setSelectedAnswer(undefined);
      setHintUsed(false);
      
      // Start timer after a brief delay
      setTimeout(() => {
        startTimer();
      }, 1000);
    } catch (error) {
      console.error('Failed to start quiz:', error);
      alert(error instanceof Error ? error.message : 'Unable to load questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (answer: string) => {
    if (showFeedback) return;

    pauseTimer();
    setSelectedAnswer(answer);
    
    const currentQuestion = quiz.questions[quiz.currentQuestionIndex];
    const isCorrect = answer === currentQuestion.correctAnswer;
    
    // Play sound effects
    if (isCorrect) {
      SoundService.playCorrect();
    } else {
      SoundService.playIncorrect();
    }
    
    // Update question with user answer
    const updatedQuestions = quiz.questions.map((q, index) => 
      index === quiz.currentQuestionIndex 
        ? { ...q, userAnswer: answer, isCorrect }
        : q
    );

    const newStreak = isCorrect ? quiz.streak + 1 : 0;

    setQuiz(prev => ({
      ...prev,
      questions: updatedQuestions,
      score: isCorrect ? prev.score + 1 : prev.score,
      streak: newStreak
    }));

    setShowFeedback(true);

    // Always show feedback first, then handle progression
    if (settings.autoAdvance) {
      setTimeout(() => {
        if (quiz.currentQuestionIndex + 1 >= quiz.questions.length) {
          endQuiz();
        } else {
          nextQuestion();
        }
      }, 2500);
    }
  };

  const endQuiz = () => {
    // Calculate final stats and save
    const totalTime = quiz.startTime ? Math.floor((Date.now() - quiz.startTime) / 1000) : 0;
    const percentage = Math.round((quiz.score / quiz.questions.length) * 100);
    
    // Update statistics
    const stats = StorageService.getStats();
    const newStats = {
      ...stats,
      totalQuizzes: stats.totalQuizzes + 1,
      totalQuestions: stats.totalQuestions + quiz.questions.length,
      correctAnswers: stats.correctAnswers + quiz.score,
      averageScore: Math.round(((stats.averageScore * stats.totalQuizzes) + percentage) / (stats.totalQuizzes + 1)),
      bestStreak: Math.max(stats.bestStreak, quiz.streak),
      fastestTime: stats.fastestTime === 0 ? totalTime : Math.min(stats.fastestTime, totalTime)
    };
    StorageService.saveStats(newStats);
    
    // Add to leaderboard if player name is provided
    if (playerName.trim()) {
      const leaderboard = StorageService.getLeaderboard();
      const entry = {
        id: Date.now().toString(),
        name: playerName.trim(),
        score: quiz.score,
        percentage,
        time: totalTime,
        date: new Date().toISOString(),
        category: 'Mixed',
        difficulty: 'Mixed'
      };
      leaderboard.push(entry);
      StorageService.saveLeaderboard(leaderboard);
    }
    
    // Check for new achievements
    const unlockedAchievements = achievements.filter(achievement => 
      achievement.condition(newStats) && !stats.achievements?.includes(achievement.id)
    );
    
    if (unlockedAchievements.length > 0) {
      SoundService.playComplete();
    }
    
    // Update quiz state with completion data
    setQuiz(prev => ({
      ...prev,
      isCompleted: true,
      totalTime: totalTime
    }));
    
    setGameState('results');
  };

  const nextQuestion = () => {
    const nextIndex = quiz.currentQuestionIndex + 1;
    
    // This function should only be called for non-final questions
    if (nextIndex >= quiz.questions.length) return;

    setQuiz(prev => ({
      ...prev,
      currentQuestionIndex: nextIndex
    }));

    setShowFeedback(false);
    setSelectedAnswer(undefined);
    setHintUsed(false);
    resetTimer();
    
    setTimeout(() => {
      startTimer();
    }, 500);
  };

  const restartQuiz = () => {
    setQuiz(prev => ({
      ...prev,
      currentQuestionIndex: 0,
      score: 0,
      streak: 0,
      hintsUsed: 0,
      startTime: Date.now(),
      isCompleted: false,
      totalTime: 0,
      questions: prev.questions.map(q => ({
        ...q,
        userAnswer: undefined,
        isCorrect: undefined
      }))
    }));

    setGameState('playing');
    setShowFeedback(false);
    setSelectedAnswer(undefined);
    setHintUsed(false);
    resetTimer();
    
    setTimeout(() => {
      startTimer();
    }, 1000);
  };

  const exitQuiz = () => {
    setGameState('setup');
    setQuiz({
      questions: [],
      currentQuestionIndex: 0,
      score: 0,
      timeLeft: 0,
      isActive: false,
      isCompleted: false,
      showResults: false,
      streak: 0,
      hintsUsed: 0,
      totalTime: 0,
      startTime: undefined
    });
    setShowFeedback(false);
    setSelectedAnswer(undefined);
    setHintUsed(false);
    setPlayerName('');
  };

  const handleHint = () => {
    if (hintUsed) return;
    setHintUsed(true);
    setQuiz(prev => ({ ...prev, hintsUsed: prev.hintsUsed + 1 }));
    SoundService.playTick();
  };

  const handleThemeChange = (themeId: string) => {
    setCurrentTheme(themeId);
    StorageService.saveTheme(themeId);
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.colors.background}`} style={{ color: theme.colors.text }}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: `linear-gradient(to bottom right, ${theme.colors.primary}, ${theme.colors.secondary})` }}
            >
              <Brain size={24} className="text-white" />
            </div>
            <h1 
              className="text-4xl font-bold bg-clip-text text-transparent"
              style={{ backgroundImage: `linear-gradient(to right, ${theme.colors.primary}, ${theme.colors.secondary})` }}
            >
              QuizMaster
            </h1>
          </div>
          
          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <button
              onClick={() => setShowStatistics(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white shadow-md hover:shadow-lg transition-all"
              style={{ color: theme.colors.primary }}
            >
              <BarChart3 size={20} />
              Stats
            </button>
            <button
              onClick={() => setShowLeaderboard(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white shadow-md hover:shadow-lg transition-all"
              style={{ color: theme.colors.primary }}
            >
              <Trophy size={20} />
              Leaderboard
            </button>
            <button
              onClick={() => setShowSettings(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white shadow-md hover:shadow-lg transition-all"
              style={{ color: theme.colors.primary }}
            >
              <Settings size={20} />
              Settings
            </button>
          </div>
          
          {gameState === 'setup' && (
            <div>
              <p className="text-gray-600 text-lg mb-4">
                Test your knowledge with dynamic trivia questions
              </p>
              <div className="max-w-xs mx-auto mb-4">
                <input
                  type="text"
                  placeholder="Enter your name (optional)"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Game Content */}
        {gameState === 'setup' && (
          <QuizSetup onStartQuiz={startQuiz} loading={loading} />
        )}

        {gameState === 'playing' && quiz.questions.length > 0 && (
          <div className="space-y-6">
            <QuizProgress 
              current={quiz.currentQuestionIndex + 1} 
              total={quiz.questions.length}
              score={quiz.score}
            />
            
            <QuizTimer timeLeft={timeLeft} isActive={isActive} />
            
            <QuizQuestion
              question={quiz.questions[quiz.currentQuestionIndex]}
              onAnswer={handleAnswer}
              showFeedback={showFeedback}
              selectedAnswer={selectedAnswer}
              onHint={handleHint}
              hintUsed={hintUsed}
              streak={quiz.streak}
              onEndSession={exitQuiz}
            />
            
            {showFeedback && !settings.autoAdvance && (
              <div className="text-center">
                <button
                  onClick={quiz.currentQuestionIndex + 1 >= quiz.questions.length ? endQuiz : nextQuestion}
                  className={`px-6 py-3 font-semibold rounded-lg transition-colors ${
                    quiz.currentQuestionIndex + 1 >= quiz.questions.length
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {quiz.currentQuestionIndex + 1 >= quiz.questions.length ? 'View Results' : 'Next Question'}
                </button>
              </div>
            )}
          </div>
        )}

        {gameState === 'results' && (
          <QuizResults
            quiz={quiz}
            onExit={exitQuiz}
          />
        )}
      </div>
      
      {/* Modals */}
      {showSettings && (
        <QuizSettings
          onClose={() => setShowSettings(false)}
          onThemeChange={handleThemeChange}
          currentTheme={currentTheme}
        />
      )}
      
      {showLeaderboard && (
        <Leaderboard onClose={() => setShowLeaderboard(false)} />
      )}
      
      {showStatistics && (
        <Statistics onClose={() => setShowStatistics(false)} />
      )}
    </div>
  );
}

export default App;