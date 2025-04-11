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
  AlertTriangle,
  Lightbulb,
  Database,
  LineChart,
  Quote,
  ArrowLeft,
  ArrowRight,
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
  const [expanded, setExpanded] = useState(false);

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
        } else {
          console.log("No funding types found in Supabase, using defaults");
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
  const position = useSharedValue({ x: 0, y: 0 });

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
        translateX.value = withSpring(SCREEN_WIDTH * 1.5, { damping: 15 });
        runOnJS(playSwipeSound)();
        runOnJS(onSwipeRight)(investmentAmount);
      } else if (translateX.value < -SWIPE_THRESHOLD) {
        // Swipe left - pass
        translateX.value = withSpring(-SCREEN_WIDTH * 1.5, { damping: 15 });
        runOnJS(playSwipeSound)();
        runOnJS(onSwipeLeft)();
      } else {
        // Return to center
        translateX.value = withSpring(0, { damping: 20 });
        rotation.value = withSpring(0, { damping: 20 });
        scale.value = withSpring(1, { damping: 20 });
      }
      cardElevation.value = withTiming(1, { duration: 200 });
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: position.value.y },
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

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const formatFundingAsk = () => {
    return fundingDetails.formattedAsk;
  };

  return (
    <View className="w-[350px] bg-[#1e293b] rounded-3xl overflow-hidden shadow-xl border border-[#334155]">
      {/* Header */}
      <View className="p-5 items-center">
        <Text className="text-white text-2xl font-bold">{companyName}</Text>
        <View className="w-full h-[1px] bg-[#475569] my-3" />
        <Text className="text-[#cbd5e1] text-center">
          Ask: {formatFundingAsk()}
        </Text>
        <View className="mt-3">
          <Text className="text-[#f59e0b] font-medium text-lg">
            +{roiPotential} ROI Potential
          </Text>
        </View>
      </View>

      {/* Content */}
      <ScrollView
        className="max-h-[400px] bg-[#1e293b]"
        showsVerticalScrollIndicator={false}
      >
        {/* Problem */}
        <View className="mx-4 mb-4 bg-[#f5f5dc] p-4 rounded-xl">
          <View className="flex-row items-center mb-2">
            <AlertTriangle
              size={20}
              color="#1e293b"
              className="mr-2"
              strokeWidth={2}
            />
            <Text className="text-[#1e293b] font-bold text-lg">Problem</Text>
          </View>
          <Text className="text-[#1e293b]">{problem}</Text>
        </View>

        {/* Solution */}
        <View className="mx-4 mb-4 bg-[#f5f5dc] p-4 rounded-xl">
          <View className="flex-row items-center mb-2">
            <Lightbulb
              size={20}
              color="#1e293b"
              className="mr-2"
              strokeWidth={2}
            />
            <Text className="text-[#1e293b] font-bold text-lg">Solution</Text>
          </View>
          <Text className="text-[#1e293b]">{solution}</Text>
        </View>

        {/* Use of Funds */}
        <View className="mx-4 mb-4 bg-[#f5f5dc] p-4 rounded-xl">
          <View className="flex-row items-center mb-2">
            <Database
              size={20}
              color="#1e293b"
              className="mr-2"
              strokeWidth={2}
            />
            <Text className="text-[#1e293b] font-bold text-lg">
              Use of Funds
            </Text>
          </View>
          <Text className="text-[#1e293b]">{useOfFunds}</Text>
        </View>

        {/* Financials */}
        <View className="mx-4 mb-4 bg-[#f5f5dc] p-4 rounded-xl">
          <View className="flex-row items-center mb-2">
            <LineChart
              size={20}
              color="#1e293b"
              className="mr-2"
              strokeWidth={2}
            />
            <Text className="text-[#1e293b] font-bold text-lg">Financials</Text>
          </View>
          <Text className="text-[#1e293b]">{financials}</Text>
        </View>

        {/* Expanded content */}
        {expanded && (
          <>
            {/* Market Size */}
            <View className="mx-4 mb-4 bg-[#f5f5dc] p-4 rounded-xl">
              <View className="flex-row items-center mb-2">
                <TrendingUp
                  size={20}
                  color="#1e293b"
                  className="mr-2"
                  strokeWidth={2}
                />
                <Text className="text-[#1e293b] font-bold text-lg">
                  Market Size
                </Text>
              </View>
              <Text className="text-[#1e293b]">{marketSize}</Text>
            </View>

            {/* Traction */}
            <View className="mx-4 mb-4 bg-[#f5f5dc] p-4 rounded-xl">
              <View className="flex-row items-center mb-2">
                <Target
                  size={20}
                  color="#1e293b"
                  className="mr-2"
                  strokeWidth={2}
                />
                <Text className="text-[#1e293b] font-bold text-lg">
                  Traction
                </Text>
              </View>
              <Text className="text-[#1e293b]">{traction}</Text>
            </View>

            {/* Team */}
            <View className="mx-4 mb-4 bg-[#f5f5dc] p-4 rounded-xl">
              <View className="flex-row items-center mb-2">
                <Users
                  size={20}
                  color="#1e293b"
                  className="mr-2"
                  strokeWidth={2}
                />
                <Text className="text-[#1e293b] font-bold text-lg">Team</Text>
              </View>
              <Text className="text-[#1e293b]">{team}</Text>
            </View>

            {/* Competitors */}
            <View className="mx-4 mb-4 bg-[#f5f5dc] p-4 rounded-xl">
              <View className="flex-row items-center mb-2">
                <Target
                  size={20}
                  color="#1e293b"
                  className="mr-2"
                  strokeWidth={2}
                />
                <Text className="text-[#1e293b] font-bold text-lg">
                  Competitors
                </Text>
              </View>
              <Text className="text-[#1e293b]">{competitors}</Text>
            </View>

            {/* Customer Quote */}
            <View className="mx-4 mb-4 bg-[#f5f5dc] p-4 rounded-xl">
              <View className="flex-row items-center mb-2">
                <Quote
                  size={20}
                  color="#1e293b"
                  className="mr-2"
                  strokeWidth={2}
                />
                <Text className="text-[#1e293b] font-bold text-lg">
                  Customer Quote
                </Text>
              </View>
              <Text className="text-[#1e293b]">{customerQuote}</Text>
            </View>
          </>
        )}

        {/* Closing Hook */}
        <View className="mx-4 mb-4 bg-[#f5f5dc] p-4 rounded-xl">
          <Text className="text-[#1e293b] font-medium text-center italic">
            "{closingHook}"
          </Text>
        </View>

        {/* Expand/Collapse button */}
        <TouchableOpacity
          onPress={toggleExpanded}
          className="mx-4 mb-4 bg-[#334155] p-3 rounded-xl items-center"
        >
          <View className="flex-row items-center">
            {expanded ? (
              <>
                <ChevronUp size={18} color="#f8fafc" className="mr-1" />
                <Text className="text-white font-medium">Show Less</Text>
              </>
            ) : (
              <>
                <ChevronDown size={18} color="#f8fafc" className="mr-1" />
                <Text className="text-white font-medium">
                  Show More Details
                </Text>
              </>
            )}
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/* Action buttons */}
      <View className="flex-row justify-between p-4 bg-[#1e293b] border-t border-[#334155]">
        <TouchableOpacity
          onPress={onSwipeLeft}
          className="bg-red-600 py-3 px-6 rounded-xl flex-row items-center"
        >
          <Text className="text-white font-bold">Pass</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onSwipeRight(investmentAmount)}
          className="bg-green-600 py-3 px-6 rounded-xl flex-row items-center"
        >
          <Text className="text-white font-bold">Invest</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default StartupCard;
