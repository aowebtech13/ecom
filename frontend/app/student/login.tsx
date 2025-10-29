import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { getPalette } from '@/constants/theme';
import { useAuthStore } from '@/store/useAuthStore';
import { api } from '@/services/api';

export default function StudentLoginScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const palette = getPalette(colorScheme ?? 'light');
  const setAuth = useAuthStore((state) => state.setAuth);

  const [email, setEmail] = useState('alice@example.com');
  const [password, setPassword] = useState('student123');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/v1/auth/student/login', {
        email,
        password,
      });

      if (response.token && response.user) {
        setAuth(response.token, response.user, 'student');
        router.replace('/student/dashboard');
      } else {
        Alert.alert('Error', 'Login failed');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: palette.background,
      paddingHorizontal: 20,
    },
    header: {
      marginBottom: 32,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: palette.text,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: palette.muted,
    },
    card: {
      marginBottom: 24,
    },
    demoBox: {
      backgroundColor: palette.primaryMuted,
      borderRadius: 8,
      padding: 12,
      marginTop: 16,
      borderLeftWidth: 4,
      borderLeftColor: palette.primary,
    },
    demoTitle: {
      color: palette.text,
      fontWeight: '600',
      marginBottom: 8,
    },
    demoText: {
      color: palette.text,
      fontSize: 13,
      marginBottom: 4,
    },
    button: {
      marginTop: 24,
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Student Portal</Text>
          <Text style={styles.subtitle}>Sign in to your account</Text>
        </View>

        <Card style={styles.card}>
          <Input
            label="Email"
            placeholder="your@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <Input
            label="Password"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={{ marginTop: 12 }}
          />

          <Button
            onPress={handleLogin}
            loading={loading}
            style={styles.button}
          >
            Sign In
          </Button>
        </Card>

        <Card style={styles.card}>
          <Text style={styles.demoTitle}>📚 Demo Credentials</Text>
          <View style={styles.demoBox}>
            <Text style={styles.demoText}>
              <Text style={{ fontWeight: 'bold' }}>Student 1:</Text>
              {'\n'}Email: alice@example.com
              {'\n'}Password: student123
            </Text>
            <Text style={[styles.demoText, { marginTop: 12 }]}>
              <Text style={{ fontWeight: 'bold' }}>Student 2:</Text>
              {'\n'}Email: bob@example.com
              {'\n'}Password: student123
            </Text>
          </View>
        </Card>
      </ScrollView>
    </View>
  );
}