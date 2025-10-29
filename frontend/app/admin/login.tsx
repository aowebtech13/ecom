import { useState } from 'react';
import { ScrollView, StyleSheet, View, Pressable, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { getPalette } from '@/constants/theme';
import { useAuthStore } from '@/store/useAuthStore';
import { api } from '@/services/api';

export default function AdminLoginScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = getPalette(colorScheme);
  const router = useRouter();
  const { setAuth } = useAuthStore();

  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/v1/auth/admin/login', { email, password });
      const { token, user } = response.data;

      setAuth({
        token,
        user,
        role: 'admin',
      });

      router.replace('/admin/dashboard');
    } catch (error: any) {
      Alert.alert('Login Failed', error.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={{ backgroundColor: palette.surface }}>
      <View style={[styles.container, { backgroundColor: palette.surface }]}>
        <View style={[styles.card, { backgroundColor: palette.card }]}>
          <ThemedText type="title" style={[styles.title, { color: palette.primary }]}>
            Admin Login
          </ThemedText>

          <ThemedText style={[styles.label, { color: palette.text }]}>Email</ThemedText>
          <TextInput
            style={[styles.input, { backgroundColor: palette.background, color: palette.text, borderColor: palette.outline }]}
            placeholder="admin@example.com"
            placeholderTextColor={palette.muted}
            value={email}
            onChangeText={setEmail}
            editable={!loading}
          />

          <ThemedText style={[styles.label, { color: palette.text }]}>Password</ThemedText>
          <TextInput
            style={[styles.input, { backgroundColor: palette.background, color: palette.text, borderColor: palette.outline }]}
            placeholder="admin123"
            placeholderTextColor={palette.muted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!loading}
          />

          <Pressable
            style={[styles.button, { backgroundColor: palette.primary, opacity: loading ? 0.6 : 1 }]}
            onPress={handleLogin}
            disabled={loading}
          >
            <ThemedText style={styles.buttonText}>
              {loading ? 'Logging in...' : 'Login'}
            </ThemedText>
          </Pressable>

          <View style={styles.demoContainer}>
            <ThemedText style={[styles.demoText, { color: palette.muted }]}>Demo Credentials:</ThemedText>
            <ThemedText style={[styles.demoText, { color: palette.text }]}>📧 admin@example.com</ThemedText>
            <ThemedText style={[styles.demoText, { color: palette.text }]}>🔑 admin123</ThemedText>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    minHeight: '100%',
  },
  card: {
    padding: 24,
    borderRadius: 12,
    gap: 16,
    marginVertical: 32,
  },
  title: {
    textAlign: 'center',
    fontSize: 24,
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  button: {
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  demoContainer: {
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    gap: 4,
  },
  demoText: {
    fontSize: 12,
  },
});