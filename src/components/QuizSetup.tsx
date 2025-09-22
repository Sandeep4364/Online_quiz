import React, { useState, useEffect } from 'react';
import { Play, Settings } from 'lucide-react';
import { QuizConfig, Category } from '../types/quiz';
import { TriviaAPI } from '../services/triviaApi';

interface QuizSetupProps {
  onStartQuiz: (config: QuizConfig) => void;
  loading: boolean;
}

export const QuizSetup: React.FC<QuizSetupProps> = ({ onStartQuiz, loading }) => {
  const [config, setConfig] = useState<QuizConfig>({
    amount: 10,
    category: 'any',
    difficulty: 'any',
    timer: 30
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const fetchedCategories = await TriviaAPI.fetchCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error('Failed to load categories:', error);
      } finally {
        setLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

  const difficulties = [
    { value: 'any', label: 'Any Difficulty' },
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' }
  ];

  const questionCounts = [5, 10, 15, 20, 25];
  const maxQuestions = 50;
  const timerOptions = [15, 30, 45, 60, 90];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate question count
    if (config.amount < 1 || config.amount > 50) {
      alert('Please select between 1 and 50 questions.');
      return;
    }
    
    onStartQuiz(config);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <Settings size={32} className="text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz Setup</h1>
        <p className="text-gray-600">Configure your trivia challenge</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Number of Questions
          </label>
          <div className="mb-4">
            <input
              type="number"
              min="1"
              max={maxQuestions}
              value={config.amount}
              onChange={(e) => setConfig({ ...config, amount: Math.min(maxQuestions, Math.max(1, parseInt(e.target.value) || 1)) })}
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors duration-300"
              placeholder="Enter number of questions (1-50)"
            />
            <p className="text-xs text-gray-500 mt-1">Enter any number between 1 and {maxQuestions}</p>
          </div>
          <div className="grid grid-cols-5 gap-3">
            {questionCounts.map(count => (
              <button
                key={count}
                type="button"
                onClick={() => setConfig({ ...config, amount: count })}
                className={`py-2 px-4 rounded-lg border-2 transition-all duration-300 ${
                  config.amount === count
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                }`}
              >
                {count}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-2">Quick select common amounts or use the input above for custom numbers</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Category
          </label>
          <select
            value={config.category}
            onChange={(e) => setConfig({ ...config, category: e.target.value })}
            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors duration-300"
            disabled={loadingCategories}
          >
            <option value="any">Any Category</option>
            {categories.map(category => (
              <option key={category.id} value={category.id.toString()}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Difficulty
          </label>
          <div className="grid grid-cols-2 gap-3">
            {difficulties.map(diff => (
              <button
                key={diff.value}
                type="button"
                onClick={() => setConfig({ ...config, difficulty: diff.value })}
                className={`py-3 px-4 rounded-lg border-2 transition-all duration-300 ${
                  config.difficulty === diff.value
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                }`}
              >
                {diff.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Time per Question (seconds)
          </label>
          <div className="grid grid-cols-5 gap-3">
            {timerOptions.map(time => (
              <button
                key={time}
                type="button"
                onClick={() => setConfig({ ...config, timer: time })}
                className={`py-2 px-4 rounded-lg border-2 transition-all duration-300 ${
                  config.timer === time
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                }`}
              >
                {time}s
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || loadingCategories}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-3"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Loading Questions...
            </>
          ) : (
            <>
              <Play size={20} />
              Start Quiz
            </>
          )}
        </button>
      </form>
    </div>
  );
};