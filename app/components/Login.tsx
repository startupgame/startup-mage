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

      // Auto-login after registration
      onLogin(data.user);
    } catch (error: any) {
      console.error("Registration error:", error);
      setError(error.message || "Failed to register");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: "github" | "twitter") => {
    try {
      setLoading(true);
      setError("");
      safeImpact();

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: "exp://localhost:19000",
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
