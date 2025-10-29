import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { getPalette } from '@/constants/theme';
import { useAuthStore } from '@/store/useAuthStore';
import { api } from '@/services/api';

interface Lecture {
  id: number;
  title: string;
  description: string;
  admin_name?: string;
}

export default function ParentDashboardScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = getPalette(colorScheme);
  const router = useRouter();
  const { user, token, clearAuth } = useAuthStore();
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLectures();
  }, []);

  const fetchLectures = async () => {
    try {
      setLoading(true);
      const response = await api.get('/v1/lectures/invited', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLectures(response.data.data || []);
    } catch (error) {
      console.error('Error fetching lectures:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure?', [
      { text: 'Cancel', onPress: () => {} },
      {
        text: 'Logout',
        onPress: () => {
          clearAuth();
          router.replace('/');
        },
      },
    ]);
  };

  return (
    <ScrollView style={{ backgroundColor: palette.surface }}>
      <ThemedView style={[styles.container, { backgroundColor: palette.surface }]}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: palette.card, borderBottomColor: palette.outline }]}>
          <View>
            <ThemedText type="title" style={{ color: palette.primary }}>
              Welcome, {user?.name}
            </ThemedText>
            <ThemedText style={{ color: palette.muted }}>Parent Dashboard</ThemedText>
          </View>
          <Pressable onPress={handleLogout} style={[styles.logoutButton, { backgroundColor: palette.primary }]}>
            <Feather name="log-out" size={20} color="#fff" />
          </Pressable>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: palette.card }]}>
            <ThemedText type="defaultSemiBold" style={{ color: palette.primary, fontSize: 24 }}>
              {lectures.length}
            </ThemedText>
            <ThemedText style={{ color: palette.muted }}>Invited</ThemedText>
          </View>
          <View style={[styles.statCard, { backgroundColor: palette.card }]}>
            <ThemedText type="defaultSemiBold" style={{ color: '#10B981', fontSize: 24 }}>
              0
            </ThemedText>
            <ThemedText style={{ color: palette.muted }}>Enrolled</ThemedText>
          </View>
        </View>

        {/* Invited Lectures */}
        <View>
          <ThemedText type="subtitle" style={[styles.sectionTitle, { color: palette.primary }]}>
            Invited Lectures
          </ThemedText>

          {loading ? (
            <ThemedText style={{ color: palette.muted, textAlign: 'center', marginVertical: 24 }}>
              Loading lectures...
            </ThemedText>
          ) : lectures.length === 0 ? (
            <View style={[styles.emptyState, { backgroundColor: palette.card }]}>
              <Feather name="mail" size={48} color={palette.muted} />
              <ThemedText style={{ color: palette.muted, textAlign: 'center' }}>
                No invitations yet. Check back soon!
              </ThemedText>
            </View>
          ) : (
            lectures.map((lecture) => (
              <Pressable
                key={lecture.id}
                style={[styles.lectureCard, { backgroundColor: palette.card, borderColor: palette.outline }]}
                onPress={() => router.push(`/parent/lecture/${lecture.id}`)}
              >
                <View style={styles.lectureHeader}>
                  <ThemedText type="defaultSemiBold" style={{ color: palette.text }}>
                    {lecture.title}
                  </ThemedText>
                  <Feather name="chevron-right" size={20} color={palette.muted} />
                </View>
                <ThemedText
                  numberOfLines={2}
                  style={{ color: palette.muted, marginTop: 4 }}
                >
                  {lecture.description}
                </ThemedText>
                <View style={styles.lectureFooter}>
                  <ThemedText style={{ color: palette.primary, fontSize: 12 }}>
                    👨‍🏫 {lecture.admin_name || 'Admin'}
                  </ThemedText>
                  <Pressable
                    style={[styles.enrollButton, { backgroundColor: palette.primary }]}
                    onPress={() => Alert.alert('Success', 'Your child has been enrolled!')}
                  >
                    <ThemedText style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>Enroll Child</ThemedText>
                  </Pressable>
                </View>
              </Pressable>
            ))
          )}
        </View>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderBottomWidth: 1,
    marginBottom: 16,
  },
  logoutButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 4,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 12,
  },
  emptyState: {
    padding: 32,
    borderRadius: 12,
    alignItems: 'center',
    gap: 12,
  },
  lectureCard: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
  },
  lectureHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lectureFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  enrollButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
});