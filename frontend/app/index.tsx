import { useEffect, useMemo, type ComponentProps } from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuthStore } from '@/store/useAuthStore';

type ActionVariant = 'solid' | 'outline';

type ActionDefinition = {
  key: string;
  title: string;
  description: string;
  icon: ComponentProps<typeof Feather>['name'];
  variant: ActionVariant;
  onPress: () => void;
};

export default function RoleSelectScreen() {
  const router = useRouter();
  const { role, user } = useAuthStore();
  const colorScheme = useColorScheme();

  useEffect(() => {
    if (role === 'admin') {
      router.replace('/admin/dashboard');
    } else if (role === 'parent') {
      router.replace('/parent/dashboard');
    } else if (role === 'student') {
      router.replace('/student/dashboard');
    }
  }, [role, router, user]);

  const palette = useMemo(
    () => ({
      primary: colorScheme === 'dark' ? '#6366f1' : '#2563eb',
      primaryMuted: colorScheme === 'dark' ? '#4338ca' : '#1d4ed8',
      surface: colorScheme === 'dark' ? '#0b1120' : '#f8fafc',
      card: colorScheme === 'dark' ? '#111827' : '#ffffff',
      outline: colorScheme === 'dark' ? 'rgba(99, 102, 241, 0.4)' : 'rgba(37, 99, 235, 0.2)',
      muted: colorScheme === 'dark' ? '#94a3b8' : '#475569',
    }),
    [colorScheme],
  );

  const actions: ActionDefinition[] = [
    {
      key: 'student',
      title: 'Student',
      description: 'Explore courses, track progress, and submit assignments.',
      icon: 'book',
      variant: 'solid',
      onPress: () => router.push('/student/login'),
    },
    {
      key: 'admin',
      title: 'Administrator',
      description: 'Manage classrooms, invites, and progress insights.',
      icon: 'shield',
      variant: 'outline',
      onPress: () => router.push('/admin/login'),
    },
    {
      key: 'parent',
      title: 'Parent',
      description: 'Review schedules and stay close to your learner.',
      icon: 'users',
      variant: 'outline',
      onPress: () => router.push('/parent/login'),
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: palette.surface }]}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          contentContainerStyle={styles.content} 
          showsVerticalScrollIndicator={false}
          scrollEnabled={true}
          pointerEvents="auto"
        >
          <View
            style={[
              styles.hero,
              { backgroundColor: palette.card, borderColor: palette.outline, shadowColor: palette.primaryMuted },
            ]}>
            <View style={styles.heroTextGroup}>
              <ThemedText type="title" style={[styles.heroTitle, { color: palette.primary }]}>
                Lecture Hub
              </ThemedText>
              <ThemedText style={[styles.heroSubtitle, { color: palette.muted }]}>
                Your streamlined space to coordinate teachers and families.
              </ThemedText>
            </View>
            <View style={styles.heroArtwork} />
          </View>

          <View style={[styles.card, { backgroundColor: palette.card, shadowColor: palette.primaryMuted }]}>
            <ThemedText type="subtitle" style={styles.cardTitle}>
              Continue as
            </ThemedText>
            <View style={styles.cardDescriptionRow}>
              <ThemedText style={[styles.cardDescription, { color: palette.muted }]}>
                Choose the path that matches how you collaborate with Lecture Hub.
              </ThemedText>
            </View>

            <View style={styles.actions}>
              {actions.map((action) => (
                <Pressable
                  key={action.key}
                  onPress={action.onPress}
                  accessibilityRole="button"
                  accessible={true}
                  pointerEvents="auto"
                  style={({ pressed }) => [
                    styles.actionButton,
                    action.variant === 'solid'
                      ? {
                          backgroundColor: palette.primary,
                          shadowColor: palette.primaryMuted,
                          opacity: pressed ? 0.9 : 1,
                        }
                      : {
                          backgroundColor: palette.card,
                          borderColor: palette.primary,
                          borderWidth: 1,
                          shadowOpacity: 0.04,
                          shadowRadius: 10,
                          elevation: 0,
                          opacity: pressed ? 0.9 : 1,
                        },
                  ]}>
                  <View
                    pointerEvents="none"
                    style={[
                      styles.iconBadge,
                      {
                        backgroundColor:
                          action.variant === 'solid' ? 'rgba(255,255,255,0.15)' : palette.primary,
                      },
                    ]}>
                    <Feather name={action.icon} size={20} color="#ffffff" />
                  </View>
                  <View pointerEvents="none" style={styles.actionCopy}>
                    <Text
                      style={[
                        styles.actionTitle,
                        action.variant === 'solid' ? styles.actionTitleOnDark : { color: palette.primary },
                      ]}>
                      {action.title}
                    </Text>
                    <Text
                      style={[
                        styles.actionDescription,
                        action.variant === 'solid'
                          ? styles.actionDescriptionOnDark
                          : { color: palette.muted },
                      ]}>
                      {action.description}
                    </Text>
                  </View>
                  <Feather
                    pointerEvents="none"
                    name="arrow-right"
                    size={20}
                    color={action.variant === 'solid' ? '#ffffff' : palette.primary}
                  />
                </Pressable>
              ))}
            </View>

            <Pressable
              onPress={() => router.push('/parent/register')}
              pointerEvents="auto"
              style={({ pressed }) => [styles.registerLink, { opacity: pressed ? 0.8 : 1 }]}>
              <Feather name="mail" size={18} color={palette.primary} />
              <Text style={[styles.registerText, { color: palette.primary }]}>
                Parents without an invite? Request access
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
    gap: 24,
  },
  hero: {
    borderRadius: 28,
    padding: 28,
    borderWidth: 1,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.12,
    shadowRadius: 36,
    elevation: 6,
  },
  heroTextGroup: {
    gap: 12,
    maxWidth: 280,
  },
  heroTitle: {
    letterSpacing: 0.5,
  },
  heroSubtitle: {
    fontSize: 16,
    lineHeight: 24,
  },
  heroArtwork: {
    position: 'absolute',
    right: -8,
    bottom: -20,
    width: 200,
    height: 200,
    opacity: 0.25,
  },
  card: {
    borderRadius: 24,
    padding: 24,
    gap: 24,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 24,
  },
  cardDescriptionRow: {
    flexDirection: 'row',
  },
  cardDescription: {
    fontSize: 15,
    lineHeight: 22,
  },
  actions: {
    gap: 16,
  },
  actionButton: {
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 3,
  },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionCopy: {
    flex: 1,
    gap: 4,
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  actionTitleOnDark: {
    color: '#ffffff',
  },
  actionDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  actionDescriptionOnDark: {
    color: 'rgba(255,255,255,0.8)',
  },
  registerLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  registerText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
