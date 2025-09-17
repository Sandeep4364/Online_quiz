export interface TriviaQuestion {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  category: string;
  difficulty: string;
  userAnswer?: string;
  isCorrect?: boolean;
}

export interface QuizConfig {
  amount: number;
  category?: number;
  difficulty?: string;
  timer: number;
}

export interface QuizState {
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  score: number;
  timeLeft: number;
  isActive: boolean;
  isCompleted: boolean;
  showResults: boolean;
  streak: number;
  hintsUsed: number;
  totalTime: number;
  startTime?: number;
}

export interface Category {
  id: number;
  name: string;
}

export interface QuizSettings {
  soundEnabled: boolean;
  autoAdvance: boolean;
  hintsEnabled: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  condition: (stats: QuizStats) => boolean;
  unlocked: boolean;
}

export interface QuizStats {
  totalQuizzes: number;
  totalQuestions: number;
  correctAnswers: number;
  averageScore: number;
  bestStreak: number;
  fastestTime: number;
  achievements: string[];
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  percentage: number;
  time: number;
  date: string;
  category: string;
  difficulty: string;
}

export interface Theme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
  };
}