// app/_layout.tsx
import { useEffect, useState } from "react";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import LoadingScreen from "./components/LoadingScreen";
import { useNotificationHandler } from "../hooks/useNotificationHandler";
import NotificationBanner from "./components/NotificationBanner";

import "../global.css";
import { useColorScheme } from "@/hooks/useColorScheme";
import { addAuthListener, removeAuthListener } from "@/utils/auth";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const segments = useSegments() as string[];
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [appReady, setAppReady] = useState(false);
  const { notification, setNotification } = useNotificationHandler();

  const [fontsLoaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const checkAuth = async () => {
    try {
      const token = await SecureStore.getItemAsync("authToken");
      setIsLoggedIn(!!token);
    } catch (error) {
      console.error("Error checking auth:", error);
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    checkAuth();

    // Add listener for auth changes
    addAuthListener(checkAuth);

    return () => {
      removeAuthListener(checkAuth);
    };
  }, []);

  // Handle navigation based on authentication state
  useEffect(() => {
    if (isLoggedIn === null) return;

    const inAuthGroup = segments[0] === "Auth";
    const inTabsGroup = segments[0] === "(tabs)";

    if (isLoggedIn) {
      if (inAuthGroup) {
        router.replace("/(tabs)");
      }
    } else {
      if (inTabsGroup || segments.length === 0) {
        router.replace("/Auth");
      }
    }
  }, [isLoggedIn, segments]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAppReady(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleViewResults = () => {
    if (notification?.action === 'view_results' && notification.reportId && notification.quizId && notification.studentId) {
      const queryParams = new URLSearchParams({
        id: notification.reportId,
        quizId: notification.quizId,
        studentId: notification.studentId,
        studentName: encodeURIComponent(notification.studentName || ''),
        quizTitle: encodeURIComponent(notification.quizTitle || ''),
        score: notification.score || '0',
        maxScore: notification.maxScore || '0',
        percentage: notification.percentage || '0',
        timeSpent: encodeURIComponent(notification.timeSpent || ''),
        submittedAt: notification.submittedAt || '',
        color: notification.color || '#6366f1'
      });

      router.push(`/components/report/quizReport?${queryParams.toString()}`);
      setNotification(null);
    }
  };

  const handleDismiss = () => {
    requestAnimationFrame(() => {
      setTimeout(() => setNotification(null), 0);
    });
  };

  // Your existing loading checks plus the new appReady check
  if (!fontsLoaded || !appReady) {
    return <LoadingScreen />;
  }

  return (
    <Provider store={store}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <SafeAreaProvider>
          <SafeAreaView
            edges={["top", "bottom", "left", "right"]}
            style={{ flex: 1 }}
          >
            {notification && (
              <NotificationBanner
                title={notification.title}
                body={notification.body}
                color={notification.color}
                type={notification.type}
                studentId={notification.studentId}
                studentName={notification.studentName}
                quizId={notification.quizId}
                quizTitle={notification.quizTitle}
                reportId={notification.reportId}
                score={notification.score}
                maxScore={notification.maxScore}
                percentage={notification.percentage}
                timeSpent={notification.timeSpent}
                submittedAt={notification.submittedAt}
                action={notification.action}
                onViewResults={handleViewResults}
                onDismiss={handleDismiss}
              />
            )}
            <Stack screenOptions={{ animation: "none", headerShown: false }}>
              {isLoggedIn ? (
                <>
                  <Stack.Screen name="(tabs)" />
                  <Stack.Screen name="+not-found" />
                </>
              ) : (
                <>
                  <Stack.Screen name="Auth" />
                  <Stack.Screen name="+not-found" />
                </>
              )}
            </Stack>
            <StatusBar style="auto" />
          </SafeAreaView>
        </SafeAreaProvider>
      </ThemeProvider>
    </Provider>
  );
}