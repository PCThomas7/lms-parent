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
import authService from "@/services/authService";
import { router } from "expo-router";

type SignupProps = {
  toggleAuth: () => void;
};

type FormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

const Signup: React.FC<SignupProps> = ({ toggleAuth }) => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (key: keyof FormData, value: string) => {
    setFormData((prev) => ({...prev, [key] : value}));

    // Clear field error on change
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const nextErrors: FormErrors = {};
    let isValid = true;

    if (!formData.name.trim()) {
      nextErrors.name = "Full name is required";
      isValid = false;
    }

    if (!formData.email.trim()) {
      nextErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      nextErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!formData.password.trim()) {
      nextErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 6) {
      nextErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    if (!formData.confirmPassword.trim()) {
      nextErrors.confirmPassword = "Please confirm your password";
      isValid = false;
    } else if (formData.confirmPassword !== formData.password) {
      nextErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(nextErrors);
    return isValid;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await authService.register(
        formData.name,
        formData.email,
        formData.confirmPassword
      );

      if (response?.status === 201 || response?.status === 200) {
        Alert.alert(
          "Success",
          "Account created successfully! Please check your email to verify your account."
        );
        router.replace("/Auth");
        return;
      }

      throw new Error("Unexpected response from server");
    } catch (error: any) {
      console.error("Signup failed:", error);

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Unable to create account. Please try again later.";

      Alert.alert("Signup Failed", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };


  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword((prev) => !prev);

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
          {/* Full Name */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-slate-700 mb-2">
              Full Name
            </Text>
            <TextInput
              className={`h-14 rounded-xl px-4 text-base text-slate-900 bg-slate-50 border-[1.5px] ${
                errors.name ? "border-red-500 bg-red-50" : "border-slate-200"
              }`}
              placeholder="Enter your full name"
              placeholderTextColor="#94A3B8"
              value={formData.name}
              onChangeText={(v) => handleInputChange("name", v)}
              autoCapitalize="words"
              editable={!isLoading}
            />
            {errors.name && (
              <Text className="text-xs text-red-500 mt-1.5 ml-1.5">
                {errors.name}
              </Text>
            )}
          </View>

          {/* Email */}
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
              onChangeText={(v) => handleInputChange("email", v)}
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

          {/* Password */}
          <View className="mb-6">
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
                placeholder="Create a password"
                placeholderTextColor="#94A3B8"
                value={formData.password}
                onChangeText={(v) => handleInputChange("password", v)}
                secureTextEntry={!showPassword}
                editable={!isLoading}
              />
              <TouchableOpacity
                onPress={togglePasswordVisibility}
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

          {/* Confirm Password */}
          <View className="mb-5">
            <Text className="text-sm font-medium text-slate-700 mb-2">
              Confirm Password
            </Text>
            <View className="relative">
              <TextInput
                className={`h-14 rounded-xl pl-4 pr-12 text-base text-slate-900 bg-slate-50 border-[1.5px] ${
                  errors.confirmPassword
                    ? "border-red-500 bg-red-50"
                    : "border-slate-200"
                }`}
                placeholder="Confirm your password"
                placeholderTextColor="#94A3B8"
                value={formData.confirmPassword}
                onChangeText={(v) => handleInputChange("confirmPassword", v)}
                secureTextEntry={!showConfirmPassword}
                editable={!isLoading}
              />
              <TouchableOpacity
                onPress={toggleConfirmPasswordVisibility}
                className="absolute right-4 top-4 p-1"
                disabled={isLoading}
              >
                <Text className="text-lg">
                  {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                </Text>
              </TouchableOpacity>
            </View>
            {errors.confirmPassword && (
              <Text className="text-xs text-red-500 mt-1.5 ml-1.5">
                {errors.confirmPassword}
              </Text>
            )}
          </View>

          {/* Terms */}
          <Text className="text-xs text-slate-500 text-center leading-5 mb-5 px-2">
            By signing up, you agree to our{" "}
            <Text className="text-blue-500 font-medium">
              Terms & Privacy Policy
            </Text>
          </Text>

          {/* Signup Button */}
          <TouchableOpacity
            className={`h-14 rounded-xl mb-6 justify-center items-center shadow-lg ${
              isLoading ? "opacity-60" : ""
            }`}
            style={{
              backgroundColor: "#10B981",
              shadowColor: "#10B981",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: isLoading ? 0 : 0.3,
              shadowRadius: 8,
              elevation: isLoading ? 0 : 6,
            }}
            disabled={isLoading}
            onPress={handleSignup}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text className="text-white text-base font-semibold">
                Create Account
              </Text>
            )}
          </TouchableOpacity>

          {/* Switch to Login */}
          <View className="flex-row justify-center items-center mb-4">
            <Text className="text-gray-600 text-base">
              Already have an account?{" "}
            </Text>
            <TouchableOpacity onPress={toggleAuth} disabled={isLoading}>
              <Text className="text-blue-500 text-base font-semibold">
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default Signup;
