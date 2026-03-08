# SkillBridge API Documentation

Base URL: `http://localhost:8080/api`

All authenticated endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Authentication Endpoints

### Register User
**POST** `/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "location": "New York, USA",
  "bio": "Software developer interested in learning new skills"
}
```

**Response:** (200 OK)
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "email": "john@example.com",
  "name": "John Doe"
}
```

**Error Responses:**
- 400: Email already exists

---

### Login
**POST** `/auth/login`

Authenticate a user and receive a JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** (200 OK)
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "email": "john@example.com",
  "name": "John Doe"
}
```

**Error Responses:**
- 400: Invalid credentials

---

## User Endpoints

### Get User by ID
**GET** `/users/{id}`

Retrieve user information by ID.

**Headers:** Requires authentication

**Response:** (200 OK)
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "John Doe",
  "email": "john@example.com",
  "bio": "Software developer",
  "location": "New York, USA",
  "reputationScore": 4.5,
  "totalRatings": 10,
  "isAdmin": false,
  "createdAt": "2024-01-15T10:30:00",
  "updatedAt": "2024-01-20T14:45:00"
}
```

---

### Get All Users
**GET** `/users`

Retrieve all users.

**Headers:** Requires authentication

**Response:** (200 OK)
```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "John Doe",
    "email": "john@example.com",
    "reputationScore": 4.5,
    "totalRatings": 10,
    ...
  }
]
```

---

### Update User Profile
**PUT** `/users/{id}`

Update user profile information.

**Headers:** Requires authentication

**Request Body:**
```json
{
  "name": "John Smith",
  "bio": "Updated bio",
  "location": "Los Angeles, USA"
}
```

**Response:** (200 OK) - Returns updated user object

---

## Skill Endpoints

### Get All Skills
**GET** `/skills`

Retrieve all available skills.

**Headers:** Requires authentication

**Response:** (200 OK)
```json
[
  {
    "id": "skill-uuid-1",
    "skillName": "Web Development",
    "category": "Technology",
    "createdAt": "2024-01-01T00:00:00"
  },
  {
    "id": "skill-uuid-2",
    "skillName": "Guitar",
    "category": "Music",
    "createdAt": "2024-01-01T00:00:00"
  }
]
```

---

### Create Skill
**POST** `/skills`

Create a new skill (or return existing one if skill name already exists).

**Headers:** Requires authentication

**Request Body:**
```json
{
  "skillName": "Python Programming",
  "category": "Technology"
}
```

**Response:** (200 OK) - Returns skill object

---

### Get User's Skills
**GET** `/skills/user/{userId}`

Get all skills associated with a user.

**Headers:** Requires authentication

**Response:** (200 OK)
```json
[
  {
    "id": "user-skill-uuid-1",
    "userId": "user-uuid",
    "skillId": "skill-uuid",
    "skillType": "OFFER",
    "proficiencyLevel": "expert",
    "description": "10 years of experience",
    "createdAt": "2024-01-15T10:00:00"
  }
]
```

---

### Get User's Skills by Type
**GET** `/skills/user/{userId}/type/{type}`

Get user's skills filtered by type (OFFER or REQUEST).

**Headers:** Requires authentication

**Parameters:**
- `type`: "OFFER" or "REQUEST"

**Response:** (200 OK) - Array of user skills

---

### Add Skill to User
**POST** `/skills/user`

Associate a skill with a user.

**Headers:** Requires authentication

**Request Body:**
```json
{
  "userId": "user-uuid",
  "skillId": "skill-uuid",
  "skillType": "OFFER",
  "proficiencyLevel": "intermediate",
  "description": "5 years of freelance work"
}
```

**Response:** (200 OK) - Returns created user skill object

**Error Responses:**
- 400: User skill already exists

---

### Remove User Skill
**DELETE** `/skills/user/{userId}/skill/{skillId}/type/{type}`

Remove a skill from a user's profile.

**Headers:** Requires authentication

**Parameters:**
- `userId`: User's UUID
- `skillId`: Skill's UUID
- `type`: "OFFER" or "REQUEST"

**Response:** (200 OK)

---

## Matching Endpoints

### Find Matches
**GET** `/matches/{userId}`

Find users with complementary skills.

**Headers:** Requires authentication

**Response:** (200 OK)
```json
[
  {
    "userId": "partner-uuid",
    "userName": "Jane Smith",
    "userLocation": "Boston, USA",
    "userReputation": 4.8,
    "skillTheyOffer": "skill-uuid-1",
    "skillTheyNeed": "skill-uuid-2"
  }
]
```

The algorithm finds users where:
- They offer a skill you want
- They want a skill you offer

---

## Exchange Endpoints

### Create Exchange Request
**POST** `/exchanges`

Send an exchange request to another user.

**Headers:** Requires authentication

**Request Body:**
```json
{
  "requesterId": "user-uuid-1",
  "partnerId": "user-uuid-2",
  "skillGivenId": "skill-uuid-1",
  "skillReceivedId": "skill-uuid-2",
  "message": "Hi! I'd love to exchange skills with you."
}
```

**Response:** (200 OK)
```json
{
  "id": "exchange-uuid",
  "requesterId": "user-uuid-1",
  "partnerId": "user-uuid-2",
  "skillGivenId": "skill-uuid-1",
  "skillReceivedId": "skill-uuid-2",
  "status": "PENDING",
  "message": "Hi! I'd love to exchange skills with you.",
  "createdAt": "2024-01-20T10:00:00",
  "updatedAt": "2024-01-20T10:00:00",
  "completedAt": null
}
```

---

### Get Exchange by ID
**GET** `/exchanges/{id}`

Retrieve exchange details.

**Headers:** Requires authentication

**Response:** (200 OK) - Returns exchange object

---

### Get User's Exchanges
**GET** `/exchanges/user/{userId}`

Get all exchanges where user is either requester or partner.

**Headers:** Requires authentication

**Response:** (200 OK) - Array of exchange objects

---

### Update Exchange Status
**PUT** `/exchanges/{id}/status`

Update the status of an exchange.

**Headers:** Requires authentication

**Request Body:**
```json
{
  "status": "ACCEPTED"
}
```

**Valid Status Values:**
- PENDING
- ACCEPTED
- REJECTED
- COMPLETED
- CANCELLED

**Response:** (200 OK) - Returns updated exchange object

---

## Rating Endpoints

### Create Rating
**POST** `/ratings`

Rate a completed exchange.

**Headers:** Requires authentication

**Request Body:**
```json
{
  "exchangeId": "exchange-uuid",
  "raterId": "user-uuid-1",
  "ratedId": "user-uuid-2",
  "rating": 5,
  "review": "Excellent teacher! Highly recommended."
}
```

**Validation:**
- Rating must be between 1 and 5
- Exchange must be COMPLETED
- Rater must be participant in the exchange
- Can only rate once per exchange

**Response:** (200 OK) - Returns rating object

**Error Responses:**
- 400: Exchange not completed
- 400: Not a participant
- 400: Already rated this exchange

---

### Get User's Ratings
**GET** `/ratings/user/{userId}`

Get all ratings received by a user.

**Headers:** Requires authentication

**Response:** (200 OK)
```json
[
  {
    "id": "rating-uuid",
    "exchangeId": "exchange-uuid",
    "raterId": "rater-uuid",
    "ratedId": "rated-uuid",
    "rating": 5,
    "review": "Great experience!",
    "createdAt": "2024-01-20T15:00:00"
  }
]
```

---

### Get Exchange Ratings
**GET** `/ratings/exchange/{exchangeId}`

Get all ratings for a specific exchange.

**Headers:** Requires authentication

**Response:** (200 OK) - Array of rating objects

---

## Admin Endpoints

All admin endpoints require the user to have `isAdmin: true`.

### Get All Users (Admin)
**GET** `/admin/users`

Retrieve all users (admin only).

**Headers:** Requires authentication + Admin role

**Response:** (200 OK) - Array of all users

---

### Delete User (Admin)
**DELETE** `/admin/users/{id}`

Delete a user account (admin only).

**Headers:** Requires authentication + Admin role

**Response:** (200 OK)

---

### Get Exchanges by Status (Admin)
**GET** `/admin/exchanges?status={status}`

Get exchanges filtered by status (admin only).

**Headers:** Requires authentication + Admin role

**Query Parameters:**
- `status`: PENDING, ACCEPTED, REJECTED, COMPLETED, or CANCELLED

**Response:** (200 OK) - Array of exchanges

---

## Error Responses

All endpoints may return the following error responses:

### 401 Unauthorized
```json
"Unauthorized"
```
Token is missing, invalid, or expired.

### 400 Bad Request
```json
"Error message describing what went wrong"
```
Invalid request data or business logic violation.

### 404 Not Found
```json
"Resource not found"
```
Requested resource doesn't exist.

### 500 Internal Server Error
```json
"Internal server error"
```
Unexpected server error.

---

## Authentication Flow

1. **Register or Login** to receive JWT token
2. **Store token** in localStorage or sessionStorage
3. **Include token** in Authorization header for all subsequent requests:
   ```
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
4. **Handle 401 errors** by redirecting to login

---

## Rate Limiting

Currently no rate limiting is implemented. In production, consider:
- Rate limiting by IP address
- User-based request quotas
- API key authentication for programmatic access

---

## CORS

The API is configured to accept requests from all origins (`*`). In production, restrict to specific domains:

```java
configuration.setAllowedOrigins(Arrays.asList("https://yourdomain.com"));
```

---

## Best Practices

1. **Always validate token expiration** on client side
2. **Handle token refresh** before expiration (current: 24 hours)
3. **Store sensitive data securely** (use httpOnly cookies in production)
4. **Validate all inputs** before sending to API
5. **Handle errors gracefully** with user-friendly messages
6. **Use HTTPS** in production
7. **Implement request retry logic** for network failures

---

## Example API Call (JavaScript)

```javascript
// Login
const loginResponse = await fetch('http://localhost:8080/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'john@example.com',
    password: 'password123'
  })
});

const { token, userId } = await loginResponse.json();

// Get user's skills (authenticated)
const skillsResponse = await fetch(`http://localhost:8080/api/skills/user/${userId}`, {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});

const skills = await skillsResponse.json();
```

---

For more information, see the main README.md file.
