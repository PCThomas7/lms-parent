import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import {
  Feather,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import AppHeader from "../header";
import ResponsiveGridSkeleton from "../skeltons/skelton";
import { useAppDispatch } from "@/redux/hooks";
import { fetchDetailedReport } from "@/redux/slices/Thunk";

interface ChildData {
  _id?: string;
  id?: string; // keeping both in case your backend uses _id
  name?: string;
  rollNumber?: string;
}

const ReportAnalytics = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { quizId, title } = useLocalSearchParams<{
    id?: string;
    quizId?: string;
    title?: string;
  }>();
  const [childData, setChildData] = useState<ChildData | null>(null);

  const getChildData = async () => {
    try {
      const child = await SecureStore.getItemAsync("children");
      if (child) {
        const parsedChild = JSON.parse(child);
        setChildData(parsedChild[0] || parsedChild);
      }
    } catch (error) {
      console.error("Failed to parse child data:", error);
    }
  };

  const fetchReport = async (quizId: string, studentId: string) => {
    if (studentId && quizId) {
      dispatch(fetchDetailedReport({ quizId, studentId } as any));
    }
  };

  // load student data on mount
  useEffect(() => {
    getChildData();
  }, []);

  // fetch report when both quizId + childData are ready
  useEffect(() => {
    if ((childData?.id || childData?._id) && quizId) {
      fetchReport(quizId as string, childData.id || childData._id!);
    }
  }, [childData, quizId]);

  const handleCardPress = (screen: string, label: string) => {
    if (screen === "difficulty-questionAnalytics") {
      router.push(`/components/report/${screen}?page=${label}`);
    }else{
          router.push(`/components/report/${screen}` as any);
    }
  };

  const analyticsOptions = [
    {
      label: "Subject-wise Analytics",
      description: "Understand progress across subjects, chapters, and topics.",
      icon: <Feather name="book-open" size={24} color="#fff" />,
      color: "#10b981",
      screen: "subjectAnalytics",
    },
    {
      label: "Difficulty-wise Analytics",
      description: "See performance on easy, medium, and hard level questions.",
      icon: <Feather name="activity" size={24} color="#fff" />,
      color: "#ef4444",
      screen: "difficulty-questionAnalytics",
    },
    {
      label: "Question-wise Analytics",
      description:
        "Analyze performance by question type: MCQ, MMCQ, numeric, etc.",
      icon: (
        <MaterialCommunityIcons
          name="format-list-bulleted"
          size={24}
          color="#fff"
        />
      ),
      color: "#8b5cf6",
      screen: "difficulty-questionAnalytics",
    },
  ];

  return (
    <View className="flex-1 bg-slate-50">
      <AppHeader
        screenTitle="Report Analytics"
        onBackPress={() => router.back()}
      />

      {!childData ? (
        <ResponsiveGridSkeleton />
      ) : (
        <ScrollView
          contentContainerStyle={{ padding: 16, paddingBottom: 50 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Student Info */}
          <View className="bg-white rounded-xl p-4 mb-5 shadow-sm">
            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-full bg-indigo-100 items-center justify-center mr-3">
                <MaterialIcons name="person" size={22} color="#4f46e5" />
              </View>
              <View>
                <Text className="text-lg font-semibold text-gray-900">
                  {childData.name || "Student"}
                </Text>
                <Text className="text-sm text-gray-600">
                  Roll No: {childData.rollNumber || "N/A"}
                </Text>
              </View>
            </View>

            <View className="mt-3 pt-3 border-t border-gray-100">
              <Text className="text-sm text-gray-700 italic">
                Performance report for{" "}
                <Text className="font-medium text-indigo-600">{title}</Text>
              </Text>
            </View>
          </View>

          {/* Analytics Options */}
          <Text className="text-lg font-semibold text-gray-800 mb-4">
            Detailed Analytics
          </Text>

          {analyticsOptions.map((option, index) => (
            <Pressable
              key={index}
              onPress={() => handleCardPress(option.screen,option.label)}
              className="rounded-xl overflow-hidden mb-5 mt-1"
              android_ripple={{ color: "#f3f4f6", foreground: true }}
              style={{
                padding: 16,
                borderRadius: 12,
                backgroundColor: "white",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 3,
                elevation: 2,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              {/* Left Section */}
              <View className="flex-row items-start flex-1">
                <View
                  style={{
                    backgroundColor: option.color,
                    borderRadius: 12,
                    padding: 10,
                    marginRight: 14,
                  }}
                >
                  {option.icon}
                </View>

                <View className="flex-1">
                  <Text className="text-gray-800 font-semibold text-[15px] mb-1">
                    {option.label}
                  </Text>
                  <Text className="text-xs text-gray-500 leading-snug">
                    {option.description}
                  </Text>
                </View>
              </View>

              {/* Right Arrow */}
              <Feather name="chevron-right" size={22} color="#9ca3af" />
            </Pressable>
          ))}

          {/* Hint text */}
          <Text className="text-center text-[13px] text-gray-500 mt-6 italic">
            Tap an option to view detailed insights
          </Text>
        </ScrollView>
      )}
    </View>
  );
};

export default ReportAnalytics;
