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
import { fetchStudentAnalytics } from "../../redux/slices/analyticsThunk";

type NavItem = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
  subtitle?: string;
};

const ICON_COLOR = "#DA1C5C";
const ICON_BG = "#FCE4EC";

const NAV_ITEMS: NavItem[] = [
  {
    label: "Overall Performance",
    icon: "stats-chart",
    route: "/components/analytics/OverallPerformance",
    subtitle: "Scores, attempts & accuracy",
  },
  {
    label: "Subject Analysis",
    icon: "book",
    route: "/components/analytics/SubjectAnalysis",
    subtitle: "Strengths by subject",
  },
  {
    label: "Difficulty Analysis",
    icon: "trending-up",
    route: "/components/analytics/DifficultyAnalysis",
    subtitle: "Easy • Medium • Hard",
  },
  {
    label: "Question Types",
    icon: "help-circle",
    route: "/components/analytics/QuestionTypes",
    subtitle: "MCQ, MMCQ, Numeric",
  },
  {
    label: "Performance Trends",
    icon: "analytics",
    route: "/components/analytics/PerformanceOverview",
    subtitle: "Progress over time",
  },
  {
    label: "Time Analysis",
    icon: "time",
    route: "/components/analytics/TimeAnalysis",
    subtitle: "Time spent & pace",
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
    <View className="flex-1 bg-gray-50">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          padding: isWide ? 24 : 16,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
      >
       
        <View
          className={`mt-2.5 ${
            isWide || isTablet ? "flex-row flex-wrap" : "flex-col"
          }`}
          style={{ gap: 25 }}
        >
          {NAV_ITEMS.map((item) => (
            <TouchableOpacity
              key={item.route}
              className={`
                bg-white rounded-xl
                ${isWide || isTablet ? "flex-1" : "w-full"}
              `}
              style={{
                paddingVertical: isWide ? 20 : 14,
                paddingHorizontal: isWide ? 20 : 14,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.02,
                shadowRadius: 3,
                elevation: 1,
                minWidth: isWide || isTablet ? `${100 / 2 - 2}%` : "100%",
                maxWidth: isWide || isTablet ? `${100 / 2 - 2}%` : "100%",
                borderColor: "#dddbdbff",
                borderWidth: 1.2,
              }}
              activeOpacity={0.9}
              onPress={() => router.push(item.route as any)}
            >
              <View className="flex-row items-center">
                <View
                  className="w-[44px] h-[44px] rounded-full justify-center items-center mr-3"
                  style={{ backgroundColor: ICON_BG }}
                >
                  <Ionicons name={item.icon} size={24} color={ICON_COLOR} />
                </View>

                <View className="flex-1 pr-2">
                  <Text
                    className="font-semibold text-gray-900"
                    style={{ fontSize: isWide ? 18 : 17 }}
                    numberOfLines={1}
                  >
                    {item.label}
                  </Text>
                  {item.subtitle && (
                    <Text
                      className="text-[13px] text-gray-500 mt-1"
                      numberOfLines={1}
                    >
                      {item.subtitle}
                    </Text>
                  )}
                </View>

                <Ionicons name="chevron-forward" size={20} color="#DA1C5C" />
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
