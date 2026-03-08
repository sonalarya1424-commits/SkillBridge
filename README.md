# SkillBridge - Peer-to-Peer Skill Exchange Platform

SkillBridge is a full-stack web application that enables users to exchange skills without money. Users can offer skills they know and request skills they want to learn, with the system intelligently matching users with complementary skills.

## Features

### Core Functionality
- **User Authentication**: JWT-based secure login and registration system
- **Profile Management**: Users can create and update profiles with bio, location, and reputation scores
- **Skill Management**:
  - Add skills you can offer
  - Add skills you want to learn
  - Edit or delete your skills
- **Intelligent Matching Algorithm**: Finds users where:
  - User A offers Skill X and wants Skill Y
  - User B offers Skill Y and wants Skill X
- **Exchange Requests**:
  - Send exchange requests to matched users
  - Accept or reject incoming requests
  - Mark exchanges as completed
- **Reputation System**:
  - Rate completed exchanges (1-5 stars)
  - Leave reviews for exchange partners
  - Reputation scores automatically calculated
- **Dashboard**: View all your skills, matches, exchanges, and reputation at a glance

## Technology Stack

### Frontend
- HTML5
- CSS3 (Modern responsive design)
- Vanilla JavaScript (ES6+)
- Fetch API for REST communication

### Backend
- Java 17
- Spring Boot 3.2.0
- Spring Security
- Spring Data JPA
- JWT Authentication (jjwt 0.11.5)

### Database
- PostgreSQL (via Supabase)
- Row Level Security (RLS) enabled

### Build Tool
- Maven

## Project Structure

```
skillbridge/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/skillbridge/
│   │   │   │   ├── controller/          # REST API endpoints
│   │   │   │   │   ├── AuthController.java
│   │   │   │   │   ├── UserController.java
│   │   │   │   │   ├── SkillController.java
│   │   │   │   │   ├── MatchingController.java
│   │   │   │   │   ├── ExchangeController.java
│   │   │   │   │   ├── RatingController.java
│   │   │   │   │   └── AdminController.java
│   │   │   │   ├── service/             # Business logic
│   │   │   │   │   ├── UserService.java
│   │   │   │   │   ├── SkillService.java
│   │   │   │   │   ├── MatchingService.java
│   │   │   │   │   ├── ExchangeService.java
│   │   │   │   │   └── RatingService.java
│   │   │   │   ├── repository/          # Data access layer
│   │   │   │   │   ├── UserRepository.java
│   │   │   │   │   ├── SkillRepository.java
│   │   │   │   │   ├── UserSkillRepository.java
│   │   │   │   │   ├── ExchangeRepository.java
│   │   │   │   │   └── RatingRepository.java
│   │   │   │   ├── model/               # JPA entities
│   │   │   │   │   ├── User.java
│   │   │   │   │   ├── Skill.java
│   │   │   │   │   ├── UserSkill.java
│   │   │   │   │   ├── Exchange.java
│   │   │   │   │   └── Rating.java
│   │   │   │   ├── security/            # Security configuration
│   │   │   │   │   ├── JwtUtil.java
│   │   │   │   │   ├── JwtRequestFilter.java
│   │   │   │   │   └── SecurityConfig.java
│   │   │   │   ├── dto/                 # Data transfer objects
│   │   │   │   │   ├── AuthRequest.java
│   │   │   │   │   ├── AuthResponse.java
│   │   │   │   │   ├── RegisterRequest.java
│   │   │   │   │   └── MatchDTO.java
│   │   │   │   └── SkillBridgeApplication.java
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/
│   └── pom.xml
└── frontend/
    ├── index.html              # Landing page
    ├── login.html              # Login page
    ├── signup.html             # Registration page
    ├── dashboard.html          # User dashboard
    ├── skills.html             # Skill management
    ├── matches.html            # View and request matches
    ├── exchanges.html          # Manage exchange requests
    ├── profile.html            # User profile
    ├── css/
    │   └── style.css           # Complete styling
    └── js/
        ├── config.js           # API configuration
        ├── utils.js            # Utility functions
        ├── auth.js             # Authentication logic
        ├── dashboard.js        # Dashboard functionality
        ├── skills.js           # Skill management
        ├── matches.js          # Matching functionality
        ├── exchanges.js        # Exchange management
        └── profile.js          # Profile management
```

