import React from 'react';
import { Trophy, Home, RotateCcw } from 'lucide-react';
import { QuizState } from '../types/quiz';
import { calculatePercentage, getScoreMessage } from '../utils/quizHelpers';

interface QuizResultsProps {
  quiz: QuizState;
  onExit: () => void;
}

export const QuizResults: React.FC<QuizResultsProps> = ({ quiz, onExit }) => {
  const percentage = calculatePercentage(quiz.score, quiz.questions.length);
  const { title, message, color } = getScoreMessage(percentage);
  
  const totalTime = quiz.totalTime || 0;
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
      <div className="text-center mb-8">
        <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
          <Trophy size={40} className="text-white" />
        </div>
        <h2 className={`text-3xl font-bold ${color} mb-2`}>{title}</h2>
        <p className="text-gray-600 text-lg">{message}</p>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">{quiz.score}</div>
            <div className="text-gray-600">Correct</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-600">{quiz.questions.length - quiz.score}</div>
            <div className="text-gray-600">Wrong</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">{percentage}%</div>
            <div className="text-gray-600">Score</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">{formatTime(totalTime)}</div>
            <div className="text-gray-600">Time</div>
          </div>
        </div>
        
        {/* Additional Stats */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-orange-600">{quiz.streak}</div>
              <div className="text-sm text-gray-600">Best Streak</div>
            </div>
            <div>
              <div className="text-lg font-bold text-indigo-600">{quiz.hintsUsed}</div>
              <div className="text-sm text-gray-600">Hints Used</div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4 mb-8">
        <h3 className="text-xl font-semibold text-gray-900">Review Answers</h3>
        {quiz.questions.map((question, index) => (
          <div key={index} className="p-4 border rounded-lg">
            <div className="flex items-start gap-3 mb-2">
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                question.isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {index + 1}
              </span>
              <div className="flex-1">
                <p className="font-medium text-gray-900 mb-1">{question.question}</p>
                <p className="text-xs text-gray-500 mb-2">{question.category} • {question.difficulty}</p>
                <div className="text-sm space-y-1">
                  <p>
                    <span className="font-medium text-gray-700">Your answer:</span>{' '}
                    <span className={question.isCorrect ? 'text-green-600' : 'text-red-600'}>
                      {question.userAnswer || 'No answer'}
                    </span>
                  </p>
                  {!question.isCorrect && (
                    <p>
                      <span className="font-medium text-gray-700">Correct answer:</span>{' '}
                      <span className="text-green-600">{question.correctAnswer}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center">
        <button
          onClick={onExit}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-300 flex items-center justify-center gap-3 mx-auto"
        >
          <Home size={20} />
          Back to Home
        </button>
      </div>
    </div>
  );
};