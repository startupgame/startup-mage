import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart,
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import PitchDetailScreen from "./PitchDetailScreen";
import { getInvestments } from "../utils/supabase";

interface Investment {
  id: string;
  companyName: string;
  investedAmount: number;
  currentValue: number;
  changePercentage: number;
  investmentDate: string;
}

interface PortfolioScreenProps {
  investments?: Investment[];
  totalInvested?: number;
  totalValue?: number;
  onBack?: () => void;
}

const PortfolioScreen = ({
  investments = [],
  totalInvested = 0,
  totalValue = 0,
  onBack = () => {},
  userId = "",
}: PortfolioScreenProps) => {
  const [loading, setLoading] = useState(false);
  const [localInvestments, setLocalInvestments] = useState(investments);
  const [selectedInvestment, setSelectedInvestment] = useState<any>(null);
  const [showPitchDetail, setShowPitchDetail] = useState(false);

  // Calculate totals based on local investments
  const localTotalInvested = localInvestments.reduce(
    (sum, inv) => sum + inv.investedAmount,
    0,
  );
  const localTotalValue = localInvestments.reduce(
    (sum, inv) => sum + inv.currentValue,
    0,
  );

  // Fetch investments from Supabase if userId is provided
  useEffect(() => {
    if (userId) {
      fetchInvestments();
    }
  }, [userId]);

  const fetchInvestments = async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const data = await getInvestments(userId);
      if (data && data.length > 0) {
        // Transform data to match our component's expected format
        const formattedData = data.map((item: any) => ({
          id: item.id,
          companyName: item.company_name,
          investedAmount: item.invested_amount,
          currentValue: item.current_value,
          changePercentage: item.change_percentage,
          investmentDate: new Date(item.investment_date).toLocaleDateString(),
          // Include pitch details if available
          pitchDetails: item.pitch_details || null,
        }));
        setLocalInvestments(formattedData);
      }
    } catch (error) {
      console.error("Error fetching investments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (investment: any) => {
    setSelectedInvestment(investment);
    setShowPitchDetail(true);
  };
  const totalChange = localTotalValue - localTotalInvested;
  const totalChangePercentage =
    localTotalInvested > 0 ? (totalChange / localTotalInvested) * 100 : 0;

  // If showing pitch detail, render that screen instead
  if (showPitchDetail && selectedInvestment) {
    return (
      <PitchDetailScreen
        {...selectedInvestment.pitchDetails}
        companyName={selectedInvestment.companyName}
        investedAmount={selectedInvestment.investedAmount}
        currentValue={selectedInvestment.currentValue}
        changePercentage={selectedInvestment.changePercentage}
        investmentDate={selectedInvestment.investmentDate}
        onBack={() => setShowPitchDetail(false)}
      />
    );
  }

  return (
    <View className="flex-1 bg-slate-900">
      {/* Header */}
      <LinearGradient colors={["#1e40af", "#1e3a8a"]} className="p-6 pt-12">
        <View className="flex-row items-center mb-4">
          <TouchableOpacity onPress={onBack} className="mr-4">
            <ArrowLeft size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold">My Portfolio</Text>
        </View>

        <View className="bg-white/10 rounded-xl p-4 mb-4">
          <Text className="text-slate-300 mb-1">Total Portfolio Value</Text>
          <Text className="text-white text-3xl font-bold">
            ${localTotalValue.toLocaleString()}
          </Text>
          <View className="flex-row items-center mt-2">
            <Text className="text-slate-300 mr-2">
              Total Invested: ${localTotalInvested.toLocaleString()}
            </Text>
            <View
              className="flex-row items-center bg-opacity-20 px-2 py-1 rounded-md"
              style={{
                backgroundColor:
                  totalChange >= 0
                    ? "rgba(34, 197, 94, 0.2)"
                    : "rgba(239, 68, 68, 0.2)",
              }}
            >
              {totalChange >= 0 ? (
                <TrendingUp size={14} color="#22c55e" />
              ) : (
                <TrendingDown size={14} color="#ef4444" />
              )}
              <Text
                className="ml-1 font-medium"
                style={{ color: totalChange >= 0 ? "#22c55e" : "#ef4444" }}
              >
                {totalChange >= 0 ? "+" : ""}
                {totalChangePercentage.toFixed(2)}%
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* Investments List */}
      <ScrollView className="flex-1 p-4">
        <Text className="text-white text-lg font-bold mb-4">
          Your Investments
        </Text>

        {loading ? (
          <View className="items-center justify-center py-10">
            <ActivityIndicator size="large" color="#3b82f6" />
            <Text className="text-slate-400 text-center mt-4">
              Loading your investments...
            </Text>
          </View>
        ) : localInvestments.length > 0 ? (
          localInvestments.map((investment) => (
            <View
              key={investment.id}
              className="bg-slate-800 rounded-xl p-4 mb-4"
            >
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-white font-bold text-lg">
                  {investment.companyName}
                </Text>
                <View
                  className="flex-row items-center px-2 py-1 rounded-md"
                  style={{
                    backgroundColor:
                      investment.changePercentage >= 0
                        ? "rgba(34, 197, 94, 0.2)"
                        : "rgba(239, 68, 68, 0.2)",
                  }}
                >
                  {investment.changePercentage >= 0 ? (
                    <TrendingUp size={14} color="#22c55e" />
                  ) : (
                    <TrendingDown size={14} color="#ef4444" />
                  )}
                  <Text
                    className="ml-1 font-medium"
                    style={{
                      color:
                        investment.changePercentage >= 0
                          ? "#22c55e"
                          : "#ef4444",
                    }}
                  >
                    {investment.changePercentage >= 0 ? "+" : ""}
                    {investment.changePercentage.toFixed(2)}%
                  </Text>
                </View>
              </View>

              <View className="flex-row justify-between mb-2">
                <View>
                  <Text className="text-slate-400 text-xs">Invested</Text>
                  <Text className="text-white">
                    ${investment.investedAmount.toLocaleString()}
                  </Text>
                </View>
                <View>
                  <Text className="text-slate-400 text-xs">Current Value</Text>
                  <Text className="text-white">
                    ${investment.currentValue.toLocaleString()}
                  </Text>
                </View>
                <View>
                  <Text className="text-slate-400 text-xs">Date</Text>
                  <Text className="text-white">
                    {investment.investmentDate}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                className="bg-blue-600 py-2 rounded-lg items-center mt-2"
                onPress={() => handleViewDetails(investment)}
              >
                <Text className="text-white font-medium">View Details</Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <View className="items-center justify-center py-10">
            <BarChart size={48} color="#94a3b8" />
            <Text className="text-slate-400 text-center mt-4">
              No investments yet
            </Text>
            <Text className="text-slate-400 text-center mt-2">
              Start investing to build your portfolio
            </Text>
            <TouchableOpacity
              onPress={onBack}
              className="mt-6 bg-blue-600 px-6 py-3 rounded-xl"
            >
              <Text className="text-white font-bold">Start Investing</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default PortfolioScreen;
