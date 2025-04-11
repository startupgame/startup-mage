import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { ArrowLeft, Award, Lock, CheckCircle } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { getMissionProgress, saveMissionProgress } from "../utils/supabase";

interface Achievement {
  id: string;
  title: string;
  description: string;
  iconUrl?: string;
  reward: number;
  rewardType: "cash" | "points";
  progress: number;
  target: number;
  unlocked: boolean;
  badge?: string;
  category?: string;
}

interface AchievementsScreenProps {
  achievements?: Achievement[];
  totalAchievements?: number;
  unlockedAchievements?: number;
  onBack?: () => void;
  userId?: string;
}

const AchievementsScreen = ({
  achievements: initialAchievements = [],
  totalAchievements: initialTotal = 0,
  unlockedAchievements: initialUnlocked = 0,
  onBack = () => {},
  userId = null,
}: AchievementsScreenProps) => {
  const [achievements, setAchievements] = useState(initialAchievements);
  const [totalAchievements, setTotalAchievements] = useState(initialTotal);
  const [unlockedAchievements, setUnlockedAchievements] =
    useState(initialUnlocked);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const progressPercentage =
    totalAchievements > 0
      ? (unlockedAchievements / totalAchievements) * 100
      : 0;

  // Load achievements from Supabase when userId changes
  useEffect(() => {
    if (userId) {
      loadAchievements();
    }
  }, [userId]);

  // Function to load achievements from Supabase
  const loadAchievements = async () => {
    if (!userId) return;

    setLoading(true);
    try {
      // First try to get achievements from Supabase
      const { data: achievementsData, error } = await supabase
        .from("achievements")
        .select("*");

      if (error) throw error;

      // Get user achievement progress from Supabase
      const { data: userAchievementsData, error: userAchievementsError } =
        await supabase
          .from("user_achievements")
          .select("*")
          .eq("user_id", userId);

      if (userAchievementsError) throw userAchievementsError;

      // If we have achievements data from Supabase
      if (achievementsData && achievementsData.length > 0) {
        // Map the achievements with user progress
        const mappedAchievements = achievementsData.map((achievement) => {
          // Find user progress for this achievement
          const userProgress = userAchievementsData?.find(
            (ua) => ua.achievement_id === achievement.id,
          );

          return {
            id: achievement.id,
            title: achievement.title,
            description: achievement.description,
            reward: achievement.reward,
            rewardType: achievement.reward_type,
            progress: userProgress?.progress || 0,
            target: achievement.target,
            unlocked: userProgress?.unlocked || false,
            badge: achievement.badge,
            category: achievement.category,
          };
        });

        setAchievements(mappedAchievements);
        setTotalAchievements(mappedAchievements.length);
        setUnlockedAchievements(
          mappedAchievements.filter((a) => a.unlocked).length,
        );
      } else {
        // If no achievements in Supabase yet, use default achievements
        // and create them in Supabase
        setAchievements(defaultAchievements);
        setTotalAchievements(defaultAchievements.length);
        setUnlockedAchievements(
          defaultAchievements.filter((a) => a.unlocked).length,
        );

        // Create default achievements in Supabase
        for (const achievement of defaultAchievements) {
          await supabase.from("achievements").upsert({
            id: achievement.id,
            title: achievement.title,
            description: achievement.description,
            reward: achievement.reward,
            reward_type: achievement.rewardType,
            target: achievement.target,
            badge: achievement.badge,
            category: achievement.category,
          });
        }
      }
    } catch (error) {
      console.error("Error loading achievements:", error);
      // Fall back to default achievements on error
      setAchievements(defaultAchievements);
      setTotalAchievements(defaultAchievements.length);
      setUnlockedAchievements(
        defaultAchievements.filter((a) => a.unlocked).length,
      );
    } finally {
      setLoading(false);
    }
  };

  // Default achievements data if none provided
  const defaultAchievements: Achievement[] = [
    // Main progression achievements
    {
      id: "1",
      title: "Baby Shark",
      description: "Complete 50 investments",
      reward: 50000,
      rewardType: "cash",
      progress: 12,
      target: 50,
      unlocked: false,
      category: "milestone",
    },
    {
      id: "2",
      title: "Shark Venture",
      description: "Complete 100 investments",
      reward: 100000,
      rewardType: "cash",
      progress: 12,
      target: 100,
      unlocked: false,
      category: "milestone",
    },
    {
      id: "3",
      title: "Shark Don",
      description: "Complete 500 investments",
      reward: 500000,
      rewardType: "cash",
      progress: 12,
      target: 500,
      unlocked: false,
      category: "milestone",
    },
    {
      id: "4",
      title: "Big Shark",
      description: "Complete 1000 investments",
      reward: 1000000,
      rewardType: "cash",
      progress: 12,
      target: 1000,
      unlocked: false,
      category: "milestone",
    },
    {
      id: "5",
      title: "Million Dollar Portfolio",
      description: "Reach $1,000,000 in portfolio value",
      reward: 100000,
      rewardType: "cash",
      progress: 450000,
      target: 1000000,
      unlocked: false,
      category: "milestone",
    },
    {
      id: "6",
      title: "Five Million Portfolio",
      description: "Reach $5,000,000 in portfolio value",
      reward: 500000,
      rewardType: "cash",
      progress: 450000,
      target: 5000000,
      unlocked: false,
      category: "milestone",
    },
    {
      id: "7",
      title: "Ten Million Portfolio",
      description: "Reach $10,000,000 in portfolio value",
      reward: 1000000,
      rewardType: "cash",
      progress: 450000,
      target: 10000000,
      unlocked: false,
      category: "milestone",
    },
    {
      id: "8",
      title: "Risk Taker",
      description: "Successfully invest in 5 high-risk startups (ROI > 150%)",
      reward: 200000,
      rewardType: "cash",
      progress: 1,
      target: 5,
      unlocked: false,
      category: "milestone",
    },
    {
      id: "9",
      title: "Steady Investor",
      description: "Successfully invest in 10 low-risk startups (ROI < 80%)",
      reward: 100000,
      rewardType: "cash",
      progress: 2,
      target: 10,
      unlocked: false,
      category: "milestone",
    },
    // Daily achievements
    {
      id: "10",
      title: "First Investment",
      description: "Make your first investment of the day",
      reward: 25000,
      rewardType: "cash",
      progress: 0,
      target: 1,
      unlocked: false,
      badge: "Early Bird",
      category: "daily",
    },
    {
      id: "11",
      title: "Daily Streak",
      description: "Invest on 3 consecutive days",
      reward: 25000,
      rewardType: "cash",
      progress: 1,
      target: 3,
      unlocked: false,
      badge: "Consistent",
      category: "daily",
    },
    {
      id: "12",
      title: "Big Spender",
      description: "Invest $500,000 in a single day",
      reward: 25000,
      rewardType: "cash",
      progress: 0,
      target: 500000,
      unlocked: false,
      badge: "Big Spender",
      category: "daily",
    },
    {
      id: "13",
      title: "Shark Frenzy",
      description: "Make 10 investments in a single day",
      reward: 25000,
      rewardType: "cash",
      progress: 0,
      target: 10,
      unlocked: false,
      badge: "Frenzy",
      category: "daily",
    },
    {
      id: "14",
      title: "Perfect Day",
      description: "Make 5 successful investments in a row in one day",
      reward: 50000,
      rewardType: "cash",
      progress: 0,
      target: 5,
      unlocked: false,
      badge: "Perfect",
      category: "daily",
    },
  ];

  // Use provided achievements or default ones
  const displayAchievements =
    achievements.length > 0 ? achievements : defaultAchievements;

  return (
    <View className="flex-1 bg-slate-900">
      {/* Header */}
      <LinearGradient colors={["#7e22ce", "#6b21a8"]} className="p-6 pt-12">
        <View className="flex-row items-center mb-4">
          <TouchableOpacity onPress={onBack} className="mr-4">
            <ArrowLeft size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold">Achievements</Text>
        </View>

        <View className="bg-white/10 rounded-xl p-4 mb-4">
          <Text className="text-purple-200 mb-1">Achievement Progress</Text>
          <View className="flex-row items-center justify-between">
            <Text className="text-white text-lg font-bold">
              {unlockedAchievements} / {totalAchievements} Unlocked
            </Text>
            <Text className="text-white font-bold">
              {progressPercentage.toFixed(0)}%
            </Text>
          </View>

          {/* Progress bar */}
          <View className="h-3 bg-purple-900 rounded-full mt-2 overflow-hidden">
            <View
              className="h-full bg-gradient-to-r from-purple-400 to-purple-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </View>
        </View>
      </LinearGradient>

      {/* Achievements List */}
      <ScrollView className="flex-1 p-4">
        {loading ? (
          <View className="items-center justify-center py-10">
            <ActivityIndicator size="large" color="#a855f7" />
            <Text className="text-gray-400 mt-4">Loading achievements...</Text>
          </View>
        ) : (
          <>
            <Text className="text-white text-lg font-bold mb-4">
              Your Achievements
            </Text>

            {/* Category Filters */}
            <View className="flex-row mb-4 space-x-2">
              <TouchableOpacity
                onPress={() => setActiveCategory(null)}
                className={`px-3 py-1 rounded-full ${activeCategory === null ? "bg-purple-500" : "bg-purple-800"}`}
              >
                <Text className="text-white font-medium">All</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setActiveCategory("daily")}
                className={`px-3 py-1 rounded-full ${activeCategory === "daily" ? "bg-purple-500" : "bg-purple-800"}`}
              >
                <Text className="text-white font-medium">Daily</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setActiveCategory("milestone")}
                className={`px-3 py-1 rounded-full ${activeCategory === "milestone" ? "bg-purple-500" : "bg-purple-800"}`}
              >
                <Text className="text-white font-medium">Milestones</Text>
              </TouchableOpacity>
            </View>

            {displayAchievements.length > 0 ? (
              displayAchievements
                .filter(
                  (achievement) =>
                    activeCategory === null ||
                    achievement.category === activeCategory,
                )
                .map((achievement) => {
                  const progressPercentage =
                    achievement.target > 0
                      ? (achievement.progress / achievement.target) * 100
                      : 0;

                  return (
                    <View
                      key={achievement.id}
                      className={`bg-slate-800 rounded-xl p-4 mb-4 ${achievement.unlocked ? "border border-purple-500" : ""}`}
                    >
                      <View className="flex-row items-center mb-3">
                        <View className="w-12 h-12 rounded-full overflow-hidden bg-purple-900 items-center justify-center mr-3">
                          {achievement.unlocked ? (
                            achievement.iconUrl ? (
                              <Image
                                source={{ uri: achievement.iconUrl }}
                                className="w-12 h-12"
                              />
                            ) : (
                              <Award size={24} color="#d8b4fe" />
                            )
                          ) : (
                            <Lock size={20} color="#d8b4fe" />
                          )}
                        </View>

                        <View className="flex-1">
                          <Text className="text-white font-bold text-lg">
                            {achievement.title}
                          </Text>
                          <Text className="text-slate-400">
                            {achievement.description}
                          </Text>
                        </View>

                        {achievement.unlocked && (
                          <CheckCircle size={24} color="#a855f7" />
                        )}
                      </View>

                      {/* Progress bar */}
                      <View className="h-2 bg-slate-700 rounded-full mb-2 overflow-hidden">
                        <View
                          className={`h-full ${achievement.unlocked ? "bg-purple-500" : "bg-purple-700"}`}
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </View>

                      <View className="flex-row justify-between items-center">
                        <Text className="text-slate-400">
                          {achievement.progress}/{achievement.target}
                        </Text>
                        <View className="flex-row items-center bg-purple-900/50 px-3 py-1 rounded-full">
                          <Text className="text-purple-300 font-medium">
                            ${achievement.reward.toLocaleString()} Shark Dollars
                            {achievement.badge ? ` + ${achievement.badge}` : ""}
                          </Text>
                        </View>
                      </View>
                    </View>
                  );
                })
            ) : (
              <View className="items-center justify-center py-10">
                <Award size={48} color="#94a3b8" />
                <Text className="text-slate-400 text-center mt-4">
                  No achievements yet
                </Text>
                <Text className="text-slate-400 text-center mt-2">
                  Keep playing to unlock achievements
                </Text>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default AchievementsScreen;
