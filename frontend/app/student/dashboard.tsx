import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Spinner } from '@/components/ui/spinner';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { getPalette } from '@/constants/theme';
import { useAuthStore } from '@/store/useAuthStore';
import { api } from '@/services/api';

interface Course {
  id: number;
  title: string;
  instructor: { name: string };
  progress_percentage: number;
  status: string;
  rating: number;
}

interface Grade {
  id: number;
  score: number;
  grade_letter: string;
  submission: {
    assignment: {
      title: string;
    };
  };
}

interface DashboardData {
  stats: {
    enrolled_courses: number;
    completed_courses: number;
    pending_assignments: number;
  };
  recent_grades: Grade[];
}

export default function StudentDashboardScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const palette = getPalette(colorScheme ?? 'light');
  const { user, logout } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [dashData, coursesData] = await Promise.all([
        api.get('/v1/student/dashboard'),
        api.get('/v1/my-courses'),
      ]);

      setDashboardData(dashData);
      setCourses(coursesData.data || []);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await api.post('/v1/auth/logout', {});
    logout();
    router.replace('/');
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: palette.background,
    },
    header: {
      backgroundColor: palette.primary,
      paddingTop: 16,
      paddingHorizontal: 20,
      paddingBottom: 24,
    },
    greeting: {
      color: '#fff',
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 4,
    },
    timestamp: {
      color: 'rgba(255,255,255,0.8)',
      fontSize: 14,
    },
    contentPadding: {
      paddingHorizontal: 20,
      paddingTop: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: palette.text,
      marginBottom: 12,
      marginTop: 16,
    },
    statsGrid: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 24,
    },
    statCard: {
      flex: 1,
      padding: 16,
      backgroundColor: palette.card,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: palette.outline,
    },
    statValue: {
      fontSize: 28,
      fontWeight: 'bold',
      color: palette.primary,
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 12,
      color: palette.muted,
    },
    courseCard: {
      marginBottom: 12,
      padding: 16,
    },
    courseTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: palette.text,
      marginBottom: 4,
    },
    courseInstructor: {
      fontSize: 13,
      color: palette.muted,
      marginBottom: 8,
    },
    gradeCard: {
      marginBottom: 12,
      padding: 12,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    gradeTitle: {
      fontSize: 14,
      color: palette.text,
      fontWeight: '600',
      flex: 1,
    },
    gradeScore: {
      fontSize: 16,
      fontWeight: 'bold',
      color: palette.primary,
      marginRight: 12,
    },
    headerRight: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    logoutBtn: {
      marginLeft: 16,
    },
    emptyText: {
      color: palette.muted,
      textAlign: 'center',
      fontSize: 14,
      marginVertical: 16,
    },
  });

  if (loading) {
    return <Spinner fullScreen />;
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.headerRight}>
          <View>
            <Text style={styles.greeting}>Welcome, {user?.name}! 👋</Text>
            <Text style={styles.timestamp}>
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'short',
                day: 'numeric',
              })}
            </Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
            <Feather name="log-out" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.contentPadding}>
        {/* Statistics */}
        <Text style={styles.sectionTitle}>Your Stats</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              {dashboardData?.stats.enrolled_courses || 0}
            </Text>
            <Text style={styles.statLabel}>Enrolled</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              {dashboardData?.stats.completed_courses || 0}
            </Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              {dashboardData?.stats.pending_assignments || 0}
            </Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
        </View>

        {/* Enrolled Courses */}
        <Text style={styles.sectionTitle}>📚 Enrolled Courses</Text>
        {courses.length > 0 ? (
          courses.map((course) => (
            <Card
              key={course.id}
              style={styles.courseCard}
              onPress={() => router.push(`/student/course-detail?id=${course.id}`)}
            >
              <Text style={styles.courseTitle}>{course.title}</Text>
              <Text style={styles.courseInstructor}>
                by {course.instructor.name}
              </Text>
              <ProgressBar
                progress={course.progress_percentage}
                showPercentage={true}
              />
              <View style={{ marginTop: 8, flexDirection: 'row', gap: 8 }}>
                {course.status === 'completed' && (
                  <Badge label="Completed" variant="success" />
                )}
                {course.status === 'active' && (
                  <Badge label="In Progress" variant="info" />
                )}
                {course.rating > 0 && (
                  <Badge label={`⭐ ${course.rating}`} variant="default" />
                )}
              </View>
            </Card>
          ))
        ) : (
          <Text style={styles.emptyText}>
            No courses enrolled yet. Browse courses to get started!
          </Text>
        )}

        {/* Recent Grades */}
        {dashboardData?.recent_grades && dashboardData.recent_grades.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>📊 Recent Grades</Text>
            {dashboardData.recent_grades.map((grade) => (
              <Card key={grade.id} style={styles.gradeCard}>
                <Text style={styles.gradeTitle}>
                  {grade.submission.assignment.title}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={styles.gradeScore}>{grade.score}</Text>
                  <Badge label={grade.grade_letter} variant="success" />
                </View>
              </Card>
            ))}
          </>
        )}

        {/* Action Buttons */}
        <Button
          onPress={() => router.push('/student/courses')}
          variant="outline"
          children="Browse All Courses"
        />
      </View>
    </ScrollView>
  );
}