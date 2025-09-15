import React from "react";
import { View, Text } from "react-native";
import { useAppSelector } from "@/redux/hooks";
import { selectQuestionType } from "@/redux/slices/detailedReport";

const questionAnalytics = () => {
  const data = useAppSelector(selectQuestionType) || [];
  return (
    <View>
      <Text>questionAnalytics</Text>
    </View>
  );
};

export default questionAnalytics;
