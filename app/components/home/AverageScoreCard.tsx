import React, { useMemo, useEffect, useState } from "react";
import { View, Text, Animated, Easing } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface AverageScoreCardProps {
  averageScore: number | null;
  studentName?: string;
  DEFAULT_TotalQuizzes: number;
  DEFAULT_TotalTime: number;          // seconds
  DEFAULT_Total_Questions: number;
}

const AverageScoreCard: React.FC<AverageScoreCardProps> = ({
  averageScore,
  studentName = "Your child",
  DEFAULT_TotalQuizzes,
  DEFAULT_TotalTime,
  DEFAULT_Total_Questions,
}) => {
  const [progressAnim] = useState(new Animated.Value(0));
  const [scoreDisplay, setScoreDisplay] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // score color + level + message
  const { score, scoreColor, performanceLevel, message } = useMemo(() => {
    const s = averageScore ?? 0;
    let color = "#EF4444";
    let level = "Needs Improvement";
    let msg = "Let's work together to boost these scores";

    if (s >= 90) {
      color = "#10B981";
      level = "Outstanding! 🌟";
      msg = `${studentName} is excelling in studies`;
    } else if (s >= 80) {
      color = "#3B82F6";
      level = "Excellent Work 🎯";
      msg = `${studentName} is performing really well`;
    } else if (s >= 70) {
      color = "#8B5CF6";
      level = "Good Progress 👍";
      msg = "Keep up the consistent effort";
    } else if (s >= 60) {
      color = "#F59E0B";
      level = "Satisfactory 📚";
      msg = "Room for improvement with practice";
    } else if (s >= 50) {
      color = "#F97316";
      level = "Needs Attention ⚡";
      msg = "Additional support may help";
    } else if (s > 0) {
      color = "#EF4444";
      level = "Requires Focus 🎯";
      msg = "Let's identify areas for improvement";
    }

    return { score: s, scoreColor: color, performanceLevel: level, message: msg };
  }, [averageScore, studentName]);

  // Convert seconds -> h m s display
  const formattedTime = useMemo(() => {
    const total = Math.max(0, Math.floor(Number(DEFAULT_TotalTime) || 0));
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    const pad = (n: number) => String(n).padStart(2, "0");
    return h > 0 ? `${h}h ${pad(m)}m ` : `${m}m ${pad(s)}s`;
  }, [DEFAULT_TotalTime]);


  // Animate progress bar and score
  useEffect(() => {
    if (averageScore === null || isAnimating) return;
    
    setIsAnimating(true);
    
    // Reset animation value
    progressAnim.setValue(0);
    
    // Animate progress bar
    Animated.timing(progressAnim, {
      toValue: score,
      duration: 1500,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
    
    // Animate score counter
    let start = 0;
    const end = Math.round(score);
    const duration = 500;
    const incrementTime = 20;
    
    const timer = setInterval(() => {
      start += 1;
      setScoreDisplay(Math.min(start, end));
      if (start >= end) {
        clearInterval(timer);
        setIsAnimating(false);
      }
    }, duration / end);
    
    return () => clearInterval(timer);
  }, [averageScore]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View className="mt-4">
      {/* Header */}
      <View className="mb-4">
        <Text className="text-2xl font-bold text-slate-800 mb-1">
          Academic Performance
        </Text>
        <Text className="text-sm text-slate-500">Based on recent assessments</Text>
      </View>

      {/* Card */}
      <View
        className="bg-slate-100 rounded-2xl p-5"
        
      >
        {/* Score */}
        <View className="items-center mb-6">
          <View
            className="w-32 h-32 rounded-full items-center justify-center mb-3"
            style={{
              backgroundColor: `${scoreColor}15`,
              borderWidth: 3,
              borderColor: scoreColor,
              shadowColor: scoreColor,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <Text className="text-4xl font-extrabold" style={{ color: scoreColor }}>
              {averageScore !== null ? scoreDisplay : "--"}
            </Text>
            <Text className="text-xs text-slate-600 font-medium">OVERALL</Text>
          </View>

          <View className="px-4 py-2 rounded-full mb-2" style={{ backgroundColor: `${scoreColor}20` }}>
            <Text className="text-base font-bold" style={{ color: scoreColor }}>
              {performanceLevel}
            </Text>
          </View>

          <Text className="text-sm text-slate-600 text-center px-4">{message}</Text>
        </View>

        {/* Progress */}
        <View className="mb-6">
          <View className="flex-row justify-between mb-3">
            <Text className="text-sm font-semibold text-slate-600">Progress</Text>
            <Text className="text-sm font-bold" style={{ color: scoreColor }}>
              {averageScore !== null ? `${score.toFixed(1)}%` : "-%"}
            </Text>
          </View>
          
          <View className="h-3 bg-slate-100 rounded-full bg-slate-200 overflow-hidden">
            <Animated.View
              className="h-full rounded-full"
              style={{ 
                width: progressWidth, 
                backgroundColor: scoreColor,
                shadowColor: scoreColor,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
                elevation: 3,
              }}
            />
          </View>

          <View className="flex-row justify-between mt-2">
            {[0, 25, 50, 75, 100].map((mark) => (
              <View key={mark} className="items-center">
                <View className="w-0.5 h-2 bg-slate-300 mb-1" />
                <Text className="text-xs text-slate-500 font-medium">{mark}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Quick Stats Row */}
        <View className="flex-row justify-between mb-4 pt-5 border-t border-slate-100 ">
          {/* Total Quizzes */}
          <View className="items-center flex-1">
            <View className="w-12 h-12 rounded-xl items-center justify-center mb-2" style={{ 
              backgroundColor: "#4F46E510",
              shadowColor: "#4F46E5",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2,
            }}>
              <Ionicons name="list" size={22} color="#4F46E5" />
            </View>
            <Text className="text-xs text-slate-500 font-medium mb-1">Total Quizzes</Text>
            <Text className="text-sm font-bold text-slate-800">{Number(DEFAULT_TotalQuizzes || 0)}</Text>
          </View>

          {/* Total Time */}
          <View className="items-center flex-1">
            <View className="w-12 h-12 rounded-xl items-center justify-center mb-2" style={{ 
              backgroundColor: "#F59E0B10",
              shadowColor: "#F59E0B",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2,
            }}>
              <Ionicons name="time" size={22} color="#F59E0B" />
            </View>
            <Text className="text-xs text-slate-500 font-medium mb-1">Time Spent</Text>
            <Text className="text-sm font-bold text-slate-800">{formattedTime}</Text>
          </View>

          {/* Total Questions */}
          <View className="items-center flex-1">
            <View className="w-12 h-12 rounded-xl items-center justify-center mb-2" style={{ 
              backgroundColor: "#06B6D410",
              shadowColor: "#06B6D4",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2,
            }}>
              <Ionicons name="document-text" size={22} color="#06B6D4" />
            </View>
            <Text className="text-xs text-slate-500 font-medium mb-1">Total Questions</Text>
            <Text className="text-sm font-bold text-slate-800">{Number(DEFAULT_Total_Questions || 0)}</Text>
          </View>
        </View>

       
      </View>
    </View>
  );
};

export default AverageScoreCard;