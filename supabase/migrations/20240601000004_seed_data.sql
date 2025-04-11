-- Seed funding types
INSERT INTO funding_types (type, format, description)
VALUES
  ('Equity', '$%amount% for %stake%% Equity in the Company', 'Traditional equity investment'),
  ('Convertible Notes', '$%amount% via Convertible Notes', 'Debt that converts to equity'),
  ('SAFE', '$%amount% through a SAFE (Simple Agreement for Future Equity)', 'Simple agreement for future equity'),
  ('Revenue-Based', '$%amount% in Revenue-Based Financing', 'Funding repaid as a percentage of revenue'),
  ('Venture Debt', '$%amount% in Venture Debt', 'Debt financing for startups'),
  ('Crowdfunding', '$%amount% via Equity Crowdfunding', 'Raising small amounts from many investors'),
  ('Angel', '$%amount% from Angel Investors', 'Early-stage investment from individuals'),
  ('P2P', '$%amount% through Peer-to-Peer Lending', 'Direct lending between individuals'),
  ('Incubator', '$%amount% from an Incubator or Accelerator Program', 'Support program for early-stage startups'),
  ('Corporate VC', '$%amount% via Corporate Venture Capital', 'Investment from established companies'),
  ('Strategic', '$%amount% via Strategic Partnership Investment', 'Investment with business alignment')
ON CONFLICT (id) DO NOTHING;

-- Seed startup cards
INSERT INTO startup_cards (name, funding_ask, roi_potential, problem, solution, market_size, hook, traction, team, competitors, financials, use_of_funds, customer_quote, funding_type, funding_format)
VALUES
  ('GreenGrow', 200000, 80, 'Traditional farming uses too much water and chemicals, with 70% of global freshwater going to agriculture', 'AI-powered irrigation system that reduces water usage by 40% while increasing crop yields by 25%', '$50B agricultural tech market with 12% CAGR', 'Invest in the future of sustainable farming!', '3,500+ acres deployed, $1.2M ARR', 'Founded by MIT AgTech researchers with 25+ years combined experience', 'Traditional irrigation (60% market), SmartField (15%), AquaLogic (10%)', 'Projecting $8M revenue by Year 3 with 65% gross margins', 'R&D (40%), Market Expansion (35%), Operations (25%)', 'GreenGrow reduced our water costs by 38% while improving yield. - FarmCorp CEO', 'Equity', '$200,000 for 8% Equity in the Company'),
  ('QuickLearn', 150000, 120, 'Online education has 87% dropout rates and fails to engage modern learners effectively', 'Gamified learning platform with AI-personalized content that increases completion rates by 4.5x', '$250B global e-learning market growing at 21% annually', 'Education that''s actually fun and effective!', '250,000 active users, 92% retention rate, $850K ARR', 'Ex-Google AI lead and former Coursera product director', 'Traditional LMS (45% market), Gamified apps (25%), Video courses (30%)', '$5.2M projected revenue by Year 3 with 78% gross margins', 'Content Development (45%), AI Enhancement (30%), Marketing (25%)', 'QuickLearn increased our employee training completion by 320%. - HR Director, TechCorp', 'SAFE', '$150,000 through a SAFE (Simple Agreement for Future Equity)'),
  ('DeliverBot', 300000, 90, 'Last-mile delivery costs represent 53% of total shipping expenses and are highly inefficient', 'Autonomous delivery robots for urban environments that reduce delivery costs by 65%', '$30B last-mile delivery market with 18% CAGR', 'The future of delivery is here!', '12,000 deliveries completed, 99.3% success rate, $420K ARR', 'Robotics PhDs from Stanford with previous exits in automation', 'Human couriers (70% market), Drone delivery (15%), Other robots (5%)', 'Projecting $12M revenue by Year 3 with 60% gross margins', 'Fleet Expansion (50%), Technology (30%), Operations (20%)', 'DeliverBot cut our delivery costs in half while improving customer satisfaction. - LocalEats Founder', 'Venture Debt', '$300,000 in Venture Debt')
ON CONFLICT (id) DO NOTHING;

-- Seed achievements
INSERT INTO achievements (title, description, reward, reward_type, target, badge, category)
VALUES
  -- Daily achievements
  ('First Investment', 'Make your first investment', 10000, 'cash', 1, NULL, 'daily'),
  ('Daily Streak', 'Play Startup Shark 3 days in a row', 50000, 'cash', 3, NULL, 'daily'),
  ('Shark Frenzy', 'Make 10 investment decisions in one day', 25000, 'cash', 10, NULL, 'daily'),
  ('Lucky Day', 'Get 3 successful investments in one day', 75000, 'cash', 3, NULL, 'daily'),
  ('Big Risk Taker', 'Invest in a startup asking for $500K+ today', 100000, 'cash', 1, NULL, 'daily'),
  ('Weekend Warrior', 'Play Startup Shark on a weekend', 20000, 'cash', 1, NULL, 'daily'),
  ('Early Bird', 'Play Startup Shark before 9 AM', 15000, 'cash', 1, NULL, 'daily'),
  ('Night Owl', 'Play Startup Shark after 10 PM', 15000, 'cash', 1, NULL, 'daily'),
  
  -- Main milestone achievements
  ('Baby Shark', 'Complete 50 investments', 50000, 'cash', 50, NULL, 'main'),
  ('Shark Venture', 'Complete 100 investments', 100000, 'cash', 100, NULL, 'main'),
  ('Shark Don', 'Complete 500 investments', 500000, 'cash', 500, NULL, 'main'),
  ('Big Shark', 'Complete 1000 investments', 1000000, 'cash', 1000, NULL, 'main'),
  ('Million Dollar Portfolio', 'Reach $1,000,000 in portfolio value', 100000, 'cash', 1000000, NULL, 'main'),
  ('Five Million Portfolio', 'Reach $5,000,000 in portfolio value', 500000, 'cash', 5000000, NULL, 'main'),
  ('Ten Million Portfolio', 'Reach $10,000,000 in portfolio value', 1000000, 'cash', 10000000, NULL, 'main'),
  ('Risk Taker', 'Successfully invest in 5 high-risk startups (ROI > 150%)', 200000, 'cash', 5, NULL, 'main'),
  ('Steady Investor', 'Successfully invest in 10 low-risk startups (ROI < 80%)', 100000, 'cash', 10, NULL, 'main'),
  ('Smart Investor', 'Reach $5,000,000 in portfolio value', 500000, 'cash', 5000000, NULL, 'main'),
  ('Shark', 'Make 5 successful investments in a row', 100000, 'cash', 5, NULL, 'main')
ON CONFLICT (id) DO NOTHING;

-- Seed missions
INSERT INTO missions (title, description, reward, reward_type, target)
VALUES
  ('First Investment', 'Make your first investment of the day', 50000, 'cash', 1),
  ('Investment Streak', 'Successfully invest in 3 startups in a row', 100000, 'cash', 3),
  ('Big Spender', 'Invest in a startup asking for $300K or more', 100000, 'cash', 1),
  ('Daily Player', 'Play Startup Shark for 5 minutes today', 50000, 'cash', 5)
ON CONFLICT (id) DO NOTHING;
