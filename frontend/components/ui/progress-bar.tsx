import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getPalette } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface ProgressBarProps {
  progress: number; // 0-100
  label?: string;
  showPercentage?: boolean;
}

export const ProgressBar = ({
  progress,
  label,
  showPercentage = true,
}: ProgressBarProps) => {
  const colorScheme = useColorScheme();
  const palette = getPalette(colorScheme ?? 'light');

  const styles = StyleSheet.create({
    container: {
      marginVertical: 8,
    },
    labelContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 6,
    },
    label: {
      color: palette.text,
      fontWeight: '600',
      fontSize: 14,
    },
    percentage: {
      color: palette.muted,
      fontSize: 12,
    },
    barBackground: {
      backgroundColor: palette.outline,
      borderRadius: 8,
      height: 8,
      overflow: 'hidden',
    },
    barFill: {
      backgroundColor: palette.primary,
      height: '100%',
      borderRadius: 8,
    },
  });

  const clampedProgress = Math.max(0, Math.min(100, progress));

  return (
    <View style={styles.container}>
      {(label || showPercentage) && (
        <View style={styles.labelContainer}>
          {label && <Text style={styles.label}>{label}</Text>}
          {showPercentage && <Text style={styles.percentage}>{Math.round(clampedProgress)}%</Text>}
        </View>
      )}
      <View style={styles.barBackground}>
        <View
          style={[
            styles.barFill,
            { width: `${clampedProgress}%` },
          ]}
        />
      </View>
    </View>
  );
};