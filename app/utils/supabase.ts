import { createClient } from "@supabase/supabase-js";
import { Platform } from "react-native";

// Initialize Supabase client with your project URL and anon key
// Using environment variables or fallback to default values
const supabaseUrl = "https://qsetnlbcuhiodkoycizx.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzZXRubGJjdWhpb2Rrb3ljaXp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyMjc0NzEsImV4cCI6MjA1OTgwMzQ3MX0.Grsxe6gyY4nlJmAXzAzUcpJcW3xeEcQ4spRFDyP60DQ";

// We have a valid Supabase URL and key
const isDummyClient = false;

// Conditionally import AsyncStorage to avoid window not defined error
let AsyncStorage: any = null;

// Only import AsyncStorage on native platforms or if window is defined (browser)
if (
  Platform.OS === "ios" ||
  Platform.OS === "android" ||
  typeof window !== "undefined"
) {
  // Dynamic import to avoid SSR issues
  try {
    AsyncStorage = require("@react-native-async-storage/async-storage").default;
  } catch (error) {
    console.warn("Failed to load AsyncStorage", error);
    // Provide a mock implementation for AsyncStorage when it can't be loaded
    AsyncStorage = {
      getItem: async () => null,
      setItem: async () => null,
      removeItem: async () => null,
    };
  }
}

// Create Supabase client with appropriate storage option
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Game data functions with error handling for dummy client
export async function saveGameState(userId: string, gameData: any) {
  try {
    if (isDummyClient) {
      console.log("[Mock] Saving game state for user:", userId);
      return null;
    }

    const { data, error } = await supabase.from("game_states").upsert(
      {
        user_id: userId,
        balance: gameData.balance,
        shark_dollars: gameData.sharkDollars || 0,
        completed_investments: gameData.completedInvestments,
        investment_streak: gameData.investmentStreak,
        last_updated: new Date().toISOString(),
      },
      { onConflict: "user_id" },
    );

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error saving game state:", error);
    return null;
  }
}

export async function loadGameState(userId: string) {
  try {
    if (isDummyClient) {
      console.log("[Mock] Loading game state for user:", userId);
      return null;
    }

    const { data, error } = await supabase
      .from("game_states")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return data;
  } catch (error) {
    console.error("Error loading game state:", error);
    return null;
  }
}

