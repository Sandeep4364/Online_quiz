import { Theme } from '../types/quiz';

export const themes: Theme[] = [
  {
    id: 'default',
    name: 'Ocean Blue',
    colors: {
      primary: '#3B82F6',
      secondary: '#8B5CF6',
      accent: '#10B981',
      background: 'from-blue-50 via-white to-purple-50',
      surface: '#FFFFFF',
      text: '#1F2937'
    }
  },
  {
    id: 'sunset',
    name: 'Sunset Orange',
    colors: {
      primary: '#F97316',
      secondary: '#EF4444',
      accent: '#F59E0B',
      background: 'from-orange-50 via-white to-red-50',
      surface: '#FFFFFF',
      text: '#1F2937'
    }
  },
  {
    id: 'forest',
    name: 'Forest Green',
    colors: {
      primary: '#059669',
      secondary: '#0D9488',
      accent: '#84CC16',
      background: 'from-green-50 via-white to-teal-50',
      surface: '#FFFFFF',
      text: '#1F2937'
    }
  },
  {
    id: 'dark',
    name: 'Dark Mode',
    colors: {
      primary: '#60A5FA',
      secondary: '#A78BFA',
      accent: '#34D399',
      background: 'from-gray-900 via-gray-800 to-gray-900',
      surface: '#1F2937',
      text: '#F9FAFB'
    }
  }
];