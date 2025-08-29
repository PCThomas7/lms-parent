import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { api } from "@/services/api";
import ParentDashboardBanner from "../components/home/ParentDashboardBanner";
import AverageScoreCard from "../components/home/AverageScoreCard";
import axios from "axios";
import Skelton from "../components/skeltons/skelton";

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

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadUserDetails(),
        fetchChildrenData(),
        fetchAverageScore(),
      ]);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
  };

  const loadUserDetails = async () => {
    try {
      const userDetailsString = await SecureStore.getItemAsync("userDetails");
      if (userDetailsString) setUser(JSON.parse(userDetailsString));
    } catch (error) {
      console.error("Error loading user details:", error);
    }
  };

  const fetchChildrenData = async () => {
    try {
      const response = await api.get("/parent/children");
      const childrenData = response.data;
      await SecureStore.setItemAsync("children", JSON.stringify(childrenData));
      setChildren(childrenData);
    } catch (error) {
      console.log("Error fetching children:", error);
      const stored = await SecureStore.getItemAsync("children");
      if (stored) setChildren(JSON.parse(stored));
    }
  };

  const DEFAULT_AVERAGE_ON_404 = 9.37;
  const DEFAULT_TotalQuizzes = 96;
  const DEFAULT_TotalTime = 24647;
  const DEFAULT_Total_Questions = 3149;

  const fetchAverageScore = async () => {
    try {
      const statusResponse = await api.get("/analytics/status");
      const raw = Number(statusResponse?.data?.averageScore);

      if (!Number.isFinite(raw)) {
        throw new Error("Invalid averageScore");
      }

      const clamped = Math.max(0, Math.min(raw, 100));
      setAverageScore(Number(clamped.toFixed(2)));
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        setAverageScore(DEFAULT_AVERAGE_ON_404);
      } else {
        console.error("Error fetching average score:", err);
        setAverageScore(0);
      }
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <Skelton />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner */}
        <ParentDashboardBanner
          user={user}
          children={children}
          onRefresh={loadDashboardData}
        />

        {/* Average Score Card Component */}
        <AverageScoreCard
          averageScore={averageScore}
          DEFAULT_TotalQuizzes={DEFAULT_TotalQuizzes}
          DEFAULT_TotalTime={DEFAULT_TotalTime}
          DEFAULT_Total_Questions={DEFAULT_Total_Questions}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
