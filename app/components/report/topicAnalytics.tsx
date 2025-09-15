import React, { useState, useEffect } from "react";
import { View, Text, ScrollView } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useAppSelector } from "@/redux/hooks";
import { selectTopicWise } from "../../../redux/slices/detailedReport";
import AppHeader from "../header";
import ResponsiveGridSkeleton from "../skeltons/skelton";

const TopicAnalytics = () => {
  const { chapter, subject } = useLocalSearchParams();
  const data = useAppSelector(selectTopicWise);
  const [filtered, setFiltered] = useState<any[]>([]);

  useEffect(() => {
    if (chapter && subject) {
      const topic = data?.filter(
        (t) => t.chapter === chapter && t.subject === subject
      );
      setFiltered(topic || []);
    }
  }, [chapter, subject, data]);

  return (
    <View className="flex-1 bg-slate-50">
      <AppHeader
        screenTitle="Topic-Wise Analytics"
        onBackPress={() => router.back()}
      />

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {filtered.length > 0 ? (
          filtered.map((item, index) => {
            const { correctAnswers, incorrectAnswers, unattempted, totalQuestions } = item;
            const total = totalQuestions || 1;
            const correctPct = (correctAnswers / total) * 100;
            const incorrectPct = (incorrectAnswers / total) * 100;
            const unattemptedPct = (unattempted / total) * 100;

            return (
              <View
                key={index}
                className="bg-white border border-slate-200 rounded-xl p-4 mb-5 shadow-sm"
              >
                {/* Title */}
                <Text className="text-base font-semibold text-slate-900 mb-3">
                  {item.topic}
                </Text>

                {/* Progress Bar */}
                <View className="flex-row h-2.5 rounded-md overflow-hidden mb-3 bg-slate-100">
                  <View
                    style={{ width: `${correctPct}%` }}
                    className="bg-emerald-500"
                  />
                  <View
                    style={{ width: `${incorrectPct}%` }}
                    className="bg-rose-500"
                  />
                  <View
                    style={{ width: `${unattemptedPct}%` }}
                    className="bg-gray-400"
                  />
                </View>

                {/* Stats Row */}
                <View className="flex-row justify-between mb-3">
                  <Text className="text-sm text-slate-600">
                    Correct: {correctAnswers}
                  </Text>
                  <Text className="text-sm text-slate-600">
                    Incorrect: {incorrectAnswers}
                  </Text>
                  <Text className="text-sm text-slate-600">
                    Unattempted: {unattempted}
                  </Text>
                </View>

                {/* Totals */}
                <View className="flex-row justify-between mb-1">
                  <Text className="text-sm text-slate-500">Total Questions</Text>
                  <Text className="text-sm font-medium text-slate-800">
                    {item.totalQuestions}
                  </Text>
                </View>

                <View className="flex-row justify-between mb-1">
                  <Text className="text-sm text-slate-500">Score</Text>
                  <Text className="text-sm font-medium text-slate-800">
                    {item.score} / {item.maxScore}
                  </Text>
                </View>

                <View className="flex-row justify-between">
                  <Text className="text-sm text-slate-500">Accuracy</Text>
                  <Text
                    className={`text-sm font-semibold ${
                      item.percentage >= 75
                        ? "text-emerald-600"
                        : item.percentage >= 50
                        ? "text-amber-500"
                        : "text-rose-500"
                    }`}
                  >
                    {item.percentage.toFixed(1)}%
                  </Text>
                </View>
              </View>
            );
          })
        ) : (
          <ResponsiveGridSkeleton />
        )}
      </ScrollView>
    </View>
  );
};

export default TopicAnalytics;
