import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { getPalette } from '@/constants/theme';
import { api } from '@/services/api';

interface Course {
  id: number;
  title: string;
  description: string;
  category: string;
  duration_hours: number;
  instructor: { name: string };
  rating: number;
  enrollment_count: number;
}

export default function CoursesScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const palette = getPalette(colorScheme ?? 'light');

  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const data = await api.get('/v1/courses/browse');
      setCourses(data.data || []);
    } catch (error) {
      console.error('Failed to load courses:', error);
    } finally {
      setLoading(false);
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
      justifyContent: 'space-between',
    },
    title: {
      color: '#fff',
      fontSize: 24,
      fontWeight: 'bold',
    },
    contentPadding: {
      paddingHorizontal: 16,
      paddingTop: 16,
    },
    courseCard: {
      marginBottom: 12,
      padding: 16,
    },
    courseCategoryBadge: {
      marginBottom: 8,
    },
    courseTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: palette.text,
      marginBottom: 4,
    },
    courseDescription: {
      fontSize: 13,
      color: palette.muted,
      marginBottom: 8,
      lineHeight: 18,
    },
    courseInfo: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
      paddingTop: 8,
      borderTopWidth: 1,
      borderTopColor: palette.outline,
    },
    infoPiece: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    infoText: {
      fontSize: 12,
      color: palette.muted,
    },
    enrollBtn: {
      marginTop: 8,
    },
    emptyText: {
      color: palette.muted,
      textAlign: 'center',
      fontSize: 14,
      marginVertical: 40,
    },
  });

  if (loading) {
    return <Spinner fullScreen />;
  }

  const renderCourse = ({ item }: { item: Course }) => (
    <Card style={styles.courseCard}>
      <Badge label={item.category} style={styles.courseCategoryBadge} />
      <Text style={styles.courseTitle}>{item.title}</Text>
      <Text style={styles.courseDescription}>{item.description}</Text>

      <View style={styles.courseInfo}>
        <View style={{ gap: 8 }}>
          <View style={styles.infoPiece}>
            <Feather name="user" size={14} color={palette.muted} />
            <Text style={styles.infoText}>{item.instructor.name}</Text>
          </View>
          <View style={styles.infoPiece}>
            <Feather name="clock" size={14} color={palette.muted} />
            <Text style={styles.infoText}>{item.duration_hours}h</Text>
          </View>
        </View>
        <View style={{ alignItems: 'flex-end', gap: 4 }}>
          {item.rating > 0 && (
            <View style={styles.infoPiece}>
              <Feather name="star" size={14} color="#f59e0b" />
              <Text style={styles.infoText}>{item.rating}/5</Text>
            </View>
          )}
          <Text style={[styles.infoText, { fontSize: 11 }]}>
            {item.enrollment_count} students
          </Text>
        </View>
      </View>

      <Button
        onPress={() => router.push(`/student/course-detail?id=${item.id}`)}
        variant="primary"
        children="View Course"
      />
    </Card>
  );

  return (
    <>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Browse Courses</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentPadding}
        showsVerticalScrollIndicator={false}
      >
        {courses.length > 0 ? (
          <FlatList
            data={courses}
            renderItem={renderCourse}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
          />
        ) : (
          <Text style={styles.emptyText}>No courses available</Text>
        )}
      </ScrollView>
    </>
  );
}