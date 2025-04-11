-- Create startup_cards table if it doesn't exist
CREATE TABLE IF NOT EXISTS startup_cards (
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

-- Create startup_pitches table if it doesn't exist
CREATE TABLE IF NOT EXISTS startup_pitches (
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

-- Create funding_types table if it doesn't exist
CREATE TABLE IF NOT EXISTS funding_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL,
  format TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable realtime for these tables
alter publication supabase_realtime add table startup_cards;
alter publication supabase_realtime add table startup_pitches;
alter publication supabase_realtime add table funding_types;
