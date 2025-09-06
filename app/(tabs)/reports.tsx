import React, { useEffect, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchStudentReport } from "@/redux/slices/Thunk";
import { selectreport } from "@/redux/slices/report";
import ResponsiveGridSkeleton from "../components/skeltons/skelton";
import { router } from "expo-router";

export default function Reports() {
  const dispatch = useAppDispatch();
  const data = useAppSelector(selectreport);
  const [refreshing, setRefreshing] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setLoading(true);
    await dispatch(fetchStudentReport());
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await dispatch(fetchStudentReport());
    setRefreshing(false);
  };

  const reports = useMemo(() => {
    if (!data) return [];
    return Array.isArray(data) ? data : [data];
  }, [data]);

  const formatDateTime = (iso?: string) => {
    if (!iso) return "—";
    try {
      const date = new Date(iso);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      const isToday = date.toDateString() === today.toDateString();
      const isYesterday = date.toDateString() === yesterday.toDateString();

      if (isToday) {
        return `Today, ${date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`;
      }
      if (isYesterday) {
        return `Yesterday, ${date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`;
      }

      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return iso;
    }
  };

  const getPerformance = (score: number = 0, maxScore: number = 1) => {
    const pct = Math.max(
      0,
      Math.min(100, (score / Math.max(1, maxScore)) * 100)
    );
    if (pct >= 85)
      return {
        label: "Excellent",
        icon: "trophy",
        gradient: ["#10B981"],
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        pct,
      };
    if (pct >= 70)
      return {
        label: "Good",
        icon: "thumbs-up",
        gradient: ["#3B82F6"],
        bg: "bg-blue-50",
        text: "text-blue-700",
        pct,
      };
    if (pct >= 50)
      return {
        label: "Average",
        icon: "trending-up",
        gradient: ["#F59E0B"],
        bg: "bg-amber-50",
        text: "text-amber-700",
        pct,
      };
    return {
      label: "Keep Practicing",
      icon: "fitness",
      gradient: ["#EF4444"],
      bg: "bg-rose-50",
      text: "text-rose-700",
      pct,
    };
  };

  if (loading) {
    return <ResponsiveGridSkeleton />;
  }

  if (!reports.length) {
    return (
      <View className="flex-1 bg-slate-50">
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#6366F1"]}
            />
          }
        >
          <View className="flex-1 items-center justify-center px-6">
            <View className="w-24 h-24 rounded-full bg-indigo-100 items-center justify-center mb-4">
              <Ionicons
                name="document-text-outline"
                size={40}
                color="#6366F1"
              />
            </View>
            <Text className="text-xl font-semibold text-slate-900 mb-2">
              No Reports Yet
            </Text>
            <Text className="text-sm text-slate-500 text-center">
              Complete your first quiz to see your progress report here
            </Text>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-50">
      {/* Header */}
      <View className="bg-white ps-5 py-3 border-b border-slate-100">
        <Text className="text-lg font-bold text-slate-900">
          Child’s Quiz Performance
        </Text>
        <Text className="text-xs text-slate-500 mt-0.5">
          Showing the last {Math.min(reports.length, 10)} quiz attempts
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#6366F1"]}
          />
        }
      >
        {reports.map((r, index) => {
          const title = r?.quiz?.title || "Untitled Quiz";
          const score = r?.score ?? 0;
          const maxScore = r?.maxScore ?? 0;
          const submitted = formatDateTime(r?.submittedAt);
          const perf = getPerformance(score, maxScore);
          const progressWidth = `${perf.pct}%`;

          return (
            <TouchableOpacity
              key={r?.id || index}
              className="mb-4"
              activeOpacity={0.95}
            >
              <View className="rounded-2xl bg-white border border-slate-200 shadow-md overflow-hidden">
                <View className="p-4">
                  {/* Title Section */}
                  <View className="flex-row items-start mb-3">
                    <View className="flex-1">
                      <Text className="text-base font-bold text-slate-900 mb-1">
                        {title}
                      </Text>
                      <Text className="text-xs text-slate-500">
                        {submitted}
                      </Text>
                    </View>
                  </View>

                  {/* Score + Performance */}
                  <View className="flex-row items-center justify-between mb-3">
                    <View className="flex-row items-center">
                      <View
                        className={`w-10 h-10 rounded-full ${perf.bg} items-center justify-center mr-3`}
                      >
                        <Ionicons
                          name={perf.icon as any}
                          size={20}
                          color={perf.gradient[0]}
                        />
                      </View>
                      <View>
                        <Text className={`text-sm font-bold ${perf.text}`}>
                          {perf.label}
                        </Text>
                        <Text className="text-xs text-slate-500">
                          {Math.round(perf.pct)}% Complete
                        </Text>
                      </View>
                    </View>

                    <View className="items-end">
                      <Text className="text-xl font-bold text-slate-900">
                        {score}
                        <Text className="text-sm font-normal text-slate-500">
                          /{maxScore}
                        </Text>
                      </Text>
                      <Text className="text-xs text-slate-500">Score</Text>
                    </View>
                  </View>

                  {/* Progress Bar */}
                  <View className="mb-3">
                    <View className="h-1 bg-slate-100 rounded-full overflow-hidden">
                      <View
                        className="h-full rounded-full"
                        style={{
                          width: progressWidth as `${number}%`,
                          backgroundColor: perf.gradient[0],
                        }}
                      />
                    </View>
                  </View>

                  {/* Action Button */}
                  <TouchableOpacity
                    className="flex-row items-center justify-center py-2.5 rounded-xl bg-indigo-600"
                    activeOpacity={0.8}
                    onPress={() => router.push('/components/report/detailedReport')}
                  >
                    <Text className="text-white text-sm font-semibold mr-2">
                      View Detailed Report
                    </Text>
                    <Ionicons name="arrow-forward" size={16} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
        <View className="h-4" />
      </ScrollView>
    </View>
  );
}
