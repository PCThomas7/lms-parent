import * as Notifications from 'expo-notifications';
import { Stack, router } from 'expo-router';
import { useEffect, useState } from 'react';

export interface NotificationPayload {
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
}

export function useNotificationHandler() {
  const [notification, setNotification] = useState<NotificationPayload | null>(null);

  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener((event) => {
      const payload = event.request.content;
      const data = payload.data as Partial<NotificationPayload>;
      
      setNotification({
        title: typeof payload.title === 'string' ? payload.title : '',
        body: typeof payload.body === 'string' ? payload.body : '',
        color: typeof data.color === 'string' ? data.color : undefined,
        type: typeof data.type === 'string' ? data.type : undefined,
        studentId: typeof data.studentId === 'string' ? data.studentId : undefined,
        studentName: typeof data.studentName === 'string' ? data.studentName : undefined,
        quizId: typeof data.quizId === 'string' ? data.quizId : undefined,
        quizTitle: typeof data.quizTitle === 'string' ? data.quizTitle : undefined,
        reportId: typeof data.reportId === 'string' ? data.reportId : undefined,
        score: typeof data.score === 'string' ? data.score : undefined,
        maxScore: typeof data.maxScore === 'string' ? data.maxScore : undefined,
        percentage: typeof data.percentage === 'string' ? data.percentage : undefined,
        timeSpent: typeof data.timeSpent === 'string' ? data.timeSpent : undefined,
        submittedAt: typeof data.submittedAt === 'string' ? data.submittedAt : undefined,
        action: data.action === 'view_results' || data.action === 'dismiss' ? data.action : undefined
      });
    });

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (notification) {
      timeout = setTimeout(() => setNotification(null), 5000);
    }
    return () => clearTimeout(timeout);
  }, [notification]);

  useEffect(() => {
    const responseSubscription = Notifications.addNotificationResponseReceivedListener((response) => {
      const payload = response.notification.request.content;
      const data = payload.data as Partial<NotificationPayload>;
      
      if (data.action === 'view_results' && data.reportId && data.quizId && data.studentId) {
        // Navigate to quiz results page with all the necessary parameters
        const queryParams = new URLSearchParams({
          id: data.reportId,
          quizId: data.quizId,
          studentId: data.studentId,
        });

        router.push(`/components/report/quizReport?${queryParams.toString()}`);
      }
      
      // For dismiss action, just clear the notification
      if (data.action === 'dismiss') {
        setNotification(null);
      }
    });

    return () => responseSubscription.remove();
  }, []);

  return { notification, setNotification };
}