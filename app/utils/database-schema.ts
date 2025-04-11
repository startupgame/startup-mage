/**
 * Supabase Database Schema
 *
 * This file documents the database schema for the Startup Shark app.
 * Use this as a reference when working with the database.
 *
 * To set up these tables in Supabase:
 * 1. Go to your Supabase project dashboard
 * 2. Navigate to SQL Editor
 * 3. Create a new query and paste the SQL below
 * 4. Run the query to create all tables
 */

/*
-- Users Profile Table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name TEXT,
  email TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Game State Table
CREATE TABLE game_states (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  balance BIGINT DEFAULT 1000000,
  score BIGINT DEFAULT 0,
  completed_investments INTEGER DEFAULT 0,
  investment_streak INTEGER DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Startup Cards Table
CREATE TABLE startup_cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  funding_ask BIGINT NOT NULL,
  roi_potential INTEGER NOT NULL,
  problem TEXT,
  solution TEXT,
  market_size TEXT,
  hook TEXT,
  traction TEXT,
  team TEXT,
  competitors TEXT,
  financials TEXT,
  use_of_funds TEXT,
  customer_quote TEXT,
  funding_type TEXT,
  funding_format TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Startup Pitches Table (Separate from cards for more detailed pitch info)
CREATE TABLE startup_pitches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  startup_id UUID REFERENCES startup_cards(id) NOT NULL,
  pitch_title TEXT NOT NULL,
  pitch_summary TEXT,
  business_model TEXT,
  target_audience TEXT,
  competitive_advantage TEXT,
  growth_strategy TEXT,
  risk_factors TEXT,
  exit_strategy TEXT,
  pitch_deck_url TEXT,
  video_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Investments Table
CREATE TABLE investments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  startup_id UUID REFERENCES startup_cards(id),
  company_name TEXT NOT NULL,
  invested_amount BIGINT NOT NULL,
  current_value BIGINT NOT NULL,
  change_percentage FLOAT NOT NULL,
  funding_type TEXT,
  investment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Achievements Table
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  reward BIGINT NOT NULL,
  reward_type TEXT NOT NULL,
  target INTEGER NOT NULL,
  badge TEXT,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Achievements Progress Table
CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  achievement_id UUID REFERENCES achievements(id) NOT NULL,
  progress INTEGER DEFAULT 0,
  unlocked BOOLEAN DEFAULT FALSE,
  unlocked_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- Daily Missions Table
CREATE TABLE missions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  reward BIGINT NOT NULL,
  reward_type TEXT NOT NULL,
  target INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Mission Progress Table
CREATE TABLE mission_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  mission_id UUID REFERENCES missions(id) NOT NULL,
  progress INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, mission_id)
);

-- Leaderboard Table
CREATE TABLE leaderboard (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  name TEXT NOT NULL,
  score BIGINT NOT NULL,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Funding Types Table
CREATE TABLE funding_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL,
  format TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies (Run these after creating tables)
-- Example policy for profiles table:
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Allow public read access to startup cards and pitches
ALTER TABLE startup_cards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view startup cards" ON startup_cards
  FOR SELECT USING (true);

ALTER TABLE startup_pitches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view startup pitches" ON startup_pitches
  FOR SELECT USING (true);

ALTER TABLE funding_types ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view funding types" ON funding_types
  FOR SELECT USING (true);
*/

// TypeScript interfaces matching the database schema

export interface Profile {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface GameState {
  id: string;
  user_id: string;
  balance: number;
  score: number;
  completed_investments: number;
  investment_streak: number;
  last_updated: string;
}

export interface StartupCard {
  id: string;
  name: string;
  funding_ask: number;
  roi_potential: number;
  problem: string;
  solution: string;
  market_size: string;
  hook: string;
  traction: string;
  team: string;
  competitors: string;
  financials: string;
  use_of_funds: string;
  customer_quote: string;
  funding_type?: string;
  funding_format?: string;
  created_at: string;
}

export interface StartupPitch {
  id: string;
  startup_id: string;
  pitch_title: string;
  pitch_summary?: string;
  business_model?: string;
  target_audience?: string;
  competitive_advantage?: string;
  growth_strategy?: string;
  risk_factors?: string;
  exit_strategy?: string;
  pitch_deck_url?: string;
  video_url?: string;
  created_at: string;
}

export interface FundingType {
  id: string;
  type: string;
  format: string;
  description?: string;
  created_at: string;
}

export interface Investment {
  id: string;
  user_id: string;
  startup_id?: string;
  company_name: string;
  invested_amount: number;
  current_value: number;
  change_percentage: number;
  funding_type?: string;
  investment_date: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  reward: number;
  reward_type: "cash" | "points";
  target: number;
  badge?: string;
  category?: string;
  created_at: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  progress: number;
  unlocked: boolean;
  unlocked_at?: string;
  updated_at: string;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  reward: number;
  reward_type: "cash" | "points";
  target: number;
  created_at: string;
}

export interface MissionProgress {
  id: string;
  user_id: string;
  mission_id: string;
  progress: number;
  completed: boolean;
  last_updated: string;
}

export interface LeaderboardEntry {
  id: string;
  user_id: string;
  name: string;
  score: number;
  last_updated: string;
}
