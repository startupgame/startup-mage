import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { playSwipeSound } from "../utils/sounds";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
  Users,
  Zap,
  BarChart,
  Star,
  Target,
  ChevronUp,
  ChevronDown,
  Sparkles,
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";

import { getFundingTypes } from "../utils/supabase";

// Default funding types for random selection (will be replaced with data from Supabase)
const DEFAULT_FUNDING_TYPES = [
  { type: "Equity", format: "$%amount% for %stake%% Equity in the Company" },
  { type: "Convertible Notes", format: "$%amount% via Convertible Notes" },
  {
    type: "SAFE",
    format: "$%amount% through a SAFE (Simple Agreement for Future Equity)",
  },
  { type: "Revenue-Based", format: "$%amount% in Revenue-Based Financing" },
  { type: "Venture Debt", format: "$%amount% in Venture Debt" },
  { type: "Crowdfunding", format: "$%amount% via Equity Crowdfunding" },
  { type: "Angel", format: "$%amount% from Angel Investors" },
  { type: "P2P", format: "$%amount% through Peer-to-Peer Lending" },
  {
    type: "Incubator",
    format: "$%amount% from an Incubator or Accelerator Program",
  },
  { type: "Corporate VC", format: "$%amount% via Corporate Venture Capital" },
  { type: "ICO", format: "$%amount% through an Initial Coin Offering (ICO)" },
  { type: "IEO", format: "$%amount% via an Initial Exchange Offering (IEO)" },
  { type: "Strategic", format: "$%amount% through Strategic Partnerships" },
  { type: "Factoring", format: "$%amount% via Factoring" },
  { type: "MCA", format: "$%amount% through Merchant Cash Advances" },
  { type: "Royalty", format: "$%amount% in Royalty Financing" },
  { type: "Government", format: "$%amount% from Government Grants or Loans" },
  { type: "Microloans", format: "$%amount% in Microloans" },
  { type: "F&F", format: "$%amount% from Family and Friends" },
  { type: "Bootstrapping", format: "$%amount% through Bootstrapping" },
  { type: "Equipment", format: "$%amount% via Equipment Financing" },
  { type: "PO", format: "$%amount% through Purchase Order Financing" },
  { type: "LOC", format: "$%amount% via a Line of Credit" },
  { type: "Mezzanine", format: "$%amount% in Mezzanine Financing" },
  {
    type: "Non-Profit",
    format: "$%amount% through Grants from Non-Profit Organizations",
  },
];

interface StartupCardProps {
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
  onSwipeLeft?: () => void;
  onSwipeRight?: (amount: number) => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

const StartupCard = ({
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
  onSwipeLeft = () => {},
  onSwipeRight = (amount: number) => {},
}: StartupCardProps) => {
  // State for funding types from Supabase
  const [fundingTypes, setFundingTypes] = useState(DEFAULT_FUNDING_TYPES);

  // Load funding types from Supabase
  useEffect(() => {
    const loadFundingTypes = async () => {
      try {
        const data = await getFundingTypes();
        if (data && data.length > 0) {
          setFundingTypes(
            data.map((item) => ({
              type: item.type,
              format: item.format,
            })),
          );
        }
      } catch (error) {
        console.error("Error loading funding types:", error);
      }
    };

    loadFundingTypes();
  }, []);

  // Generate random funding amount and type
  const generateRandomFunding = () => {
    // Random amount between 100k and 999k
    const amount = Math.floor(Math.random() * 900000) + 100000;
    // Random equity stake between 5% and 25% (only for equity type)
    const stake = Math.floor(Math.random() * 20) + 5;
    // Random funding type
    const fundingType =
      fundingTypes[Math.floor(Math.random() * fundingTypes.length)];

    return {
      amount,
      stake,
      type: fundingType.type,
      formattedAsk: fundingType.format
        .replace("%amount%", amount.toLocaleString())
        .replace("%stake%", stake.toString()),
    };
  };

  // State for investment amount and funding details
  const [fundingDetails, setFundingDetails] = useState(generateRandomFunding());
  const [investmentAmount, setInvestmentAmount] = useState(
    fundingDetails.amount,
  );
  const [showAmountControls, setShowAmountControls] = useState(false);

  // Animation values
  const translateX = useSharedValue(0);
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);
  const cardElevation = useSharedValue(1);

