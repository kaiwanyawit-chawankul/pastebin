# Pastebin

A pastebin clone application that allows users to share text snippets and code online.

## Overview

This project implements a pastebin service where users can:

- Create and share text/code snippets
- Access shared content via unique URLs
- Set expiration times for pastes
- Format code with syntax highlighting

## Project Structure

The project is located at `/src/` and contains implementation for both frontend and backend components.

## Prerequisites

- Node.js (v16 or higher)
- npm (v8 or higher)

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd pastebin
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Development

To start the development server:

```bash
npm start
```

The application will be available at `http://localhost:3000`

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run lint` - Runs ESLint to check code quality
- `npm run format` - Formats code using Prettier

## Git Hooks

This project uses Husky and lint-staged to maintain code quality:

- Pre-commit: Runs ESLint and Prettier on staged files
- All commits must pass linting and formatting checks

## Technologies

- React 18
- Auth0 for authentication
- Tailwind CSS for styling
- ESLint and Prettier for code quality
- Husky for Git hooks

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Run tests and ensure linting passes
4. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
