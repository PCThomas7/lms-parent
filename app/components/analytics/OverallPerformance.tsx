import React, { useMemo } from "react";
import { View, Text, ScrollView, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAppSelector } from "../../../redux/hooks";
import ResponsiveGridSkeleton from "../skeltons/skelton";
import {
  selectTotalAttempts,
  selectAverageScore,
  selectTotalQuestions,
  selectCorrectAnswers,
  selectUnattempted,
  selectIncorrectAnswers,
  selectTimeSpentAnalysis,
} from "../../../redux/slices/analytics";
import { PieChart } from "react-native-chart-kit";
import AppHeader from "../../components/header";

// Helper to format seconds
const formatTime = (seconds: number): string => {
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
};

const OverallPerformance = () => {
  const router = useRouter();

  const totalAttempts = useAppSelector(selectTotalAttempts);
  const averageScore = useAppSelector(selectAverageScore);
  const totalQuestions = useAppSelector(selectTotalQuestions);
  const correctAnswers = useAppSelector(selectCorrectAnswers);
  const unattempted = useAppSelector(selectUnattempted);
  const incorrectAnswers = useAppSelector(selectIncorrectAnswers);
  const timeSpentAnalysis = useAppSelector(selectTimeSpentAnalysis);

  const metrics = useMemo(() => {
    if (!totalAttempts) return null;
    return {
      totalAttempts,
      averageScore: averageScore.toFixed(2),
      totalQuestions,
      correctAnswers,
      incorrectAnswers,
      unattempted,
      totalTimeSpent: timeSpentAnalysis?.totalTimeSpent || 0,
      avgTimePerQuiz: timeSpentAnalysis?.averageTimePerQuiz || 0,
      avgTimePerQuestion: timeSpentAnalysis?.averageTimePerQuestion || 0,
    };
  }, [
    totalAttempts,
    averageScore,
    totalQuestions,
    correctAnswers,
    incorrectAnswers,
    unattempted,
    timeSpentAnalysis,
  ]);

  const pieData = useMemo(() => {
    if (!metrics) return [];
    return [
      { name: "Correct", value: metrics.correctAnswers, color: "#10B981" },
      { name: "Incorrect", value: metrics.incorrectAnswers, color: "#EF4444" },
      { name: "Unattempted", value: metrics.unattempted, color: "#6B7280" },
    ];
  }, [metrics]);

  if (!metrics) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <AppHeader
          screenTitle="Overall Performance"
          onBackPress={() => router.back()}
        />
        <View className="flex-1 justify-center items-center">
          <ResponsiveGridSkeleton />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <AppHeader
        screenTitle="Overall Performance"
        onBackPress={() => router.back()}
      />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 24 }}>
        <View className="flex-row flex-wrap justify-between mb-4 mt-3">
          <MetricCard
            icon="stats-chart"
            title="Total Quizzes"
            value={metrics.totalAttempts.toString()}
            color="#4F46E5"
          />
          <MetricCard
            icon="school"
            title="Average Score"
            value={`${metrics.averageScore}%`}
            color="#10B981"
          />
          <MetricCard
            icon="help-circle"
            title="Total Questions"
            value={metrics.totalQuestions.toString()}
            color="#F59E0B"
          />
          <MetricCard
            icon="time"
            title="Total Time"
            value={formatTime(metrics.totalTimeSpent)}
            color="#8B5CF6"
          />
          <MetricCard
            icon="timer"
            title="Avg Time/Quiz"
            value={formatTime(metrics.avgTimePerQuiz)}
            color="#EC4899"
          />
          <MetricCard
            icon="speedometer"
            title="Avg Time/Ques"
            value={formatTime(metrics.avgTimePerQuestion)}
            color="#3B82F6"
          />
        </View>

        <View
          className="bg-white rounded-xl px-4 py-4"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
          }}
        >
          <Text className="text-lg font-semibold text-center text-gray-900 mb-2">
            Question Analysis
          </Text>
          <View className="items-center mb-3">
            <PieChart
              data={pieData}
              width={Dimensions.get("window").width - 64}
              height={200}
              chartConfig={{
                color: () => "#000",
              }}
              accessor="value"
              backgroundColor="transparent"
              paddingLeft="75"
              absolute
              hasLegend={false}
              style={{ borderRadius: 12 }}
            />
          </View>
          <View className="flex-row justify-center space-x-6">
            <LegendItem
              color="#10B981"
              label="Correct"
              count={metrics.correctAnswers}
            />
            <LegendItem
              color="#EF4444"
              label="Incorrect"
              count={metrics.incorrectAnswers}
            />
          </View>
          <View className="flex-row justify-center mt-2">
            <LegendItem
              color="#6B7280"
              label="Unattempted"
              count={metrics.unattempted}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const MetricCard = React.memo(
  ({
    icon,
    title,
    value,
    color,
  }: {
    icon: string;
    title: string;
    value: string;
    color: string;
  }) => (
    <View
      className="w-[48%] bg-white rounded-xl px-4 py-4 mb-4 shadow-sm border-l-[4px]"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        borderLeftColor: color,
      }}
    >
      <Ionicons name={icon as any} size={24} color={color} className="mb-1" />
      <Text className="text-sm text-gray-500">{title}</Text>
      <Text className="text-xl font-semibold text-gray-900">{value}</Text>
    </View>
  )
);

const LegendItem = ({
  color,
  label,
  count,
}: {
  color: string;
  label: string;
  count: number;
}) => (
  <View className="flex-row items-center">
    <View
      className="w-3 h-3 rounded-full mr-2"
      style={{ backgroundColor: color }}
    />
    <Text className="text-sm text-gray-700">
      {label}: {count}
    </Text>
  </View>
);

export default React.memo(OverallPerformance);
