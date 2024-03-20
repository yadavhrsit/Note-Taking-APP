# Simple Note-Taking API

This repository contains a RESTful API for a basic note-taking application, built using Node.js and Express.js with MongoDB as the database. The API enables users to perform essential CRUD operations on text notes.

## Overview

This RESTful API enables users to manage text notes. It provides functionalities for creating, retrieving, updating, and deleting notes.

## Getting Started

### Prerequisites

Ensure you have the following installed:

- Node.js
- MongoDB

### Installation

1. Clone this repository.
2. Install dependencies using `npm install`.
3. Set up the MongoDB database.
4. Run the server using `npm start`.

### Testing

Run tests using `npm test` to ensure API endpoints function correctly.

## Base URL

### http://localhost:3200

## User Endpoints

### Register a New User

- **Endpoint:** `POST /user/register`
  - **Request Body:**
    - `username`: User's desired username (String)
    - `password`: User's desired password (String)
  - **Response:**
    - Success (Status 201):
      - `{ "message": "User registered successfully" }`
    - Failure (Status 400):
      - `{ "error": "A User with this Username already exists" }`
      - `{ "error": "Username must be between 5 and 16 characters" }`
      - `{ "error": "Password must be between 6 and 20 characters" }`

### Login

- **Endpoint:** `POST /user/login`
  - **Request Body:**
    - `username`: User's username (String)
    - `password`: User's password (String)
  - **Response:**
    - Success (Status 200):
      - `{ "message": "Login successful", "token": "<generated_token>" }`
    - Failure (Status 400 or 401):
      - `{ "error": "Unregistered User" }`
      - `{ "error": "You entered wrong Password" }`
      - `{ "error": "Password is required" }`
      - `{ "error": "Username is required" }`

## Notes Endpoints

### Create a Note

- **Endpoint:** `POST /notes`
  - **Authorization Header:** `Bearer <token>`
  - **Request Body:**
    - `title`: Title of the note (String)
    - `content`: Content of the note (String)
  - **Response:**
    - Success (Status 201):
      - `{ "_id": "<note_id>" }`
    - Failure (Status 400 or 401):
      - `{ "errors": [{ "msg": "Title is required" }] }`
      - `{ "errors": [{ "msg": "Content is required" }] }`
      - `{ "errors": [{ "msg": "Title must be between 1 and 50 characters" }] }`
      - `{ "errors": [{ "msg": "Content must be between 1 and 1000 characters" }] }`
      - `{ "error": "Unauthorized, Token missing or invalid" }`

### Get All Notes

- **Endpoint:** `GET /notes`
- **Authorization Header:** `Bearer <token>`
- **Response:**
  - Success (Status 200):
    - Array of notes or an empty array if no notes exist.

### Get a Single Note by ID

- **Endpoint:** `GET /notes/:noteId`
- **Authorization Header:** `Bearer <token>`
- **Response:**
  - Success (Status 200):
    - Details of the specific note based on its ID.

### Update a Note

- **Endpoint:** `PUT /notes/:noteId`
- **Authorization Header:** `Bearer <token>`
- **Request Body:**
  - Updated `title` and/or `content` of the note.
- **Response:**
  - Success (Status 200):
    - Updated note details.
  - Failure (Status 400 or 401):
    - Similar error messages as note creation for validation issues.
    - `{ "error": "Unauthorized, Token missing or invalid" }`

### Delete a Note

- **Endpoint:** `DELETE /notes/:noteId`
- **Authorization Header:** `Bearer <token>`
- **Response:**
  - Success (Status 200):
    - `{ "message": "Note deleted successfully" }`
  - Failure (Status 400 or 401):
    - `{ "error": "Unauthorized, Token missing or invalid" }`

## Error Codes

- `400`: Bad Request - Invalid input or missing required fields.
- `401`: Unauthorized - Access without valid authentication.
- `403`: Forbidden - Unauthorized access or operation.
- `404`: Not Found - Resource not found.
- `500`: Internal Server Error - Unexpected server error.

## Authentication

This API requires authentication for certain endpoints. The token generated upon successful login should be included in the `Authorization` header as `Bearer <token>` for protected endpoints.

## Protected Routes

Certain endpoints in this API require authentication via JSON Web Tokens (JWT) included in the `Authorization` header as `Bearer <token>` for access.

- **User Endpoints**:
  - `/user/register`: Public endpoint to register a new user.
  - `/user/login`: Public endpoint to authenticate and obtain a token.

- **Note Endpoints**:
  - `/notes`: Requires a valid token for creating, updating, and deleting a note.
    - `POST /notes`: Create a new note.
    - `PUT /notes/:noteId`: Update a note.
    - `DELETE /notes/:noteId`: Delete a note.

To access protected routes:
1. Register a new user using `/user/register`.
2. Log in with the registered user using `/user/login`.
3. Use the obtained token in the `Authorization` header as `<token>` for authenticated requests to note-related endpoints.

## Response Formats

- Successful responses include relevant data or success messages.
- Error responses provide detailed error messages for easy debugging and understanding.

## Usage

1. Register a new user using `POST /user/register`.
2. Log in with the registered user using `POST /user/login`.
3. Use the provided token to access protected endpoints for managing notes (`POST`, `GET`, `PUT`, `DELETE`).

## Examples

- Example requests and responses for each endpoint can be found in the provided test cases or via API exploration tools like Postman.
