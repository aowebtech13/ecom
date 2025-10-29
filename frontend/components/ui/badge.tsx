import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getPalette } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface BadgeProps {
  label: string;
  variant?: 'default' | 'success' | 'danger' | 'warning' | 'info';
}

export const Badge = ({ label, variant = 'default' }: BadgeProps) => {
  const colorScheme = useColorScheme();
  const palette = getPalette(colorScheme ?? 'light');

  const getColors = () => {
    switch (variant) {
      case 'success':
        return { bg: '#10b981', text: '#fff' };
      case 'danger':
        return { bg: '#ef4444', text: '#fff' };
      case 'warning':
        return { bg: '#f59e0b', text: '#fff' };
      case 'info':
        return { bg: palette.primary, text: '#fff' };
      default:
        return { bg: palette.muted, text: palette.text };
    }
  };

  const colors = getColors();

  const styles = StyleSheet.create({
    badge: {
      backgroundColor: colors.bg,
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 20,
      alignSelf: 'flex-start',
    },
    text: {
      color: colors.text,
      fontSize: 12,
      fontWeight: '600',
    },
  });

  return (
    <View style={styles.badge}>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
};