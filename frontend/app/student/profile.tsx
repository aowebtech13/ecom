import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { getPalette } from '@/constants/theme';
import { useAuthStore } from '@/store/useAuthStore';
import { api } from '@/services/api';

interface Stats {
  total_submitted: number;
  graded: number;
  pending_grade: number;
  late_submissions: number;
  average_grade: number;
}

export default function ProfileScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const palette = getPalette(colorScheme ?? 'light');
  const { user, logout } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await api.get('/v1/student/assignment-stats');
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
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
    contentPadding: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 40 },
    profileCard: { marginBottom: 20, padding: 20, alignItems: 'center' },
    avatar: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: palette.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12,
    },
    avatarText: { color: '#fff', fontSize: 32, fontWeight: 'bold' },
    name: { fontSize: 20, fontWeight: 'bold', color: palette.text, marginBottom: 4 },
    email: { fontSize: 14, color: palette.muted, marginBottom: 8 },
    statCard: { marginBottom: 12, padding: 16 },
    statRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    statLabel: { fontSize: 14, color: palette.text, fontWeight: '600' },
    statValue: { fontSize: 16, fontWeight: 'bold', color: palette.primary },
    logoutBtn: { marginTop: 20 },
  });

  if (loading) return <Spinner fullScreen />;

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>My Profile</Text>
      </View>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentPadding} showsVerticalScrollIndicator={false}>
        <Card style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.name}>{user?.name}</Text>
          <Text style={styles.email}>{user?.email}</Text>
          <Badge label="Student" variant="info" />
        </Card>

        {stats && (
          <>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: palette.text, marginBottom: 12 }}>
              Assignment Stats
            </Text>
            <Card style={styles.statCard}>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Total Submitted</Text>
                <Text style={styles.statValue}>{stats.total_submitted}</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Graded</Text>
                <Text style={styles.statValue}>{stats.graded}</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Pending Grade</Text>
                <Text style={styles.statValue}>{stats.pending_grade}</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Late Submissions</Text>
                <Text style={styles.statValue}>{stats.late_submissions}</Text>
              </View>
              <View style={[styles.statRow, { paddingTopWidth: 1, borderTopColor: palette.outline, paddingTop: 12, marginTop: 12 }]}>
                <Text style={styles.statLabel}>Average Grade</Text>
                <Text style={styles.statValue}>
                  {stats.average_grade ? stats.average_grade.toFixed(1) : 'N/A'}
                </Text>
              </View>
            </Card>
          </>
        )}

        <Button
          onPress={handleLogout}
          variant="danger"
          children="Logout"
        />
      </ScrollView>
    </>
  );
}