  // Generate new funding details when company name changes
  useEffect(() => {
    setFundingDetails(generateRandomFunding());
  }, [companyName]);

  // Update investment amount when funding details change
  useEffect(() => {
    setInvestmentAmount(fundingDetails.amount);
  }, [fundingDetails]);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: any) => {
      ctx.startX = translateX.value;
      cardElevation.value = withTiming(1.05, { duration: 200 });
    },
    onActive: (event, ctx) => {
      translateX.value = ctx.startX + event.translationX;
      rotation.value = (translateX.value / SCREEN_WIDTH) * 15; // -15 to 15 degrees

      // Scale effect based on swipe distance
      const scaleFactor = interpolate(
        Math.abs(translateX.value),
        [0, SCREEN_WIDTH * 0.5],
        [1, 0.95],
        Extrapolate.CLAMP,
      );
      scale.value = scaleFactor;
    },
    onEnd: (event) => {
      if (translateX.value > SWIPE_THRESHOLD) {
        // Swipe right - invest
        translateX.value = withSpring(SCREEN_WIDTH * 1.5);
        runOnJS(playSwipeSound)();
        runOnJS(onSwipeRight)(investmentAmount);
      } else if (translateX.value < -SWIPE_THRESHOLD) {
        // Swipe left - pass
        translateX.value = withSpring(-SCREEN_WIDTH * 1.5);
        runOnJS(playSwipeSound)();
        runOnJS(onSwipeLeft)();
      } else {
        // Return to center
        translateX.value = withSpring(0);
        rotation.value = withSpring(0);
        scale.value = withSpring(1);
      }
      cardElevation.value = withTiming(1, { duration: 200 });
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { rotate: `${rotation.value}deg` },
        { scale: scale.value },
      ],
      elevation: 8 * cardElevation.value,
      shadowOpacity: 0.2 * cardElevation.value,
      shadowRadius: 8 * cardElevation.value,
    };
  });

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

  // Animated styles for swipe indicators
  const investOpacity = useAnimatedStyle(() => {
    return {
      opacity: translateX.value > 50 ? Math.min(translateX.value / 100, 1) : 0,
    };
  });

  const passOpacity = useAnimatedStyle(() => {
    return {
      opacity:
        translateX.value < -50 ? Math.min(-translateX.value / 100, 1) : 0,
    };
  });

  // Handle investment amount changes
  const increaseAmount = () => {
    const newAmount = Math.min(
      investmentAmount + 50000,
      fundingDetails.amount * 1.5,
    );
    setInvestmentAmount(newAmount);
  };

  const decreaseAmount = () => {
    const newAmount = Math.max(
      investmentAmount - 50000,
      fundingDetails.amount * 0.5,
    );
    setInvestmentAmount(newAmount);
  };

  return (
    <View className="flex-1 items-center justify-center bg-gray-100">
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View
          className="overflow-hidden"
          style={[{ width: 380, height: 580 }, animatedStyle]}
        >
          {/* Swipe indicators */}
          <Animated.View
            style={[investOpacity]}
            className="absolute top-10 right-5 z-50 bg-green-500 px-4 py-2 rounded-full rotate-12"
          >
            <Text className="text-white font-bold">INVEST!</Text>
          </Animated.View>

          <Animated.View
            style={[passOpacity]}
            className="absolute top-10 left-5 z-50 bg-red-500 px-4 py-2 rounded-full -rotate-12"
          >
            <Text className="text-white font-bold">PASS</Text>
          </Animated.View>

          {/* Main Card */}
          <View className="bg-white rounded-3xl shadow-2xl overflow-hidden h-full border-2 border-blue-100">
            {/* Card Header - Updated design */}
            <LinearGradient
              colors={["#1e3a8a", "#1e40af"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              className="p-5 rounded-t-3xl border-b border-blue-400/30"
            >
              <View className="flex-row justify-between items-center mb-2">
                <View className="bg-blue-700/50 px-3 py-1 rounded-full">
                  <Text className="text-white text-xs font-medium">
                    STARTUP PITCH
                  </Text>
                </View>
                <View className="bg-amber-500/20 px-3 py-1 rounded-full">
                  <Text className="text-amber-400 text-xs font-medium">
                    +{roiPotential} ROI
                  </Text>
                </View>
              </View>

              <Text className="text-white text-3xl font-bold mb-3">
                {companyName}
              </Text>

              {/* Funding Ask */}
              <Pressable
                onPress={() => setShowAmountControls(!showAmountControls)}
                className="mb-3"
              >
                <Text className="text-white text-center text-lg">
                  Ask:{" "}
                  <Text className="text-white font-bold">
                    ${fundingDetails.amount.toLocaleString()}
                  </Text>{" "}
                  at $9.5M Valuation
                </Text>
              </Pressable>

              {/* Funding Ask with Valuation */}
              <View className="flex-row justify-between items-center">
                <View>
                  <Text className="text-blue-200 text-xs">Asking</Text>
                  <Text className="text-white font-bold text-lg">
                    ${fundingDetails.amount.toLocaleString()}
                  </Text>
                </View>

                <View>
                  <Text className="text-blue-200 text-xs">Valuation</Text>
                  <Text className="text-white font-bold text-lg">$9.5M</Text>
                </View>

                <View>
                  <Text className="text-blue-200 text-xs">Type</Text>
                  <Text className="text-white font-bold text-sm">
                    {fundingDetails.type}
                  </Text>
                </View>
              </View>

              {showAmountControls && (
                <View className="mt-3 bg-white/10 p-3 rounded-lg">
                  <Text className="text-white text-xs mb-2">
                    Adjust your investment:
                  </Text>
                  <View className="flex-row items-center justify-between">
                    <TouchableOpacity
                      onPress={decreaseAmount}
                      className="bg-amber-700 w-10 h-10 rounded-full items-center justify-center"
                    >
                      <ChevronDown size={20} color="white" />
                    </TouchableOpacity>

                    <Text className="text-white font-bold">
                      ${investmentAmount.toLocaleString()}
                    </Text>

                    <TouchableOpacity
                      onPress={increaseAmount}
                      className="bg-amber-700 w-10 h-10 rounded-full items-center justify-center"
                    >
                      <ChevronUp size={20} color="white" />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </LinearGradient>

            {/* Card Content - Scrollable */}
            <ScrollView
              className="flex-1 p-5"
              showsVerticalScrollIndicator={false}
            >
              {/* Problem Section - Styled like the image */}
              <View className="mb-4 bg-amber-50 p-4 rounded-xl shadow-md border border-amber-100">
                <View className="flex-row items-center mb-3">
                  <View className="w-8 h-8 rounded-full bg-red-100 items-center justify-center mr-2">
                    <TrendingDown size={16} color="#1e293b" />
                  </View>
                  <Text className="text-slate-800 font-bold text-base">
                    Problem
                  </Text>
                </View>
                <Text className="text-slate-700 text-sm leading-relaxed">
                  {problem}
                </Text>
              </View>

              {/* Solution Section - Styled like the image */}
              <View className="mb-4 bg-amber-50 p-4 rounded-xl shadow-md border border-amber-100">
                <View className="flex-row items-center mb-3">
                  <View className="w-8 h-8 rounded-full bg-blue-100 items-center justify-center mr-2">
                    <Zap size={16} color="#1e293b" />
                  </View>
                  <Text className="text-slate-800 font-bold text-base">
                    Solution
                  </Text>
                </View>
                <Text className="text-slate-700 text-sm leading-relaxed">
                  {solution}
                </Text>
              </View>

              {/* Market & Traction */}
              <View className="mb-4 flex-row">
                <View className="flex-1 mr-2 bg-gray-50 p-4 rounded-xl shadow-md border border-gray-100">
                  <View className="flex-row items-center mb-2">
                    <Target size={16} color="#10b981" />
                    <Text className="text-green-500 font-bold text-sm ml-1">
                      Market Size
                    </Text>
                  </View>
                  <Text className="text-gray-700 text-xs">{marketSize}</Text>
                </View>

                <View className="flex-1 ml-2 bg-gray-50 p-4 rounded-xl shadow-md border border-gray-100">
                  <View className="flex-row items-center mb-2">
                    <TrendingUp size={16} color="#8b5cf6" />
                    <Text className="text-purple-500 font-bold text-sm ml-1">
                      Traction
                    </Text>
                  </View>
                  <Text className="text-gray-700 text-xs">{traction}</Text>
                </View>
              </View>

              {/* Team & Financials */}
              <View className="mb-4 flex-row">
                <View className="flex-1 mr-2 bg-gray-50 p-4 rounded-xl shadow-md border border-gray-100">
                  <View className="flex-row items-center mb-2">
                    <Users size={16} color="#0ea5e9" />
                    <Text className="text-sky-500 font-bold text-sm ml-1">
                      Team
                    </Text>
                  </View>
                  <Text className="text-gray-700 text-xs">{team}</Text>
                </View>

                <View className="flex-1 ml-2 bg-gray-50 p-4 rounded-xl shadow-md border border-gray-100">
                  <View className="flex-row items-center mb-2">
                    <BarChart size={16} color="#f59e0b" />
                    <Text className="text-amber-500 font-bold text-sm ml-1">
                      Financials
                    </Text>
                  </View>
                  <Text className="text-gray-700 text-xs">{financials}</Text>
                </View>
              </View>

              {/* Use of Funds Chart - Styled like the image */}
              <View className="mb-4 bg-amber-50 p-4 rounded-xl shadow-md border border-amber-100">
                <View className="flex-row items-center mb-3">
                  <View className="w-8 h-8 rounded-full bg-amber-100 items-center justify-center mr-2">
                    <PieChart size={16} color="#1e293b" />
                  </View>
                  <Text className="text-slate-800 font-bold text-base">
                    Use of Funds
                  </Text>
                </View>

                {/* Simple bar chart visualization */}
                <View className="mb-2">
                  {fundData.map((item, index) => (
                    <View key={index} className="mb-3">
                      <View className="flex-row justify-between mb-1">
                        <Text className="text-slate-700 text-xs font-medium">
                          {item.category}
                        </Text>
                        <Text className="text-slate-700 text-xs font-medium">
                          {item.percent}%
                        </Text>
                      </View>
                      <View className="h-3 bg-slate-200 rounded-full overflow-hidden">
                        <LinearGradient
                          colors={
                            index === 0
                              ? ["#1e40af", "#1e3a8a"]
                              : index === 1
                                ? ["#0f766e", "#115e59"]
                                : ["#b45309", "#92400e"]
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
              <View className="mb-4 bg-blue-50 p-4 rounded-xl shadow-md border border-blue-100">
                <Text className="text-gray-800 italic text-sm text-center leading-relaxed">
                  "{customerQuote}"
                </Text>
              </View>

              {/* Closing Hook */}
              <LinearGradient
                colors={["#3b82f6", "#1d4ed8"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="mb-4 p-4 rounded-xl shadow-md"
              >
                <Text className="text-white font-medium text-sm text-center">
                  {closingHook}
                </Text>
              </LinearGradient>
            </ScrollView>

            {/* Swipe Instructions */}
            <View className="absolute bottom-0 left-0 right-0 p-4 flex-row justify-between bg-white/90 backdrop-blur-sm border-t border-gray-100">
              <View className="items-center">
                <View className="w-10 h-10 rounded-full bg-red-100 items-center justify-center">
                  <TrendingDown size={20} color="#ef4444" />
                </View>
                <Text className="text-xs text-gray-500 mt-1">
                  Swipe Left to Pass
                </Text>
              </View>
              <View className="items-center">
                <View className="w-10 h-10 rounded-full bg-green-100 items-center justify-center">
                  <DollarSign size={20} color="#10b981" />
                </View>
                <Text className="text-xs text-gray-500 mt-1">
                  Swipe Right to Invest
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

export default StartupCard;
