import React from 'react';
import { Lightbulb, Zap } from 'lucide-react';
import { QuizQuestion as QuizQuestionType } from '../types/quiz';
import { StorageService } from '../services/storageService';

interface QuizQuestionProps {
  question: QuizQuestionType;
  onAnswer: (answer: string) => void;
  showFeedback: boolean;
  selectedAnswer?: string;
  onHint?: () => void;
  hintUsed?: boolean;
  streak?: number;
  onEndSession?: () => void;
}

export const QuizQuestion: React.FC<QuizQuestionProps> = ({ 
  question, 
  onAnswer, 
  showFeedback, 
  selectedAnswer,
  onHint,
  hintUsed = false,
  streak = 0,
  onEndSession
}) => {
  const settings = StorageService.getSettings();

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAnswerButtonClass = (answer: string) => {
    if (!showFeedback) {
      return 'w-full p-4 text-left border-2 border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200';
    }

    if (answer === question.correctAnswer) {
      return 'w-full p-4 text-left border-2 border-green-500 bg-green-50 text-green-800 rounded-lg';
    }

    if (answer === selectedAnswer && answer !== question.correctAnswer) {
      return 'w-full p-4 text-left border-2 border-red-500 bg-red-50 text-red-800 rounded-lg';
    }

    return 'w-full p-4 text-left border-2 border-gray-200 bg-gray-50 text-gray-600 rounded-lg';
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-sm text-gray-500">#{question.id}</span>
        <span className="text-sm text-gray-400">•</span>
        <span className="text-sm text-gray-600">{question.category}</span>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(question.difficulty)}`}>
          {question.difficulty.toUpperCase()}
        </span>
        {streak > 0 && (
          <div className="flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-semibold">
            <Zap className="w-3 h-3" />
            {streak} streak
          </div>
        )}
      </div>

      {settings.showHints && onHint && !showFeedback && (
        <div className="mb-4">
          <button
            onClick={onHint}
            disabled={hintUsed}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              hintUsed
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
            }`}
          >
            <Lightbulb className="w-4 h-4" />
            {hintUsed ? 'Hint Used' : 'Get Hint'}
          </button>
        </div>
      )}

      <h2 className="text-2xl font-bold text-gray-900 mb-8 leading-relaxed">
        {question.question}
      </h2>

      {/* Back Button */}
      {onEndSession && (
        <div className="mb-6">
          <button
            onClick={onEndSession}
            className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
          >
            ← End Quiz
          </button>
        </div>
      )}

      <div className="space-y-3">
        {question.options.map((answer, index) => {
          const isHintAnswer = hintUsed && answer !== question.correctAnswer && Math.random() > 0.5;
          return (
          <button
            key={index}
            onClick={() => !showFeedback && onAnswer(answer)}
            className={`${getAnswerButtonClass(answer)} ${isHintAnswer ? 'opacity-40' : ''}`}
            disabled={showFeedback}
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center text-sm font-semibold">
                {String.fromCharCode(65 + index)}
              </span>
              <span className="font-medium">{answer}</span>
            </div>
          </button>
        );
        })}
      </div>

      {showFeedback && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800 font-medium">
            {selectedAnswer === question.correctAnswer ? '✅ Correct!' : '❌ Incorrect'}
          </p>
          {question.explanation && (
            <p className="text-blue-700 mt-2">{question.explanation}</p>
          )}
        </div>
      )}
    </div>
  );
};