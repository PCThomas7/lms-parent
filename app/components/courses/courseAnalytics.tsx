import React, { useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AppHeader from "../header";
import ResponsiveGridSkeleton from "../skeltons/skelton";
import service from "@/services/service";
import * as SecureStore from "expo-secure-store";
import {
  Ionicons,
  MaterialIcons,
  FontAwesome,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

const CourseAnalytics = () => {
  const router = useRouter();
  const { course } = useLocalSearchParams();
  const parsedCourse = JSON.parse(course as string);

  const safeCourseId = Array.isArray(parsedCourse.courseId)
    ? parsedCourse.courseId[0]
    : parsedCourse.courseId;

  const [analytics, setAnalytics] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProgress = async () => {
    try {
      const data = await SecureStore.getItemAsync("children");
      if (!data) throw new Error("No student data in SecureStore");

      const student = JSON.parse(data);
      const studentId = student?.[0]?._id;
      if (!studentId) throw new Error("No student ID found");

      const response = await service.getCourseDetailedAnalytics(
        safeCourseId,
        studentId
      );

      setAnalytics(response);
    } catch (err: any) {
      console.error("Failed to fetch analytics:", err);
      setError(err.message || "Error fetching analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (safeCourseId) fetchProgress();
  }, [safeCourseId]);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "Not available";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const completionPercentage =
    analytics?.totalLessons && analytics.totalLessons > 0
      ? Math.round(
          ((analytics.completedLessons ?? 0) / analytics.totalLessons) * 100
        )
      : 0;

  if (loading) return <ResponsiveGridSkeleton />;

  if (error) {
    return (
      <View className="flex-1 justify-center items-center p-5">
        <MaterialIcons name="error-outline" size={48} color="#EF4444" />
        <Text className="text-lg text-red-500 mt-4">{error}</Text>
      </View>
    );
  }

  if (!analytics) {
    return (
      <View className="flex-1 justify-center items-center p-5">
        <Text className="text-base text-slate-600">No analytics available</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-100">
      <AppHeader
        screenTitle="Course Analytics"
        onBackPress={() => router.back()}
      />

      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <View className="flex-1 p-4">
          {/* Main Analytics Card */}
          <View className="bg-white rounded-2xl p-5 mb-6 shadow">
            <Text className="text-xl font-semibold text-slate-800 text-center mb-4">
              {parsedCourse.title}
            </Text>

            <View>
              <View className="flex-row items-center mb-3">
                <MaterialIcons name="trending-up" size={20} color="#4F46E5" />
                <Text className="text-base font-medium text-indigo-600 ml-2">
                  Overall Progress
                </Text>
              </View>

              <View className="h-3 bg-slate-200 rounded-full overflow-hidden mb-2">
                <View
                  className="h-full rounded-full bg-indigo-600"
                  style={{ width: `${completionPercentage}%` }}
                />
              </View>

              <View className="flex-row justify-between items-center">
                <Text className="text-base font-bold text-indigo-600">
                  {completionPercentage}%
                </Text>
                <Text className="text-sm text-slate-500">
                  {analytics?.completedLessons ?? 0} of{" "}
                  {analytics?.totalLessons ?? 0} lessons completed
                </Text>
              </View>
            </View>
          </View>

          {/* Lesson Type Progress */}
          <Text className="text-base font-semibold text-slate-800 mb-4 flex-row items-center">
            <MaterialCommunityIcons
              name="format-list-checks"
              size={18}
              color="#4F46E5"
            />{" "}
            Lesson Progress
          </Text>

          <View className="mb-6">
            {/* Video */}
            <View className="bg-white rounded-xl p-4 mb-3 shadow-sm">
              <View className="flex-row items-center mb-3">
                <FontAwesome name="video-camera" size={18} color="#38BDF8" />
                <Text className="ml-2 text-base font-semibold text-slate-700">
                  Video Lessons
                </Text>
              </View>
              <View className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <View
                  className="h-full rounded-full"
                  style={{
                    width: `${
                      analytics?.lessonTypeStats?.video?.total
                        ? Math.round(
                            ((analytics.lessonTypeStats.video.completed ?? 0) /
                              analytics.lessonTypeStats.video.total) *
                              100
                          )
                        : 0
                    }%`,
                    backgroundColor: "#38BDF8",
                  }}
                />
              </View>
              <Text className="text-sm text-slate-500 mt-2">
                {analytics?.lessonTypeStats?.video?.completed ?? 0} of{" "}
                {analytics?.lessonTypeStats?.video?.total ?? 0} completed
              </Text>
            </View>

            {/* Quiz */}
            <View className="bg-white rounded-xl p-4 mb-3 shadow-sm">
              <View className="flex-row items-center mb-3">
                <MaterialIcons name="quiz" size={18} color="#FACC15" />
                <Text className="ml-2 text-base font-semibold text-slate-700">
                  Quiz Assessments
                </Text>
              </View>
              <View className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <View
                  className="h-full rounded-full"
                  style={{
                    width: `${
                      analytics?.lessonTypeStats?.quiz?.total
                        ? Math.round(
                            ((analytics.lessonTypeStats.quiz.completed ?? 0) /
                              analytics.lessonTypeStats.quiz.total) *
                              100
                          )
                        : 0
                    }%`,
                    backgroundColor: "#FACC15",
                  }}
                />
              </View>
              <Text className="text-sm text-slate-500 mt-2">
                {analytics?.lessonTypeStats?.quiz?.completed ?? 0} of{" "}
                {analytics?.lessonTypeStats?.quiz?.total ?? 0} completed
              </Text>
            </View>

            {/* PDF */}
            <View className="bg-white rounded-xl p-4 mb-3 shadow-sm">
              <View className="flex-row items-center mb-3">
                <MaterialCommunityIcons
                  name="file-pdf-box"
                  size={18}
                  color="#A3A3A3"
                />
                <Text className="ml-2 text-base font-semibold text-slate-700">
                  PDF Materials
                </Text>
              </View>
              <View className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <View
                  className="h-full rounded-full"
                  style={{
                    width: `${
                      analytics?.lessonTypeStats?.pdf?.total
                        ? Math.round(
                            ((analytics.lessonTypeStats.pdf.completed ?? 0) /
                              analytics.lessonTypeStats.pdf.total) *
                              100
                          )
                        : 0
                    }%`,
                    backgroundColor: "#A3A3A3",
                  }}
                />
              </View>
              <Text className="text-sm text-slate-500 mt-2">
                {analytics?.lessonTypeStats?.pdf?.completed ?? 0} of{" "}
                {analytics?.lessonTypeStats?.pdf?.total ?? 0} completed
              </Text>
            </View>
          </View>

          {/* Course Activity */}
          <Text className="text-base font-semibold text-slate-800 mb-4 flex-row items-center">
            <Ionicons name="time-outline" size={18} color="#0EA5E9" /> Course
            Activity
          </Text>

          <View>
            <View className="bg-white rounded-xl p-4 mb-3 shadow-sm">
              <View className="flex-row items-center mb-2">
                <MaterialIcons
                  name="play-circle-outline"
                  size={18}
                  color="#4F46E5"
                />
                <Text className="ml-2 text-base font-semibold text-slate-700">
                  Started On
                </Text>
              </View>
              <Text className="text-sm text-slate-600">
                {formatDate(analytics?.startedAt)}
              </Text>
            </View>

            <View className="bg-white rounded-xl p-4 mb-10 shadow-sm">
              <View className="flex-row items-center mb-2">
                <MaterialIcons
                  name="access-time"
                  size={18}
                  color="#4F46E5"
                />
                <Text className="ml-2 text-base font-semibold text-slate-700">
                  Last Accessed
                </Text>
              </View>
              <Text className="text-sm text-slate-600">
                {formatDate(analytics?.lastAccessedAt)}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default CourseAnalytics;
