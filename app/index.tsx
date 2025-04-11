import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Animated,
  PanResponder,
  TouchableOpacity,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import * as Haptics from "expo-haptics";
import { safeImpact } from "./utils/haptics";
import { BarChart, Award } from "lucide-react-native";
import {
  supabase,
  saveGameState,
  saveInvestment,
  updateLeaderboard,
  saveMissionProgress,
  getStartupCards,
} from "./utils/supabase";
import { checkSession, initializeUserData } from "./utils/auth";
import {
  initSounds,
  unloadSounds,
  playSuccessSound,
  playFailureSound,
} from "./utils/sounds";
import {
  fetchStartupCards,
  seedStartupCards,
  seedFundingTypes,
} from "./utils/fetchStartupCards";

import StartupCard from "./components/StartupCard";
import GameHeader from "./components/GameHeader";
import InvestmentOutcome from "./components/InvestmentOutcome";
import FundOptions from "./components/FundOptions";
import Leaderboard from "./components/Leaderboard";
import DailyMissions from "./components/DailyMissions";
import PortfolioScreen from "./components/PortfolioScreen";
import AchievementsScreen from "./components/AchievementsScreen";
import HeaderNotification from "./components/HeaderNotification";

// Default startup cards (will be replaced with data from Supabase)
const DEFAULT_STARTUPS = [
  {
    id: "1",
    name: "GreenGrow",
    fundingAsk: 200000,
    roiPotential: 80,
    problem:
      "Traditional farming uses too much water and chemicals, with 70% of global freshwater going to agriculture",
    solution:
      "AI-powered irrigation system that reduces water usage by 40% while increasing crop yields by 25%",
    marketSize: "$50B agricultural tech market with 12% CAGR",
    hook: "Invest in the future of sustainable farming!",
    traction: "3,500+ acres deployed, $1.2M ARR",
    team: "Founded by MIT AgTech researchers with 25+ years combined experience",
    competitors:
      "Traditional irrigation (60% market), SmartField (15%), AquaLogic (10%)",
    financials: "Projecting $8M revenue by Year 3 with 65% gross margins",
    useOfFunds: "R&D (40%), Market Expansion (35%), Operations (25%)",
    customerQuote:
      "GreenGrow reduced our water costs by 38% while improving yield. - FarmCorp CEO",
  },
  {
    id: "2",
    name: "QuickLearn",
    fundingAsk: 150000,
    roiPotential: 120,
    problem:
      "Online education has 87% dropout rates and fails to engage modern learners effectively",
    solution:
      "Gamified learning platform with AI-personalized content that increases completion rates by 4.5x",
    marketSize: "$250B global e-learning market growing at 21% annually",
    hook: "Education that's actually fun and effective!",
    traction: "250,000 active users, 92% retention rate, $850K ARR",
    team: "Ex-Google AI lead and former Coursera product director",
    competitors:
      "Traditional LMS (45% market), Gamified apps (25%), Video courses (30%)",
    financials: "$5.2M projected revenue by Year 3 with 78% gross margins",
    useOfFunds:
      "Content Development (45%), AI Enhancement (30%), Marketing (25%)",
    customerQuote:
      "QuickLearn increased our employee training completion by 320%. - HR Director, TechCorp",
  },
  {
    id: "3",
    name: "DeliverBot",
    fundingAsk: 300000,
    roiPotential: 90,
    problem:
      "Last-mile delivery costs represent 53% of total shipping expenses and are highly inefficient",
    solution:
      "Autonomous delivery robots for urban environments that reduce delivery costs by 65%",
    marketSize: "$30B last-mile delivery market with 18% CAGR",
    hook: "The future of delivery is here!",
    traction: "12,000 deliveries completed, 99.3% success rate, $420K ARR",
    team: "Robotics PhDs from Stanford with previous exits in automation",
    competitors:
      "Human couriers (70% market), Drone delivery (15%), Other robots (5%)",
    financials: "Projecting $12M revenue by Year 3 with 60% gross margins",
    useOfFunds: "Fleet Expansion (50%), Technology (30%), Operations (20%)",
    customerQuote:
      "DeliverBot cut our delivery costs in half while improving customer satisfaction. - LocalEats Founder",
  },
  {
    id: "4",
    name: "HealthTrack",
    fundingAsk: 180000,
    roiPotential: 110,
    problem:
      "78% of people abandon health goals within 2 months due to lack of personalization and feedback",
    solution:
      "AI health coach that personalizes recommendations based on biometric data, improving adherence by 215%",
    marketSize: "$120B health and wellness market growing at 15% annually",
    hook: "Your personal AI health companion!",
    traction: "85,000 active users, 88% retention rate, $1.1M ARR",
    team: "Founded by former Fitbit product lead and Stanford Medical AI researcher",
    competitors:
      "Fitness apps (40% market), Wearables (35%), Human coaching (25%)",
    financials: "$7.5M projected revenue by Year 3 with 72% gross margins",
    useOfFunds:
      "AI Development (40%), User Acquisition (35%), Team Expansion (25%)",
    customerQuote:
      "HealthTrack helped me lose 30 pounds and maintain it for over a year. - Satisfied User",
  },
  {
    id: "5",
    name: "EcoPackage",
    fundingAsk: 220000,
    roiPotential: 75,
    problem:
      "8 million tons of plastic enter oceans annually, with packaging representing 40% of all plastic waste",
    solution:
      "Biodegradable packaging made from seaweed that dissolves in water within 24 hours",
    marketSize: "$80B sustainable packaging market with 25% CAGR",
    hook: "Packaging that disappears without a trace!",
    traction:
      "Partnerships with 15 D2C brands, 500,000 units shipped, $680K ARR",
    team: "Materials science PhDs with patents in biodegradable polymers",
    competitors:
      "Plastic packaging (75% market), Paper alternatives (15%), Other bio-materials (10%)",
    financials: "$9.2M projected revenue by Year 3 with 55% gross margins",
    useOfFunds: "Manufacturing Scale (45%), R&D (30%), Sales (25%)",
    customerQuote:
      "Our customers love that we've eliminated plastic with EcoPackage. - BeautyBox CEO",
  },
  {
    id: "6",
    name: "CryptoSimple",
    fundingAsk: 350000,
    roiPotential: 200,
    problem:
      "Only 4.2% of global population uses cryptocurrency due to complexity and technical barriers",
    solution:
      "User-friendly crypto wallet with built-in education and simplified trading, increasing adoption by 8x",
    marketSize: "$300B cryptocurrency market with 30% year-over-year growth",
    hook: "Making crypto accessible to everyone!",
    traction: "120,000 users, $2.5M monthly transaction volume, $950K ARR",
    team: "Ex-Coinbase engineer and fintech UX expert with previous successful exits",
    competitors:
      "Complex wallets (65% market), Exchanges (25%), Banking apps (10%)",
    financials: "$15M projected revenue by Year 3 with 85% gross margins",
    useOfFunds:
      "Security (40%), User Acquisition (35%), Feature Development (25%)",
    customerQuote:
      "I finally understand crypto thanks to CryptoSimple. - First-time crypto user",
  },
];

