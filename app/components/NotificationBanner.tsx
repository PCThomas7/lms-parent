import React, { useEffect, useRef } from 'react';
import {
  Text,
  View,
  Animated,
  Dimensions,
  Platform,
  TouchableOpacity,
  Easing,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

interface NotificationBannerProps {
  title: string;
  body: string;
  type?: string;
  action?: 'view_results' | 'dismiss';
  onViewResults?: () => void;
  onDismiss?: () => void;
}

const NotificationBanner: React.FC<NotificationBannerProps> = ({
  title,
  body,
  type,
  action = 'view_results',
  onViewResults,
  onDismiss,
}) => {
  const translateY = useRef(new Animated.Value(-150)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const slideIn = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 400,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      })
    ]).start();
  };

  const slideOutAndDismiss = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -200,
        duration: 300,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      })
    ]).start(() => {
      onDismiss?.();
    });
  };

  useEffect(() => {
    slideIn();
  }, []);

  const getIconName = (): keyof typeof Ionicons.glyphMap => {
    if (type === 'quiz_results') {
      return 'clipboard-check-outline' as keyof typeof Ionicons.glyphMap;
    }
    return 'notifications-outline' as keyof typeof Ionicons.glyphMap;
  };

  return (
    <Animated.View
      className="absolute left-4 right-4 rounded-xl p-4 z-50 border bg-black"
      style={[
        { 
          transform: [{ translateY }],
          opacity,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.3,
          shadowRadius: 4.65,
          elevation: 8,
          top: Platform.OS === 'ios' ? 50 : 30,
          borderColor: 'rgba(255, 255, 255, 0.1)',
        }
      ]}
    >
      <View className="flex-row items-start mb-3">
        <View className="w-10 h-10 rounded-full bg-white/15 justify-center items-center mr-3 mt-0.5">
          <Ionicons 
            name={getIconName()} 
            size={24} 
            color="#fff" 
          />
        </View>
        
        <View className="flex-1 mr-2">
          <Text className="text-white font-bold text-base mb-1 tracking-wide" numberOfLines={1}>
            {title}
          </Text>
          <Text className="text-white/85 text-sm leading-5 font-normal" numberOfLines={3}>
            {body}
          </Text>
        </View>
        
        <TouchableOpacity 
          onPress={slideOutAndDismiss} 
          className="p-1 rounded-xl bg-white/10"
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
        >
          <Ionicons name="close" size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {action === 'view_results' && onViewResults && (
        <TouchableOpacity
          className="flex-row items-center justify-center bg-white/15 py-2.5 px-4 rounded-xl border border-white/20"
          onPress={() => {
            onViewResults();
            slideOutAndDismiss();
          }}
          activeOpacity={0.8}
        >
          <Text className="text-white font-semibold text-sm tracking-wide">
            View Results
          </Text>
          <Ionicons name="arrow-forward" size={16} color="#fff" className="ml-1.5" />
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

export default NotificationBanner;