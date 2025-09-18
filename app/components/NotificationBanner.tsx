import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Animated,
  Dimensions,
  Platform,
  TouchableOpacity,
  Easing,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface NotificationBannerProps {
  title: string;
  body: string;
  color?: string;
  type?: string;
  studentId?: string;
  studentName?: string;
  quizId?: string;
  quizTitle?: string;
  reportId?: string;
  score?: string;
  maxScore?: string;
  percentage?: string;
  timeSpent?: string;
  submittedAt?: string;
  action?: 'view_results' | 'dismiss';
  onViewResults?: () => void;
  onDismiss?: () => void;
}

const NotificationBanner: React.FC<NotificationBannerProps> = ({
  title,
  body,
  color = '#6366f1',
  type,
  studentId,
  studentName,
  quizId,
  quizTitle,
  reportId,
  score,
  maxScore,
  percentage,
  timeSpent,
  submittedAt,
  action = 'view_results',
  onViewResults,
  onDismiss,
}) => {
  const translateY = useRef(new Animated.Value(-150)).current;

  const slideIn = () => {
    Animated.timing(translateY, {
      toValue: Platform.OS === 'ios' ? 50 : 30,
      duration: 350,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start();
  };

  const slideOutAndDismiss = () => {
    Animated.timing(translateY, {
      toValue: -200,
      duration: 350,
      easing: Easing.in(Easing.exp),
      useNativeDriver: true,
    }).start(() => {
      onDismiss?.();
    });
  };

  useEffect(() => {
    slideIn();

    // Auto-dismiss after 5s
    const timer = setTimeout(() => {
      slideOutAndDismiss();
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const getIconName = () => {
    if (type === 'quiz_results') return 'clipboard-check';
    return 'information';
  };

  const getIcon = () => {
    if (type === 'quiz_results') return 'clipboard-check-outline';
    return 'information-outline';
  };

  return (
    <Animated.View
      style={[styles.container, { transform: [{ translateY }], backgroundColor: color }]}
    >
      <View style={styles.topRow}>
        <MaterialCommunityIcons
          name={getIcon()}
          size={28}
          color="white"
          style={styles.icon}
        />
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          <Text style={styles.body} numberOfLines={2}>{body}</Text>
          
          {/* Additional quiz info for quiz results */}
          {type === 'quiz_results' && score && maxScore && (
            <View style={styles.quizInfo}>
              <Text style={styles.quizScore}>
                Score: {score}/{maxScore} ({percentage}%)
              </Text>
              {timeSpent && (
                <Text style={styles.quizTime}>Time: {timeSpent}</Text>
              )}
            </View>
          )}
        </View>
        
        <TouchableOpacity onPress={slideOutAndDismiss} style={styles.closeIcon}>
          <Ionicons name="close" size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {action === 'view_results' && onViewResults && (
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            onViewResults();
            slideOutAndDismiss();
          }}
        >
          <Text style={styles.actionButtonText}>VIEW RESULTS →</Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: '23%',
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingHorizontal: 20,
    paddingBottom: 20,
    width: '100%',
    zIndex: 9999,
    elevation: 10,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  icon: {
    marginRight: 12,
    marginTop: 4,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#fff',
    marginBottom: 4,
  },
  body: {
    fontSize: 14,
    color: '#e5e7eb',
    marginBottom: 8,
    lineHeight: 18,
  },
  quizInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quizScore: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  quizTime: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
    opacity: 0.9,
  },
  closeIcon: {
    padding: 4,
    marginLeft: 8,
  },
  actionButton: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    letterSpacing: 0.5,
    fontSize: 12,
  },
});

export default NotificationBanner;