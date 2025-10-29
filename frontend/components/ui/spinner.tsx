import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { getPalette } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface SpinnerProps {
  size?: 'small' | 'large';
  fullScreen?: boolean;
}

export const Spinner = ({ size = 'large', fullScreen = false }: SpinnerProps) => {
  const colorScheme = useColorScheme();
  const palette = getPalette(colorScheme ?? 'light');

  const styles = StyleSheet.create({
    container: {
      flex: fullScreen ? 1 : 0,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
  });

  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={palette.primary} />
    </View>
  );
};