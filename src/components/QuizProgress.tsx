import React from 'react';

interface QuizProgressProps {
  currentQuestion: number;
  totalQuestions: number;
  score: number;
}

export const QuizProgress: React.FC<QuizProgressProps> = ({ currentQuestion, totalQuestions, score }) => {
  const progressPercentage = (currentQuestion / totalQuestions) * 100;

  return (
    <div className="w-full space-y-3">
      <div className="flex justify-between items-center text-sm font-medium text-gray-600">
        <span>Question {currentQuestion} of {totalQuestions}</span>
        <span>Score: {score}/{totalQuestions}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  );
};