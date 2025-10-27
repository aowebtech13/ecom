import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { useAuthStore } from '@/store/useAuthStore';

export default function RoleSelectScreen() {
  const router = useRouter();
  const { role, user } = useAuthStore();

  useEffect(() => {
    if (role === 'admin') {
      router.replace('/admin/dashboard');
    } else if (role === 'parent') {
      router.replace('/parent/dashboard');
    }
  }, [role, router, user]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lecture Hub</Text>
      <Text style={styles.subtitle}>Choose how you want to continue</Text>
      <Pressable style={styles.button} onPress={() => router.push('/admin/login')}>
        <Text style={styles.buttonText}>Admin</Text>
      </Pressable>
      <Pressable style={styles.button} onPress={() => router.push('/parent/login')}>
        <Text style={styles.buttonText}>Parent</Text>
      </Pressable>
      <Pressable style={styles.linkButton} onPress={() => router.push('/parent/register')}>
        <Text style={styles.linkText}>Parents without an invite? Sign up</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 32,
    textAlign: 'center',
  },
  button: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#2563eb',
    marginBottom: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  linkButton: {
    marginTop: 24,
  },
  linkText: {
    color: '#2563eb',
    fontSize: 16,
  },
});
