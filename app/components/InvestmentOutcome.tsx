import React, { useEffect } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import { safeNotification } from "../utils/haptics";
import { playSuccessSound, playFailureSound } from "../utils/sounds";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { ArrowDownCircle, ArrowUpCircle, X } from "lucide-react-native";

interface InvestmentOutcomeProps {
  visible?: boolean;
  onClose?: () => void;
  success?: boolean;
  amount?: number;
  companyName?: string;
}

export default function InvestmentOutcome({
  visible = true,
  onClose = () => {},
  success = true,
  amount = 200000,
  companyName = "TechStartup Inc.",
}: InvestmentOutcomeProps) {
  const isSuccess = success;
  const returnAmount = Math.abs(amount);
  const investmentAmount = isSuccess ? returnAmount - amount : returnAmount;
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);
  const iconScale = useSharedValue(0.5);

  useEffect(() => {
    if (visible) {
      // Trigger haptic feedback based on outcome
      if (isSuccess) {
        safeNotification(Haptics.NotificationFeedbackType.Success);
        playSuccessSound(); // Play good investment sound effect
      } else {
        safeNotification(Haptics.NotificationFeedbackType.Error);
        playFailureSound(); // Play bad investment sound effect
      }

      // Animate modal in
      opacity.value = withTiming(1, { duration: 300 });
      scale.value = withSpring(1, { damping: 12 });

      // Animate icon
      iconScale.value = withSequence(
        withTiming(1.2, { duration: 400, easing: Easing.out(Easing.back()) }),
        withTiming(1, { duration: 200 }),
      );
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }],
    };
  });

  const iconAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: iconScale.value }],
    };
  });

  const handleClose = () => {
    opacity.value = withTiming(0, { duration: 200 });
    scale.value = withTiming(0.8, { duration: 200 }, () => {
      onClose();
    });
  };

  if (!visible) return null;

  const formattedInvestment = `${investmentAmount.toLocaleString()}`;
  const formattedReturn = isSuccess ? `${returnAmount.toLocaleString()}` : "$0";

  const formattedNetChange = isSuccess
    ? `+${amount.toLocaleString()}`
    : `-${returnAmount.toLocaleString()}`;

  return (
    <View className="absolute inset-0 flex items-center justify-center bg-black/50 z-50">
      <Animated.View
        style={animatedStyle}
        className="w-[300px] bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-xl"
      >
        {/* Header */}
        <View
          className={`p-6 ${isSuccess ? "bg-green-500" : "bg-red-500"} items-center`}
        >
          <Animated.View style={iconAnimatedStyle}>
            {isSuccess ? (
              <ArrowUpCircle size={64} color="white" />
            ) : (
              <ArrowDownCircle size={64} color="white" />
            )}
          </Animated.View>
          <Text className="text-white text-2xl font-bold mt-2">
            {isSuccess ? "Great Investment!" : "Investment Loss"}
          </Text>
        </View>

        {/* Content */}
        <View className="p-6">
          <Text className="text-gray-800 dark:text-gray-200 text-lg font-medium mb-4">
            {isSuccess
              ? `Your investment in ${companyName} paid off!`
              : `Your investment in ${companyName} didn't perform as expected.`}
          </Text>

          <View className="space-y-3 mb-6">
            <View className="flex-row justify-between">
              <Text className="text-gray-600 dark:text-gray-400">
                Investment:
              </Text>
              <Text className="font-medium text-gray-800 dark:text-gray-200">
                {formattedInvestment}
              </Text>
            </View>

            <View className="flex-row justify-between">
              <Text className="text-gray-600 dark:text-gray-400">Return:</Text>
              <Text className="font-medium text-gray-800 dark:text-gray-200">
                {formattedReturn}
              </Text>
            </View>

            <View className="flex-row justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
              <Text className="text-gray-600 dark:text-gray-400">
                Net Change:
              </Text>
              <Text
                className={`font-bold ${isSuccess ? "text-green-600" : "text-red-600"}`}
              >
                {formattedNetChange}
              </Text>
            </View>
          </View>

          {/* Shark Dollars */}
          <View className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg mb-6 items-center">
            <Text className="text-gray-800 dark:text-gray-200 font-medium">
              {isSuccess ? "+20,000 Shark Dollars" : "-5,000 Shark Dollars"}
            </Text>
          </View>

          {/* Close button */}
          <Pressable
            onPress={handleClose}
            className="bg-blue-500 py-3 px-6 rounded-full items-center"
          >
            <Text className="text-white font-bold text-lg">Continue</Text>
          </Pressable>
        </View>

        {/* Close icon */}
        <Pressable
          onPress={handleClose}
          className="absolute top-3 right-3 p-1 rounded-full bg-white/20"
        >
          <X size={20} color="white" />
        </Pressable>
      </Animated.View>
    </View>
  );
}
