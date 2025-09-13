import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { useAppDispatch } from "../../redux/hooks";
import { fetchStudentAnalytics } from "../../redux/slices/Thunk";

type NavItem = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
  subtitle?: string;
  color: string;
  bgColor: string;
};

const NAV_ITEMS: NavItem[] = [
  {
    label: "Overall Performance",
    icon: "stats-chart",
    route: "/components/analytics/OverallPerformance",
    color: "#6366F1",
    bgColor: "#EEF2FF",
  },
  {
    label: "Subject Analysis",
    icon: "book",
    route: "/components/analytics/SubjectAnalysis",
    color: "#10B981",
    bgColor: "#ECFDF5",
  },
  {
    label: "Difficulty Analysis",
    icon: "trending-up",
    route: "/components/analytics/DifficultyAnalysis",
    color: "#F59E0B",
    bgColor: "#FEF3C7",
  },
  {
    label: "Question Types",
    icon: "help-circle",
    route: "/components/analytics/QuestionTypes",
    color: "#EF4444",
    bgColor: "#FEE2E2",
  },
  {
    label: "Performance Trends",
    icon: "analytics",
    route: "/components/analytics/PerformanceOverview",
    color: "#8B5CF6",
    bgColor: "#F3E8FF",
  },
  {
    label: "Time Analysis",
    icon: "time",
    route: "/components/analytics/TimeAnalysis",
    color: "#06B6D4",
    bgColor: "#CFFAFE",
  },
];

const Analytics: React.FC = () => {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isWide = width >= 700;
  const isTablet = width >= 600;

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchStudentAnalytics());
  }, [dispatch]);

  return (
    <View className="flex-1 bg-slate-50">
      {/* Header Section */}
      <View className="bg-white px-4 py-5 border-b border-slate-100">
        <Text className="text-2xl font-bold text-gray-900">
          Performance Analytics
        </Text>
        <Text className="text-sm text-gray-500 mt-1">
          Get clear insights into your child’s learning progress.
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          padding: isWide ? 24 : 16,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View
          className={`${
            isWide || isTablet ? "flex-row flex-wrap" : "flex-col"
          }`}
          style={{ gap: isWide ? 20 : 16 }}
        >
          {NAV_ITEMS.map((item, index) => (
            <TouchableOpacity
              key={item.route}
              className={`
                bg-white rounded-2xl
                ${isWide || isTablet ? "flex-1" : "w-full"}
              `}
              style={{
                paddingVertical: isWide ? 18 : 14,
                paddingHorizontal: isWide ? 18 : 16,
                minWidth: isWide || isTablet ? `${100 / 2 - 2}%` : "100%",
                maxWidth: isWide || isTablet ? `${100 / 2 - 2}%` : "100%",
                borderColor: "#E2E8F0",
                borderWidth: 1,
              }}
              activeOpacity={0.7}
              onPress={() => router.push(item.route as any)}
            >
              <View className="flex-row items-center">
                <View
                  className="w-12 h-12 rounded-xl justify-center items-center mr-3.5"
                  style={{ backgroundColor: item.bgColor }}
                >
                  <Ionicons name={item.icon} size={26} color={item.color} />
                </View>

                <View className="flex-1 pr-2">
                  <Text
                    className="font-semibold text-gray-900"
                    style={{ fontSize: isWide ? 17 : 16 }}
                    numberOfLines={1}
                  >
                    {item.label}
                  </Text>
                  <Text
                    className="text-gray-500 mt-0.5"
                    style={{ fontSize: 12 }}
                  >
                    View detailed insights
                  </Text>
                </View>

                <View
                  className="w-8 h-8 rounded-full justify-center items-center"
                  style={{ backgroundColor: "#F8FAFC" }}
                >
                  <Ionicons name="chevron-forward" size={18} color="#64748B" />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <Text className="text-center text-[13px] text-gray-500 mt-6 italic">
          Tap an option to explore your analytics
        </Text>
      </ScrollView>
    </View>
  );
};

export default Analytics;
