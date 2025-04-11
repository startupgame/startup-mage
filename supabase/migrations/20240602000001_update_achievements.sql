-- Remove funding model achievements and add daily achievements
DELETE FROM achievements WHERE category = 'funding';

-- Update main category to milestone
UPDATE achievements SET category = 'milestone' WHERE category = 'main';

-- Add daily achievements
INSERT INTO achievements (title, description, reward, reward_type, target, badge, category)
VALUES
  -- Daily achievements
  ('Daily Streak', 'Play Startup Shark 3 days in a row', 50000, 'cash', 3, NULL, 'daily'),
  ('Shark Frenzy', 'Make 10 investment decisions in one day', 25000, 'cash', 10, NULL, 'daily'),
  ('Lucky Day', 'Get 3 successful investments in one day', 75000, 'cash', 3, NULL, 'daily'),
  ('Big Risk Taker', 'Invest in a startup asking for $500K+ today', 100000, 'cash', 1, NULL, 'daily'),
  ('Weekend Warrior', 'Play Startup Shark on a weekend', 20000, 'cash', 1, NULL, 'daily'),
  ('Early Bird', 'Play Startup Shark before 9 AM', 15000, 'cash', 1, NULL, 'daily'),
  ('Night Owl', 'Play Startup Shark after 10 PM', 15000, 'cash', 1, NULL, 'daily')
ON CONFLICT (id) DO NOTHING;

-- Enable realtime for user_achievements table only
-- Note: achievements table is already in the publication
alter publication supabase_realtime add table user_achievements;