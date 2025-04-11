import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { Trophy, X, Medal, User } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { safeImpact } from "../utils/haptics";

interface LeaderboardEntry {
  id: string;
  rank: number;
  name: string;
  score: number;
  avatarUrl?: string;
  isCurrentUser?: boolean;
}

interface LeaderboardProps {
  entries?: LeaderboardEntry[];
  currentUserRank?: number;
  isOpen?: boolean;
  onClose?: () => void;
}

const Leaderboard = ({
  entries = [],
  currentUserRank = 0,
  isOpen = true,
  onClose = () => {},
}: LeaderboardProps) => {
  if (!isOpen) return null;

  const handleClose = () => {
    safeImpact(Haptics.ImpactFeedbackStyle.Light);
    onClose();
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "text-yellow-400";
      case 2:
        return "text-slate-300";
      case 3:
        return "text-amber-600";
      default:
        return "text-white";
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Medal size={20} color="#fbbf24" />;
      case 2:
        return <Medal size={20} color="#cbd5e1" />;
      case 3:
        return <Medal size={20} color="#b45309" />;
      default:
        return null;
    }
  };

  return (
    <View className="absolute inset-0 flex items-center justify-center bg-black/50 z-50">
      <View className="w-[350px] bg-slate-800 rounded-3xl overflow-hidden shadow-xl">
        {/* Header */}
        <View className="p-6 bg-blue-600 items-center">
          <Trophy size={40} color="white" />
          <Text className="text-white text-2xl font-bold mt-2">
            Global Leaderboard
          </Text>
          <Text className="text-blue-200 text-sm">
            Top Shark Dollar investors
          </Text>
        </View>

        {/* Close button */}
        <TouchableOpacity
          onPress={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-blue-700"
        >
          <X size={20} color="white" />
        </TouchableOpacity>

        {/* Leaderboard List */}
        <ScrollView className="max-h-[400px]">
          {entries.map((entry) => (
            <View
              key={entry.id}
              className={`p-4 flex-row items-center ${entry.isCurrentUser ? "bg-blue-900/50" : ""} ${entry.rank % 2 === 0 ? "bg-slate-700/30" : ""}`}
            >
              {/* Rank */}
              <View className="w-10 items-center">
                {getRankIcon(entry.rank) || (
                  <Text className={`font-bold ${getRankColor(entry.rank)}`}>
                    {entry.rank}
                  </Text>
                )}
              </View>

              {/* Avatar */}
              <View className="w-10 h-10 rounded-full overflow-hidden bg-blue-400 mr-3 items-center justify-center">
                {entry.avatarUrl ? (
                  <Image
                    source={{ uri: entry.avatarUrl }}
                    className="w-10 h-10"
                  />
                ) : (
                  <User size={20} color="white" />
                )}
              </View>

              {/* Name */}
              <View className="flex-1">
                <Text
                  className={`font-bold ${entry.isCurrentUser ? "text-yellow-400" : "text-white"}`}
                >
                  {entry.name} {entry.isCurrentUser && "(You)"}
                </Text>
              </View>

              {/* Score */}
              <Text className="text-white font-bold">
                ${entry.score.toLocaleString()}
              </Text>
            </View>
          ))}
        </ScrollView>

        {/* Current user rank */}
        {currentUserRank > 0 && (
          <View className="p-4 border-t border-slate-700 bg-blue-900/30">
            <Text className="text-center text-blue-200">
              Your current rank:{" "}
              <Text className="text-white font-bold">#{currentUserRank}</Text>
            </Text>
          </View>
        )}

        {/* Close button */}
        <View className="p-4 border-t border-slate-700">
          <TouchableOpacity
            onPress={handleClose}
            className="py-3 bg-blue-600 rounded-xl items-center"
          >
            <Text className="text-white font-bold">Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Leaderboard;
