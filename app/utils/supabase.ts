import { createClient } from "@supabase/supabase-js";
import { Platform } from "react-native";

// Initialize Supabase client with your project URL and anon key
// Replace with your actual Supabase project URL and anon key
const supabaseUrl = "https://your-project-url.supabase.co";
const supabaseAnonKey = "your-anon-key";

// Create a dummy client if URL is the default placeholder
const isDummyClient = supabaseUrl === "https://your-project-url.supabase.co";

if (isDummyClient) {
  console.warn(
    "Using dummy Supabase client. Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY environment variables for production use.",
  );
}

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
        score: gameData.score,
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
      company_name: investment.companyName,
      invested_amount: investment.investedAmount,
      current_value: investment.currentValue,
      change_percentage: investment.changePercentage,
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
      .select("*")
      .eq("user_id", userId)
      .order("investment_date", { ascending: false });

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
  score: number,
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
        score,
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
      .order("score", { ascending: false })
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
      .select("*")
      .eq("user_id", userId);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error getting mission progress:", error);
    return [];
  }
}
