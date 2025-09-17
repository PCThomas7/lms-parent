import React, { useMemo, useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  Animated,
  TouchableOpacity,
} from "react-native";
import { useAppSelector } from "@/redux/hooks";
import {
  DifficultyPerformance,
  QuestionTypePerformance,
  selectDifficultyWise,
  selectQuestionType,
} from "../../../redux/slices/detailedReport";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { PieChart } from "react-native-chart-kit";
import AppHeader from "../header";

type AnalyticsMode = "Difficulty-wise Analytics" | "Question-wise Analytics";
type AnalyticsData = DifficultyPerformance | QuestionTypePerformance;

const screenWidth = Dimensions.get("window").width;

const DifficultyAnalytics = () => {
  const router = useRouter();
  const { page } = useLocalSearchParams<{ page?: AnalyticsMode }>();

  const difficultyData = useAppSelector(selectDifficultyWise);
  const questionTypeData = useAppSelector(selectQuestionType);

  const [selectedValue, setSelectedValue] = useState<string>("");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const mode: AnalyticsMode =
    Array.isArray(page) && page.length > 0
      ? (page[0] as AnalyticsMode)
      : page || "Difficulty-wise Analytics";

  const currentData: AnalyticsData[] = useMemo(
    () => (mode === "Difficulty-wise Analytics" ? difficultyData : questionTypeData) ?? [],
    [mode, difficultyData, questionTypeData]
  );

  function isDifficultyPerformance(item: AnalyticsData): item is DifficultyPerformance {
    return (item as DifficultyPerformance).difficulty !== undefined;
  }

  useEffect(() => {
    if (currentData.length > 0 && !selectedValue) {
      const firstItem = currentData[0];
      const initialValue = isDifficultyPerformance(firstItem)
        ? firstItem.difficulty
        : firstItem.questionType;
      setSelectedValue(initialValue);
    }
  }, [currentData, selectedValue]);

  const current: AnalyticsData | undefined = useMemo(() => {
    if (!currentData || !selectedValue) return undefined;
    return currentData.find((item) =>
      isDifficultyPerformance(item)
        ? item.difficulty === selectedValue
        : item.questionType === selectedValue
    );
  }, [currentData, selectedValue]);

  const toggleDropdown = () => {
    Animated.timing(rotateAnim, {
      toValue: dropdownVisible ? 0 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
    setDropdownVisible(!dropdownVisible);
  };

  const handleSelect = (value: string) => {
    setSelectedValue(value);
    toggleDropdown();
  };

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const pieData =
    current && "correctAnswers" in current
      ? [
          {
            name: "Correct",
            value: current.correctAnswers ?? 0,
            color: "#10B981",
            legendFontColor: "#1f2937",
            legendFontSize: 13,
          },
          {
            name: "Incorrect",
            value: current.incorrectAnswers ?? 0,
            color: "#ef4444",
            legendFontColor: "#1f2937",
            legendFontSize: 13,
          },
          {
            name: "Unattempted",
            value: current.unattempted ?? 0,
            color: "#9ca3af",
            legendFontColor: "#1f2937",
            legendFontSize: 13,
          },
        ].filter((item) => item.value > 0)
      : [];

  const getDisplayValue = (item: AnalyticsData): string =>
    isDifficultyPerformance(item) ? item.difficulty : item.questionType;

  return (
    <View className="flex-1 bg-white">
      <AppHeader screenTitle={mode} onBackPress={() => router.back()} />

      <ScrollView contentContainerClassName="p-4">
        {/* Dropdown */}
        {currentData.length > 0 && (
          <View className="relative z-10 mb-4">
            <TouchableOpacity
              onPress={toggleDropdown}
              className="flex-row justify-between items-center bg-gray-50 px-3 py-3 rounded-lg border border-gray-200"
            >
              <Text className="text-gray-800 text-base">{selectedValue}</Text>
              <Animated.View style={{ transform: [{ rotate: rotateInterpolate }] }}>
                <Ionicons name="chevron-down" size={20} color="#6B7280" />
              </Animated.View>
            </TouchableOpacity>

            {dropdownVisible && (
              <View className="absolute top-14 left-0 right-0 bg-white border border-gray-200 rounded-lg max-h-44 shadow-md">
                <ScrollView>
                  {currentData.map((item, idx) => {
                    const displayValue = getDisplayValue(item);
                    return (
                      <TouchableOpacity
                        key={idx}
                        className={`px-3 py-3 flex-row justify-between ${
                          selectedValue === displayValue ? "bg-indigo-50" : ""
                        }`}
                        onPress={() => handleSelect(displayValue)}
                      >
                        <Text className="text-gray-800 text-base">{displayValue}</Text>
                        {selectedValue === displayValue && (
                          <Ionicons name="checkmark" size={18} color="#4F46E5" />
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
            )}
          </View>
        )}

        {/* Chart - Updated to match the provided UI */}
        {current && pieData.length > 0 && (
          <View className="bg-white rounded-xl mb-4 p-4 shadow-md">
            <Text className="text-base font-semibold text-gray-800 text-center">
              Answer Distribution
            </Text>
            <View className="items-center">
              <PieChart
                data={pieData}
                width={screenWidth - 64}
                height={200}
                chartConfig={{
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                }}
                accessor="value"
                backgroundColor="transparent"
                paddingLeft="75"
                absolute
                hasLegend={false}
              />
            </View>

            {/* Legend - Updated to match the provided UI */}
            <View className="mt-1">
              <View className="flex-row justify-center mb-2">
                <View className="flex-row items-center">
                  <View className="w-4 h-4 bg-green-500 rounded-full mr-2" />
                  <Text className="text-sm text-gray-700">
                    Correct: {current.correctAnswers}
                  </Text>
                </View>
                <View className="flex-row items-center ml-4">
                  <View className="w-4 h-4 bg-red-500 rounded-full mr-2" />
                  <Text className="text-sm text-gray-700">
                    Incorrect: {current.incorrectAnswers}
                  </Text>
                </View>
              </View>
              <View className="flex-row py-1 justify-center">
                <View className="flex-row items-center">
                  <View className="w-4 h-4 bg-gray-500 rounded-full mr-2" />
                  <Text className="text-sm text-gray-700">
                    Unattempted: {current.unattempted}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Metrics */}
        {current && (
          <View className="bg-white p-4 rounded-xl shadow-sm">
            <Text className="text-gray-800 font-semibold mb-3">Summary</Text>

            <View className="flex-row justify-between py-1">
              <Text className="text-gray-500">Total Questions</Text>
              <Text className="text-gray-900 font-medium">
                {current.totalQuestions}
              </Text>
            </View>

            <View className="flex-row justify-between py-1">
              <Text className="text-gray-500">Score</Text>
              <Text className="text-gray-900 font-medium">
                {current.score} / {current.maxScore}
              </Text>
            </View>

            <View className="flex-row justify-between py-1">
              <Text className="text-gray-500">Percentage</Text>
              <Text
                className={`font-medium ${
                  current.percentage >= 75
                    ? "text-emerald-500"
                    : current.percentage >= 50
                    ? "text-amber-500"
                    : "text-red-500"
                }`}
              >
                {current.percentage.toFixed(1)}%
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default DifficultyAnalytics;