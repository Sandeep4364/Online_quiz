import React from 'react';
import { Trophy, RotateCcw, Home } from 'lucide-react';
import { QuizQuestion } from '../types/quiz';
import { calculatePercentage, getScoreMessage } from '../utils/quizHelpers';

interface QuizResultsProps {
  questions: QuizQuestion[];
  score: number;
  onRestart: () => void;
  onNewQuiz: () => void;
}

export const QuizResults: React.FC<QuizResultsProps> = ({ questions, score, onRestart, onNewQuiz }) => {
  const percentage = calculatePercentage(score, questions.length);
  const { title, message, color } = getScoreMessage(percentage);

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
        <div className="grid grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold text-blue-600">{score}</div>
            <div className="text-gray-600">Correct</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-red-600">{questions.length - score}</div>
            <div className="text-gray-600">Wrong</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-600">{percentage}%</div>
            <div className="text-gray-600">Score</div>
          </div>
        </div>
      </div>

      <div className="space-y-4 mb-8">
        <h3 className="text-xl font-semibold text-gray-900">Review Answers</h3>
        {questions.map((question, index) => (
          <div key={index} className="p-4 border rounded-lg">
            <div className="flex items-start gap-3 mb-2">
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                question.isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {index + 1}
              </span>
              <div className="flex-1">
                <p className="font-medium text-gray-900 mb-1">{question.question}</p>
                <div className="text-sm space-y-1">
                  <p>
                    <span className="font-medium text-gray-700">Your answer:</span>{' '}
                    <span className={question.isCorrect ? 'text-green-600' : 'text-red-600'}>
                      {question.userAnswer}
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

      <div className="flex gap-4">
        <button
          onClick={onRestart}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2"
        >
          <RotateCcw size={20} />
          Try Again
        </button>
        <button
          onClick={onNewQuiz}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2"
        >
          <Home size={20} />
          New Quiz
        </button>
      </div>
    </div>
  );
};