## Database Schema

### Tables

#### users
- `id` (UUID, Primary Key)
- `name` (Text)
- `email` (Text, Unique)
- `password_hash` (Text)
- `bio` (Text)
- `location` (Text)
- `reputation_score` (Decimal)
- `total_ratings` (Integer)
- `is_admin` (Boolean)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

#### skills
- `id` (UUID, Primary Key)
- `skill_name` (Text, Unique)
- `category` (Text)
- `created_at` (Timestamp)

#### user_skills
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key → users)
- `skill_id` (UUID, Foreign Key → skills)
- `skill_type` (Text: OFFER or REQUEST)
- `proficiency_level` (Text: beginner, intermediate, expert)
- `description` (Text)
- `created_at` (Timestamp)

#### exchanges
- `id` (UUID, Primary Key)
- `requester_id` (UUID, Foreign Key → users)
- `partner_id` (UUID, Foreign Key → users)
- `skill_given_id` (UUID, Foreign Key → skills)
- `skill_received_id` (UUID, Foreign Key → skills)
- `status` (Text: PENDING, ACCEPTED, REJECTED, COMPLETED, CANCELLED)
- `message` (Text)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)
- `completed_at` (Timestamp)

#### ratings
- `id` (UUID, Primary Key)
- `exchange_id` (UUID, Foreign Key → exchanges)
- `rater_id` (UUID, Foreign Key → users)
- `rated_id` (UUID, Foreign Key → users)
- `rating` (Integer: 1-5)
- `review` (Text)
- `created_at` (Timestamp)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Users
- `GET /api/users/{id}` - Get user by ID
- `GET /api/users` - Get all users
- `PUT /api/users/{id}` - Update user profile

### Skills
- `GET /api/skills` - Get all skills
- `POST /api/skills` - Create new skill
- `GET /api/skills/user/{userId}` - Get user's skills
- `GET /api/skills/user/{userId}/type/{type}` - Get user's skills by type
- `POST /api/skills/user` - Add skill to user
- `DELETE /api/skills/user/{userId}/skill/{skillId}/type/{type}` - Remove user skill

### Matching
- `GET /api/matches/{userId}` - Get skill matches for user

### Exchanges
- `POST /api/exchanges` - Create exchange request
- `GET /api/exchanges/{id}` - Get exchange by ID
- `GET /api/exchanges/user/{userId}` - Get user's exchanges
- `PUT /api/exchanges/{id}/status` - Update exchange status

### Ratings
- `POST /api/ratings` - Create rating
- `GET /api/ratings/user/{userId}` - Get user's ratings
- `GET /api/ratings/exchange/{exchangeId}` - Get exchange ratings

### Admin
- `GET /api/admin/users` - Get all users (admin only)
- `DELETE /api/admin/users/{id}` - Delete user (admin only)
- `GET /api/admin/exchanges` - Get exchanges by status (admin only)

## Setup Instructions

### Prerequisites
- Java 17 or higher
- Maven 3.6+
- PostgreSQL database (Supabase account)
- Modern web browser

### Backend Setup

1. **Configure Database Connection**

   The database is already provisioned via Supabase. Create a `.env` file or set environment variables:

   ```properties
   DATABASE_URL=jdbc:postgresql://<supabase-host>:5432/postgres
   DATABASE_USERNAME=postgres
   DATABASE_PASSWORD=<your-password>
   JWT_SECRET=<your-secret-key-min-256-bits>
   ```

2. **Build the Backend**

   ```bash
   cd backend
   mvn clean install
   ```

3. **Run the Backend**

   ```bash
   mvn spring-boot:run
   ```

   The backend will start on `http://localhost:8080`

### Frontend Setup

1. **Configure API Endpoint**

   Edit `frontend/js/config.js` and ensure the API_BASE_URL points to your backend:

   ```javascript
   const API_BASE_URL = 'http://localhost:8080/api';
   ```

