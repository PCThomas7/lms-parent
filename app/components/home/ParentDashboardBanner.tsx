import React, { useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

interface UserDetails {
  name: string;
  role: string;
  email: string;
}

interface Child {
  _id: string;
  name: string;
  email: string;
  rollNumber: string;
  joinDate?: string;
}

interface RecentPerformance {
  maxScore: number;
  percentage: number;
  quizId: string;
  quizTitle: string;
  score: number;
  submittedAt: string;
}

interface ParentDashboardBannerProps {
  user: UserDetails | null;
  children: Child[];
  recentPerformance?: RecentPerformance;
  loading?: boolean;
  onRefresh?: () => void;
}

const ParentDashboardBanner: React.FC<ParentDashboardBannerProps> = ({
  user,
  children,
  recentPerformance,
  loading = false,
}) => {
  const firstChild = children[0];
  const router = useRouter();

  const getCurrentGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  if (loading) {
    return (
      <View className="min-h-[200px] items-center justify-center rounded-xl p-6 mb-6 bg-[#5A3FEC]">
        <ActivityIndicator size="large" color="#ffffff" />
        <Text className="text-white mt-2 text-sm">Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <View className="mb-5 p-5 rounded-2xl overflow-hidden bg-indigo-600 shadow-lg shadow-black/20">
        {/* Combined Greeting and Child Overview */}
        <View className="mb-4">
          <Text className="text-xl font-bold text-white">
            {getCurrentGreeting()}, {user?.name?.split(" ")[0] || "Parent"}
          </Text>
          {firstChild && (
            <Text className="text-white/90 text-base font-semibold mt-1">
              Here's {firstChild.name}'s learning overview
            </Text>
          )}
        </View>

        {/* jdf */}

        {/* Recent performance */}
        {recentPerformance ? (
          <View className="mt-2 p-4 rounded-xl bg-white/15">
            <View className="flex-row items-center mb-2">
              <Ionicons name="trophy-outline" size={16} color="#fff" />
              <Text className="text-white font-semibold ml-2 text-sm">
                Recent Quiz Performance
              </Text>
            </View>

            <Text
              className="text-white font-bold text-base mb-2"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {recentPerformance.quizTitle}
            </Text>

            <View className="flex-row items-center justify-between mt-1">
              <View className="flex-row items-center">
                <View className="flex-row items-center bg-white/25 px-3 py-1 rounded-full">
                  <Text className="text-white/90 text-base mr-2 font-medium">
                    Score:
                  </Text>
                  <Text className="text-white text-base font-extrabold">
                    {recentPerformance.score}
                    <Text className="text-white/70 text-base font-extrabold">
                      /{recentPerformance.maxScore}
                    </Text>
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => router.push("/reports")}
                activeOpacity={0.85}
                className="flex-row items-center bg-white py-1 px-3 rounded-lg"
              >
                <Text className="text-[#5A3FEC] font-bold text-sm mr-1">
                  View Report
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View className="mt-2 p-4 rounded-xl bg-white/15 items-center">
            <Ionicons name="analytics-outline" size={24} color="#fff" />
            <Text className="text-white mt-2 text-center">
              No quiz results yet
            </Text>
            <Text className="text-white/70 text-xs text-center mt-1">
              Completed quizzes will appear here
            </Text>
          </View>
        )}
    </View>
  );
};

export default ParentDashboardBanner;
