# Online Quiz Application

This is a React-based online quiz application built with TypeScript and Vite. It uses the Open Trivia Database (Open Trivia DB) API to fetch dynamic trivia questions and provides an engaging quiz experience with features like a leaderboard, statistics, timer, hints, and customizable themes.

## Features

- Fetches trivia questions dynamically from the Open Trivia DB API.
- Multiple categories and difficulty levels.
- Timer for each question with sound effects.
- Leaderboard to display top scores with player names, categories, difficulty, percentage score, and completion time.
- Statistics tracking total quizzes played, average score, best streak, and fastest completion time.
- Achievements system to reward players based on performance.
- Customizable themes and sound settings.
- Responsive and user-friendly UI built with React and Tailwind CSS.

## Technologies Used

- React 18 with TypeScript
- Vite for build tooling and development server
- Tailwind CSS for styling
- Open Trivia DB API for quiz questions
- Lucide React icons for UI elements

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd Online_quiz-main
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173` (or the port shown in the terminal).

## Usage

- Enter your name (optional) and start the quiz.
- Answer multiple-choice questions within the time limit.
- Use hints if enabled in settings.
- View your score and progress during the quiz.
- Check the leaderboard to see top players and scores.
- View detailed statistics and achievements.
- Customize themes and sound settings in the settings modal.

## Project Structure

- `src/components/` - React components including Quiz, Leaderboard, Statistics, and Settings.
- `src/services/` - Services for API calls, storage, and sound management.
- `src/hooks/` - Custom React hooks like the quiz timer.
- `src/utils/` - Utility functions for formatting and data transformation.
- `src/types/` - TypeScript interfaces and types.
- `src/data/` - Static data such as themes and achievements.

## Contributing

Contributions are welcome! Please open issues or submit pull requests for improvements or bug fixes.

## License

This project is licensed under the MIT License.

---

Enjoy testing your knowledge with this dynamic and interactive quiz application!