2. **Serve Frontend**

   Use any static file server. For example, with Python:

   ```bash
   cd frontend
   python -m http.server 8000
   ```

   Or use Node.js with `http-server`:

   ```bash
   npx http-server -p 8000
   ```

   Access the application at `http://localhost:8000`

### Database Initialization

The database schema is automatically created via Supabase migrations. Sample skills data is included:
- 20 different skills across categories (Technology, Design, Arts, Music, Languages, Culinary, Fitness, Marketing, Writing, Communication)

## Usage Guide

### For Users

1. **Register an Account**
   - Visit the signup page
   - Provide name, email, password, location, and bio
   - Automatically logged in after registration

2. **Add Your Skills**
   - Navigate to "My Skills"
   - Add skills you can offer (OFFER)
   - Add skills you want to learn (REQUEST)
   - Specify proficiency level and description

3. **Find Matches**
   - Visit the "Matches" page
   - View users with complementary skills
   - Send exchange requests

4. **Manage Exchanges**
   - Accept/reject incoming requests
   - Track exchange progress
   - Mark exchanges as completed

5. **Build Reputation**
   - Rate completed exchanges
   - Receive ratings from partners
   - Watch your reputation score grow

### For Admins

Admins can:
- View all users
- Remove fake accounts
- Monitor exchanges by status

To make a user an admin, update their `is_admin` field in the database to `true`.

## Security Features

- **Password Hashing**: BCrypt encryption
- **JWT Authentication**: Secure token-based auth
- **Row Level Security**: Database-level access control
- **CORS Configuration**: Controlled cross-origin requests
- **Input Validation**: Server-side validation for all inputs

## Matching Algorithm

The intelligent matching algorithm works as follows:

1. Retrieves all skills the user offers (OFFER)
2. Retrieves all skills the user wants to learn (REQUEST)
3. Finds other users who:
   - Offer at least one skill the user wants
   - Want at least one skill the user offers
4. Returns matches with user details and skill information

This ensures mutual benefit in every match.

## Design Principles

- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- **Clean UI**: Modern, intuitive interface with smooth transitions
- **User Feedback**: Clear error messages and success notifications
- **Loading States**: Visual feedback during data fetching
- **Accessible**: Semantic HTML and proper form labels

## Testing

### Sample Test Scenarios

1. **User Registration and Login**
   - Create multiple test users
   - Verify JWT token generation
   - Test authentication persistence

2. **Skill Management**
   - Add various skills (offers and requests)
   - Test skill deletion
   - Verify skill uniqueness

3. **Matching Algorithm**
   - Create complementary skills for different users
   - Verify matches are correctly identified
   - Test edge cases (no matches, multiple matches)

4. **Exchange Flow**
   - Send exchange request
   - Accept/reject as partner
   - Complete exchange
   - Submit ratings

5. **Reputation System**
   - Submit multiple ratings
   - Verify average calculation
   - Check rating constraints

## Troubleshooting

### Common Issues

**Backend won't start**
- Verify Java version (17+)
- Check database connection in application.properties
- Ensure no other service is using port 8080

**Frontend can't connect to backend**
- Verify backend is running
- Check CORS configuration
- Ensure API_BASE_URL is correct in config.js

**Database connection errors**
- Verify Supabase credentials
- Check network connectivity
- Ensure database migrations are applied

**JWT errors**
- Verify JWT_SECRET is set and long enough (256 bits)
- Check token expiration time
- Clear browser localStorage and re-login

## Future Enhancements

Potential features for future development:
- Real-time chat between matched users
- Skill verification system
- Calendar integration for scheduling exchanges
- Mobile app (React Native / Flutter)
- Advanced search and filtering
- Skill categories and tags
- Email notifications
- Social media integration
- Video call integration
- Achievement badges

## Contributing

This is a demonstration project. For contributions:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is created for educational purposes.

## Support

For issues or questions:
- Check the troubleshooting section
- Review API documentation
- Inspect browser console for frontend errors
- Check backend logs for server errors

---

Built with ❤️ using Spring Boot and modern web technologies
