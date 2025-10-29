import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { getPalette } from '@/constants/theme';
import { api } from '@/services/api';

interface Submission {
  id: number;
  assignment: {
    id: number;
    title: string;
    course: { title: string };
    max_points: number;
    due_date: string;
  };
  status: string;
  submitted_at: string;
  grade?: { score: number; grade_letter: string };
}

export default function AssignmentsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const palette = getPalette(colorScheme ?? 'light');

  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const data = await api.get('/v1/student/submissions');
      setSubmissions(data.data || []);
    } catch (error) {
      console.error('Failed to load submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: palette.background },
    header: {
      backgroundColor: palette.primary,
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 20,
      flexDirection: 'row',
      alignItems: 'center',
    },
    title: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginLeft: 12, flex: 1 },
    contentPadding: { paddingHorizontal: 16, paddingTop: 16 },
    submissionCard: { marginBottom: 12, padding: 14 },
    submissionTitle: { fontSize: 15, fontWeight: '600', color: palette.text, marginBottom: 4 },
    submissionCourse: { fontSize: 12, color: palette.muted, marginBottom: 8 },
    submissionInfo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    infoText: { fontSize: 12, color: palette.muted },
    gradeRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
    gradeScore: { fontSize: 16, fontWeight: 'bold', color: palette.primary },
    emptyText: { color: palette.muted, textAlign: 'center', marginTop: 40 },
  });

  if (loading) return <Spinner fullScreen />;

  const renderSubmission = ({ item }: { item: Submission }) => (
    <Card style={styles.submissionCard}>
      <Badge label={item.status.toUpperCase()} />
      <Text style={styles.submissionTitle}>{item.assignment.title}</Text>
      <Text style={styles.submissionCourse}>{item.assignment.course.title}</Text>
      <View style={styles.submissionInfo}>
        <Text style={styles.infoText}>
          Due: {new Date(item.assignment.due_date).toLocaleDateString()}
        </Text>
        <Text style={styles.infoText}>{item.assignment.max_points} pts</Text>
      </View>
      {item.grade && (
        <View style={styles.gradeRow}>
          <Text style={styles.gradeScore}>{item.grade.score}</Text>
          <Badge label={item.grade.grade_letter} variant="success" />
        </View>
      )}
    </Card>
  );

  return (
    <>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Assignments</Text>
      </View>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentPadding} showsVerticalScrollIndicator={false}>
        {submissions.length > 0 ? (
          <FlatList
            data={submissions}
            renderItem={renderSubmission}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
          />
        ) : (
          <Text style={styles.emptyText}>No submissions yet</Text>
        )}
      </ScrollView>
    </>
  );
}