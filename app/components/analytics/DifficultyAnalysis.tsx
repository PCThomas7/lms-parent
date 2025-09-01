import React, { useState } from "react";
import { View, Text, ScrollView, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { PieChart } from "react-native-chart-kit";
import { useAppSelector } from "../../../redux/hooks";
import { selectDifficultyPerformance } from "../../../redux/slices/analytics";
import AppHeader from "../../components/header";
import ResponsiveGridSkeleton from "../skeltons/skelton";
import CustomDropdown from "./CustomDropdown";

const screenWidth = Dimensions.get("window").width;

const DifficultyAnalysis = () => {
  const router = useRouter();
  const difficultyData = useAppSelector(selectDifficultyPerformance);
  const [selectedDifficulty, setSelectedDifficulty] = useState(
    difficultyData?.[0]?.difficulty || ""
  );

  if (!difficultyData || difficultyData.length === 0) {
    return (
      <View className="flex-1 bg-white">
        <ResponsiveGridSkeleton />
      </View>
    );
  }

  const current =
    difficultyData.find((item) => item.difficulty === selectedDifficulty) ||
    difficultyData[0];

  const pieData = [
    { name: "Correct", value: current.correctAnswers, color: "#10B981" },
    { name: "Incorrect", value: current.incorrectAnswers, color: "#EF4444" },
    { name: "Unattempted", value: current.unattempted, color: "#6B7280" },
  ];

  return (
    <View className="flex-1 bg-gray-50">
      <AppHeader
        screenTitle="Difficulty Analysis"
        onBackPress={() => router.back()}
      />

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
        keyboardShouldPersistTaps="handled"
      >
        <CustomDropdown
          data={difficultyData.map((item) => item.difficulty)}
          selected={selectedDifficulty}
          onSelect={(value) => setSelectedDifficulty(value)}
        />

        {/* Chart */}
        <View className="bg-white rounded-xl mb-2 mt-2 p-4 shadow">
          <Text className="text-base font-semibold text-gray-800 text-center mb-2">
            Answer Distribution
          </Text>
          <PieChart
            data={pieData}
            width={screenWidth - 64}
            height={200}
            chartConfig={{
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            accessor="value"
            backgroundColor="transparent"
            paddingLeft="75"
            absolute
            hasLegend={false}
            style={{ borderRadius: 8 }}
          />

          {/* Custom Legend */}
          <View className="mt-2">
            <View className="flex-row justify-center mb-2">
              <View className="flex-row items-center">
                <View
                  className="w-4 h-4 rounded-full mr-2"
                  style={{ backgroundColor: "#10B981" }}
                />
                <Text className="text-sm text-gray-700">
                  Correct: {current.correctAnswers}
                </Text>
              </View>
              <View className="flex-row items-center ml-4">
                <View
                  className="w-4 h-4 rounded-full mr-2"
                  style={{ backgroundColor: "#EF4444" }}
                />
                <Text className="text-sm text-gray-700">
                  Incorrect: {current.incorrectAnswers}
                </Text>
              </View>
            </View>
            <View className="flex-row justify-center">
              <View className="flex-row items-center">
                <View
                  className="w-4 h-4 rounded-full mr-2"
                  style={{ backgroundColor: "#6B7280" }}
                />
                <Text className="text-sm text-gray-700">
                  Unattempted: {current.unattempted}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Metrics */}
        <View className="bg-white rounded-xl px-4 py-6 mt-5 shadow">
          <Text className="text-base font-semibold text-gray-800 mb-4">
            Performance Summary
          </Text>
          <View className="flex-row justify-between mb-3">
            <View className="bg-gray-50 rounded-lg p-4 w-[48%] items-center">
              <Ionicons
                name="help-circle"
                size={24}
                color="#4F46E5"
                style={{ marginBottom: 8 }}
              />
              <Text className="text-sm text-gray-500 mb-1 text-center">
                Total Questions
              </Text>
              <Text className="text-lg font-semibold text-gray-800 text-center">
                {current.totalQuestions}
              </Text>
            </View>
            <View className="bg-gray-50 rounded-lg p-4 w-[48%] items-center">
              <Ionicons
                name="trophy"
                size={24}
                color="#10B981"
                style={{ marginBottom: 8 }}
              />
              <Text className="text-sm text-gray-500 mb-1 text-center">
                Percentage
              </Text>
              <Text className="text-lg font-semibold text-gray-800 text-center">
                {current.percentage.toFixed(1)}%
              </Text>
            </View>
          </View>
          <View className="flex-row justify-between">
            <View className="bg-gray-50 rounded-lg p-4 w-[48%] items-center">
              <Ionicons
                name="stats-chart"
                size={24}
                color="#F59E0B"
                style={{ marginBottom: 8 }}
              />
              <Text className="text-sm text-gray-500 mb-1 text-center">
                Score
              </Text>
              <Text className="text-lg font-semibold text-gray-800 text-center">
                {current.score}/{current.maxScore}
              </Text>
            </View>
            <View className="bg-gray-50 rounded-lg p-4 w-[48%] items-center">
              <Ionicons
                name="checkmark-circle"
                size={24}
                color="#8B5CF6"
                style={{ marginBottom: 8 }}
              />
              <Text className="text-sm text-gray-500 mb-1 text-center">
                Accuracy
              </Text>
              <Text className="text-lg font-semibold text-gray-800 text-center">
                {(
                  (current.correctAnswers / current.totalQuestions) *
                  100
                ).toFixed(1)}
                %
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default DifficultyAnalysis;
