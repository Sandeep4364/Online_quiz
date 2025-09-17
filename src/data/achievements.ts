import { Achievement } from '../types/quiz';

export const achievements: Achievement[] = [
  {
    id: 'first_quiz',
    title: 'Getting Started',
    description: 'Complete your first quiz',
    icon: '🎯',
    condition: (stats) => stats.totalQuizzes >= 1,
    unlocked: false
  },
  {
    id: 'perfect_score',
    title: 'Perfect Score',
    description: 'Get 100% on a quiz',
    icon: '💯',
    condition: (stats) => stats.averageScore === 100,
    unlocked: false
  },
  {
    id: 'speed_demon',
    title: 'Speed Demon',
    description: 'Complete a quiz in under 2 minutes',
    icon: '⚡',
    condition: (stats) => stats.fastestTime > 0 && stats.fastestTime < 120,
    unlocked: false
  },
  {
    id: 'streak_master',
    title: 'Streak Master',
    description: 'Get 10 correct answers in a row',
    icon: '🔥',
    condition: (stats) => stats.bestStreak >= 10,
    unlocked: false
  },
  {
    id: 'quiz_veteran',
    title: 'Quiz Veteran',
    description: 'Complete 50 quizzes',
    icon: '🏆',
    condition: (stats) => stats.totalQuizzes >= 50,
    unlocked: false
  },
  {
    id: 'knowledge_seeker',
    title: 'Knowledge Seeker',
    description: 'Answer 500 questions correctly',
    icon: '📚',
    condition: (stats) => stats.correctAnswers >= 500,
    unlocked: false
  }
];