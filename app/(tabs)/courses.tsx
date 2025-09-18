import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, Pressable, RefreshControl } from "react-native";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";
import service from "@/services/service";
import ResponsiveGridSkeleton from "../components/skeltons/skelton";

interface Course {
  courseId: string;
  title: string;
  thumbnail?: string;
  completedLessons: number;
  totalLessons: number;
  description: string;
  isCompleted: boolean;
  lastAccessedAt: string;
  overallProgress: number;
  startedAt: string;
}

interface ChildData {
  _id: string;
}

async function getCourses(): Promise<Course[]> {
  const child = await SecureStore.getItemAsync("children");
  if (!child) throw new Error("No child data found in storage");
  
  const parsed: ChildData[] = JSON.parse(child);
  const childId = parsed[0]?._id;
  
  if (!childId) throw new Error("No child ID found");
  
  return service.getChildCourses(childId);
}

const ProgressBar = ({ progress }: { progress: number }) => {
  const scoreColor =
    progress >= 75 ? "#16a34a" : progress >= 50 ? "#facc15" : "#f87171";

  const progressWidth = Math.min(progress, 100);

  return (
    <View className="mb-3">
      <View className="flex-row justify-between mb-1">
        <Text className="text-xs font-medium text-gray-500">Progress</Text>
        <Text className="text-xs font-bold" style={{ color: scoreColor }}>
          {progress.toFixed(0)}%
        </Text>
      </View>
      <View className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <View
          className="h-full rounded-full"
          style={{
            width: `${progressWidth}%`,
            backgroundColor: scoreColor,
          }}
        />
      </View>
    </View>
  );
};

const CourseCard = ({ item, onPress }: { item: Course; onPress: () => void }) => {
  const progress = item.totalLessons > 0
    ? (item.completedLessons / item.totalLessons) * 100
    : 0;

  return (
    <View className="bg-white mx-4 my-2 p-4 rounded-xl shadow-sm border border-gray-100">
      {item.thumbnail && (
        <Image
          source={{ uri: item.thumbnail }}
          className="w-full h-32 rounded-lg mb-3"
          resizeMode="cover"
        />
      )}
      
      <Text className="text-base font-semibold mb-2 text-gray-800" numberOfLines={2}>
        {item.title}
      </Text>

      {item.description ? (
        <Text className="text-sm text-gray-500 mb-2" numberOfLines={2}>
          {item.description}
        </Text>
      ) : null}

      <Text className="text-sm text-gray-600 mb-3">
        {item.completedLessons}/{item.totalLessons} Lessons Completed
      </Text>

      <ProgressBar progress={progress} />

      <Pressable
        onPress={onPress}
        className="mt-3 bg-indigo-600 py-2.5 px-4 rounded-lg"
      >
        <Text className="text-white text-center font-medium text-sm">
          View Progress
        </Text>
      </Pressable>
    </View>
  );
};

const EmptyState = () => (
  <View className="flex-1 justify-center items-center p-8">
    <View className="bg-gray-100 p-6 rounded-xl items-center">
      <Text className="text-lg font-semibold text-gray-700 mb-2 text-center">
        No Courses Available
      </Text>
      <Text className="text-gray-500 text-center">
        You don't have any courses yet. Check back later for new content!
      </Text>
    </View>
  </View>
);

const Courses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const router = useRouter();

  const ITEMS_PER_PAGE = 6;

  const loadCourses = async (loadMore = false) => {
    try {
      const data = await getCourses();
      
      if (loadMore) {
        const startIndex = 0;
        const endIndex = page * ITEMS_PER_PAGE;
        const paginatedData = data.slice(0, endIndex);
        
        setCourses(paginatedData);
        setHasMore(endIndex < data.length);
      } else {
        const initialData = data.slice(0, ITEMS_PER_PAGE);
        setCourses(initialData);
        setHasMore(data.length > ITEMS_PER_PAGE);
        setPage(1);
      }
    } catch (error) {
      console.error("Failed to load courses:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setPage(1);
    loadCourses(false);
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  useEffect(() => {
    loadCourses(false);
  }, []);

  useEffect(() => {
    if (page > 1) {
      loadCourses(true);
    }
  }, [page]);

  const handleCoursePress = (course: Course) => {
    router.push({
      pathname: "/components/courses/courseAnalytics",
      params: { 
        course: JSON.stringify(course),
      },
    });
  };

  const renderFooter = () => {
    if (!hasMore && courses.length > 0) {
      return (
        <View className="py-4 items-center">
          <Text className="text-gray-500">No more courses to load</Text>
        </View>
      );
    }

    if (loading && page > 1) {
      return (
        <View className="py-4 items-center">
          <Text className="text-gray-500">Loading more courses...</Text>
        </View>
      );
    }

    return null;
  };

  if (loading && courses.length === 0) {
    return <ResponsiveGridSkeleton />;
  }

  return (
    <View className="flex-1 bg-gray-50">
      <View className="px-4 py-4 bg-white border-b border-gray-200 shadow-sm">
        <Text className="text-2xl font-bold text-gray-800">Enrolled Courses</Text>
      </View>

      <FlatList
        data={courses}
        keyExtractor={(item) => item.courseId}
        renderItem={({ item }) => (
          <CourseCard 
            item={item} 
            onPress={() => handleCoursePress(item)}
          />
        )}
        contentContainerStyle={courses.length === 0 ? { flex: 1 } : { paddingVertical: 8 }}
        ListEmptyComponent={<EmptyState />}
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#6366f1"]}
            tintColor="#6366f1"
          />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.3}
        showsVerticalScrollIndicator={true}
      />
    </View>
  );
};

export default Courses;