import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { CheckCircle2, Circle, Award, Zap } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { safeNotification } from "../utils/haptics";
import { playCoinSound } from "../utils/sounds";
import {
  supabase,
  getMissionProgress,
  saveMissionProgress,
} from "../utils/supabase";

interface Mission {
  id: string;
  title: string;
  description: string;
  reward: number;
  rewardType: "cash" | "points";
  progress: number;
  target: number;
  completed: boolean;
}

interface DailyMissionsProps {
  missions?: Mission[];
  onMissionClaim?: (missionId: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
  userId?: string;
}

const DailyMissions = ({
  missions: initialMissions = [],
  onMissionClaim = () => {},
  isOpen = true,
  onClose = () => {},
  userId = null,
}: DailyMissionsProps) => {
  const [missions, setMissions] = useState(initialMissions);
  const [loading, setLoading] = useState(false);

  // Load missions from Supabase when component mounts or userId changes
  useEffect(() => {
    if (isOpen && userId) {
      loadMissions();
    }
  }, [isOpen, userId]);

  // Function to load missions from Supabase
  const loadMissions = async () => {
    if (!userId) return;

    setLoading(true);
    try {
      // First try to get missions from Supabase
      const { data: missionsData, error } = await supabase
        .from("missions")
        .select("*");

      if (error) throw error;

      // Get user mission progress from Supabase
      const progressData = await getMissionProgress(userId);

      // If we have missions data from Supabase
      if (missionsData && missionsData.length > 0) {
        // Map the missions with user progress
        const mappedMissions = missionsData.map((mission) => {
          // Find user progress for this mission
          const userProgress = progressData?.find(
            (p) => p.mission_id === mission.id,
          );

          return {
            id: mission.id,
            title: mission.title,
            description: mission.description,
            reward: mission.reward,
            rewardType: mission.reward_type,
            progress: userProgress?.progress || 0,
            target: mission.target,
            completed: userProgress?.completed || false,
          };
        });

        setMissions(mappedMissions);
      } else {
        // If no missions in Supabase yet, use default missions
        // and create them in Supabase
        setMissions(initialMissions);

        // Create default missions in Supabase if they don't exist
        for (const mission of initialMissions) {
          await supabase.from("missions").upsert({
            id: mission.id,
            title: mission.title,
            description: mission.description,
            reward: mission.reward,
            reward_type: mission.rewardType,
            target: mission.target,
          });
        }
      }
    } catch (error) {
      console.error("Error loading missions:", error);
      // Fall back to initial missions on error
      setMissions(initialMissions);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const handleClaimReward = (missionId: string) => {
    safeNotification(Haptics.NotificationFeedbackType.Success);
    playCoinSound(); // Play achievement claim sound when claiming reward
    onMissionClaim(missionId);
  };

  return (
    <View className="absolute inset-0 flex items-center justify-center bg-black/50 z-50">
      <View className="w-[350px] bg-slate-800 rounded-3xl overflow-hidden shadow-xl">
        {/* Header */}
        <View className="p-6 bg-blue-600 items-center">
          <Award size={40} color="white" />
          <Text className="text-white text-2xl font-bold mt-2">
            Daily Missions
          </Text>
          <Text className="text-blue-200 text-sm">
            Complete missions to earn rewards
          </Text>
        </View>

        {/* Missions List */}
        <ScrollView className="max-h-[400px] p-4">
          {loading ? (
            <View className="items-center justify-center py-10">
              <ActivityIndicator size="large" color="#3b82f6" />
              <Text className="text-slate-400 mt-4">Loading missions...</Text>
            </View>
          ) : missions.length > 0 ? (
            missions.map((mission) => (
              <View
                key={mission.id}
                className={`p-4 mb-3 rounded-xl ${mission.completed ? "bg-blue-900/30" : "bg-slate-700"}`}
              >
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-white font-bold text-lg">
                    {mission.title}
                  </Text>
                  {mission.completed ? (
                    <CheckCircle2 size={22} color="#4ade80" />
                  ) : (
                    <Circle size={22} color="#94a3b8" />
                  )}
                </View>

                <Text className="text-slate-300 mb-3">
                  {mission.description}
                </Text>

                {/* Progress bar */}
                <View className="h-2 bg-slate-600 rounded-full mb-2 overflow-hidden">
                  <View
                    className="h-full bg-blue-500"
                    style={{
                      width: `${(mission.progress / mission.target) * 100}%`,
                    }}
                  />
                </View>

                <View className="flex-row justify-between items-center">
                  <Text className="text-slate-300">
                    {mission.progress}/{mission.target} completed
                  </Text>
                  <View className="flex-row items-center">
                    <Text className="text-yellow-400 font-bold">
                      ${mission.reward.toLocaleString()} Shark Dollars
                    </Text>
                  </View>
                </View>

                {mission.progress >= mission.target && !mission.completed && (
                  <TouchableOpacity
                    onPress={() => handleClaimReward(mission.id)}
                    className="mt-3 bg-green-600 py-2 rounded-lg items-center flex-row justify-center"
                  >
                    <Zap size={16} color="white" />
                    <Text className="text-white font-bold ml-1">
                      Claim Reward
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            ))
          ) : (
            <View className="items-center justify-center py-10">
              <Text className="text-slate-400 text-center">
                No missions available right now.
              </Text>
              <Text className="text-slate-400 text-center mt-2">
                Check back tomorrow!
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Close button */}
        <View className="p-4 border-t border-slate-700">
          <TouchableOpacity
            onPress={onClose}
            className="py-3 bg-blue-600 rounded-xl items-center"
          >
            <Text className="text-white font-bold">Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default DailyMissions;
