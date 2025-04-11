import { supabase } from "./supabase";
import { DEFAULT_FUNDING_TYPES } from "./constants";

// Fetch startup cards from Supabase
export async function fetchStartupCards() {
  try {
    const { data, error } = await supabase
      .from("startup_cards")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching startup cards:", error);
      return [];
    }

    if (data && data.length > 0) {
      return data.map((card) => ({
        id: card.id,
        name: card.name,
        fundingAsk: card.funding_ask,
        roiPotential: card.roi_potential,
        problem: card.problem,
        solution: card.solution,
        marketSize: card.market_size,
        hook: card.hook,
        traction: card.traction,
        team: card.team,
        competitors: card.competitors,
        financials: card.financials,
        useOfFunds: card.use_of_funds,
        customerQuote: card.customer_quote,
        fundingType: card.funding_type,
        fundingFormat: card.funding_format,
      }));
    }

    return [];
  } catch (error) {
    console.error("Error fetching startup cards:", error);
    return [];
  }
}

// Seed startup cards if none exist
export async function seedStartupCards() {
  try {
    // Check if we already have startup cards
    const { count, error } = await supabase
      .from("startup_cards")
      .select("*", { count: "exact", head: true });

    if (error) {
      console.error("Error checking startup cards:", error);
      return false;
    }

    // If we already have cards, don't seed
    if (count && count > 0) {
      console.log(`Found ${count} existing startup cards, skipping seed`);
      return true;
    }

    // Sample startup cards to seed
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
        financials: "$5.2M projected revenue by Year 3 with 78% gross margins",
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
        traction: "12,000 deliveries completed, 99.3% success rate, $420K ARR",
        team: "Robotics PhDs from Stanford with previous exits in automation",
        competitors:
          "Human couriers (70% market), Drone delivery (15%), Other robots (5%)",
        financials: "Projecting $12M revenue by Year 3 with 60% gross margins",
        use_of_funds:
          "Fleet Expansion (50%), Technology (30%), Operations (20%)",
        customer_quote:
          "DeliverBot cut our delivery costs in half while improving customer satisfaction. - LocalEats Founder",
        funding_type: "Venture Debt",
        funding_format: "$300,000 in Venture Debt",
      },
    ];

    // Insert the sample startups
    const { error: insertError } = await supabase
      .from("startup_cards")
      .insert(SAMPLE_STARTUPS);

    if (insertError) {
      console.error("Error seeding startup cards:", insertError);
      return false;
    }

    console.log("Successfully seeded startup cards");
    return true;
  } catch (error) {
    console.error("Error in seedStartupCards:", error);
    return false;
  }
}

// Seed funding types if none exist
export async function seedFundingTypes() {
  try {
    // Check if we already have funding types
    const { count, error } = await supabase
      .from("funding_types")
      .select("*", { count: "exact", head: true });

    if (error) {
      console.error("Error checking funding types:", error);
      return false;
    }

    // If we already have funding types, don't seed
    if (count && count > 0) {
      console.log(`Found ${count} existing funding types, skipping seed`);
      return true;
    }

    // Prepare funding types for insertion
    const fundingTypesToInsert = DEFAULT_FUNDING_TYPES.map((type) => ({
      type: type.type,
      format: type.format,
      description: `Funding through ${type.type}`,
    }));

    // Insert the funding types
    const { error: insertError } = await supabase
      .from("funding_types")
      .insert(fundingTypesToInsert);

    if (insertError) {
      console.error("Error seeding funding types:", insertError);
      return false;
    }

    console.log("Successfully seeded funding types");
    return true;
  } catch (error) {
    console.error("Error in seedFundingTypes:", error);
    return false;
  }
}
