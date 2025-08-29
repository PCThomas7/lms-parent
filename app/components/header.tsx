import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AppHeaderProps {
  screenTitle: string;
  onBackPress?: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ screenTitle, onBackPress }) => {
  return (
    <View className="flex-row items-center px-4 py-2 border-b border-gray-200">
      {onBackPress && (
        <TouchableOpacity
          onPress={onBackPress}
          className="w-10 h-10 rounded-full bg-gray-100 mr-3 justify-center items-center"
        >
          <Ionicons name="arrow-back" size={24} color="#4F46E5" />
        </TouchableOpacity>
      )}
      <Text className="text-[20px] font-semibold text-gray-800 flex-1" numberOfLines={1}>
        {screenTitle}
      </Text>
    </View>
  );
};

export default AppHeader;
