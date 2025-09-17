import React, { useState } from 'react';
import { Settings, Volume2, VolumeX, Zap, Eye, RotateCcw } from 'lucide-react';
import { StorageService } from '../services/storageService';
import { SoundService } from '../services/soundService';
import { themes } from '../data/themes';

interface QuizSettingsProps {
  onClose: () => void;
  onThemeChange: (themeId: string) => void;
  currentTheme: string;
}

export const QuizSettings: React.FC<QuizSettingsProps> = ({ onClose, onThemeChange, currentTheme }) => {
  const [settings, setSettings] = useState(StorageService.getSettings());

  const updateSetting = (key: string, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    StorageService.saveSettings(newSettings);

    if (key === 'soundEnabled') {
      SoundService.setEnabled(value);
    }
  };

  const resetStats = () => {
    if (confirm('Are you sure you want to reset all statistics? This cannot be undone.')) {
      StorageService.saveStats({
        totalQuizzes: 0,
        totalQuestions: 0,
        correctAnswers: 0,
        averageScore: 0,
        bestStreak: 0,
        fastestTime: 0,
        achievements: []
      });
      StorageService.saveLeaderboard([]);
      alert('Statistics reset successfully!');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Settings className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              ×
            </button>
          </div>

          <div className="space-y-6">
            {/* Theme Selection */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Theme</h3>
              <div className="grid grid-cols-2 gap-3">
                {themes.map(theme => (
                  <button
                    key={theme.id}
                    onClick={() => onThemeChange(theme.id)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      currentTheme === theme.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="text-sm font-medium text-gray-900">{theme.name}</div>
                    <div className="flex gap-1 mt-2">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: theme.colors.primary }}
                      />
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: theme.colors.secondary }}
                      />
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: theme.colors.accent }}
                      />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Audio Settings */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Audio</h3>
              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  {settings.soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                  <span className="font-medium">Sound Effects</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.soundEnabled}
                  onChange={(e) => updateSetting('soundEnabled', e.target.checked)}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
              </label>
            </div>

            {/* Gameplay Settings */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Gameplay</h3>
              <div className="space-y-3">
                <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Zap className="w-5 h-5" />
                    <span className="font-medium">Auto-advance Questions</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.autoAdvance}
                    onChange={(e) => updateSetting('autoAdvance', e.target.checked)}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Eye className="w-5 h-5" />
                    <span className="font-medium">Show Hints</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.showHints}
                    onChange={(e) => updateSetting('showHints', e.target.checked)}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                </label>
              </div>
            </div>

            {/* Reset Data */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Data</h3>
              <button
                onClick={resetStats}
                className="w-full flex items-center justify-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
              >
                <RotateCcw className="w-5 h-5" />
                Reset All Statistics
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};