export async function saveInvestment(userId: string, investment: any) {
  try {
    if (isDummyClient) {
      console.log("[Mock] Saving investment for user:", userId);
      return null;
    }

    const { data, error } = await supabase.from("investments").insert({
      user_id: userId,
      startup_id: investment.startupId,
      company_name: investment.companyName,
      invested_amount: investment.investedAmount,
      current_value: investment.currentValue,
      change_percentage: investment.changePercentage,
      funding_type: investment.fundingType,
      investment_date: investment.investmentDate || new Date().toISOString(),
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error saving investment:", error);
    return null;
  }
}

export async function getInvestments(userId: string) {
  try {
    if (isDummyClient) {
      console.log("[Mock] Getting investments for user:", userId);
      return [];
    }

    const { data, error } = await supabase
      .from("investments")
      .select("*, startup_cards(*)")
      .eq("user_id", userId)
      .order("investment_date", { ascending: false })
      .limit(25); // Updated to limit to last 25 investments

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error getting investments:", error);
    return [];
  }
}

export async function updateLeaderboard(
  userId: string,
  name: string,
  sharkDollars: number,
) {
  try {
    if (isDummyClient) {
      console.log("[Mock] Updating leaderboard for user:", userId);
      return null;
    }

    const { data, error } = await supabase.from("leaderboard").upsert(
      {
        user_id: userId,
        name,
        shark_dollars: sharkDollars,
        last_updated: new Date().toISOString(),
      },
      { onConflict: "user_id" },
    );

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error updating leaderboard:", error);
    return null;
  }
}

export async function getLeaderboard(limit = 10) {
  try {
    if (isDummyClient) {
      console.log("[Mock] Getting leaderboard data");
      return [];
    }

    const { data, error } = await supabase
      .from("leaderboard")
      .select("*")
      .order("shark_dollars", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error getting leaderboard:", error);
    return [];
  }
}

export async function saveMissionProgress(
  userId: string,
  missionId: string,
  progress: number,
  completed: boolean,
) {
  try {
    if (isDummyClient) {
      console.log("[Mock] Saving mission progress for user:", userId);
      return null;
    }

    const { data, error } = await supabase.from("mission_progress").upsert(
      {
        user_id: userId,
        mission_id: missionId,
        progress,
        completed,
        last_updated: new Date().toISOString(),
      },
      { onConflict: ["user_id", "mission_id"] },
    );

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error saving mission progress:", error);
    return null;
  }
}

export async function getMissionProgress(userId: string) {
  try {
    if (isDummyClient) {
      console.log("[Mock] Getting mission progress for user:", userId);
      return [];
    }

    const { data, error } = await supabase
      .from("mission_progress")
      .select("*, missions(*)")
      .eq("user_id", userId);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error getting mission progress:", error);
    return [];
  }
}

// Get startup cards from Supabase
export async function getStartupCards() {
  try {
    if (isDummyClient) {
      console.log("[Mock] Getting startup cards");
      return [];
    }

    const { data, error } = await supabase
      .from("startup_cards")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error getting startup cards:", error);
    return [];
  }
}

// Track viewed cards to avoid repeating them unnecessarily
export async function saveViewedCard(
  userId: string,
  cardId: string,
  action: string = "viewed",
) {
  try {
    if (isDummyClient || !userId || !cardId) {
      console.log("[Mock] Saving viewed card:", cardId);
      return null;
    }

    const { data, error } = await supabase.from("user_viewed_cards").upsert(
      {
        user_id: userId,
        card_id: cardId,
        viewed_at: new Date().toISOString(),
        action: action,
      },
      { onConflict: ["user_id", "card_id"] },
    );

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error saving viewed card:", error);
    return null;
  }
}

// Get fresh startup cards that haven't been viewed by the user
export async function getFreshStartupCards(userId: string) {
  try {
    if (isDummyClient || !userId) {
      console.log("[Mock] Getting fresh startup cards");
      return [];
    }

    // First try to get cards the user hasn't viewed yet
    const { data: freshCards, error: freshError } = await supabase
      .from("startup_cards")
      .select("*")
      .not(
        "id",
        "in",
        supabase
          .from("user_viewed_cards")
          .select("card_id")
          .eq("user_id", userId),
      )
      .order("created_at", { ascending: false });

    if (freshError) throw freshError;

    // If we have fresh cards, return them
    if (freshCards && freshCards.length > 0) {
      return freshCards;
    }

    // If no fresh cards, reset viewed status and return all cards
    // This means the user has seen all cards, so we'll show them again
    console.log("No fresh cards found, resetting viewed status");

    // Get all cards
    const { data: allCards, error: allError } = await supabase
      .from("startup_cards")
      .select("*")
      .order("created_at", { ascending: false });

    if (allError) throw allError;

    // Clear viewed cards for this user
    const { error: deleteError } = await supabase
      .from("user_viewed_cards")
      .delete()
      .eq("user_id", userId);

    if (deleteError) console.error("Error clearing viewed cards:", deleteError);

    return allCards || [];
  } catch (error) {
    console.error("Error getting fresh startup cards:", error);
    return [];
  }
}

// Get startup pitches from Supabase
export async function getStartupPitches(startupId?: string) {
  try {
    if (isDummyClient) {
      console.log("[Mock] Getting startup pitches");
      return [];
    }

    let query = supabase.from("startup_pitches").select("*, startup_cards(*)");

    if (startupId) {
      query = query.eq("startup_id", startupId);
    }

    const { data, error } = await query.order("created_at", {
      ascending: false,
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error getting startup pitches:", error);
    return [];
  }
}

// Get funding types from Supabase
export async function getFundingTypes() {
  try {
    if (isDummyClient) {
      console.log("[Mock] Getting funding types");
      return [];
    }

    const { data, error } = await supabase.from("funding_types").select("*");

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error getting funding types:", error);
    return [];
  }
}

// Save a startup card to Supabase
export async function saveStartupCard(card: any) {
  try {
    if (isDummyClient) {
      console.log("[Mock] Saving startup card");
      return null;
    }

    const { data, error } = await supabase
      .from("startup_cards")
      .insert({
        name: card.name,
        funding_ask: card.funding_ask,
        roi_potential: card.roi_potential,
        problem: card.problem,
        solution: card.solution,
        market_size: card.market_size,
        hook: card.hook,
        traction: card.traction,
        team: card.team,
        competitors: card.competitors,
        financials: card.financials,
        use_of_funds: card.use_of_funds,
        customer_quote: card.customer_quote,
        funding_type: card.funding_type,
        funding_format: card.funding_format,
      })
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error("Error saving startup card:", error);
    return null;
  }
}

// Save a startup pitch to Supabase
export async function saveStartupPitch(pitch: any) {
  try {
    if (isDummyClient) {
      console.log("[Mock] Saving startup pitch");
      return null;
    }

    const { data, error } = await supabase
      .from("startup_pitches")
      .insert({
        startup_id: pitch.startup_id,
        pitch_title: pitch.pitch_title,
        pitch_summary: pitch.pitch_summary,
        business_model: pitch.business_model,
        target_audience: pitch.target_audience,
        competitive_advantage: pitch.competitive_advantage,
        growth_strategy: pitch.growth_strategy,
        risk_factors: pitch.risk_factors,
        exit_strategy: pitch.exit_strategy,
        pitch_deck_url: pitch.pitch_deck_url,
        video_url: pitch.video_url,
      })
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error("Error saving startup pitch:", error);
    return null;
  }
}
