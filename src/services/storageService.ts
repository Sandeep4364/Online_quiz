export class StorageService {
  private static readonly STATS_KEY = 'quiz_stats';
  private static readonly LEADERBOARD_KEY = 'quiz_leaderboard';
  private static readonly SETTINGS_KEY = 'quiz_settings';
  private static readonly THEME_KEY = 'quiz_theme';

  static getStats(): any {
    const stats = localStorage.getItem(this.STATS_KEY);
    return stats ? JSON.parse(stats) : {
      totalQuizzes: 0,
      totalQuestions: 0,
      correctAnswers: 0,
      averageScore: 0,
      bestStreak: 0,
      fastestTime: 0,
      achievements: []
    };
  }

  static saveStats(stats: any): void {
    localStorage.setItem(this.STATS_KEY, JSON.stringify(stats));
  }

  static getLeaderboard(): any[] {
    const leaderboard = localStorage.getItem(this.LEADERBOARD_KEY);
    return leaderboard ? JSON.parse(leaderboard) : [];
  }

  static saveLeaderboard(leaderboard: any[]): void {
    localStorage.setItem(this.LEADERBOARD_KEY, JSON.stringify(leaderboard));
  }

  static getSettings(): any {
    const settings = localStorage.getItem(this.SETTINGS_KEY);
    return settings ? JSON.parse(settings) : {
      soundEnabled: true,
      animationsEnabled: true,
      autoAdvance: true,
      showHints: true
    };
  }

  static saveSettings(settings: any): void {
    localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
  }

  static getTheme(): string {
    return localStorage.getItem(this.THEME_KEY) || 'default';
  }

  static saveTheme(theme: string): void {
    localStorage.setItem(this.THEME_KEY, theme);
  }
}