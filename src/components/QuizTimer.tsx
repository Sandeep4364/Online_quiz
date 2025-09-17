import React from 'react';
import { Clock } from 'lucide-react';
import { formatTime } from '../utils/quizHelpers';

interface QuizTimerProps {
  timeLeft: number;
  isActive: boolean;
  isWarning?: boolean;
}

export const QuizTimer: React.FC<QuizTimerProps> = ({ timeLeft, isActive, isWarning = false }) => {
  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
      isWarning 
        ? 'bg-red-100 text-red-700 animate-pulse' 
        : 'bg-blue-100 text-blue-700'
    }`}>
      <Clock size={20} className={isActive ? 'animate-spin' : ''} />
      <span className="font-mono text-lg font-semibold">
        {formatTime(timeLeft)}
      </span>
    </div>
  );
};