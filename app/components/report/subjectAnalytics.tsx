import React from "react";
import { View, Text, ScrollView, TouchableOpacity, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";
import {
  selectSubjectWise,
  selectOverallPerformance,
} from "../../../redux/slices/detailedReport";
import AppHeader from "../header";

// Helper: Convert seconds to H M S format
const formatTime = (seconds: number = 0): string => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h}h ${m}m ${s}s`;
};

const QuizAnalytics = () => {
  const router = useRouter();
  const subjectData = useSelector(selectSubjectWise) || [];
  const overallPerformanceData = useSelector(selectOverallPerformance);

  const renderProgressBar = (
    correct: number,
    incorrect: number,
    unattempted: number
  ) => {
    const total = correct + incorrect + unattempted || 1;
    const correctWidth = `${(correct / total) * 100}%`;
    const incorrectWidth = `${(incorrect / total) * 100}%`;
    const unattemptedWidth = `${(unattempted / total) * 100}%`;

    return (
      <View className="h-3 flex-row rounded-md overflow-hidden bg-slate-100 mb-4">
        <View style={{ width: correctWidth } as ViewStyle} className="bg-emerald-500" />
        <View style={{ width: incorrectWidth } as ViewStyle} className="bg-rose-500" />
        <View style={{ width: unattemptedWidth } as ViewStyle} className="bg-gray-400" />
      </View>
    );
  };

  const renderStatItem = (label: string, value: string | number) => (
    <View className="items-center flex-1">
      <Text className="text-xs text-slate-500 mb-1">{label}</Text>
      <Text className="text-sm font-semibold text-slate-900">{value}</Text>
    </View>
  );

  return (
    <View className="flex-1 bg-slate-50">
      <AppHeader
        screenTitle="Quiz Analytics"
        onBackPress={() => router.back()}
      />

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        <Text className="text-lg font-semibold text-slate-800 mb-5">
          Subject-wise Performance
        </Text>

        {subjectData.map(
          (
            subject: {
              subject: string;
              correctAnswers: number;
              incorrectAnswers: number;
              unattempted: number;
              totalQuestions: number;
              score: number;
              maxScore: number;
              percentage: number;
            },
            index: number
          ) => (
            <View
              key={index}
              className="bg-white rounded-xl p-5 mb-5 shadow-sm border border-slate-200"
            >
              {/* Header */}
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-base font-semibold text-slate-900">
                  {subject.subject}
                </Text>
                <Text className="text-sm font-medium text-emerald-600">
                  {subject.percentage.toFixed(1)}% Accuracy
                </Text>
              </View>

              {/* Progress Bar */}
              {renderProgressBar(
                subject.correctAnswers,
                subject.incorrectAnswers,
                subject.unattempted
              )}

              {/* Legend */}
              <View className="flex-row justify-between flex-wrap mb-4">
                <View className="flex-row items-center mr-4 mb-2">
                  <View className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-2" />
                  <Text className="text-xs text-slate-600">
                    Correct: {subject.correctAnswers}
                  </Text>
                </View>
                <View className="flex-row items-center mr-4 mb-2">
                  <View className="w-2.5 h-2.5 rounded-full bg-rose-500 mr-2" />
                  <Text className="text-xs text-slate-600">
                    Incorrect: {subject.incorrectAnswers}
                  </Text>
                </View>
                <View className="flex-row items-center mr-4 mb-2">
                  <View className="w-2.5 h-2.5 rounded-full bg-gray-400 mr-2" />
                  <Text className="text-xs text-slate-600">
                    Unattempted: {subject.unattempted}
                  </Text>
                </View>
              </View>

              {/* Stats */}
              <View className="flex-row justify-between bg-slate-50 rounded-lg p-3 mb-4">
                {renderStatItem("Total Questions", subject.totalQuestions)}
                {renderStatItem("Score", `${subject.score}/${subject.maxScore}`)}
                {renderStatItem(
                  "Time Spent",
                  formatTime(overallPerformanceData?.timeSpent ?? 0)
                )}
              </View>

              {/* Button */}
              <TouchableOpacity
                className="flex-row items-center justify-center py-3 rounded-lg bg-indigo-50"
                onPress={() => router.push(`/components/report/chapterAnalytics?subject=${subject.subject}`)}
              >
                <Text className="text-sm font-semibold text-indigo-600 mr-2">
                  View Chapterwise Analytics
                </Text>
                <Ionicons name="chevron-forward" size={18} color="#4F46E5" />
              </TouchableOpacity>
            </View>
          )
        )}
      </ScrollView>
    </View>
  );
};

export default QuizAnalytics;
