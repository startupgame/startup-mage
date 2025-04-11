import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import {
  Trophy,
  ShoppingBag,
  BarChart,
  Award,
  Calendar,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { safeImpact } from "../utils/haptics";

interface GameHeaderProps {
  balance?: number;
  sharkDollars?: number;
  onMenuPress?: () => void;
  onStorePress?: () => void;
  onLeaderboardPress?: () => void;
  onPortfolioPress?: () => void;
  onAchievementsPress?: () => void;
  instructionText?: string;
  showInstruction?: boolean;
}

const GameHeader = ({
  balance = 1000000,
  sharkDollars = 0,
  onMenuPress,
  onStorePress,
  onLeaderboardPress,
  onPortfolioPress,
  onAchievementsPress,
  instructionText = "Swipe right to invest, left to pass",
  showInstruction = false,
}: GameHeaderProps) => {
  const router = useRouter();
  const [showInstructionLocal, setShowInstructionLocal] =
    useState(showInstruction);
  const instructionOpacity = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setShowInstructionLocal(showInstruction);
    if (showInstruction) {
      Animated.timing(instructionOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // Auto hide after 5 seconds
      const timer = setTimeout(() => {
        Animated.timing(instructionOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => setShowInstructionLocal(false));
      }, 5000);

      return () => clearTimeout(timer);
    } else {
      Animated.timing(instructionOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [showInstruction]);

  const handleMenuPress = () => {
    safeImpact(Haptics.ImpactFeedbackStyle.Light);
    if (onMenuPress) {
      onMenuPress();
    }
  };

  const handlePortfolioPress = () => {
    safeImpact(Haptics.ImpactFeedbackStyle.Light);
    if (onPortfolioPress) {
      onPortfolioPress();
    }
  };

  const handleAchievementsPress = () => {
    safeImpact(Haptics.ImpactFeedbackStyle.Light);
    if (onAchievementsPress) {
      onAchievementsPress();
    }
  };

  const handleStorePress = () => {
    safeImpact(Haptics.ImpactFeedbackStyle.Light);
    if (onStorePress) {
      onStorePress();
    }
  };

  const handleLeaderboardPress = () => {
    safeImpact(Haptics.ImpactFeedbackStyle.Light);
    if (onLeaderboardPress) {
      onLeaderboardPress();
    }
  };

  // Format balance with commas and dollar sign
  const formattedBalance = `${balance.toLocaleString()}`;

  return (
    <View className="w-full h-24 px-4 pt-8 pb-2 bg-blue-900">
      <View className="flex-row items-center justify-between">
        {/* Left side - Action buttons */}
        <View className="flex-row">
          <TouchableOpacity
            onPress={handleMenuPress}
            className="w-10 h-10 mr-2 items-center justify-center rounded-full bg-blue-800"
          >
            <Calendar size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handlePortfolioPress}
            className="w-10 h-10 mr-2 items-center justify-center rounded-full bg-blue-800"
          >
            <BarChart size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleAchievementsPress}
            className="w-10 h-10 items-center justify-center rounded-full bg-blue-800"
          >
            <Award size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* Center - Balance and Score */}
        <View className="items-center">
          <Text className="text-xl font-bold text-white">
            {formattedBalance}
          </Text>
          <Text className="text-sm text-blue-200 font-semibold">
            {sharkDollars > 0 ? `${sharkDollars.toLocaleString()} ` : ""}Shark
            Dollars
          </Text>
        </View>

        {/* Right side - Store and Leaderboard buttons */}
        <View className="flex-row">
          <TouchableOpacity
            onPress={handleStorePress}
            className="w-10 h-10 mr-2 items-center justify-center rounded-full bg-blue-800"
          >
            <ShoppingBag size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleLeaderboardPress}
            className="w-10 h-10 items-center justify-center rounded-full bg-blue-800"
          >
            <Trophy size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Instruction text that appears temporarily */}
      {showInstructionLocal && (
        <Animated.View
          style={{ opacity: instructionOpacity }}
          className="absolute bottom-0 left-0 right-0 items-center pb-1"
        >
          <Text className="text-white text-sm font-medium bg-blue-800 px-4 py-1 rounded-full">
            {instructionText}
          </Text>
        </Animated.View>
      )}
    </View>
  );
};

export default GameHeader;
