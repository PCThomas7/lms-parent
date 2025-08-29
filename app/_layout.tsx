// app/_layout.tsx
import { useEffect, useState } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import * as SecureStore from 'expo-secure-store';
import { Provider } from 'react-redux';
import {store} from '../redux/store'

import '../global.css';
import { useColorScheme } from '@/hooks/useColorScheme';
import { addAuthListener, removeAuthListener } from '@/utils/auth'; // Import from utils

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const segments = useSegments() as String[];
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const checkAuth = async () => {
    try {
      const token = await SecureStore.getItemAsync('authToken');
      setIsLoggedIn(!!token);
    } catch (error) {
      console.error('Error checking auth:', error);
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

    const inAuthGroup = segments[0] === 'Auth';
    const inTabsGroup = segments[0] === '(tabs)';

    if (isLoggedIn) {
      if (inAuthGroup) {
        router.replace('/(tabs)');
      }
    } else {
      if (inTabsGroup || segments.length === 0) {
        router.replace('/Auth');
      }
    }
  }, [isLoggedIn, segments]);

  if (isLoggedIn === null || !loaded) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <StatusBar style="auto" />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <Provider store={store}>
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <SafeAreaProvider>
        <SafeAreaView edges={['top', 'bottom', 'left', 'right']} style={{ flex: 1 }}>
          <Stack screenOptions={{ animation: 'none', headerShown: false }}>
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