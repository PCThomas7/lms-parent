import React from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAppSelector } from "../../../redux/hooks";
import {
  selectRecentPerformance,
  selectAnalyticsLoading,
} from "../../../redux/slices/analytics";
import AppHeader from "../../components/header";
import GridResponsiveSkeleton from '../../components/skeltons/skelton'

const PerformanceOverview = () => {
  const router = useRouter();
  const recentPerformance = useAppSelector(selectRecentPerformance);
  const isLoading = useAppSelector(selectAnalyticsLoading);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const getColor = (percentage: number) =>
    percentage >= 75 ? "#22C55E" : percentage >= 50 ? "#F59E0B" : "#EF4444";

  const getIcon = (percentage: number) =>
    percentage >= 75
      ? "trending-up"
      : percentage >= 50
      ? "remove-outline"
      : "trending-down";

  return (
    <View className="flex-1 bg-slate-100">
      <AppHeader
        screenTitle="Performance Overview"
        onBackPress={() => router.back()}
      />

      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <GridResponsiveSkeleton/>
        </View>
      ) : recentPerformance.length === 0 ? (
        <View className="flex-1 justify-center items-center p-10">
          <Ionicons name="stats-chart" size={56} color="#9CA3AF" />
          <Text className="text-xl font-semibold text-gray-800 mt-6">
            No Performance Data
          </Text>
          <Text className="text-base text-gray-500 mt-2 text-center leading-5">
            Your quiz results will appear here once you start taking quizzes.
          </Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{
            padding: 20,
            paddingBottom: 40,
          }}
          showsVerticalScrollIndicator={false}
        >
          <Text className="text-xl font-bold text-gray-800 mb-6 ml-1">
            Recent Attempts
          </Text>

          {recentPerformance.map((quiz, index) => {
            const percentageColor = getColor(quiz.percentage);
            const icon = getIcon(quiz.percentage);

            return (
              <View
                key={index}
                className="bg-white rounded-2xl p-6 mb-5 border border-gray-100 shadow-md"
              >
                {/* Header Row */}
                <View className="flex-row justify-between items-center mb-3">
                  <Text className="text-sm text-gray-500">
                    {formatDate(quiz.submittedAt)}
                  </Text>
                  <View
                    className="flex-row items-center px-3 py-1.5 rounded-full"
                    style={{ backgroundColor: `${percentageColor}15` }}
                  >
                    <Ionicons
                      name={icon}
                      size={18}
                      color={percentageColor}
                      style={{ marginRight: 6 }}
                    />
                    <Text
                      className="text-sm font-semibold"
                      style={{ color: percentageColor }}
                    >
                      {quiz.percentage.toFixed(1)}%
                    </Text>
                  </View>
                </View>

                {/* Quiz Title */}
                <Text className="text-lg font-semibold text-gray-900 mb-4">
                  {quiz.quizTitle}
                </Text>

                {/* Stats Row */}
                <View className="flex-row justify-between">
                  <View className="items-start">
                    <Text className="text-xs text-gray-500 mb-1 uppercase">
                      Your Score
                    </Text>
                    <Text className="text-xl font-bold text-gray-900">
                      {quiz.score}
                    </Text>
                  </View>

                  <View className="items-start">
                    <Text className="text-xs text-gray-500 mb-1 uppercase">
                      Max Score
                    </Text>
                    <Text className="text-xl font-bold text-gray-900">
                      {quiz.maxScore}
                    </Text>
                  </View>

                  <View className="items-start">
                    <Text className="text-xs text-gray-500 mb-1 uppercase">
                      Accuracy
                    </Text>
                    <Text
                      className="text-xl font-bold"
                      style={{ color: percentageColor }}
                    >
                      {quiz.percentage.toFixed(1)}%
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}

          {/* Footer Info */}
          <View className="items-center mt-4">
            <Text className="text-sm text-gray-500">
              Showing {recentPerformance.length} recent attempts
            </Text>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default PerformanceOverview;
