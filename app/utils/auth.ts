import { supabase } from "./supabase";
import { loadGameState } from "./supabase";

// Check if user is already logged in
export async function checkSession() {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session ? data.session.user : null;
  } catch (error) {
    console.error("Error checking session:", error);
    return null;
  }
}

// Sign in with email and password
export async function signInWithEmail(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data.user;
  } catch (error) {
    console.error("Error signing in:", error);
    throw error;
  }
}

// Sign up with email and password
export async function signUpWithEmail(
  email: string,
  password: string,
  name: string,
) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });
    if (error) throw error;

    // Create user profile
    if (data.user) {
      const { error: profileError } = await supabase.from("profiles").insert([
        {
          id: data.user.id,
          name,
          email,
          created_at: new Date().toISOString(),
        },
      ]);

      if (profileError) throw profileError;
    }

    return data.user;
  } catch (error) {
    console.error("Error signing up:", error);
    throw error;
  }
}

// Sign in with OAuth provider
export async function signInWithOAuth(
  provider: "google" | "github" | "twitter",
) {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo:
          Platform.OS === "web"
            ? window.location.origin
            : "exp://localhost:19000",
        queryParams:
          provider === "google"
            ? {
                access_type: "offline",
                prompt: "consent",
              }
            : undefined,
      },
    });
    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error signing in with ${provider}:`, error);
    throw error;
  }
}

// Sign out
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
}

// Initialize user data after login
export async function initializeUserData(userId: string) {
  try {
    // Load game state
    const gameState = await loadGameState(userId);

    // If no game state exists, create default one
    if (!gameState) {
      const { error } = await supabase.from("game_states").insert([
        {
          user_id: userId,
          balance: 1000000,
          shark_dollars: 0,
          completed_investments: 0,
          investment_streak: 0,
          last_updated: new Date().toISOString(),
        },
      ]);
      if (error) throw error;

      // Return default values
      return {
        balance: 1000000,
        sharkDollars: 0,
        completedInvestments: 0,
        investmentStreak: 0,
      };
    }

    // Return existing game state
    return {
      balance: gameState.balance,
      sharkDollars: gameState.shark_dollars || 0,
      completedInvestments: gameState.completed_investments,
      investmentStreak: gameState.investment_streak,
    };
  } catch (error) {
    console.error("Error initializing user data:", error);
    // Return default values on error
    return {
      balance: 1000000,
      sharkDollars: 0,
      completedInvestments: 0,
      investmentStreak: 0,
    };
  }
}
