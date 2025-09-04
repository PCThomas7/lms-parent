import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppSelector } from '../../../redux/hooks';
import { selectTimeSpentAnalysis } from '../../../redux/slices/analytics';
import AppHeader from '../../components/header';
import ResponsiveGridSkeleton from '../skeltons/skelton';


const TimeAnalysis = () => {
  const router = useRouter();
  const timeData = useAppSelector(selectTimeSpentAnalysis) || {
    totalTimeSpent: 0,
    averageTimePerQuiz: 0,
    averageTimePerQuestion: 0,
  };

  const formatTime = (seconds: number): string => {
    const safeSeconds = seconds || 0;
    const minutes = Math.floor(safeSeconds / 60);
    const remainingSeconds = Math.floor(safeSeconds % 60);
    return `${minutes > 0 ? `${minutes}m ` : ''}${remainingSeconds}s`;
  };

  if (!timeData || Object.keys(timeData).length === 0) {
    return (
     <ResponsiveGridSkeleton/>
    );
  }

  const getTimeInsight = (time: number, type: 'quiz' | 'question'): string => {
    const safeTime = time || 0;
    if (type === 'quiz') {
      return safeTime < 600
        ? 'You complete quizzes quickly, which shows good efficiency!'
        : 'You take your time with quizzes, ensuring thorough understanding.';
    } else {
      return safeTime < 30
        ? 'Quick responses show good recall, but ensure you read carefully.'
        : 'Thoughtful consideration leads to better accuracy.';
    }
  };

  return (
     <View className='flex-1'>
       {/* Header */}
      <AppHeader screenTitle="Time Analysis" onBackPress={() => router.back()} />

      {/* Content */}
      <View className="flex-1">
        <View className="px-5 pt-5 pb-10">
          {/* Summary */}
          <View className="mb-6">
            <Text className="text-[16px] font-semibold text-[#374151] mb-4 ml-1">
              Your Time Statistics
            </Text>

            <View className="flex-row justify-between">
              {/* Card: Total Time */}
              <View className="flex-1 bg-white rounded-[12px] p-4 items-center mx-1 shadow-md border border-[#F3F4F6]">
                <Ionicons name="time-outline" size={24} color="#4F46E5" />
                <Text className="text-[14px] font-bold text-[#111827] my-2">
                  {formatTime(timeData.totalTimeSpent)}
                </Text>
                <Text className="text-[13px] text-[#6B7280] text-center">Total Time</Text>
              </View>

              {/* Card: Per Quiz */}
              <View className="flex-1 bg-white rounded-[12px] p-4 items-center mx-1 shadow-md border border-[#F3F4F6]">
                <Ionicons name="speedometer-outline" size={24} color="#10B981" />
                <Text className="text-[14px] font-bold text-[#111827] my-2">
                  {formatTime(timeData.averageTimePerQuiz)}
                </Text>
                <Text className="text-[13px] text-[#6B7280] text-center">Per Quiz</Text>
              </View>

              {/* Card: Per Question */}
              <View className="flex-1 bg-white rounded-[12px] p-4 items-center mx-1 shadow-md border border-[#F3F4F6]">
                <Ionicons name="help-circle-outline" size={24} color="#F59E0B" />
                <Text className="text-[14px] font-bold text-[#111827] my-2">
                  {formatTime(timeData.averageTimePerQuestion)}
                </Text>
                <Text className="text-[13px] text-[#6B7280] text-center">Per Question</Text>
              </View>
            </View>
          </View>

          {/* Insights */}
          <View className="mb-4 flex-column gap-3">
            <Text className="text-[16px] font-semibold text-[#374151] mb-4 ml-1">
              Performance Insights
            </Text>

            {/* Insight card */}
            <View className="bg-white rounded-[12px] p-4 mb-3 shadow-sm border border-[#F3F4F6]">
              <View className="flex-row items-center mb-2">
                <Ionicons name="bulb-outline" size={20} color="#F59E0B" />
                <Text className="text-[15px] font-semibold text-[#111827] ml-2">
                  Total Learning Time
                </Text>
              </View>
              <Text className="text-[14px] text-[#4B5563] leading-[22px]">
                You've invested{' '}
                <Text className="font-semibold text-[#111827]">
                  {formatTime(timeData.totalTimeSpent)}
                </Text>{' '}
                in your learning journey.
                {(timeData.totalTimeSpent || 0) > 3600
                  ? ' That shows great dedication!'
                  : ' Keep building your knowledge!'}
              </Text>
            </View>

            <View className="bg-white rounded-[12px] p-4 mb-3 shadow-sm border border-[#F3F4F6]">
              <View className="flex-row items-center mb-2">
                <Ionicons name="analytics-outline" size={20} color="#4F46E5" />
                <Text className="text-[15px] font-semibold text-[#111827] ml-2">
                  Quiz Efficiency
                </Text>
              </View>
              <Text className="text-[14px] text-[#4B5563] leading-[22px]">
                Average of{' '}
                <Text className="font-semibold text-[#111827]">
                  {formatTime(timeData.averageTimePerQuiz)}
                </Text>{' '}
                per quiz. {getTimeInsight(timeData.averageTimePerQuiz, 'quiz')}
              </Text>
            </View>

            <View className="bg-white rounded-[12px] p-4 mb-3 shadow-sm border border-[#F3F4F6]">
              <View className="flex-row items-center mb-2">
                <Ionicons name="timer-outline" size={20} color="#10B981" />
                <Text className="text-[15px] font-semibold text-[#111827] ml-2">
                  Question Response
                </Text>
              </View>
              <Text className="text-[14px] text-[#4B5563] leading-[22px]">
                <Text className="font-semibold text-[#111827]">
                  {formatTime(timeData.averageTimePerQuestion)}
                </Text>{' '}
                per question on average.{' '}
                {getTimeInsight(timeData.averageTimePerQuestion, 'question')}
              </Text>
            </View>
          </View>
        </View>
      </View>
     </View>
  );
};

export default TimeAnalysis;
