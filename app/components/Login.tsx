import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { supabase } from "../utils/supabase";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Github,
  Twitter,
  LogIn,
  Linkedin,
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { safeImpact } from "../utils/haptics";

interface LoginProps {
  onLogin: (user: any) => void;
}

const Login = ({ onLogin }: LoginProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    try {
      setLoading(true);
      setError("");
      safeImpact();

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Get user profile from database
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .single();

      onLogin({ ...data.user, profile: profileData });
    } catch (error: any) {
      console.error("Login error:", error);
      setError(error.message || "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!email || !password || !name) {
      setError("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      setError("");
      safeImpact();

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
        try {
          const { error: profileError } = await supabase
            .from("profiles")
            .insert([
              {
                id: data.user.id,
                name,
                email,
                created_at: new Date().toISOString(),
              },
            ]);

          if (profileError) {
            console.error("Profile creation error:", profileError);
            // Continue with login even if profile creation fails
            // The profile might already exist or will be created later
          }

          // Initialize game state for new user
          const { error: gameStateError } = await supabase
            .from("game_states")
            .insert([
              {
                user_id: data.user.id,
                balance: 1000000, // Starting with $1M
                shark_dollars: 0,
                completed_investments: 0,
                investment_streak: 0,
                last_updated: new Date().toISOString(),
              },
            ]);

          if (gameStateError && gameStateError.code !== "23505") {
            // Ignore duplicate key errors
            console.error("Game state initialization error:", gameStateError);
          }
        } catch (initError) {
          console.error("User initialization error:", initError);
          // Continue with login even if initialization fails
        }
      }

      // Auto-login after registration
      if (data.user) {
        // Get user profile from database
        try {
          const { data: profileData } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", data.user.id)
            .single();

          onLogin({ ...data.user, profile: profileData });
        } catch (profileError) {
          console.error(
            "Error fetching profile after registration:",
            profileError,
          );
          // Login without profile data if fetch fails
          onLogin(data.user);
        }
      } else {
        // Handle edge case where user data is missing
        setError(
          "Registration successful but user data is missing. Please try logging in.",
        );
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      setError(error.message || "Failed to register");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (
    provider: "github" | "twitter" | "google" | "linkedin",
  ) => {
    try {
      setLoading(true);
      setError("");
      safeImpact();

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

      // Note: OAuth flow will redirect and complete in _layout.tsx
      // We don't need to call onLogin here
    } catch (error: any) {
      console.error(`${provider} login error:`, error);
      setError(error.message || `Failed to login with ${provider}`);
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <ScrollView className="flex-1 bg-blue-950">
        <LinearGradient
          colors={["#1e40af", "#1e3a8a", "#172554"]}
          className="flex-1 min-h-screen px-6 py-12"
        >
          <View className="items-center mb-8">
            <Image
              source={{
                uri: "https://api.dicebear.com/7.x/avataaars/svg?seed=shark&backgroundColor=b6e3f4",
              }}
              style={{ width: 100, height: 100 }}
              className="rounded-full bg-blue-300 mb-4"
            />
            <Text className="text-white text-3xl font-bold">Startup Shark</Text>
            <Text className="text-blue-200 text-lg">
              {isRegistering ? "Create an account" : "Sign in to continue"}
            </Text>
          </View>

          {error ? (
            <View className="bg-red-500/20 border border-red-500 rounded-lg p-3 mb-6">
              <Text className="text-red-100">{error}</Text>
            </View>
          ) : null}

          <View className="space-y-4 mb-6">
            {isRegistering && (
              <View className="bg-white/10 rounded-xl px-4 py-3 flex-row items-center">
                <User size={20} color="#93c5fd" />
                <TextInput
                  className="flex-1 text-white ml-3"
                  placeholder="Your Name"
                  placeholderTextColor="#64748b"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </View>
            )}

            <View className="bg-white/10 rounded-xl px-4 py-3 flex-row items-center">
              <Mail size={20} color="#93c5fd" />
              <TextInput
                className="flex-1 text-white ml-3"
                placeholder="Email Address"
                placeholderTextColor="#64748b"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View className="bg-white/10 rounded-xl px-4 py-3 flex-row items-center">
              <Lock size={20} color="#93c5fd" />
              <TextInput
                className="flex-1 text-white ml-3"
                placeholder="Password (min 6 characters)"
                placeholderTextColor="#64748b"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <EyeOff size={20} color="#64748b" />
                ) : (
                  <Eye size={20} color="#64748b" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            className="bg-blue-600 rounded-xl py-4 items-center mb-6"
            onPress={isRegistering ? handleRegister : handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-bold text-lg">
                {isRegistering ? "Create Account" : "Sign In"}
              </Text>
            )}
          </TouchableOpacity>

          <View className="flex-row items-center mb-6">
            <View className="flex-1 h-[1px] bg-blue-800" />
            <Text className="text-blue-300 mx-4">OR</Text>
            <View className="flex-1 h-[1px] bg-blue-800" />
          </View>

          <View className="flex-row justify-center space-x-4 mb-8">
            <TouchableOpacity
              className="bg-[#333] w-12 h-12 rounded-full items-center justify-center"
              onPress={() => handleSocialLogin("github")}
            >
              <Github size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-[#1DA1F2] w-12 h-12 rounded-full items-center justify-center"
              onPress={() => handleSocialLogin("twitter")}
            >
              <Twitter size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-[#DB4437] w-12 h-12 rounded-full items-center justify-center"
              onPress={() => handleSocialLogin("google")}
            >
              <Text className="text-white font-bold">G</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-[#0077B5] w-12 h-12 rounded-full items-center justify-center"
              onPress={() => handleSocialLogin("linkedin")}
            >
              <Linkedin size={24} color="white" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            className="items-center"
            onPress={() => setIsRegistering(!isRegistering)}
          >
            <Text className="text-blue-300">
              {isRegistering
                ? "Already have an account? Sign In"
                : "Don't have an account? Create one"}
            </Text>
          </TouchableOpacity>
        </LinearGradient>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Login;