export default function MainGameScreen() {
  const [balance, setBalance] = useState(1000000); // Starting with $1M Shark Dollars
  const [sharkDollars, setSharkDollars] = useState(0);
  const [currentStartupIndex, setCurrentStartupIndex] = useState(0);
  const [startups, setStartups] = useState(DEFAULT_STARTUPS);
  const [showOutcome, setShowOutcome] = useState(false);
  const [investmentResult, setInvestmentResult] = useState({
    success: false,
    amount: 0,
    companyName: "",
  });
  const [showFundOptions, setShowFundOptions] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showDailyMissions, setShowDailyMissions] = useState(false);
  const [showPortfolio, setShowPortfolio] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [completedInvestments, setCompletedInvestments] = useState(0);
  const [investmentStreak, setInvestmentStreak] = useState(0);
  const [portfolio, setPortfolio] = useState([]);
  const [userId, setUserId] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [notification, setNotification] = useState({
    visible: false,
    message: "",
    type: "success",
  });
  const [showInstruction, setShowInstruction] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Reset idle timer whenever user interacts
  const resetIdleTimer = () => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }

    // Hide instruction if showing
    setShowInstruction(false);

    // Set new timer to show instruction after 10 seconds of inactivity
    idleTimerRef.current = setTimeout(() => {
      setShowInstruction(true);
    }, 10000);
  };

  // Load startup cards from Supabase
  const loadStartupCards = useCallback(async () => {
    setIsLoading(true);
    try {
      // Seed funding types and startup cards if needed
      await seedFundingTypes();
      await seedStartupCards();

      // Fetch startup cards
      const cards = await fetchStartupCards();
      if (cards && cards.length > 0) {
        setStartups(cards);
        console.log(`Loaded ${cards.length} startup cards from Supabase`);
      } else {
        console.log("No startup cards found in Supabase, using defaults");
        setStartups(DEFAULT_STARTUPS);
      }
    } catch (error) {
      console.error("Error loading startup cards:", error);
      setStartups(DEFAULT_STARTUPS);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize sounds, idle timer, and load data on mount
  useEffect(() => {
    // Initialize sound effects
    initSounds();

    // Reset idle timer
    resetIdleTimer();

    // Load startup cards
    loadStartupCards();

    // Check if user is already logged in
    checkSession().then((user) => {
      if (user) {
        setUserId(user.id);
        setIsLoggedIn(true);

        // Initialize user data
        initializeUserData(user.id).then((data) => {
          if (data) {
            setBalance(data.balance);
            setSharkDollars(data.sharkDollars);
            setCompletedInvestments(data.completedInvestments);
            setInvestmentStreak(data.investmentStreak);
          }
        });
      }
    });

    return () => {
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
      // Unload sounds when component unmounts
      unloadSounds();
    };
  }, [loadStartupCards]);

  // Animation values
  const position = useRef(new Animated.ValueXY()).current;
  const rotation = position.x.interpolate({
    inputRange: [-200, 0, 200],
    outputRange: ["-30deg", "0deg", "30deg"],
    extrapolate: "clamp",
  });

  // Reset position when startup changes and ensure smooth transitions
  useEffect(() => {
    // Ensure position is reset to center
    position.setValue({ x: 0, y: 0 });

    // Make sure the card is visible
    const currentStartup = startups[currentStartupIndex % startups.length];
    if (!currentStartup) {
      // If for some reason we don't have a startup, reset to the first one
      setCurrentStartupIndex(0);
    }
  }, [currentStartupIndex, startups]);

  // Check if funds are depleted and track achievements
  useEffect(() => {
    if (balance <= 0) {
      setShowFundOptions(true);
    }

    // Update achievements when relevant state changes
    if (userId) {
      // Track achievement progress
      const trackAchievements = async () => {
        try {
          // First investment achievement (Baby Shark)
          if (completedInvestments > 0) {
            await supabase.from("user_achievements").upsert(
              {
                user_id: userId,
                achievement_id: "1", // Baby Shark
                progress: completedInvestments,
                unlocked: completedInvestments >= 50,
                updated_at: new Date().toISOString(),
              },
              { onConflict: ["user_id", "achievement_id"] },
            );
          }

          // Shark Venture achievement
          if (completedInvestments > 0) {
            await supabase.from("user_achievements").upsert(
              {
                user_id: userId,
                achievement_id: "2", // Shark Venture
                progress: completedInvestments,
                unlocked: completedInvestments >= 100,
                updated_at: new Date().toISOString(),
              },
              { onConflict: ["user_id", "achievement_id"] },
            );
          }

          // Shark Don achievement
          if (completedInvestments > 0) {
            await supabase.from("user_achievements").upsert(
              {
                user_id: userId,
                achievement_id: "3", // Shark Don
                progress: completedInvestments,
                unlocked: completedInvestments >= 500,
                updated_at: new Date().toISOString(),
              },
              { onConflict: ["user_id", "achievement_id"] },
            );
          }

          // Investment streak achievement (Daily)
          if (investmentStreak > 0) {
            await supabase.from("user_achievements").upsert(
              {
                user_id: userId,
                achievement_id: "11", // Daily Streak
                progress: investmentStreak,
                unlocked: investmentStreak >= 3,
                updated_at: new Date().toISOString(),
              },
              { onConflict: ["user_id", "achievement_id"] },
            );
          }

          // First Investment of the day (Daily)
          if (completedInvestments > 0) {
            await supabase.from("user_achievements").upsert(
              {
                user_id: userId,
                achievement_id: "10", // First Investment
                progress: 1,
                unlocked: true,
                updated_at: new Date().toISOString(),
              },
              { onConflict: ["user_id", "achievement_id"] },
            );
          }
        } catch (error) {
          console.error("Error tracking achievements:", error);
        }
      };

      trackAchievements();
    }
  }, [balance, completedInvestments, investmentStreak, userId]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > 120) {
          // Swipe right - Invest
          safeImpact(Haptics.ImpactFeedbackStyle.Medium);
          handleInvest();
        } else if (gesture.dx < -120) {
          // Swipe left - Pass
          safeImpact(Haptics.ImpactFeedbackStyle.Light);
          handlePass();
        } else {
          // Return to center
          Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            friction: 5,
            useNativeDriver: false,
          }).start();
        }
      },
    }),
  ).current;

  const handleInvest = (customAmount = 0) => {
    resetIdleTimer();
    const startup = startups[currentStartupIndex % startups.length];
    const investmentAmount =
      customAmount > 0 ? customAmount : startup.fundingAsk;

    // Check if user has enough funds
    if (balance < investmentAmount) {
      setShowFundOptions(true);
      // Reset card position
      Animated.spring(position, {
        toValue: { x: 0, y: 0 },
        friction: 5,
        useNativeDriver: false,
      }).start();
      return;
    }

    // Fixed 20% success rate (80% failure) as requested
    const successRate = 0.2; // Base 20% success rate (80% failure)

    const isSuccess = Math.random() < successRate;
    let returnAmount = 0;

    if (isSuccess) {
      // Success: ROI-based return (higher ROI = higher return)
      const baseMultiplier = 1.5;
      const roiBonus = startup.roiPotential / 100;
      const multiplier = baseMultiplier + Math.random() * roiBonus;
      returnAmount = Math.round(investmentAmount * multiplier);

      // Update balance and shark dollars
      const profit = returnAmount - investmentAmount;
      setBalance((prev) => prev - investmentAmount + returnAmount);
      setSharkDollars((prev) => prev + Math.round(profit / 100));

      // Add to completed investments count for missions
      setCompletedInvestments((prev) => prev + 1);

      // Check for streak
      setInvestmentStreak((prev) => prev + 1);

      // Show notification instead of modal
      setNotification({
        visible: true,
        message: `Great investment in ${startup.name}! +${(returnAmount - investmentAmount).toLocaleString()}`,
        type: "success",
      });

      // Play success sound
      playSuccessSound();

      // Save investment to Supabase if logged in
      if (userId) {
        const investment = {
          startupId: startup.id,
          companyName: startup.name,
          investedAmount: investmentAmount,
          currentValue: returnAmount,
          changePercentage:
            ((returnAmount - investmentAmount) / investmentAmount) * 100,
          investmentDate: new Date().toISOString(),
          fundingType: startup.fundingType || "Equity",
        };

        saveInvestment(userId, investment);

        // Update game state
        saveGameState(userId, {
          balance: balance - investmentAmount + returnAmount,
          sharkDollars: sharkDollars + Math.round(profit / 100),
          completedInvestments: completedInvestments + 1,
          investmentStreak: investmentStreak + 1,
        });

        // Update leaderboard
        updateLeaderboard(
          userId,
          "Player",
          sharkDollars + Math.round(profit / 100),
        );

        // Track Big Spender achievement if investment is large
        if (investmentAmount >= 300000) {
          await supabase.from("user_achievements").upsert(
            {
              user_id: userId,
              achievement_id: "12", // Big Spender
              progress: investmentAmount,
              unlocked: true,
              updated_at: new Date().toISOString(),
            },
            { onConflict: ["user_id", "achievement_id"] },
          );
        }
      }
    } else {
      // Failure: lose 50% to 100% of investment
      const lossPercentage = 0.5 + Math.random() * 0.5;
      const lossAmount = Math.round(investmentAmount * lossPercentage);
      setBalance((prev) => prev - lossAmount);
      setSharkDollars((prev) => Math.max(0, prev - 5000));
      returnAmount = -lossAmount;

      // Reset streak on failure
      setInvestmentStreak(0);

      // Show notification instead of modal
      setNotification({
        visible: true,
        message: `Investment in ${startup.name} didn't pay off. -${Math.abs(returnAmount).toLocaleString()}`,
        type: "error",
      });

      // Play failure sound
      playFailureSound();

      // Save investment to Supabase if logged in
      if (userId) {
        const investment = {
          startupId: startup.id,
          companyName: startup.name,
          investedAmount: investmentAmount,
          currentValue: investmentAmount - lossAmount,
          changePercentage: -lossPercentage * 100,
          investmentDate: new Date().toISOString(),
          fundingType: startup.fundingType || "Equity",
        };

        saveInvestment(userId, investment);

        // Update game state with updated values
        saveGameState(userId, {
          balance: balance - lossAmount,
          sharkDollars: Math.max(0, sharkDollars - 5000),
          completedInvestments: completedInvestments + 1,
          investmentStreak: 0,
        });

        // Update leaderboard
        updateLeaderboard(userId, "Player", Math.max(0, sharkDollars - 5000));
      }
    }

    // Animate card off screen and ensure next card appears
    Animated.timing(position, {
      toValue: { x: 500, y: 0 },
      duration: 300,
      useNativeDriver: false,
    }).start();

    // Move to next card after animation with a slight delay
    setTimeout(() => {
      position.setValue({ x: 0, y: 0 }); // Reset position for next card
      setCurrentStartupIndex((prev) => (prev + 1) % startups.length);
    }, 300);
  };

  const handlePass = () => {
    resetIdleTimer();
    // Animate card off screen
    Animated.timing(position, {
      toValue: { x: -500, y: 0 },
      duration: 300,
      useNativeDriver: false,
    }).start();

    // Move to next card after animation with a slight delay
    setTimeout(() => {
      position.setValue({ x: 0, y: 0 }); // Reset position for next card
      setCurrentStartupIndex((prev) => (prev + 1) % startups.length);
    }, 300);
  };

  const handleNotificationHide = () => {
    setNotification({ ...notification, visible: false });
  };

  const handleFundOptionsClosed = (addedFunds = 0) => {
    setShowFundOptions(false);
    if (addedFunds > 0) {
      setBalance((prev) => prev + addedFunds);
    }
  };

  const currentStartup = startups[currentStartupIndex % startups.length];

  // Mock leaderboard data
  const leaderboardEntries = [
    {
      id: "1",
      rank: 1,
      name: "SharkMaster",
      score: 1575000,
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=shark1",
    },
    {
      id: "2",
      rank: 2,
      name: "InvestorPro",
      score: 1234000,
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=shark2",
    },
    {
      id: "3",
      rank: 3,
      name: "MoneyMaker",
      score: 1098000,
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=shark3",
    },
    {
      id: "4",
      rank: 4,
      name: "WealthWizard",
      score: 987000,
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=shark4",
    },
    {
      id: "5",
      rank: 5,
      name: "RichRider",
      score: 854000,
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=shark5",
    },
    {
      id: "6",
      rank: 6,
      name: "CashKing",
      score: 765000,
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=shark6",
    },
    {
      id: "7",
      rank: 7,
      name: "ProfitPirate",
      score: 643000,
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=shark7",
    },
    {
      id: "8",
      rank: 8,
      name: "VentureViking",
      score: 528000,
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=shark8",
    },
    {
      id: "9",
      rank: 9,
      name: "You",
      score: sharkDollars,
      isCurrentUser: true,
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=you",
    },
    {
      id: "10",
      rank: 10,
      name: "StartupSurfer",
      score: 412000,
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=shark10",
    },
  ];

  // Mock daily missions
  const dailyMissions = [
    {
      id: "1",
      title: "First Investment",
      description: "Make your first investment of the day",
      reward: 50000,
      rewardType: "cash",
      progress: completedInvestments > 0 ? 1 : 0,
      target: 1,
      completed: false,
    },
    {
      id: "2",
      title: "Investment Streak",
      description: "Successfully invest in 3 startups in a row",
      reward: 20000,
      rewardType: "cash",
      progress: investmentStreak,
      target: 3,
      completed: false,
    },
    {
      id: "3",
      title: "Big Spender",
      description: "Invest in a startup asking for $300K or more",
      reward: 100000,
      rewardType: "cash",
      progress: 0,
      target: 1,
      completed: false,
    },
    {
      id: "4",
      title: "Daily Player",
      description: "Play Startup Shark for 5 minutes today",
      reward: 10000,
      rewardType: "cash",
      progress: 5,
      target: 5,
      completed: false,
    },
  ];

  const handleMissionClaim = (missionId: string) => {
    // Find the mission
    const mission = dailyMissions.find((m) => m.id === missionId);
    if (mission) {
      // Add reward to balance or shark dollars based on type
      if (mission.rewardType === "cash") {
        setBalance((prev) => prev + mission.reward);
      } else {
        setSharkDollars((prev) => prev + mission.reward);
      }

      // Update mission completed status
      const updatedMissions = dailyMissions.map((m) =>
        m.id === missionId ? { ...m, completed: true } : m,
      );

      // Save mission progress to Supabase if logged in
      if (userId) {
        saveMissionProgress(userId, missionId, mission.target, true);

        // Update game state with new balance/shark dollars
        saveGameState(userId, {
          balance,
          sharkDollars:
            mission.rewardType === "cash"
              ? sharkDollars
              : sharkDollars + mission.reward,
          completedInvestments,
          investmentStreak,
        });
      }
    }
  };

  // Mock portfolio data
  const mockPortfolio = [
    {
      id: "1",
      companyName: "GreenGrow",
      investedAmount: 200000,
      currentValue: 320000,
      changePercentage: 60,
      investmentDate: "2023-05-15",
    },
    {
      id: "2",
      companyName: "QuickLearn",
      investedAmount: 150000,
      currentValue: 285000,
      changePercentage: 90,
      investmentDate: "2023-06-02",
    },
    {
      id: "3",
      companyName: "HealthTrack",
      investedAmount: 180000,
      currentValue: 162000,
      changePercentage: -10,
      investmentDate: "2023-06-20",
    },
  ];

  // Achievement data with updated categories
  const mockAchievements = [
    {
      id: "1",
      title: "First Investment",
      description: "Make your first investment",
      reward: 10000,
      rewardType: "cash",
      progress: completedInvestments > 0 ? 1 : 0,
      target: 1,
      unlocked: completedInvestments > 0,
      category: "milestone",
    },
    {
      id: "2",
      title: "Big Spender",
      description: "Invest $1,000,000 total",
      reward: 250000,
      rewardType: "cash",
      progress: totalInvested || 530000, // Use actual total if available
      target: 1000000,
      unlocked: (totalInvested || 530000) >= 1000000,
      category: "milestone",
    },
    {
      id: "3",
      title: "Smart Investor",
      description: "Reach $5,000,000 in portfolio value",
      reward: 50000,
      rewardType: "cash",
      progress: totalValue || 767000, // Use actual total if available
      target: 5000000,
      unlocked: (totalValue || 767000) >= 5000000,
      category: "milestone",
    },
    {
      id: "4",
      title: "Shark",
      description: "Make 5 successful investments in a row",
      reward: 100000,
      rewardType: "cash",
      progress: investmentStreak,
      target: 5,
      unlocked: investmentStreak >= 5,
      category: "milestone",
    },
    {
      id: "5",
      title: "Daily Player",
      description: "Play Startup Shark today",
      reward: 5000,
      rewardType: "cash",
      progress: 1,
      target: 1,
      unlocked: true,
      category: "daily",
    },
    {
      id: "6",
      title: "Investment Streak",
      description: "Successfully invest in 3 startups in a row",
      reward: 20000,
      rewardType: "cash",
      progress: investmentStreak,
      target: 3,
      unlocked: investmentStreak >= 3,
      category: "daily",
    },
  ];

  // Calculate portfolio totals
  const totalInvested = mockPortfolio.reduce(
    (sum, inv) => sum + inv.investedAmount,
    0,
  );
  const totalValue = mockPortfolio.reduce(
    (sum, inv) => sum + inv.currentValue,
    0,
  );

  if (showPortfolio) {
    return (
      <PortfolioScreen
        investments={mockPortfolio}
        totalInvested={totalInvested}
        totalValue={totalValue}
        userId={userId}
        onBack={() => setShowPortfolio(false)}
      />
    );
  }

  if (showAchievements) {
    return (
      <AchievementsScreen
        achievements={mockAchievements}
        totalAchievements={mockAchievements.length}
        unlockedAchievements={mockAchievements.filter((a) => a.unlocked).length}
        userId={userId}
        onBack={() => setShowAchievements(false)}
      />
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-blue-950">
      <StatusBar style="light" />

      <GameHeader
        balance={balance}
        sharkDollars={sharkDollars}
        onMenuPress={() => {
          resetIdleTimer();
          setShowDailyMissions(true);
        }}
        onStorePress={() => {
          resetIdleTimer();
          setShowFundOptions(true);
        }}
        onLeaderboardPress={() => {
          resetIdleTimer();
          setShowLeaderboard(true);
        }}
        onPortfolioPress={() => {
          resetIdleTimer();
          setShowPortfolio(true);
        }}
        onAchievementsPress={() => {
          resetIdleTimer();
          setShowAchievements(true);
        }}
        showInstruction={showInstruction}
      />

      {/* Header notification */}
      <HeaderNotification
        visible={notification.visible}
        message={notification.message}
        type={notification.type as "success" | "error" | "info"}
        onHide={handleNotificationHide}
        duration={3000}
      />

      <View className="flex-1 items-center justify-center">
        <Animated.View
          style={{
            transform: [
              { translateX: position.x },
              { translateY: position.y },
              { rotate: rotation },
            ],
          }}
          {...panResponder.panHandlers}
          className="w-full items-center justify-center"
          onTouchStart={resetIdleTimer}
        >
          <StartupCard
            companyName={currentStartup.name}
            fundingAsk={`${currentStartup.fundingAsk.toLocaleString()}`}
            roiPotential={`${currentStartup.roiPotential}%`}
            problem={currentStartup.problem}
            solution={currentStartup.solution}
            marketSize={currentStartup.marketSize}
            closingHook={currentStartup.hook}
            traction={currentStartup.traction}
            team={currentStartup.team}
            competitors={currentStartup.competitors}
            financials={currentStartup.financials}
            useOfFunds={currentStartup.useOfFunds}
            customerQuote={currentStartup.customerQuote}
            onSwipeLeft={handlePass}
            onSwipeRight={handleInvest}
          />
        </Animated.View>
      </View>

      {showFundOptions && (
        <FundOptions
          currentBalance={balance}
          onClose={() => {
            resetIdleTimer();
            handleFundOptionsClosed();
          }}
          onWatchAd={() => {
            resetIdleTimer();
            handleFundOptionsClosed(50000);
          }}
          onPurchase={(amount) => {
            resetIdleTimer();
            handleFundOptionsClosed(amount);
          }}
        />
      )}

      {showLeaderboard && (
        <Leaderboard
          entries={leaderboardEntries}
          currentUserRank={9}
          isOpen={showLeaderboard}
          onClose={() => {
            resetIdleTimer();
            setShowLeaderboard(false);
          }}
        />
      )}

      {showDailyMissions && (
        <DailyMissions
          missions={dailyMissions}
          onMissionClaim={(missionId) => {
            resetIdleTimer();
            handleMissionClaim(missionId);
          }}
          isOpen={showDailyMissions}
          userId={userId}
          onClose={() => {
            resetIdleTimer();
            setShowDailyMissions(false);
          }}
        />
      )}
    </SafeAreaView>
  );
}
