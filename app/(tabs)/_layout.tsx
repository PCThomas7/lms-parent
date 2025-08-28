import React from "react";
import { Platform, useWindowDimensions } from "react-native";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "@/hooks/useColorScheme";
import { HapticTab } from "../components/HapticTab";

export default function TabLayout() {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const isAndroid = Platform.OS === "android";

  const screenOptions: React.ComponentProps<typeof Tabs>["screenOptions"] = {
    headerShown: false,
    tabBarActiveTintColor: "#E11D48",
    tabBarInactiveTintColor: "#888",
    tabBarButton: HapticTab,
    tabBarStyle: {
      height: isLandscape ? 50 : 70,
      paddingTop: 8,
      paddingBottom: isAndroid ? (isLandscape ? 0 : 4) : isLandscape ? 0 : 16,
      backgroundColor: "#fff",
      borderTopWidth: 0,
      elevation: 0,
      shadowOpacity: 0,
      position: Platform.select({ ios: "absolute", default: "relative" }),
    },
    tabBarLabelStyle: {
      fontSize: isLandscape ? 10 : 12,
      marginBottom: isLandscape ? 0 : 4,
      fontWeight: "500",
    },
    tabBarItemStyle: {
      marginHorizontal: isLandscape ? 2 : 4,
      height: isLandscape ? 50 : 60,
      justifyContent: "center",
      alignItems: "center",
    },
  };

  const tabScreens: {
    name: string;
    title: string;
    iconName: {
      focused: keyof typeof Ionicons.glyphMap;
      outline: keyof typeof Ionicons.glyphMap;
    };
  }[] = [
    {
      name: "index",
      title: "Home",
      iconName: { focused: "home", outline: "home-outline" },
    },
    {
      name: "analytics",
      title: "Analytics",
      iconName: { focused: "stats-chart", outline: "stats-chart-outline" }, // charts/metrics
    },
    {
      name: "reports",
      title: "Reports",
      iconName: { focused: "document-text", outline: "document-text-outline" }, // documents/reports
    },
  ];

  return (
    <Tabs screenOptions={screenOptions}>
      {tabScreens.map(({ name, title, iconName }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            title,
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? iconName.focused : iconName.outline}
                size={isLandscape ? 22 : 24}
                color={color}
              />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
