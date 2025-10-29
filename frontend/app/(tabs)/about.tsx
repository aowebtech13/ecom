import { ScrollView, StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { getPalette } from '@/constants/theme';

export default function AboutScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = getPalette(colorScheme);

  return (
    <ScrollView style={{ backgroundColor: palette.surface }}>
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={[styles.title, { color: palette.primary }]}>
          About Lecture Hub
        </ThemedText>

        <View style={[styles.section, { backgroundColor: palette.card }]}>
          <ThemedText type="subtitle" style={[styles.sectionTitle, { color: palette.primary }]}>
            Our Mission
          </ThemedText>
          <ThemedText style={{ color: palette.text }}>
            Lecture Hub is designed to streamline communication and coordination between teachers and families. We provide a simple, secure platform where educators can share lectures and parents can stay involved in their children's learning journey.
          </ThemedText>
        </View>

        <View style={[styles.section, { backgroundColor: palette.card }]}>
          <ThemedText type="subtitle" style={[styles.sectionTitle, { color: palette.primary }]}>
            Key Features
          </ThemedText>
          <ThemedText style={{ color: palette.text, marginBottom: 8 }}>
            • <ThemedText type="defaultSemiBold">Lecture Management</ThemedText> - Teachers can easily create and manage lectures
          </ThemedText>
          <ThemedText style={{ color: palette.text, marginBottom: 8 }}>
            • <ThemedText type="defaultSemiBold">Smart Invitations</ThemedText> - Send secure invites to parents
          </ThemedText>
          <ThemedText style={{ color: palette.text, marginBottom: 8 }}>
            • <ThemedText type="defaultSemiBold">Child Enrollment</ThemedText> - Parents can register their children for lectures
          </ThemedText>
          <ThemedText style={{ color: palette.text }}>
            • <ThemedText type="defaultSemiBold">Secure Access</ThemedText> - JWT-based authentication ensures data security
          </ThemedText>
        </View>

        <View style={[styles.section, { backgroundColor: palette.card }]}>
          <ThemedText type="subtitle" style={[styles.sectionTitle, { color: palette.primary }]}>
            Getting Started
          </ThemedText>
          <ThemedText style={{ color: palette.text, marginBottom: 8 }}>
            <ThemedText type="defaultSemiBold">For Administrators:</ThemedText> Sign in with your admin credentials to create lectures and manage invitations.
          </ThemedText>
          <ThemedText style={{ color: palette.text }}>
            <ThemedText type="defaultSemiBold">For Parents:</ThemedText> Register or accept an invite to access lectures and enroll your children.
          </ThemedText>
        </View>

        <View style={[styles.footer, { backgroundColor: palette.card, borderTopColor: palette.outline }]}>
          <ThemedText style={{ color: palette.muted, textAlign: 'center' }}>
            © 2025 Lecture Hub. All rights reserved.
          </ThemedText>
        </View>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  title: {
    textAlign: 'center',
    marginVertical: 16,
    fontSize: 28,
  },
  section: {
    padding: 16,
    borderRadius: 12,
    gap: 8,
    marginVertical: 8,
  },
  sectionTitle: {
    marginBottom: 8,
    fontSize: 18,
  },
  footer: {
    padding: 16,
    marginTop: 24,
    borderTopWidth: 1,
  },
});