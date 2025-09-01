import React, { useState } from "react";
import { View, Text, ScrollView, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAppSelector } from "../../../redux/hooks";
import { selectSubjectPerformance } from "../../../redux/slices/analytics";
import { PieChart } from "react-native-chart-kit";
import AppHeader from "../header";
import ResponsiveGridSkeleton from "../skeltons/skelton";
import CustomDropdown from "./CustomDropdown";

const SubjectAnalysis = () => {
  const router = useRouter();
  const subjectPerformance = useAppSelector(selectSubjectPerformance);
  const [selectedSubject, setSelectedSubject] = useState(
    subjectPerformance?.[0]?.subject || ""
  );

  if (!subjectPerformance || subjectPerformance.length === 0) {
    return (
      <View className="flex-1 bg-white">
        <ResponsiveGridSkeleton />
      </View>
    );
  }

  const currentSubject =
    subjectPerformance.find((sub) => sub.subject === selectedSubject) ||
    subjectPerformance[0];

  const pieData = [
    { name: "Correct", value: currentSubject.correctAnswers, color: "#10B981" },
    { name: "Incorrect", value: currentSubject.incorrectAnswers, color: "#EF4444" },
    { name: "Unattempted", value: currentSubject.unattempted, color: "#6B7280" },
  ];

  return (
    <View className="bg-white flex-1">
      <AppHeader
        screenTitle="Subject Analysis"
        onBackPress={() => router.back()}
      />

      <ScrollView contentContainerClassName="p-4 pb-6">
        <CustomDropdown
          data={subjectPerformance.map((item) => item.subject)}
          selected={selectedSubject}
          onSelect={(value) => setSelectedSubject(value)}
        />

        {/* Pie Chart */}
        <View className="bg-white rounded-xl mb-2 mt-2 p-4 shadow-md">
          <Text className="text-base font-semibold text-gray-800 text-center">
            Question Analysis
          </Text>
          <View className="items-center">
            <PieChart
              data={pieData}
              width={Dimensions.get("window").width - 64}
              height={200}
              chartConfig={{
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              accessor="value"
              backgroundColor="transparent"
              paddingLeft="75"
              absolute
              hasLegend={false}
            />
          </View>

          {/* Legend */}
          <View className="mt-1">
            <View className="flex-row justify-center mb-2">
              <View className="flex-row items-center">
                <View className="w-4 h-4 bg-green-500 rounded-full mr-2" />
                <Text className="text-sm text-gray-700">
                  Correct: {currentSubject.correctAnswers}
                </Text>
              </View>
              <View className="flex-row items-center ml-4">
                <View className="w-4 h-4 bg-red-500 rounded-full mr-2" />
                <Text className="text-sm text-gray-700">
                  Incorrect: {currentSubject.incorrectAnswers}
                </Text>
              </View>
            </View>
            <View className="flex-row py-1 justify-center">
              <View className="flex-row items-center">
                <View className="w-4 h-4 bg-gray-500 rounded-full mr-2" />
                <Text className="text-sm text-gray-700">
                  Unattempted: {currentSubject.unattempted}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Performance Metrics */}
        <View className="bg-white rounded-xl px-4 py-6 mt-5 shadow-md">
          <Text className="text-md font-semibold text-gray-800 mb-4">
            Performance Summary
          </Text>

          <View className="flex-row justify-between mb-3">
            <View className="bg-gray-50 rounded-lg p-4 w-[48%] items-center">
              <Ionicons name="help-circle" size={24} color="#4F46E5" />
              <Text className="text-sm text-gray-500 mb-1 text-center">
                Total Questions
              </Text>
              <Text className="text-lg font-semibold text-gray-800 text-center">
                {currentSubject.totalQuestions}
              </Text>
            </View>
            <View className="bg-gray-50 rounded-lg p-4 w-[48%] items-center">
              <Ionicons name="trophy" size={24} color="#10B981" />
              <Text className="text-sm text-gray-500 mb-1 text-center">
                Percentage
              </Text>
              <Text className="text-lg font-semibold text-gray-800 text-center">
                {currentSubject.percentage.toFixed(1)}%
              </Text>
            </View>
          </View>

          <View className="flex-row justify-between">
            <View className="bg-gray-50 rounded-lg p-4 w-[48%] items-center">
              <Ionicons name="stats-chart" size={24} color="#F59E0B" />
              <Text className="text-sm text-gray-500 mb-1 text-center">
                Score
              </Text>
              <Text className="text-lg font-semibold text-gray-800 text-center">
                {currentSubject.score}/{currentSubject.maxScore}
              </Text>
            </View>
            <View className="bg-gray-50 rounded-lg p-4 w-[48%] items-center">
              <Ionicons name="checkmark-circle" size={24} color="#8B5CF6" />
              <Text className="text-sm text-gray-500 mb-1 text-center">
                Accuracy
              </Text>
              <Text className="text-lg font-semibold text-gray-800 text-center">
                {(
                  (currentSubject.correctAnswers /
                    (currentSubject.correctAnswers + currentSubject.incorrectAnswers)) *
                  100 || 0
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

export default SubjectAnalysis;
