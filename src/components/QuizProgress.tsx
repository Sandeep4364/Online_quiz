import React from 'react';

interface QuizProgressProps {
  current: number;
  total: number;
  score: number;
}

export const QuizProgress: React.FC<QuizProgressProps> = ({ current, total, score }) => {
  const progressPercentage = (current / total) * 100;

  return (
    <div className="w-full space-y-3">
      <div className="flex justify-between items-center text-sm font-medium text-gray-600">
        <span>Question {current} of {total}</span>
        <span>Score: {score}/{total}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      <div className="text-xs text-gray-500 text-center">
        {total - current} questions remaining
      </div>
    </div>
  );
};