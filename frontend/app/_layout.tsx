import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="admin/login" />
          <Stack.Screen name="admin/register" />
          <Stack.Screen name="admin/dashboard" />
          <Stack.Screen name="admin/lecture" />
          <Stack.Screen name="parent/login" />
          <Stack.Screen name="parent/register" />
          <Stack.Screen name="parent/dashboard" />
          <Stack.Screen name="parent/lecture" />
          <Stack.Screen name="student/login" />
          <Stack.Screen name="student/dashboard" />
          <Stack.Screen name="student/courses" />
          <Stack.Screen name="student/course-detail" />
          <Stack.Screen name="student/assignments" />
          <Stack.Screen name="student/profile" />
          <Stack.Screen name="invite/[token]" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
