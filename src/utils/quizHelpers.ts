import { TriviaQuestion, QuizQuestion } from '../types/quiz';
import { TriviaAPI } from '../services/triviaApi';

export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const transformTriviaQuestions = (triviaQuestions: TriviaQuestion[]): QuizQuestion[] => {
  return triviaQuestions.map((question, index) => {
    const decodedQuestion = TriviaAPI.decodeHtmlEntities(question.question);
    const decodedCorrectAnswer = TriviaAPI.decodeHtmlEntities(question.correct_answer);
    const decodedIncorrectAnswers = question.incorrect_answers.map(answer => 
      TriviaAPI.decodeHtmlEntities(answer)
    );

    const allAnswers = shuffleArray([decodedCorrectAnswer, ...decodedIncorrectAnswers]);

    return {
      id: (index + 1).toString(),
      category: TriviaAPI.decodeHtmlEntities(question.category),
      difficulty: question.difficulty,
      question: decodedQuestion,
      options: allAnswers,
      correctAnswer: decodedCorrectAnswer,
    };
  });
};

export const calculatePercentage = (score: number, total: number): number => {
  return Math.round((score / total) * 100);
};

export const getScoreMessage = (percentage: number): { title: string; message: string; color: string } => {
  if (percentage >= 90) {
    return {
      title: "Excellent!",
      message: "You're a trivia master!",
      color: "text-green-600"
    };
  } else if (percentage >= 70) {
    return {
      title: "Great Job!",
      message: "You did really well!",
      color: "text-blue-600"
    };
  } else if (percentage >= 50) {
    return {
      title: "Good Effort!",
      message: "Not bad, keep practicing!",
      color: "text-yellow-600"
    };
  } else {
    return {
      title: "Keep Trying!",
      message: "Practice makes perfect!",
      color: "text-red-600"
    };
  }
};