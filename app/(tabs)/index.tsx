import React from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import { notifyAuthChange } from '@/utils/auth';

export default function Index() {
  const logout = async () => {
    await SecureStore.deleteItemAsync("authToken");
    await SecureStore.deleteItemAsync("refreshToken");
    await SecureStore.deleteItemAsync("userDetails");
    notifyAuthChange();
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 items-center justify-center bg-amber-300"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Text className="text-2xl font-semibold text-gray-800">Index Page</Text>

      <TouchableOpacity
        onPress={logout}
        className="absolute right-4 top-4 p-2 bg-red-500 rounded"
      >
        <Text className="text-white font-semibold">Logout</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}
