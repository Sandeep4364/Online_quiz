import React from 'react';
import { BarChart3, Target, Zap, Trophy, Award } from 'lucide-react';
import { StorageService } from '../services/storageService';
import { achievements } from '../data/achievements';

interface StatisticsProps {
  onClose: () => void;
}

export const Statistics: React.FC<StatisticsProps> = ({ onClose }) => {
  const stats = StorageService.getStats();
  const unlockedAchievements = achievements.filter(achievement => 
    achievement.condition(stats)
  );

  const statCards = [
    {
      icon: <BarChart3 className="w-8 h-8 text-blue-600" />,
      title: 'Total Quizzes',
      value: stats.totalQuizzes,
      color: 'bg-blue-50 border-blue-200'
    },
    {
      icon: <Target className="w-8 h-8 text-green-600" />,
      title: 'Correct Answers',
      value: stats.correctAnswers,
      color: 'bg-green-50 border-green-200'
    },
    {
      icon: <Zap className="w-8 h-8 text-yellow-600" />,
      title: 'Best Streak',
      value: stats.bestStreak,
      color: 'bg-yellow-50 border-yellow-200'
    },
    {
      icon: <Trophy className="w-8 h-8 text-purple-600" />,
      title: 'Average Score',
      value: `${Math.round(stats.averageScore)}%`,
      color: 'bg-purple-50 border-purple-200'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">Statistics</h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              ×
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {statCards.map((stat, index) => (
              <div key={index} className={`p-4 rounded-lg border-2 ${stat.color}`}>
                <div className="flex items-center gap-3 mb-2">
                  {stat.icon}
                  <h3 className="font-semibold text-gray-900">{stat.title}</h3>
                </div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              </div>
            ))}
          </div>

          {/* Achievements */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Award className="w-6 h-6 text-yellow-500" />
              Achievements ({unlockedAchievements.length}/{achievements.length})
            </h3>
            
            <div className="grid grid-cols-1 gap-3">
              {achievements.map(achievement => {
                const isUnlocked = achievement.condition(stats);
                return (
                  <div
                    key={achievement.id}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      isUnlocked
                        ? 'border-yellow-200 bg-yellow-50'
                        : 'border-gray-200 bg-gray-50 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{achievement.icon}</span>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{achievement.title}</h4>
                        <p className="text-sm text-gray-600">{achievement.description}</p>
                      </div>
                      {isUnlocked && (
                        <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm">✓</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};