import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import { notifyAuthChange } from "@/utils/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

interface UserDetails {
  name: string;
  role: string;
  email: string;
}

export default function Index() {
  const [user, setUser] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserDetails();
  }, []);

  const loadUserDetails = async () => {
    try {
      const userDetailsString = await SecureStore.getItemAsync("userDetails");
      if (userDetailsString) {
        const userDetails: UserDetails = JSON.parse(userDetailsString);
        setUser(userDetails);
      }
    } catch (error) {
      console.error("Error loading user details:", error);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync("authToken");
      await SecureStore.deleteItemAsync("refreshToken");
      await SecureStore.deleteItemAsync("userDetails");
      
      // Google sign out
      GoogleSignin.configure({
        webClientId:
          "725112630139-rgj27jcug4ggeco8ggujmn415j2ptr39.apps.googleusercontent.com",
      });
      await GoogleSignin.signOut();
      notifyAuthChange();
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-amber-300">
        <Text className="text-lg text-gray-800">Loading...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 items-center justify-center bg-amber-300 p-4"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Text className="text-2xl font-semibold text-gray-800 mb-8">
        Welcome to Index Page
      </Text>

      {user ? (
        <View className="w-full max-w-md bg-white rounded-lg p-6 shadow-md mb-8">
          <Text className="text-xl font-bold text-gray-800 text-center mb-4">
            User Profile
          </Text>
          
          <View className="space-y-3">
            <View className="flex-row justify-between border-b border-gray-200 pb-2">
              <Text className="text-gray-600 font-medium">Name:</Text>
              <Text className="text-gray-800">{user.name}</Text>
            </View>
            
            <View className="flex-row justify-between border-b border-gray-200 pb-2">
              <Text className="text-gray-600 font-medium">Email:</Text>
              <Text className="text-gray-800">{user.email}</Text>
            </View>
            
            <View className="flex-row justify-between border-b border-gray-200 pb-2">
              <Text className="text-gray-600 font-medium">Role:</Text>
              <Text className="text-gray-800 capitalize">{user.role}</Text>
            </View>
          </View>
        </View>
      ) : (
        <Text className="text-red-500 mb-8">No user information found</Text>
      )}

      <TouchableOpacity
        onPress={logout}
        className="absolute right-4 top-4 p-3 bg-red-500 rounded-lg shadow-md"
      >
        <Text className="text-white font-semibold">Logout</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}