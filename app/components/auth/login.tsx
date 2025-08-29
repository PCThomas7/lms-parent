import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
  ScrollView,
  Keyboard,
  ActivityIndicator,
  Alert,
} from "react-native";
import authService from "../../../services/authService";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import { notifyAuthChange } from "@/utils/auth";
// import AuthOptions from "./GoogleAuth";

type LoginProps = {
  toggleAuth: () => void;
};

type FormData = {
  email: string;
  password: string;
};

type FormErrors = {
  email: string;
  password: string;
};

type googleData = {
  email: string;
  name: String;
  sub: string;
};

const Login: React.FC<LoginProps> = ({ toggleAuth }) => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<FormErrors>({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = { email: "", password: "" };
    let isValid = true;

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const data = await authService.login(formData.email, formData.password);
      const { user, token, refreshToken } = data;

      if (user.role === "Parent") {
        await Promise.all([
          SecureStore.setItemAsync("authToken", token),
          SecureStore.setItemAsync("refreshToken", refreshToken),
          SecureStore.setItemAsync("userDetails", JSON.stringify(user)),
        ]);

        notifyAuthChange();
        router.replace("/(tabs)");
      } else {
        notifyAuthChange();
        router.replace("/Auth");
      }
    } catch (err: any) {
      console.error("Login failed:", err);

      const errorMessage =
        err.response?.data?.message ||
        "Invalid email or password. Please try again.";

      Alert.alert("Login Failed", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    router.push("/components/auth/ForgotPassword");
  };

  const handleGoogleSignIn = async (googleData: googleData) => {
    try {
      const userInfo = {
        name: googleData.name,
        email: googleData.email,
        sub: googleData.sub,
      };
      const res = await authService.googleLogin(userInfo);
      const { token, refreshToken, user } = res.data;
      await SecureStore.setItemAsync("authToken", token);
      await SecureStore.setItemAsync("refreshToken", refreshToken);
      await SecureStore.setItemAsync("userDetails", JSON.stringify(user));
      notifyAuthChange();
      router.replace("/(tabs)");
    } catch (err: any) {
      console.log("Google login failed:", err.response?.data || err);
      Alert.alert("Error", "Google login failed");
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, paddingVertical: 10 }}
          className="px-3"
        >
          {/* Email Input */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-slate-700 mb-2">
              Email
            </Text>
            <TextInput
              className={`h-14 rounded-xl px-4 text-base text-slate-900 bg-slate-50 border-[1.5px] ${
                errors.email ? "border-red-500 bg-red-50" : "border-slate-200"
              }`}
              placeholder="Enter your email"
              placeholderTextColor="#94A3B8"
              value={formData.email}
              onChangeText={(value) => handleInputChange("email", value)}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
            />
            {errors.email && (
              <Text className="text-xs text-red-500 mt-1.5 ml-1.5">
                {errors.email}
              </Text>
            )}
          </View>

          {/* Password Input */}
          <View className="mb-2">
            <Text className="text-sm font-medium text-slate-700 mb-2">
              Password
            </Text>
            <View className="relative">
              <TextInput
                className={`h-14 rounded-xl pl-4 pr-12 text-base text-slate-900 bg-slate-50 border-[1.5px] ${
                  errors.password
                    ? "border-red-500 bg-red-50"
                    : "border-slate-200"
                }`}
                placeholder="Enter your password"
                placeholderTextColor="#94A3B8"
                value={formData.password}
                onChangeText={(value) => handleInputChange("password", value)}
                secureTextEntry={!showPassword}
                editable={!isLoading}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-4 p-1"
                disabled={isLoading}
              >
                <Text className="text-lg">{showPassword ? "👁️" : "👁️‍🗨️"}</Text>
              </TouchableOpacity>
            </View>
            {errors.password && (
              <Text className="text-xs text-red-500 mt-1.5 ml-1.5">
                {errors.password}
              </Text>
            )}
          </View>

          {/* Forgot Password */}
          <TouchableOpacity
            className="self-end mb-7"
            onPress={handleForgotPassword}
          >
            <Text className="text-blue-500 text-sm font-medium">
              Forgot Password?
            </Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity
            className={`h-14 rounded-xl mb-6 justify-center items-center shadow-lg ${
              isLoading ? "opacity-60" : ""
            }`}
            style={{
              backgroundColor: "#3B82F6",
              shadowColor: "#3B82F6",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: isLoading ? 0 : 0.3,
              shadowRadius: 8,
              elevation: isLoading ? 0 : 6,
            }}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text className="text-white text-base font-semibold">
                Sign In
              </Text>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View className="relative h-6 justify-center mb-5">
            <View className="absolute top-1/2 left-0 right-0 border-t border-slate-200" />
            <View className="self-center bg-white px-3">
              <Text className="text-slate-500 text-xs">Or continue with</Text>
            </View>
          </View>

          {/* Auth Options */}
          {/* <AuthOptions
            isLoading={isLoading}
            handleGoogleSignIn={handleGoogleSignIn}
          /> */}

          {/* Sign Up Link */}
          <View className="flex-row justify-center items-center mb-5">
            <Text className="text-gray-600 text-base">
              Don't have an account?{" "}
            </Text>
            <TouchableOpacity onPress={toggleAuth} disabled={isLoading}>
              <Text className="text-blue-500 text-base font-semibold">
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default Login;
