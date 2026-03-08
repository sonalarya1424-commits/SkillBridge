# SkillBridge - Quick Setup Guide

This guide will help you get SkillBridge up and running in minutes.

## Step 1: Prerequisites

Make sure you have the following installed:

- **Java 17 or higher**
  ```bash
  java -version
  ```

- **Maven 3.6+**
  ```bash
  mvn -version
  ```

- **A web browser** (Chrome, Firefox, Safari, or Edge)

## Step 2: Database Setup

The database is already provisioned via Supabase and the schema is already created. You need to configure the connection.

### Get Your Database Credentials

Your Supabase database credentials should include:
- Database host
- Database name (usually `postgres`)
- Username (usually `postgres`)
- Password

### Configure Backend Connection

Create environment variables or update `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://<your-supabase-host>:5432/postgres
spring.datasource.username=postgres
spring.datasource.password=<your-password>
```

Also set your JWT secret (must be at least 256 bits):

```properties
jwt.secret=your-very-long-secret-key-at-least-256-bits-long-change-this-in-production
```

## Step 3: Start the Backend

```bash
# Navigate to backend directory
cd backend

# Build the project
mvn clean install

# Run the application
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

You should see output like:
```
Started SkillBridgeApplication in X.XXX seconds
```

## Step 4: Start the Frontend

Open a new terminal window:

```bash
# Navigate to frontend directory
cd frontend

# Option 1: Using Python
python -m http.server 8000

# Option 2: Using Node.js
npx http-server -p 8000

# Option 3: Using PHP
php -S localhost:8000
```

Access the application at `http://localhost:8000`

## Step 5: Create Your First Account

1. Open `http://localhost:8000` in your browser
2. Click "Sign Up"
3. Fill in the registration form:
   - Name: Your name
   - Email: your.email@example.com
   - Password: Choose a strong password
   - Location: Your city/country
   - Bio: Brief description about yourself
4. Click "Sign Up"

You'll be automatically logged in and redirected to your dashboard!

## Step 6: Add Your First Skills

1. Navigate to "My Skills" from the top menu
2. In the "Add New Skill" form:
   - Select "I Offer This Skill" or "I Want to Learn This Skill"
   - Enter skill name (e.g., "Web Development")
   - Enter category (e.g., "Technology")
   - Select proficiency level
   - Add description
3. Click "Add Skill"

**Important**: Add at least one OFFER skill and one REQUEST skill to get matches!

## Step 7: Test the Matching System

To see the matching algorithm in action:

1. Create a second user account (use incognito/private browser window)
2. For the second user, add:
   - OFFER: A skill that the first user REQUESTED
   - REQUEST: A skill that the first user OFFERED
3. Go to "Matches" page for either user
4. You should see each other as matches!

## Sample Test Data

Here are some pre-populated skills you can use:

**Technology**: Web Development, Mobile App Development, Python Programming, JavaScript, Data Science

**Design**: Graphic Design, UI/UX Design

**Arts**: Photography, Video Editing

**Music**: Guitar, Piano

**Languages**: Spanish Language, French Language

**Culinary**: Cooking, Baking

**Fitness**: Yoga, Personal Training

**Marketing**: Digital Marketing

**Writing**: Content Writing

**Communication**: Public Speaking

## Verification Checklist

✅ Backend running on port 8080
✅ Frontend running on port 8000
✅ Can register new account
✅ Can login
✅ Can add skills
✅ Can see dashboard

## Common Issues and Solutions

### Issue: Backend won't start

**Solution 1**: Check if port 8080 is already in use
```bash
# Windows
netstat -ano | findstr :8080

# Mac/Linux
lsof -i :8080
```

**Solution 2**: Verify Java version
```bash
java -version
# Should show version 17 or higher
```

**Solution 3**: Check database connection
- Verify credentials in application.properties
- Test connection to Supabase

### Issue: Frontend can't load

**Solution**: Check if the static server is running and port 8000 is available

### Issue: Login fails

**Solution 1**: Check browser console for errors (F12 → Console)

**Solution 2**: Verify backend is running (`http://localhost:8080/api/`)

**Solution 3**: Clear browser cache and localStorage

### Issue: CORS errors

**Solution**: The backend is configured to accept all origins. Ensure you're accessing frontend via localhost:8000, not file://

## Testing the Complete Flow

1. **User A** registers and adds:
   - OFFER: "Guitar"
   - REQUEST: "Piano"

2. **User B** registers and adds:
   - OFFER: "Piano"
   - REQUEST: "Guitar"

3. Both users should see each other in "Matches"

4. **User A** sends an exchange request to **User B**

5. **User B** sees the request in "Exchanges" and accepts it

6. Both users mark the exchange as "Completed"

7. Both users rate each other (1-5 stars)

8. Reputation scores update automatically

## Next Steps

- Explore the dashboard
- Add more skills
- Find matches
- Send exchange requests
- Build your reputation!

## Need Help?

- Check the main README.md for detailed documentation
- Review the API endpoints
- Inspect browser console for frontend errors
- Check backend logs for server errors

## Production Deployment Notes

When deploying to production:

1. **Change JWT Secret**: Use a cryptographically secure random key
2. **Update CORS**: Restrict allowed origins in SecurityConfig.java
3. **Use HTTPS**: Deploy backend with SSL certificate
4. **Environment Variables**: Use proper environment variable management
5. **Database**: Use production database credentials
6. **Build Frontend**: Consider using a build tool for optimization

---

Enjoy using SkillBridge! 🎉
