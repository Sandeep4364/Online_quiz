import { TriviaQuestion, Category } from '../types/quiz';

const BASE_URL = 'https://opentdb.com/api.php';
const CATEGORIES_URL = 'https://opentdb.com/api_category.php';

export class TriviaAPI {
  static async fetchQuestions(
    config: { amount: number; category?: string; difficulty?: string }
  ): Promise<TriviaQuestion[]> {
    const params = new URLSearchParams({
      amount: config.amount.toString(),
      type: 'multiple'
    });

    if (config.category && config.category !== 'any') {
      params.append('category', config.category);
    }

    if (config.difficulty && config.difficulty !== 'any') {
      params.append('difficulty', config.difficulty);
    }

    try {
      const response = await fetch(`${BASE_URL}?${params}`);
      const data = await response.json();

      if (data.response_code !== 0) {
        throw new Error('Failed to fetch questions');
      }

      return data.results;
    } catch (error) {
      console.error('Error fetching trivia questions:', error);
      throw new Error('Unable to load questions. Please try again.');
    }
  }

  static async fetchCategories(): Promise<Category[]> {
    try {
      const response = await fetch(CATEGORIES_URL);
      const data = await response.json();
      return data.trivia_categories;
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  }

  static decodeHtmlEntities(text: string): string {
    const textArea = document.createElement('textarea');
    textArea.innerHTML = text;
    return textArea.value;
  }
}