# QuranMood API Documentation

## Overview

The QuranMood API provides endpoints for managing Quranic verses, user interactions (likes and comments), and verse enhancements using AI.

## Base URL

```
http://localhost:3000/api
```

## Authentication

The API uses a simple user ID and name system for tracking interactions. User information is required for:
- Adding/editing/deleting verses
- Liking verses
- Adding/editing/deleting comments

Required user information:
```javascript
{
  userId: string,    // Unique user identifier
  userName: string   // User's display name
}
```

## API Endpoints

### Verses

#### Get Random Verse by Mood

```http
GET /verse/random/:mood
```

Returns a random verse matching the specified mood.

#### Get All Verses

```http
GET /verse/all?page=1&limit=10
```

Returns paginated verses.

#### Get Verse by ID

```http
GET /verse/:id
```

Returns a specific verse.

#### Get Verses by Tag

```http
GET /verse/search/tag?tag=prayer
```

Returns verses matching the tag.

#### Get All Moods

```http
GET /verse/moods
```

Returns all available moods.

#### Add New Verse

```http
POST /verse/add/:surah/:verse
```

Adds a new verse by scraping and enhancing with AI.

Required body:
```javascript
{
  userId: string,
  userName: string
}
```

#### Add Verse Manually

```http
POST /verse/manual
```

Adds a verse manually with provided data.

Required body:
```javascript
{
  userId: string,
  userName: string,
  // Verse data
  id: string,
  mood: string[],
  arabic: string,
  english: string,
  bangla: string,
  // ... other verse fields
}
```

#### Edit Verse

```http
PUT /verse/:id
```

Updates an existing verse.

Required body:
```javascript
{
  userId: string,
  userName: string,
  // Updated verse fields
  mood?: string[],
  arabic?: string,
  english?: string,
  bangla?: string,
  // ... other verse fields
}
```

#### Delete Verse

```http
DELETE /verse/:id
```

Deletes a verse.

Required body:
```javascript
{
  userId: string,
  userName: string
}
```

### Interactions

#### Toggle Like

```http
POST /interactions/likes/:verseId
```

Toggles a like on a verse.

Required body:
```javascript
{
  userId: string,
  userName: string
}
```

#### Get Likes

```http
GET /interactions/likes/:verseId
```

Returns likes for a verse.

#### Add Comment

```http
POST /interactions/comments/:verseId
```

Adds a comment to a verse.

Required body:
```javascript
{
  userId: string,
  userName: string,
  content: string
}
```

#### Get Comments

```http
GET /interactions/comments/:verseId
```

Returns comments for a verse.

#### Edit Comment

```http
PUT /interactions/comments/:commentId
```

Edits an existing comment.

Required body:
```javascript
{
  userId: string,
  content: string
}
```

#### Delete Comment

```http
DELETE /interactions/comments/:commentId
```

Deletes a comment.

Required body:
```javascript
{
  userId: string
}
```

## Data Structures

### Verse Object

```javascript
{
  id: string,              // Format: "surah_verse"
  mood: string[],          // Array of mood tags
  arabic: string,          // Arabic text
  english: string,         // English translation
  bangla: string,          // Bengali translation
  reference: {
    surah: number,         // Surah number
    ayah: number,          // Verse number
    text: string           // Surah name
  },
  source: string,          // Source URL
  tags: string[],          // Thematic tags
  context: string,         // Context and significance
  translation_info: {
    english_translator: string,
    bangla_translator: string,
    language: string
  },
  created_by: {            // User who created the verse
    userId: string,
    userName: string,
    timestamp: string      // ISO timestamp
  },
  updated_by?: {           // User who last updated the verse
    userId: string,
    userName: string,
    timestamp: string      // ISO timestamp
  }
}
```

### Like Object

```javascript
{
  verseId: string,
  userId: string,
  userName: string,
  createdAt: string       // ISO timestamp
}
```

### Comment Object

```javascript
{
  id: string,             // Unique comment ID
  verseId: string,
  userId: string,
  userName: string,
  content: string,
  createdAt: string,      // ISO timestamp
  updatedAt?: string      // ISO timestamp (optional)
}
```

## Error Handling

All endpoints return appropriate HTTP status codes and error messages in the following format:

```javascript
{
  message: string,        // Error description
  error: string,          // Detailed error message
  suggestion?: string     // Optional suggestion for resolution
}
```

Common status codes:

- 200: Success
- 201: Created
- 400: Bad Request
- 404: Not Found
- 409: Conflict
- 500: Server Error
- 503: Service Unavailable

## Rate Limiting

Currently, there are no rate limits implemented. Consider implementing rate limiting for production use.

## CORS

The API supports CORS for cross-origin requests. Configure allowed origins in production.

## Security Considerations

1. Input validation is performed on all endpoints
2. User data is stored locally in JSON files
3. No sensitive data is exposed
4. User can only edit/delete their own comments
5. All verse modifications are tracked with user information
6. Consider implementing proper authentication for production use

## Development

To run the API locally:

1. Install dependencies: `npm install`
2. Set environment variables:
   - `GEMINI_API_KEY`: Your Google Gemini API key
3. Start the server: `npm start`
4. Access the API at `http://localhost:3000/api`
