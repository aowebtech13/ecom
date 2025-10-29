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
  created_at: string;
}

export default function AdminDashboardScreen() {
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
      const response = await api.get('/v1/lectures', {
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
            <ThemedText style={{ color: palette.muted }}>Admin Dashboard</ThemedText>
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
            <ThemedText style={{ color: palette.muted }}>Lectures</ThemedText>
          </View>
          <View style={[styles.statCard, { backgroundColor: palette.card }]}>
            <ThemedText type="defaultSemiBold" style={{ color: '#10B981', fontSize: 24 }}>
              1
            </ThemedText>
            <ThemedText style={{ color: palette.muted }}>Pending</ThemedText>
          </View>
        </View>

        {/* Create Lecture Button */}
        <Pressable
          style={[styles.createButton, { backgroundColor: palette.primary }]}
          onPress={() => router.push('/admin/create-lecture')}
        >
          <Feather name="plus" size={20} color="#fff" />
          <ThemedText style={styles.createButtonText}>Create New Lecture</ThemedText>
        </Pressable>

        {/* Lectures List */}
        <View>
          <ThemedText type="subtitle" style={[styles.sectionTitle, { color: palette.primary }]}>
            Your Lectures
          </ThemedText>

          {loading ? (
            <ThemedText style={{ color: palette.muted, textAlign: 'center', marginVertical: 24 }}>
              Loading lectures...
            </ThemedText>
          ) : lectures.length === 0 ? (
            <View style={[styles.emptyState, { backgroundColor: palette.card }]}>
              <Feather name="inbox" size={48} color={palette.muted} />
              <ThemedText style={{ color: palette.muted, textAlign: 'center' }}>
                No lectures yet. Create your first lecture!
              </ThemedText>
            </View>
          ) : (
            lectures.map((lecture) => (
              <Pressable
                key={lecture.id}
                style={[styles.lectureCard, { backgroundColor: palette.card, borderColor: palette.outline }]}
                onPress={() => router.push(`/admin/lecture/${lecture.id}`)}
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
                <ThemedText style={{ color: palette.muted, fontSize: 12, marginTop: 8 }}>
                  {new Date(lecture.created_at).toLocaleDateString()}
                </ThemedText>
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
  createButton: {
    flexDirection: 'row',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
});