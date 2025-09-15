import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, ViewStyle } from "react-native";
import { useAppSelector } from "@/redux/hooks";
import { selectChapterWise } from "../../../redux/slices/detailedReport";
import { useLocalSearchParams, useRouter } from "expo-router";
import AppHeader from "../header";
import { Ionicons } from "@expo/vector-icons";

const ChapterAnalytics = () => {
  const router = useRouter();
  const { subject } = useLocalSearchParams();
  const chapterData = useAppSelector(selectChapterWise) || [];

  const [filteredChapters, setFilteredChapters] = useState<typeof chapterData>([]);

  useEffect(() => {
    if (typeof subject === "string") {
      const filtered = chapterData.filter(
        (chapter: any) => chapter.subject === subject
      );
      setFilteredChapters(filtered);
    }
  }, [subject, chapterData]);

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
      <View className="h-2.5 flex-row rounded-md overflow-hidden bg-slate-200 mb-3">
        <View style={{ width: correctWidth } as ViewStyle} className="bg-emerald-500" />
        <View style={{ width: incorrectWidth } as ViewStyle} className="bg-rose-500" />
        <View style={{ width: unattemptedWidth } as ViewStyle} className="bg-gray-400" />
      </View>
    );
  };

  return (
    <View className="flex-1 bg-slate-50">
      {/* Header */}
      <AppHeader
        screenTitle="Chapter-Wise Analytics"
        onBackPress={() => router.back()}
      />

      {/* Content */}
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {filteredChapters.map((chapter, index) => (
          <View
            key={index}
            className="bg-white rounded-xl p-4 mb-5 border border-slate-200 shadow-sm"
          >
            {/* Title */}
            <Text className="text-base font-semibold text-slate-900 mb-1">
              {chapter.chapter}
            </Text>
            <Text className="text-sm font-medium text-emerald-600 mb-3">
              {chapter.percentage.toFixed(1)}% Accuracy
            </Text>

            {/* Progress Bar */}
            {renderProgressBar(
              chapter.correctAnswers,
              chapter.incorrectAnswers,
              chapter.unattempted
            )}

            {/* Legend */}
            <View className="flex-row justify-between flex-wrap mb-4">
              <View className="flex-row items-center mr-4 mb-2">
                <View className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-2" />
                <Text className="text-xs text-slate-600">
                  Correct: {chapter.correctAnswers}
                </Text>
              </View>
              <View className="flex-row items-center mr-4 mb-2">
                <View className="w-2.5 h-2.5 rounded-full bg-rose-500 mr-2" />
                <Text className="text-xs text-slate-600">
                  Incorrect: {chapter.incorrectAnswers}
                </Text>
              </View>
              <View className="flex-row items-center mr-4 mb-2">
                <View className="w-2.5 h-2.5 rounded-full bg-gray-400 mr-2" />
                <Text className="text-xs text-slate-600">
                  Unattempted: {chapter.unattempted}
                </Text>
              </View>
            </View>

            {/* Navigate to Topic Analytics */}
            <TouchableOpacity
              className="flex-row items-center justify-center py-2.5 rounded-lg bg-indigo-50"
              onPress={() =>
                router.push(
                  `/components/report/topicAnalytics?chapter=${chapter.chapter}&subject=${subject}`
                )
              }
            >
              <Text className="text-sm font-semibold text-indigo-600 mr-2">
                View Topicwise Analytics
              </Text>
              <Ionicons name="chevron-forward" size={16} color="#4F46E5" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default ChapterAnalytics;
