import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { AlertTriangle, DollarSign } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { safeImpact } from "../utils/haptics";

interface OutOfFundsPopupProps {
  visible: boolean;
  onClose: () => void;
  onAddFunds: () => void;
}

const OutOfFundsPopup = ({
  visible,
  onClose,
  onAddFunds,
}: OutOfFundsPopupProps) => {
  if (!visible) return null;

  const handleAddFunds = () => {
    safeImpact(Haptics.ImpactFeedbackStyle.Medium);
    onAddFunds();
  };

  return (
    <View className="absolute inset-0 flex items-center justify-center bg-black/70 z-50">
      <View className="w-[320px] bg-slate-800 rounded-3xl overflow-hidden shadow-xl">
        {/* Header */}
        <View className="p-6 bg-red-600 items-center">
          <AlertTriangle size={40} color="white" />
          <Text className="text-white text-2xl font-bold mt-2">
            Out of Shark Dollars!
          </Text>
        </View>

        {/* Content */}
        <View className="p-6">
          <Text className="text-white text-center mb-4">
            You've run out of Shark Dollars! Add more funds to continue
            investing in exciting startups.
          </Text>

          <View className="bg-slate-700 p-4 rounded-xl mb-6">
            <Text className="text-center text-blue-300 font-semibold mb-2">
              Get back in the game!
            </Text>
            <View className="flex-row justify-center items-center">
              <DollarSign size={24} color="#60a5fa" />
              <Text className="text-white text-xl font-bold ml-1">
                Add more funds
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={handleAddFunds}
            className="bg-blue-600 py-3 rounded-xl items-center mb-3"
          >
            <Text className="text-white font-bold text-lg">Add Funds</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onClose}
            className="py-3 border border-slate-600 rounded-xl items-center"
          >
            <Text className="text-slate-300 font-medium">Maybe Later</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default OutOfFundsPopup;
