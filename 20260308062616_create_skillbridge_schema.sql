/*
  # SkillBridge Database Schema

  ## Overview
  Complete database schema for the SkillBridge peer-to-peer skill exchange platform.

  ## 1. New Tables
  
  ### `users`
  Core user information table
  - `id` (uuid, primary key) - Unique user identifier
  - `name` (text) - User's full name
  - `email` (text, unique) - User email for login
  - `password_hash` (text) - Encrypted password
  - `bio` (text) - User biography
  - `location` (text) - User's location
  - `reputation_score` (decimal) - Average rating score
  - `total_ratings` (integer) - Count of ratings received
  - `created_at` (timestamptz) - Account creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `skills`
  Master list of all available skills
  - `id` (uuid, primary key) - Unique skill identifier
  - `skill_name` (text, unique) - Name of the skill
  - `category` (text) - Skill category
  - `created_at` (timestamptz) - Creation timestamp

  ### `user_skills`
  Links users to skills they offer or want to learn
  - `id` (uuid, primary key) - Unique identifier
  - `user_id` (uuid, foreign key) - References users
  - `skill_id` (uuid, foreign key) - References skills
  - `skill_type` (text) - Either 'OFFER' or 'REQUEST'
  - `proficiency_level` (text) - Skill level (beginner, intermediate, expert)
  - `description` (text) - Additional details
  - `created_at` (timestamptz) - Creation timestamp

  ### `exchanges`
  Tracks skill exchange requests and completions
  - `id` (uuid, primary key) - Unique exchange identifier
  - `requester_id` (uuid, foreign key) - User initiating exchange
  - `partner_id` (uuid, foreign key) - User receiving request
  - `skill_given_id` (uuid, foreign key) - Skill requester will teach
  - `skill_received_id` (uuid, foreign key) - Skill requester wants to learn
  - `status` (text) - PENDING, ACCEPTED, REJECTED, COMPLETED, CANCELLED
  - `message` (text) - Optional message with request
  - `created_at` (timestamptz) - Request creation time
  - `updated_at` (timestamptz) - Last status update
  - `completed_at` (timestamptz) - Completion timestamp

  ### `ratings`
  User ratings after completed exchanges
  - `id` (uuid, primary key) - Unique rating identifier
  - `exchange_id` (uuid, foreign key) - References exchanges
  - `rater_id` (uuid, foreign key) - User giving the rating
  - `rated_id` (uuid, foreign key) - User being rated
  - `rating` (integer) - Rating value 1-5
  - `review` (text) - Optional written review
  - `created_at` (timestamptz) - Rating timestamp

  ## 2. Security
  - Enable Row Level Security (RLS) on all tables
  - Users can read their own data and public profiles
  - Users can only modify their own data
  - Ratings are public but can only be created by exchange participants
  - Admin functions handled at application level

  ## 3. Indexes
  - Performance indexes on foreign keys and frequently queried columns
  - Unique constraints on email and skill names
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  bio text DEFAULT '',
  location text DEFAULT '',
  reputation_score decimal(3,2) DEFAULT 0.00,
  total_ratings integer DEFAULT 0,
  is_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create skills table
CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_name text UNIQUE NOT NULL,
  category text DEFAULT 'General',
  created_at timestamptz DEFAULT now()
);

-- Create user_skills table
CREATE TABLE IF NOT EXISTS user_skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  skill_id uuid NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  skill_type text NOT NULL CHECK (skill_type IN ('OFFER', 'REQUEST')),
  proficiency_level text DEFAULT 'intermediate' CHECK (proficiency_level IN ('beginner', 'intermediate', 'expert')),
  description text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, skill_id, skill_type)
);

-- Create exchanges table
CREATE TABLE IF NOT EXISTS exchanges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  partner_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  skill_given_id uuid NOT NULL REFERENCES skills(id),
  skill_received_id uuid NOT NULL REFERENCES skills(id),
  status text DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED', 'CANCELLED')),
  message text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

-- Create ratings table
CREATE TABLE IF NOT EXISTS ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  exchange_id uuid NOT NULL REFERENCES exchanges(id) ON DELETE CASCADE,
  rater_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rated_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  UNIQUE(exchange_id, rater_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_skills_user_id ON user_skills(user_id);
CREATE INDEX IF NOT EXISTS idx_user_skills_skill_id ON user_skills(skill_id);
CREATE INDEX IF NOT EXISTS idx_user_skills_type ON user_skills(skill_type);
CREATE INDEX IF NOT EXISTS idx_exchanges_requester ON exchanges(requester_id);
CREATE INDEX IF NOT EXISTS idx_exchanges_partner ON exchanges(partner_id);
CREATE INDEX IF NOT EXISTS idx_exchanges_status ON exchanges(status);
CREATE INDEX IF NOT EXISTS idx_ratings_exchange ON ratings(exchange_id);
CREATE INDEX IF NOT EXISTS idx_ratings_rated_id ON ratings(rated_id);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE exchanges ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view all profiles"
  ON users FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- RLS Policies for skills table
CREATE POLICY "Anyone can view skills"
  ON skills FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create skills"
  ON skills FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- RLS Policies for user_skills table
CREATE POLICY "Users can view all user skills"
  ON user_skills FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create own skills"
  ON user_skills FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own skills"
  ON user_skills FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own skills"
  ON user_skills FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for exchanges table
CREATE POLICY "Users can view their exchanges"
  ON exchanges FOR SELECT
  TO authenticated
  USING (auth.uid() = requester_id OR auth.uid() = partner_id);

CREATE POLICY "Users can create exchange requests"
  ON exchanges FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Partners can update exchange status"
  ON exchanges FOR UPDATE
  TO authenticated
  USING (auth.uid() = partner_id OR auth.uid() = requester_id)
  WITH CHECK (auth.uid() = partner_id OR auth.uid() = requester_id);

-- RLS Policies for ratings table
CREATE POLICY "Anyone can view ratings"
  ON ratings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Exchange participants can create ratings"
  ON ratings FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = rater_id AND
    EXISTS (
      SELECT 1 FROM exchanges
      WHERE exchanges.id = exchange_id
      AND (exchanges.requester_id = auth.uid() OR exchanges.partner_id = auth.uid())
      AND exchanges.status = 'COMPLETED'
    )
  );

-- Function to update user reputation score
CREATE OR REPLACE FUNCTION update_user_reputation()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE users
  SET 
    reputation_score = (
      SELECT COALESCE(AVG(rating), 0)
      FROM ratings
      WHERE rated_id = NEW.rated_id
    ),
    total_ratings = (
      SELECT COUNT(*)
      FROM ratings
      WHERE rated_id = NEW.rated_id
    )
  WHERE id = NEW.rated_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update reputation after rating
CREATE TRIGGER trigger_update_reputation
AFTER INSERT ON ratings
FOR EACH ROW
EXECUTE FUNCTION update_user_reputation();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for users table
CREATE TRIGGER trigger_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- Trigger for exchanges table
CREATE TRIGGER trigger_exchanges_updated_at
BEFORE UPDATE ON exchanges
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();