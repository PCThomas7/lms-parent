import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

interface UserDetails {
  name: string;
  role: string;
  email: string;
}

interface Child {
  _id: string;
  name: string;
  email: string;
  rollNumber: string;
  joinDate?: string; // ISO string
}

interface ParentDashboardBannerProps {
  user: UserDetails | null;
  children: Child[];
  loading?: boolean;
  onRefresh?: () => void;
}

const ParentDashboardBanner: React.FC<ParentDashboardBannerProps> = ({
  user,
  children,
  loading = false,
  onRefresh,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [expandedChild, setExpandedChild] = useState<string | null>(null);

  const getCurrentGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const getCurrentDate = () => {
    const options = { weekday: "long", month: "long", day: "numeric" } as const;
    return new Date().toLocaleDateString("en-US", options);
  };

  const getChildCountText = () => {
    const count = children.length;
    if (count === 0) return "No children enrolled";
    if (count === 1) return "1 child enrolled";
    return `${count} children enrolled`;
  };

  const toggleDetails = () => {
    setShowDetails((s) => !s);
    if (showDetails) setExpandedChild(null);
  };

  const toggleChildDetails = (childId: string) => {
    setExpandedChild(expandedChild === childId ? null : childId);
  };

  const formatJoinDate = (iso?: string) => {
    if (!iso) return "-";
    const d = new Date(iso);
    return d.toLocaleDateString("en-GB", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  };

  if (loading) {
    return (
      <View className="min-h-[200px] items-center justify-center rounded-xl p-6 mb-6 bg-[#DA1C5C]">
        <ActivityIndicator size="large" color="#ffffff" />
        <Text className="text-white mt-2 text-sm">Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <View className="mb-6 overflow-hidden rounded-xl">
      <LinearGradient
        colors={["#DA1C5C", "#F35B8E"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="p-4 rounded-xl"
      >
        {/* soft decorations */}
        <View className="absolute w-32 h-32 rounded-full bg-white/12 -right-9 -top-9" />
        <View className="absolute w-24 h-24 rounded-full bg-white/12 -left-7 -bottom-10" />

        {/* Top date pill */}
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center px-3 py-1.5 rounded-full bg-white/18">
            <Ionicons name="calendar" size={16} color="#fff" />
            <Text className="ml-1.5 text-xs font-semibold text-white">
              {getCurrentDate()}
            </Text>
          </View>

          {onRefresh ? (
            <TouchableOpacity 
              onPress={onRefresh} 
              className="flex-row items-center px-3 py-1.5 rounded-full bg-white"
              activeOpacity={0.8}
            >
              <Ionicons name="refresh" size={16} color="#DA1C5C" />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Greeting */}
        <View className="flex-row items-center my-4">
          <View className="w-14 h-14 rounded-full bg-white/22 border-2 border-white/35 items-center justify-center mr-3">
            <Ionicons name="person" size={26} color="#fff" />
          </View>
          <View className="flex-1">
            <Text className="text-2xl font-extrabold text-white">
              {getCurrentGreeting()}, {user?.name?.split(" ")[0] || "Parent"}!
            </Text>
            <Text className="text-white/85 text-sm mt-0.5">
              {user?.email}
            </Text>
          </View>
        </View>

        {/* Children summary */}
        <TouchableOpacity
          onPress={toggleDetails}
          activeOpacity={0.8}
          className="flex-row items-center justify-between p-3 rounded-xl bg-white/12"
        >
          <View className="flex-row items-center">
            <Ionicons name="school" size={20} color="#fff" />
            <Text className="ml-2 font-bold text-white">
              {getChildCountText()}
            </Text>
          </View>

          {children.length > 0 && (
            <View className="px-3 py-1.5 rounded-full bg-white/90">
              <Text className="text-xs font-extrabold text-[#DA1C5C]">
                {showDetails ? "Hide Details" : "View Details"}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Children accordion */}
        {showDetails && (
          <View className="p-3 mt-3 rounded-xl bg-white/12">
            {children.length > 0 ? (
              <>
                <Text className="font-extrabold text-center text-white mb-2">
                  Children Details
                </Text>
                {children.map((child, index) => {
                  const key = child._id || String(index);
                  const isOpen = expandedChild === key;
                  return (
                    <View key={key} className="mb-2.5 last:mb-0">
                      <TouchableOpacity
                        onPress={() => toggleChildDetails(key)}
                        activeOpacity={0.8}
                        className="flex-row items-center justify-between p-2.5 rounded-lg bg-white/10"
                      >
                        <View className="flex-row items-center">
                          <View className="w-7 h-7 rounded-full bg-[#FFD7E6] items-center justify-center mr-2.5">
                            <Text className="font-extrabold text-[#A10E41]">
                              {index + 1}
                            </Text>
                          </View>
                          <Text className="font-bold text-white text-base">
                            {child.name}
                          </Text>
                        </View>
                        <Ionicons
                          name={isOpen ? "chevron-up" : "chevron-down"}
                          size={20}
                          color="#fff"
                        />
                      </TouchableOpacity>

                      {isOpen && (
                        <View className="p-2.5 mt-1.5 rounded-lg bg-white/12">
                          <View className="flex-row items-center justify-between mb-2">
                            <Text className="text-white/80 text-sm">Email</Text>
                            <Text className="font-bold text-white text-sm">
                              {child.email || "-"}
                            </Text>
                          </View>
                          <View className="flex-row items-center justify-between mb-2">
                            <Text className="text-white/80 text-sm">Roll No</Text>
                            <Text className="font-bold text-white text-sm">
                              {child.rollNumber || "-"}
                            </Text>
                          </View>
                          <View className="flex-row items-center justify-between">
                            <Text className="text-white/80 text-sm">Join Date</Text>
                            <Text className="font-bold text-white text-sm">
                              {formatJoinDate(child.joinDate)}
                            </Text>
                          </View>
                        </View>
                      )}
                    </View>
                  );
                })}
              </>
            ) : (
              <View className="items-center justify-center py-4">
                <Ionicons name="school" size={32} color="#fff" />
                <Text className="font-bold text-white mt-2">
                  No children enrolled yet
                </Text>
                <Text className="text-white/85 text-xs mt-1 text-center">
                  Your children's profiles will appear here once registered.
                </Text>
              </View>
            )}
          </View>
        )}
      </LinearGradient>
    </View>
  );
};

export default ParentDashboardBanner;