import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
  Users,
  Zap,
  BarChart,
  Star,
  Target,
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";

interface PitchDetailProps {
  id?: string;
  companyName?: string;
  fundingAsk?: string;
  roiPotential?: string;
  problem?: string;
  solution?: string;
  marketSize?: string;
  closingHook?: string;
  traction?: string;
  team?: string;
  competitors?: string;
  financials?: string;
  useOfFunds?: string;
  customerQuote?: string;
  investedAmount?: number;
  currentValue?: number;
  changePercentage?: number;
  investmentDate?: string;
  onBack?: () => void;
}

const PitchDetailScreen = ({
  companyName = "TechBit AI",
  fundingAsk = "$250K",
  roiPotential = "120%",
  problem = "Data analysis is too complex for small businesses",
  solution = "AI-powered analytics platform that simplifies business intelligence",
  marketSize = "$5.2B by 2025",
  closingHook = "Join us in democratizing data for everyone!",
  traction = "5,000+ users, $1.2M ARR",
  team = "Founded by ex-Google data scientists",
  competitors = "Legacy BI (60% market), DIY analytics (30%)",
  financials = "Projecting $10M revenue by Year 3",
  useOfFunds = "R&D (40%), Marketing (35%), Operations (25%)",
  customerQuote = "TechBit AI increased our insights by 300%. - Happy Customer",
  investedAmount = 0,
  currentValue = 0,
  changePercentage = 0,
  investmentDate = "",
  onBack = () => {},
}: PitchDetailProps) => {
  // Parse useOfFunds to create chart data
  const parseUseOfFunds = () => {
    try {
      const segments = useOfFunds.split(", ");
      return segments.map((segment) => {
        const [category, percentStr] = segment.split(" (");
        const percent = parseInt(percentStr.replace("%)", ""));
        return { category, percent };
      });
    } catch (e) {
      return [
        { category: "R&D", percent: 40 },
        { category: "Marketing", percent: 35 },
        { category: "Operations", percent: 25 },
      ];
    }
  };

  const fundData = parseUseOfFunds();

  return (
    <View className="flex-1 bg-slate-900">
      {/* Header */}
      <LinearGradient colors={["#3b82f6", "#1d4ed8"]} className="p-6 pt-12">
        <View className="flex-row items-center mb-4">
          <TouchableOpacity onPress={onBack} className="mr-4">
            <ArrowLeft size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold">{companyName}</Text>
        </View>

        {investedAmount > 0 && (
          <View className="bg-white/10 rounded-xl p-4 mb-4">
            <View className="flex-row justify-between mb-2">
              <Text className="text-slate-300">Investment Date</Text>
              <Text className="text-white font-medium">{investmentDate}</Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-slate-300">Invested Amount</Text>
              <Text className="text-white font-medium">
                ${investedAmount.toLocaleString()}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-slate-300">Current Value</Text>
              <View className="flex-row items-center">
                <Text className="text-white font-medium mr-2">
                  ${currentValue.toLocaleString()}
                </Text>
                <View
                  className="flex-row items-center px-2 py-1 rounded-md"
                  style={{
                    backgroundColor:
                      changePercentage >= 0
                        ? "rgba(34, 197, 94, 0.2)"
                        : "rgba(239, 68, 68, 0.2)",
                  }}
                >
                  {changePercentage >= 0 ? (
                    <TrendingUp size={14} color="#22c55e" />
                  ) : (
                    <TrendingDown size={14} color="#ef4444" />
                  )}
                  <Text
                    className="ml-1 font-medium"
                    style={{
                      color: changePercentage >= 0 ? "#22c55e" : "#ef4444",
                    }}
                  >
                    {changePercentage >= 0 ? "+" : ""}
                    {changePercentage.toFixed(2)}%
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            <DollarSign size={16} color="white" />
            <Text className="text-white ml-1 font-medium">
              Ask: {fundingAsk}
            </Text>
          </View>
          <View className="flex-row items-center bg-green-500/30 px-3 py-1 rounded-full">
            <TrendingUp size={14} color="white" />
            <Text className="text-white ml-1 font-medium">
              ROI: {roiPotential}
            </Text>
          </View>
        </View>
      </LinearGradient>

      {/* Pitch Content - Scrollable */}
      <ScrollView className="flex-1 p-5" showsVerticalScrollIndicator={false}>
        {/* Problem & Solution Section */}
        <View className="mb-4 bg-slate-800 p-4 rounded-xl">
          <View className="flex-row items-center mb-3">
            <View className="w-8 h-8 rounded-full bg-red-900/50 items-center justify-center mr-2">
              <TrendingDown size={16} color="#fca5a5" />
            </View>
            <Text className="text-red-400 font-bold text-base">Problem</Text>
          </View>
          <Text className="text-slate-300 text-sm leading-relaxed">
            {problem}
          </Text>

          <View className="flex-row items-center mb-3 mt-4">
            <View className="w-8 h-8 rounded-full bg-blue-900/50 items-center justify-center mr-2">
              <Zap size={16} color="#93c5fd" />
            </View>
            <Text className="text-blue-400 font-bold text-base">Solution</Text>
          </View>
          <Text className="text-slate-300 text-sm leading-relaxed">
            {solution}
          </Text>
        </View>

        {/* Market & Traction */}
        <View className="mb-4 flex-row">
          <View className="flex-1 mr-2 bg-slate-800 p-4 rounded-xl">
            <View className="flex-row items-center mb-2">
              <Target size={16} color="#86efac" />
              <Text className="text-green-400 font-bold text-sm ml-1">
                Market Size
              </Text>
            </View>
            <Text className="text-slate-300 text-xs">{marketSize}</Text>
          </View>

          <View className="flex-1 ml-2 bg-slate-800 p-4 rounded-xl">
            <View className="flex-row items-center mb-2">
              <TrendingUp size={16} color="#c4b5fd" />
              <Text className="text-purple-400 font-bold text-sm ml-1">
                Traction
              </Text>
            </View>
            <Text className="text-slate-300 text-xs">{traction}</Text>
          </View>
        </View>

        {/* Team & Financials */}
        <View className="mb-4 flex-row">
          <View className="flex-1 mr-2 bg-slate-800 p-4 rounded-xl">
            <View className="flex-row items-center mb-2">
              <Users size={16} color="#7dd3fc" />
              <Text className="text-sky-400 font-bold text-sm ml-1">Team</Text>
            </View>
            <Text className="text-slate-300 text-xs">{team}</Text>
          </View>

          <View className="flex-1 ml-2 bg-slate-800 p-4 rounded-xl">
            <View className="flex-row items-center mb-2">
              <BarChart size={16} color="#fcd34d" />
              <Text className="text-amber-400 font-bold text-sm ml-1">
                Financials
              </Text>
            </View>
            <Text className="text-slate-300 text-xs">{financials}</Text>
          </View>
        </View>

        {/* Use of Funds Chart */}
        <View className="mb-4 bg-slate-800 p-4 rounded-xl">
          <View className="flex-row items-center mb-3">
            <PieChart size={16} color="#86efac" />
            <Text className="text-green-400 font-bold text-base ml-1">
              Use of Funds
            </Text>
          </View>

          {/* Simple bar chart visualization */}
          <View className="mb-2">
            {fundData.map((item, index) => (
              <View key={index} className="mb-3">
                <View className="flex-row justify-between mb-1">
                  <Text className="text-slate-300 text-xs font-medium">
                    {item.category}
                  </Text>
                  <Text className="text-slate-300 text-xs font-medium">
                    {item.percent}%
                  </Text>
                </View>
                <View className="h-3 bg-slate-700 rounded-full overflow-hidden">
                  <LinearGradient
                    colors={
                      index === 0
                        ? ["#60a5fa", "#3b82f6"]
                        : index === 1
                          ? ["#4ade80", "#10b981"]
                          : ["#fbbf24", "#f59e0b"]
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    className="h-full"
                    style={{ width: `${item.percent}%` }}
                  />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Customer Quote */}
        <View className="mb-4 bg-blue-900/30 p-4 rounded-xl">
          <Text className="text-slate-200 italic text-sm text-center leading-relaxed">
            "{customerQuote}"
          </Text>
        </View>

        {/* Closing Hook */}
        <LinearGradient
          colors={["#3b82f6", "#1d4ed8"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="mb-4 p-4 rounded-xl"
        >
          <Text className="text-white font-medium text-sm text-center">
            {closingHook}
          </Text>
        </LinearGradient>
      </ScrollView>
    </View>
  );
};

export default PitchDetailScreen;
