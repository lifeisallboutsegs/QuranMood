# QuranMood API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
Currently, the API requires `userId` and `userName` in the request body for operations that modify data.

## Endpoints

### Contact

#### Submit Contact Form
```http
POST /contact
```
Request Body:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Feedback",
  "message": "Great app! I have some suggestions..."
}
```

Response:
```json
{
  "message": "Contact message received successfully",
  "contact": {
    "id": "1234567890",
    "name": "John Doe",
    "subject": "Feedback",
    "createdAt": "2024-03-20T10:00:00Z"
  }
}
```

### Verses

#### Get Random Verse by Mood
```http
GET /verse/random/:mood
```
Query Parameters:
- `mood` (path parameter): The mood to filter verses by

Response:
```json
{
  "verse": {
    "id": "1_1",
    "arabic": "...",
    "english": "...",
    "bangla": "...",
    "mood": ["peace", "guidance"],
    "tags": ["quran", "beginning"],
    "reference": {
      "surah": 1,
      "ayah": 1,
      "text": "Al-Fatiha"
    }
  }
}
```

#### Get All Verses
```http
GET /verse/all
```
Query Parameters:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

Response:
```json
{
  "verses": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalVerses": 100,
    "versesPerPage": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

#### Get Verse by ID
```http
GET /verse/:id
```
Path Parameters:
- `id`: Verse ID (format: surah_verse)

Response:
```json
{
  "verse": {
    "id": "1_1",
    "arabic": "...",
    "english": "...",
    "bangla": "...",
    "mood": ["peace", "guidance"],
    "tags": ["quran", "beginning"],
    "reference": {
      "surah": 1,
      "ayah": 1,
      "text": "Al-Fatiha"
    }
  }
}
```

#### Get Verses by Tag
```http
GET /verse/search/tag?tag=prayer
```
Query Parameters:
- `tag`: Tag to search for

Response:
```json
{
  "verses": [...],
  "count": 5,
  "searchedTag": "prayer"
}
```

#### Get All Available Moods
```http
GET /verse/moods
```
Response:
```json
{
  "moods": ["peace", "guidance", "patience", "gratitude"]
}
```

#### Add Verse (Auto)
```http
POST /verse/add/:surah/:verse
```
Path Parameters:
- `surah`: Surah number
- `verse`: Verse number

Request Body:
```json
{
  "userId": "required",
  "userName": "required"
}
```

Query Parameters:
- `useStreaming` (optional): Use streaming for AI enhancement

Response:
```json
{
  "message": "Verse successfully added with AI enhancement",
  "verse": {...},
  "enhancement_method": "standard"
}
```

#### Add Verse (Manual)
```http
POST /verse/manual
```
Request Body:
```json
{
  "userId": "required",
  "userName": "required",
  "id": "1_1",
  "arabic": "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
  "english": "In the name of Allah, the Entirely Merciful, the Especially Merciful",
  "bangla": "পরম করুণাময় অতি দয়ালু আল্লাহর নামে",
  "mood": ["peace", "guidance"],
  "tags": ["quran", "beginning"],
  "reference": {
    "surah": 1,
    "ayah": 1,
    "text": "Al-Fatiha"
  }
}
```

#### Edit Verse
```http
PUT /verse/:id
```
Path Parameters:
- `id`: Verse ID

Request Body:
```json
{
  "userId": "required",
  "userName": "required",
  "arabic": "updated text",
  "english": "updated text",
  "mood": ["updated", "moods"]
}
```

#### Delete Verse
```http
DELETE /verse/:id
```
Path Parameters:
- `id`: Verse ID

Request Body:
```json
{
  "userId": "required",
  "userName": "required"
}
```

### Interactions

#### Toggle Like
```http
POST /interactions/likes/:verseId
```
Path Parameters:
- `verseId`: Verse ID

Request Body:
```json
{
  "userId": "required",
  "userName": "required"
}
```

Response:
```json
{
  "message": "Verse liked",
  "likes": 5
}
```

#### Get Likes
```http
GET /interactions/likes/:verseId
```
Path Parameters:
- `verseId`: Verse ID

Response:
```json
{
  "likes": 5,
  "users": [
    {
      "userId": "user1",
      "userName": "User One",
      "timestamp": "2024-03-20T10:00:00Z"
    }
  ]
}
```

#### Add Comment
```http
POST /interactions/comments/:verseId
```
Path Parameters:
- `verseId`: Verse ID

Request Body:
```json
{
  "userId": "required",
  "userName": "required",
  "content": "required"
}
```

#### Get Comments
```http
GET /interactions/comments/:verseId
```
Path Parameters:
- `verseId`: Verse ID

Response:
```json
{
  "comments": [
    {
      "id": "comment1",
      "content": "Great verse!",
      "user": {
        "userId": "user1",
        "userName": "User One"
      },
      "createdAt": "2024-03-20T10:00:00Z"
    }
  ]
}
```

#### Edit Comment
```http
PUT /interactions/comments/:commentId
```
Path Parameters:
- `commentId`: Comment ID

Request Body:
```json
{
  "userId": "required",
  "content": "required"
}
```

#### Delete Comment
```http
DELETE /interactions/comments/:commentId
```
Path Parameters:
- `commentId`: Comment ID

Request Body:
```json
{
  "userId": "required"
}
```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "message": "Error message",
  "error": "Detailed error"
}
```

### 404 Not Found
```json
{
  "message": "Verse not found",
  "searchedId": "1_1"
}
```

### 500 Internal Server Error
```json
{
  "message": "Something went wrong!",
  "error": "Error details"
}
```

## Rate Limiting
Currently, there are no rate limits implemented.

## CORS
The API supports CORS and can be accessed from any origin. 