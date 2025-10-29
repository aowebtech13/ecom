import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Spinner } from '@/components/ui/spinner';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { getPalette } from '@/constants/theme';
import { api } from '@/services/api';

interface Assignment {
  id: number;
  title: string;
  type: string;
  due_date: string;
  max_points: number;
}

interface CourseDetail {
  id: number;
  title: string;
  description: string;
  category: string;
  duration_hours: number;
  learning_outcomes: string;
  instructor: { name: string };
  rating: number;
}

interface Enrollment {
  status: string;
  progress_percentage: number;
}

export default function CourseDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const palette = getPalette(colorScheme ?? 'light');

  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    fetchCourseDetail();
  }, [id]);

  const fetchCourseDetail = async () => {
    try {
      setLoading(true);
      const [courseData, assignmentsData] = await Promise.all([
        api.get(`/v1/courses/${id}`),
        api.get(`/v1/courses/${id}/assignments`),
      ]);

      setCourse(courseData);
      setAssignments(assignmentsData || []);

      // Check if already enrolled
      const enrollmentsData = await api.get('/v1/enrollments');
      const myEnrollment = enrollmentsData.find(
        (e: any) => e.course_id === parseInt(id as string)
      );
      if (myEnrollment) {
        setEnrollment(myEnrollment);
      }
    } catch (error) {
      console.error('Failed to load course:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    setEnrolling(true);
    try {
      await api.post(`/v1/courses/${id}/enroll`, {});
      Alert.alert('Success', 'Enrolled in course successfully!');
      fetchCourseDetail();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to enroll');
    } finally {
      setEnrolling(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: palette.background,
    },
    header: {
      backgroundColor: palette.primary,
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 20,
      flexDirection: 'row',
      alignItems: 'center',
    },
    headerTitle: {
      color: '#fff',
      fontSize: 20,
      fontWeight: 'bold',
      marginLeft: 12,
      flex: 1,
    },
    contentPadding: {
      paddingHorizontal: 16,
      paddingTop: 16,
    },
    card: {
      marginBottom: 16,
      padding: 16,
    },
    courseTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: palette.text,
      marginBottom: 8,
    },
    courseCategory: {
      marginBottom: 12,
    },
    courseDescription: {
      color: palette.text,
      fontSize: 14,
      lineHeight: 20,
      marginBottom: 12,
    },
    courseInfo: {
      marginBottom: 12,
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 8,
    },
    infoText: {
      color: palette.muted,
      fontSize: 14,
    },
    outcomeTitle: {
      fontWeight: '600',
      color: palette.text,
      marginBottom: 6,
    },
    outcomeText: {
      color: palette.text,
      fontSize: 13,
    },
    assignmentCard: {
      marginBottom: 12,
      padding: 12,
    },
    assignmentTitle: {
      fontSize: 15,
      fontWeight: '600',
      color: palette.text,
      marginBottom: 6,
    },
    assignmentInfo: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 8,
      paddingTop: 8,
      borderTopWidth: 1,
      borderTopColor: palette.outline,
    },
    dueDate: {
      fontSize: 12,
      color: palette.muted,
    },
    points: {
      fontSize: 12,
      fontWeight: '600',
      color: palette.primary,
    },
    enrolledStatus: {
      color: palette.primary,
      fontWeight: '600',
      marginBottom: 16,
      padding: 12,
      backgroundColor: palette.primaryMuted,
      borderRadius: 8,
      overflow: 'hidden',
      textAlign: 'center',
    },
  });

  if (loading) {
    return <Spinner fullScreen />;
  }

  if (!course) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <Text style={{ textAlign: 'center', color: palette.muted }}>
          Course not found
        </Text>
      </View>
    );
  }

  return (
    <>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{course.title}</Text>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.contentPadding} showsVerticalScrollIndicator={false}>
        <Card style={styles.card}>
          <Badge label={course.category} style={styles.courseCategory} />
          <Text style={styles.courseTitle}>{course.title}</Text>

          {enrollment && (
            <Text style={styles.enrolledStatus}>
              ✓ Enrolled - {Math.round(enrollment.progress_percentage)}% Complete
            </Text>
          )}

          <Text style={styles.courseDescription}>{course.description}</Text>

          <View style={styles.courseInfo}>
            <View style={styles.infoRow}>
              <Feather name="user" size={16} color={palette.primary} />
              <Text style={styles.infoText}>Instructor: {course.instructor.name}</Text>
            </View>
            <View style={styles.infoRow}>
              <Feather name="clock" size={16} color={palette.primary} />
              <Text style={styles.infoText}>{course.duration_hours} hours</Text>
            </View>
            {course.rating > 0 && (
              <View style={styles.infoRow}>
                <Feather name="star" size={16} color="#f59e0b" />
                <Text style={styles.infoText}>Rating: {course.rating}/5</Text>
              </View>
            )}
          </View>

          {enrollment && (
            <ProgressBar
              progress={enrollment.progress_percentage}
              label="Course Progress"
            />
          )}
        </Card>

        {course.learning_outcomes && (
          <Card style={styles.card}>
            <Text style={styles.outcomeTitle}>📚 Learning Outcomes</Text>
            <Text style={styles.outcomeText}>{course.learning_outcomes}</Text>
          </Card>
        )}

        {assignments.length > 0 && (
          <>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: palette.text, marginBottom: 12, marginTop: 8 }}>
              Assignments ({assignments.length})
            </Text>
            {assignments.map((assignment) => (
              <Card key={assignment.id} style={styles.assignmentCard}>
                <Badge
                  label={assignment.type.toUpperCase()}
                  variant={
                    assignment.type === 'quiz'
                      ? 'info'
                      : assignment.type === 'project'
                      ? 'warning'
                      : 'default'
                  }
                />
                <Text style={styles.assignmentTitle}>{assignment.title}</Text>
                <View style={styles.assignmentInfo}>
                  <Text style={styles.dueDate}>
                    Due: {new Date(assignment.due_date).toLocaleDateString()}
                  </Text>
                  <Text style={styles.points}>{assignment.max_points} pts</Text>
                </View>
              </Card>
            ))}
          </>
        )}

        {!enrollment && (
          <Button
            onPress={handleEnroll}
            loading={enrolling}
            children="Enroll in Course"
          />
        )}
      </ScrollView>
    </>
  );
}