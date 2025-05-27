# Quran Mood API Backend Documentation

## Base URL

```
http://localhost:3000/api/verse
```

---

## Endpoints

### GET `/api/verse`

**Description:**
Returns a random Quran verse. Optionally filter by mood.

**Query Parameters:**

* `mood` (optional): Filter verses by mood (case-insensitive, partial match).

**Responses:**

* `200 OK`

  ```json
  {
    "verse": {
      "id": "2_152",
      "mood": ["grateful", "remembrance"],
      "arabic": "...",
      "english": "...",
      "reference": { "surah": 2, "ayah": 152, "text": "Al-Baqarah (The Cow)" },
      "source": "https://quran.com/2/152",
      "tags": ["gratitude", "faith"],
      "translation_info": { "translator": "Saheeh International", "language": "en" }
    }
  }
  ```
* `404 Not Found`

  ```json
  { "message": "No verses found for that mood" }
  ```

---

### POST `/api/verse`

**Description:**
Add a new verse.

**Request Body:**
Must include `id`, `mood` (array), `arabic`, and `english`. Other fields optional.

```json
{
  "id": "2_152",
  "mood": ["grateful", "remembrance"],
  "arabic": "...",
  "english": "...",
  "reference": { "surah": 2, "ayah": 152, "text": "Al-Baqarah (The Cow)" },
  "source": "https://quran.com/2/152",
  "tags": ["gratitude", "faith"],
  "translation_info": { "translator": "Saheeh International", "language": "en" }
}
```

> id: Preferred format is surah_ayah (e.g., "2_152" for Surah 2, Ayah 152).

**Responses:**

* `201 Created`

  ```json
  { "message": "Verse added", "verse": { /* newly added verse object */ } }
  ```
* `400 Bad Request`

  ```json
  { "message": "id, mood, arabic, and english are required" }
  ```
* `409 Conflict`

  ```json
  { "message": "Verse with this ID already exists" }
  ```

---

### PUT `/api/verse/:id`

**Description:**
Update an existing verse by `id`.

**URL Parameters:**

* `id` — Verse ID.

**Request Body:**
Partial or full fields to update.

```json
{
  "english": "Updated English text"
}
```

**Responses:**

* `200 OK`

  ```json
  { "message": "Verse updated", "verse": { /* updated verse object */ } }
  ```
* `404 Not Found`

  ```json
  { "message": "Verse not found" }
  ```

---

### DELETE `/api/verse/:id`

**Description:**
Delete a verse by `id`.

**URL Parameters:**

* `id` — Verse ID.

**Responses:**

* `200 OK`

  ```json
  { "message": "Verse deleted" }
  ```
* `404 Not Found`

  ```json
  { "message": "Verse not found" }
  ```

---

# Notes

* All data stored in `verses.json`.
* Mood matching is case-insensitive and partial.
* ID must be unique for each verse.


