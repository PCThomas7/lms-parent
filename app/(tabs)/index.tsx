import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  RefreshControl, // ✅ import
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { api } from "@/services/api";
import ParentDashboardBanner from "../components/home/ParentDashboardBanner";
import AverageScoreCard from "../components/home/AverageScoreCard";
import axios from "axios";
import Skelton from "../components/skeltons/skelton";
import service from "@/services/service";

// ----------------------
// Default fallback values
// ----------------------
const DEFAULT_AVERAGE_ON_404 = 9.37;
const DEFAULT_TotalQuizzes = 96;
const DEFAULT_TotalTime = 24647; // seconds
const DEFAULT_TotalQuestions = 3149;

interface UserDetails {
  name: string;
  role: string;
  email: string;
}

interface Child {
  _id: string;
  name: string;
  email: string;
  rollNumber: string;
  joinDate?: string;
}

export default function Index() {
  const [user, setUser] = useState<UserDetails | null>(null);
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [averageScore, setAverageScore] = useState<number | null>(null);
  const [dashboardStats, setDashboardStats] = useState({
    totalQuizzes: DEFAULT_TotalQuizzes,
    totalTime: DEFAULT_TotalTime,
    totalQuestions: DEFAULT_TotalQuestions,
  });
  const [recentPerformance, setRecentPerformance] = useState({
    maxScore: 0,
    percentage: 0,
    quizId: "",
    quizTitle: "",
    score: 0,
    submittedAt: "",
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  // ----------------------
  // Main dashboard loader
  // ----------------------
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Run user details in parallel
      const userPromise = loadUserDetails();

      // Get children data first
      const childrenData = await fetchChildrenData();

      // Only fetch analytics if we actually have a child
      if (childrenData.length > 0) {
        await fetchAverageScore(childrenData[0]._id);
      }

      // Wait for user details to finish
      await userPromise;
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false); // ✅ stop refresh spinner
    }
  };

  // ----------------------
  // Load user details
  // ----------------------
  const loadUserDetails = async () => {
    try {
      const userDetailsString = await SecureStore.getItemAsync("userDetails");
      if (userDetailsString) {
        setUser(JSON.parse(userDetailsString));
      }
    } catch (error) {
      console.error("Error loading user details:", error);
    }
  };

  // ----------------------
  // Fetch children data
  // ----------------------
  const fetchChildrenData = async (): Promise<Child[]> => {
    try {
      const response = await api.get("/parent/children");
      console.log("numberOf childs : ",response.data)
      const childrenData: Child[] = response.data;
      await SecureStore.setItemAsync("children", JSON.stringify(childrenData[0]));
      setChildren(childrenData);
      return childrenData;
    } catch (error) {
      console.log("Error fetching children:", error);
      const stored = await SecureStore.getItemAsync("children");
      if (stored) {
        const parsed: Child[] = JSON.parse(stored);
        setChildren(parsed);
        return parsed;
      }
      return [];
    }
  };

  // ----------------------
  // Fetch analytics for a given child
  // ----------------------
  const fetchAverageScore = async (childId: string) => {
    try {
      const statusResponse = await service.getStudentAnalyticsById(childId);
      const analytics = statusResponse?.analytics;
      if (!analytics) throw new Error("No analytics data");

      // Extract fields
      const raw = Number(analytics.averageScore);
      const totalQuizzes = Number(analytics.totalAttempts);
      const totalTime = Number(analytics.timeSpentAnalysis?.totalTimeSpent);
      const totalQuestions = Number(analytics.totalQuestions);

      if (!Number.isFinite(raw)) throw new Error("Invalid averageScore");

      const clamped = Math.max(0, Math.min(raw, 100));

      // Update state
      setAverageScore(Number(clamped.toFixed(2)));
      setDashboardStats({
        totalQuizzes,
        totalTime,
        totalQuestions,
      });
      setRecentPerformance({
        maxScore: analytics.recentPerformance[0].maxScore,
        percentage: analytics.recentPerformance[0].percentage,
        quizId: analytics.recentPerformance[0].quizId,
        quizTitle: analytics.recentPerformance[0].quizTitle,
        score: analytics.recentPerformance[0].score,
        submittedAt: analytics.recentPerformance[0].submittedAt,
      });
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        setAverageScore(DEFAULT_AVERAGE_ON_404);
        setDashboardStats({
          totalQuizzes: DEFAULT_TotalQuizzes,
          totalTime: DEFAULT_TotalTime,
          totalQuestions: DEFAULT_TotalQuestions,
        });
      } else {
        console.error("Error fetching average score:", err);
        setAverageScore(0);
        setDashboardStats({
          totalQuizzes: 0,
          totalTime: 0,
          totalQuestions: 0,
        });
      }
    }
  };

  // ----------------------
  // Loading State
  // ----------------------
  if (loading && !refreshing) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <Skelton />
      </View>
    );
  }

  // ----------------------
  // Render UI
  // ----------------------
  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              loadDashboardData();
            }}
            colors={["#5A3FEC"]} // ✅ Android spinner color
            tintColor="#5A3FEC"   // ✅ iOS spinner color
          />
        }
      >
        {/* Banner */}
        <ParentDashboardBanner
          user={user}
          children={children}
          recentPerformance={recentPerformance}
        />

        {/* Average Score Card Component */}
        <AverageScoreCard
          averageScore={averageScore}
          DEFAULT_TotalQuizzes={dashboardStats.totalQuizzes}
          DEFAULT_TotalTime={dashboardStats.totalTime}
          DEFAULT_Total_Questions={dashboardStats.totalQuestions}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
