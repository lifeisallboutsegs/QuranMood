# Quran Mood Backend API

A Node.js backend service for the Quran Mood application that provides Quranic verses and related functionality.

## Features

- RESTful API endpoints for Quranic verses
- Integration with Google's Generative AI
- CORS enabled for cross-origin requests
- Express.js based server architecture
- Modular route and controller structure

## Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)
- Google AI API credentials (for AI features)

## Installation

1. Clone the repository
2. Navigate to the backend directory:
   ```bash
   cd backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Environment Setup

Create a `.env` file in the backend directory with the following variables:

```
PORT=3000
GOOGLE_AI_API_KEY=your_api_key_here
```

## Project Structure

```
backend/
├── controllers/     # Request handlers and business logic
├── data/           # Data storage and models
├── routes/         # API route definitions
├── utils/          # Utility functions and helpers
├── index.js        # Main application entry point
└── package.json    # Project dependencies and scripts
```

## API Endpoints

### Available Routes

- `GET /api/verse` - Get Quranic verses
- `GET /` - Health check endpoint

## Development

To start the development server:

```bash
npm start
```

## Dependencies

- express: Web framework
- cors: Cross-origin resource sharing
- @google/genai: Google's Generative AI integration
- axios: HTTP client
- cheerio: HTML parsing

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

ISC
