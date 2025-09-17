import { useState, useEffect, useCallback } from 'react';

export const useQuizTimer = (initialTime: number, onTimeUp: () => void) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isActive, setIsActive] = useState(false);

  const startTimer = useCallback(() => {
    setIsActive(true);
  }, []);

  const pauseTimer = useCallback(() => {
    setIsActive(false);
  }, []);

  const resetTimer = useCallback((newTime?: number) => {
    setTimeLeft(newTime || initialTime);
    setIsActive(false);
  }, [initialTime]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            setIsActive(false);
            onTimeUp();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      if (interval) {
        clearInterval(interval);
      }
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isActive, timeLeft, onTimeUp]);

  return {
    timeLeft,
    isActive,
    startTimer,
    pauseTimer,
    resetTimer
  };
};