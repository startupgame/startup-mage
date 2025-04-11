-- Create table to track viewed cards
CREATE TABLE IF NOT EXISTS user_viewed_cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  card_id UUID NOT NULL REFERENCES startup_cards(id) ON DELETE CASCADE,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  action TEXT NOT NULL DEFAULT 'viewed',
  UNIQUE(user_id, card_id)
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_user_viewed_cards_user_id ON user_viewed_cards(user_id);
CREATE INDEX IF NOT EXISTS idx_user_viewed_cards_card_id ON user_viewed_cards(card_id);
CREATE INDEX IF NOT EXISTS idx_user_viewed_cards_viewed_at ON user_viewed_cards(viewed_at);

-- Enable RLS
ALTER TABLE user_viewed_cards ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own viewed cards"
  ON user_viewed_cards
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own viewed cards"
  ON user_viewed_cards
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Enable realtime
alter publication supabase_realtime add table user_viewed_cards;