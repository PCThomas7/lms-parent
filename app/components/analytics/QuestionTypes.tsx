import React, { useState } from "react";
import { View, Text, ScrollView, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { PieChart } from "react-native-chart-kit";
import { useAppSelector } from "../../../redux/hooks";
import { selectQuestionTypePerformance } from "../../../redux/slices/analytics";
import AppHeader from "../../components/header";
import CustomDropdown from "./CustomDropdown";

const screenWidth = Dimensions.get("window").width;

const QuestionTypes = () => {
  const router = useRouter();
  const questionTypes = useAppSelector(selectQuestionTypePerformance);

  const [selectedType, setSelectedType] = useState(
    questionTypes?.[0]?.questionType || ""
  );

  const current = questionTypes.find((q) => q.questionType === selectedType);

  const pieData = current
    ? [
        { name: "Correct", value: current.correctAnswers, color: "#10B981" },
        { name: "Incorrect", value: current.incorrectAnswers, color: "#EF4444" },
        { name: "Unattempted", value: current.unattempted, color: "#6B7280" },
      ]
    : [];

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <AppHeader screenTitle="Question Types" onBackPress={() => router.back()} />

      <ScrollView contentContainerClassName="p-4 pb-6">
        {/* Dropdown */}
        <CustomDropdown
          data={questionTypes.map((item) => item.questionType)}
          selected={selectedType}
          onSelect={(value) => setSelectedType(value)}
        />

        {/* Pie Chart */}
        {current && (
          <View className="bg-white rounded-xl p-4 mb-2 mt-2 shadow-sm">
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

            {/* Legend */}
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
        )}

        {/* Performance Summary */}
        {current && (
          <View className="bg-white rounded-xl px-4 py-6 mt-5 shadow-sm">
            <Text className="text-base font-semibold text-gray-800 mb-4">
              Performance Summary
            </Text>

            {/* First Row */}
            <View className="flex-row justify-between mb-3">
              <View className="bg-gray-50 rounded-lg p-4 w-[48%] items-center">
                <Ionicons name="help-circle" size={24} color="#4F46E5" />
                <Text className="text-sm text-gray-500 mb-1">Total Questions</Text>
                <Text className="text-lg font-semibold text-gray-800">
                  {current.totalQuestions}
                </Text>
              </View>
              <View className="bg-gray-50 rounded-lg p-4 w-[48%] items-center">
                <Ionicons name="trophy" size={24} color="#10B981" />
                <Text className="text-sm text-gray-500 mb-1">Percentage</Text>
                <Text className="text-lg font-semibold text-gray-800">
                  {current.percentage.toFixed(1)}%
                </Text>
              </View>
            </View>

            {/* Second Row */}
            <View className="flex-row justify-between">
              <View className="bg-gray-50 rounded-lg p-4 w-[48%] items-center">
                <Ionicons name="stats-chart" size={24} color="#F59E0B" />
                <Text className="text-sm text-gray-500 mb-1">Score</Text>
                <Text className="text-lg font-semibold text-gray-800">
                  {current.score}/{current.maxScore}
                </Text>
              </View>
              <View className="bg-gray-50 rounded-lg p-4 w-[48%] items-center">
                <Ionicons name="checkmark-circle" size={24} color="#8B5CF6" />
                <Text className="text-sm text-gray-500 mb-1">Accuracy</Text>
                <Text className="text-lg font-semibold text-gray-800">
                  {((current.correctAnswers / current.totalQuestions) * 100).toFixed(1)}%
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default QuestionTypes;
