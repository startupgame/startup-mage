import { supabase } from "./supabase";
import { DEFAULT_FUNDING_TYPES } from "./constants";

/**
 * Initialize Supabase database with necessary tables and seed data
 * This function should be called once when the app is first installed
 */
export async function initializeSupabaseDatabase() {
  try {
    console.log("Initializing Supabase database...");

    // Check if funding_types table exists and has data
    const { data: fundingTypes, error: fundingTypesError } = await supabase
      .from("funding_types")
      .select("count");

    if (fundingTypesError) {
      console.error("Error checking funding_types table:", fundingTypesError);
    } else if (!fundingTypes || fundingTypes.length === 0) {
      // Seed funding types
      console.log("Seeding funding types...");
      for (const fundingType of DEFAULT_FUNDING_TYPES) {
        await supabase.from("funding_types").insert({
          type: fundingType.type,
          format: fundingType.format,
          description: `Funding through ${fundingType.type}`,
        });
      }
    }

    // Check if startup_cards table exists and has data
    const { data: startupCards, error: startupCardsError } = await supabase
      .from("startup_cards")
      .select("count");

    if (startupCardsError) {
      console.error("Error checking startup_cards table:", startupCardsError);
    } else if (!startupCards || startupCards.length === 0) {
      // Seed startup cards with sample data
      console.log("Seeding startup cards...");
      const SAMPLE_STARTUPS = [
        {
          name: "GreenGrow",
          funding_ask: 200000,
          roi_potential: 80,
          problem:
            "Traditional farming uses too much water and chemicals, with 70% of global freshwater going to agriculture",
          solution:
            "AI-powered irrigation system that reduces water usage by 40% while increasing crop yields by 25%",
          market_size: "$50B agricultural tech market with 12% CAGR",
          hook: "Invest in the future of sustainable farming!",
          traction: "3,500+ acres deployed, $1.2M ARR",
          team: "Founded by MIT AgTech researchers with 25+ years combined experience",
          competitors:
            "Traditional irrigation (60% market), SmartField (15%), AquaLogic (10%)",
          financials: "Projecting $8M revenue by Year 3 with 65% gross margins",
          use_of_funds: "R&D (40%), Market Expansion (35%), Operations (25%)",
          customer_quote:
            "GreenGrow reduced our water costs by 38% while improving yield. - FarmCorp CEO",
          funding_type: "Equity",
          funding_format: "$200,000 for 8% Equity in the Company",
        },
        {
          name: "QuickLearn",
          funding_ask: 150000,
          roi_potential: 120,
          problem:
            "Online education has 87% dropout rates and fails to engage modern learners effectively",
          solution:
            "Gamified learning platform with AI-personalized content that increases completion rates by 4.5x",
          market_size: "$250B global e-learning market growing at 21% annually",
          hook: "Education that's actually fun and effective!",
          traction: "250,000 active users, 92% retention rate, $850K ARR",
          team: "Ex-Google AI lead and former Coursera product director",
          competitors:
            "Traditional LMS (45% market), Gamified apps (25%), Video courses (30%)",
          financials:
            "$5.2M projected revenue by Year 3 with 78% gross margins",
          use_of_funds:
            "Content Development (45%), AI Enhancement (30%), Marketing (25%)",
          customer_quote:
            "QuickLearn increased our employee training completion by 320%. - HR Director, TechCorp",
          funding_type: "SAFE",
          funding_format:
            "$150,000 through a SAFE (Simple Agreement for Future Equity)",
        },
        {
          name: "DeliverBot",
          funding_ask: 300000,
          roi_potential: 90,
          problem:
            "Last-mile delivery costs represent 53% of total shipping expenses and are highly inefficient",
          solution:
            "Autonomous delivery robots for urban environments that reduce delivery costs by 65%",
          market_size: "$30B last-mile delivery market with 18% CAGR",
          hook: "The future of delivery is here!",
          traction:
            "12,000 deliveries completed, 99.3% success rate, $420K ARR",
          team: "Robotics PhDs from Stanford with previous exits in automation",
          competitors:
            "Human couriers (70% market), Drone delivery (15%), Other robots (5%)",
          financials:
            "Projecting $12M revenue by Year 3 with 60% gross margins",
          use_of_funds:
            "Fleet Expansion (50%), Technology (30%), Operations (20%)",
          customer_quote:
            "DeliverBot cut our delivery costs in half while improving customer satisfaction. - LocalEats Founder",
          funding_type: "Venture Debt",
          funding_format: "$300,000 in Venture Debt",
        },
      ];

      for (const startup of SAMPLE_STARTUPS) {
        await supabase.from("startup_cards").insert(startup);
      }
    }

    // Check if achievements table exists and has data
    const { data: achievements, error: achievementsError } = await supabase
      .from("achievements")
      .select("count");

    if (achievementsError) {
      console.error("Error checking achievements table:", achievementsError);
    }

    // Check if missions table exists and has data
    const { data: missions, error: missionsError } = await supabase
      .from("missions")
      .select("count");

    if (missionsError) {
      console.error("Error checking missions table:", missionsError);
    } else if (!missions || missions.length === 0) {
      // Seed missions with sample data
      console.log("Seeding missions...");
      const SAMPLE_MISSIONS = [
        {
          id: "1",
          title: "First Investment",
          description: "Make your first investment of the day",
          reward: 50000,
          reward_type: "cash",
          target: 1,
        },
        {
          id: "2",
          title: "Investment Streak",
          description: "Successfully invest in 3 startups in a row",
          reward: 200,
          reward_type: "points",
          target: 3,
        },
        {
          id: "3",
          title: "Big Spender",
          description: "Invest in a startup asking for $300K or more",
          reward: 100000,
          reward_type: "cash",
          target: 1,
        },
        {
          id: "4",
          title: "Daily Player",
          description: "Play Startup Shark for 5 minutes today",
          reward: 100,
          reward_type: "points",
          target: 5,
        },
      ];

      for (const mission of SAMPLE_MISSIONS) {
        await supabase.from("missions").insert(mission);
      }
    }

    console.log("Supabase database initialization complete!");
    return true;
  } catch (error) {
    console.error("Error initializing Supabase database:", error);
    return false;
  }
}
