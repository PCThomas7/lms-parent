import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAppSelector } from "@/redux/hooks";
import { selectreport } from "@/redux/slices/report";
import {
  selectQuizData,
  selectTotalQuestions,
  selectTotalMarks,
} from "@/redux/slices/quizSlice";
import AppHeader from "../header";
import ResponsiveGridSkeleton from "../skeltons/skelton";
import service from "@/services/service";

const DetailedReport = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const data = useAppSelector(selectreport);
  const newData = data.find((item) => item._id === id);
  // console.log("newData : ",newData)

  const [highScore, setHighScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const getHighestScore = async () => {
    try {
      const response = await service.getQuizHighestScore(newData?.quiz?._id);
      setHighScore(response?.highestScore?.score ?? 0);
    } catch (error) {
      console.log("error : ", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getHighestScore();
  }, []);

  const quizData = useAppSelector(selectQuizData);
  const totalQ = useAppSelector(selectTotalQuestions);
  const totalMarks = useAppSelector(selectTotalMarks);

  if (isLoading || !newData) return <ResponsiveGridSkeleton />;

  const quiz = newData.quiz || {};
  const score = newData.score || 0;
  const correctAnswers = newData.correctAnswers || 0;
  const incorrectAnswers = newData.incorrectAnswers || 0;
  const unattemptedAnswers = newData.unattemptedAnswers || 0;
  const accuracy = Math.round((correctAnswers / totalQ) * 100);
  const formattedDate = new Date(newData.createdAt).toDateString();

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  const renderGridItem = (
    icon: any,
    label: any,
    value: any,
    color = "#111827",
    bold = false
  ) => (
    <View
      className="flex-row justify-center gap-3 items-center mb-3 p-4 bg-slate-50 rounded-lg mx-1"
      style={{ minWidth: "45%" }}
    >
      <View>
        <Ionicons name={icon} size={24} color="#6159eeff" />
      </View>
      <View>
        <Text className="text-[12px] font-semibold text-gray-500 mt-2">
          {label}
        </Text>
        <Text
          className={`text-base mt-1 ${bold ? "font-semibold" : "font-semibold"}`}
          style={{ color }}
        >
          {value}
        </Text>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-white">
      <AppHeader screenTitle="Quiz Report" onBackPress={() => router.back()} />

      <ScrollView className="px-5">
        {/* Title and Date */}
        <View className="mb-2 p-5">
          <Text className="text-2xl font-bold text-gray-900 text-center mb-1">
            {quiz.title}
          </Text>
          <Text className="text-sm text-gray-500 text-center">
            {formattedDate}
          </Text>
        </View>

        {/* Grid Info */}
        <View className="mb-6 pb-4 border-b border-dashed border-gray-500">
          <View className="flex-row flex-wrap justify-between">
            {renderGridItem("list-outline", "Total Questions", totalQ.toString())}
            {renderGridItem("time-outline", "Time Limit", `${quizData?.timeLimit || 60} min`)}
            {renderGridItem("book-outline", "Total Marks", totalMarks.toString())}
            {renderGridItem("trophy-outline", "Highest Score", highScore.toString())}
          </View>
        </View>

        {/* Performance Overview */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4 text-center">
            Performance Overview
          </Text>
          <View className="flex-row flex-wrap justify-between">
            {renderGridItem("star-outline", "Your Score", `${score}/${totalMarks}`, "#000", true)}
            {renderGridItem("checkmark-circle-outline", "Correct", correctAnswers.toString(), "#000", true)}
            {renderGridItem("close-circle-outline", "Incorrect", incorrectAnswers.toString(), "#000", true)}
            {renderGridItem("repeat-outline", "UnAttempted", unattemptedAnswers.toString(), "#000", true)}
            {renderGridItem("timer-outline", "Time Spent", formatTime(0), "#000", true)}
            {renderGridItem("speedometer-outline", "Accuracy", `${score < 0 ? 0 : accuracy}%`, "#000", true)}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Buttons */}
      <View className="flex-row justify-between p-5 border-t border-gray-200 bg-white">
        <TouchableOpacity className="bg-indigo-600 px-6 py-4 rounded-xl flex-1 mx-2 items-center shadow-sm" onPress={() => router.push(`/components/report/reportAnalytics?id=${id}&quizId=${quiz?._id}&title=${quiz.title}`)}>
          <Text className="text-white text-center font-semibold">Analytics</Text>
        </TouchableOpacity>
        <TouchableOpacity className="bg-indigo-600 px-6 py-4 rounded-xl flex-1 mx-2 items-center shadow-sm" onPress={() => router.push(`/components/report/solutions?id=${id}`)}>
          <Text className="text-white text-center font-semibold">Solutions</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DetailedReport;
