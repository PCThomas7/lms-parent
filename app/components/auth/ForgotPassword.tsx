import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { api } from "@/services/api";

const { height } = Dimensions.get("window");

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");

  const validateEmail = useCallback((value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!value) {
      setEmailError("Email is required");
      return false;
    }

    if (!emailRegex.test(value)) {
      setEmailError("Please enter a valid email");
      return false;
    }

    setEmailError("");
    return true;
  }, []);

  const handleEmailChange = useCallback(
    (value: string) => {
      setEmail(value);
      if (emailError) validateEmail(value);
    },
    [emailError, validateEmail]
  );

  const handleResetPassword = useCallback(async () => {
    if (!validateEmail(email)) return;

    setIsLoading(true);

    try {
      // Simulate API call
      await api.post("/auth/forgot-password", { email });

      Alert.alert(
        "Success",
        "Password reset instructions have been sent to your email.",
        [{ text: "OK", onPress: () => router.replace("/Auth") }]
      );
    } catch (error) {
      Alert.alert(
        "Error",
        "Failed to send reset instructions. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }, [email, validateEmail]);

  const handleBackToSignIn = useCallback(() => {
    router.replace("/Auth");
  }, []);

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header Image */}
        <View style={styles.headerContainer}>
          <Image
            source={require("../../../assets/images/auth/Loginscreen.png")}
            className="w-full h-full"
            resizeMode="contain"
            accessibilityLabel="Password reset illustration"
          />
        </View>

        {/* Form Section */}
        <View className="flex-1 bg-white rounded-t-[30px] px-6 pt-8 pb-6 -mt-5">
          <View className="mb-8">
            <Text className="text-3xl font-bold text-gray-800 mb-2">
              Forgot Password?
            </Text>
            <Text className="text-gray-600 text-base leading-5">
              Enter your registered email address, and we’ll send you a link to
              securely reset your password.
            </Text>
          </View>

          {/* Email Input */}
          <View className="mb-6">
            <Text className="text-gray-700 text-sm font-medium mb-2">
              Email Address
            </Text>
            <View
              className={`border rounded-lg px-4 py-3 ${emailError ? "border-red-500" : "border-gray-300"}`}
            >
              <TextInput
                value={email}
                onChangeText={handleEmailChange}
                placeholder="Enter your email"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
                className="text-gray-800 text-base"
              />
            </View>
            {emailError && (
              <Text className="text-red-500 text-xs mt-1">{emailError}</Text>
            )}
          </View>

          {/* Reset Button */}
          <TouchableOpacity
            onPress={handleResetPassword}
            disabled={isLoading || !email}
            className={`rounded-lg py-4 mb-4 ${
              isLoading || !email
                ? "bg-gray-300"
                : "bg-blue-600 active:bg-blue-700"
            }`}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text className="text-white text-center font-semibold text-base">
                Send Reset Instructions
              </Text>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View className="flex-row items-center my-4">
            <View className="flex-1 h-px bg-gray-300" />
            <Text className="mx-4 text-gray-500 text-sm">OR</Text>
            <View className="flex-1 h-px bg-gray-300" />
          </View>

          {/* Back to Sign In */}
          <TouchableOpacity
            onPress={handleBackToSignIn}
            disabled={isLoading}
            className="border border-gray-300 rounded-lg py-4"
            activeOpacity={0.7}
          >
            <Text className="text-gray-700 text-center font-medium text-base">
              Back to Sign In
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  headerContainer: {
    height: height * 0.27,
    backgroundColor: "#FCE7F3",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
});

export default ForgotPassword;
