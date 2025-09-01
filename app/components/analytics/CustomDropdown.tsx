import React, { useRef, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface DropdownProps {
  data: string[];
  selected: string;
  onSelect: (value: string) => void;
}

const CustomDropdown: React.FC<DropdownProps> = ({ data, selected, onSelect }) => {
  const [open, setOpen] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const toggleDropdown = () => {
    Animated.timing(rotateAnim, {
      toValue: open ? 0 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
    setOpen(!open);
  };

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  return (
    <View className="relative z-10 mb-5">
      <TouchableOpacity
        className="flex-row justify-between items-center p-4 bg-gray-50 border border-gray-200 rounded-xl"
        onPress={toggleDropdown}
      >
        <Text className="text-base text-gray-800 font-medium">{selected}</Text>
        <Animated.View style={{ transform: [{ rotate: rotateInterpolate }] }}>
          <Ionicons name="chevron-down" size={20} color="#6B7280" />
        </Animated.View>
      </TouchableOpacity>

      {open && (
        <View className="absolute top-14 left-0 right-0 bg-white border border-gray-200 rounded-lg max-h-52 shadow-md z-50">
          <ScrollView className="max-h-52">
            {data.map((item, index) => (
              <TouchableOpacity
                key={index}
                className={`flex-row justify-between items-center p-3 border-b border-gray-100 ${
                  selected === item ? "bg-violet-50" : ""
                }`}
                onPress={() => {
                  onSelect(item);
                  setOpen(false);
                  Animated.timing(rotateAnim, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                  }).start();
                }}
              >
                <Text className="text-base text-gray-800">{item}</Text>
                {selected === item && (
                  <Ionicons name="checkmark" size={18} color="#4F46E5" />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default CustomDropdown;
