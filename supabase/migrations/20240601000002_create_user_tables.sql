-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name TEXT,
  email TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create game_states table if it doesn't exist
CREATE TABLE IF NOT EXISTS game_states (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  balance BIGINT DEFAULT 1000000,
  shark_dollars BIGINT DEFAULT 0,
  completed_investments INTEGER DEFAULT 0,
  investment_streak INTEGER DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create investments table if it doesn't exist
CREATE TABLE IF NOT EXISTS investments (
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

-- Enable realtime for these tables
alter publication supabase_realtime add table profiles;
alter publication supabase_realtime add table game_states;
alter publication supabase_realtime add table investments;
