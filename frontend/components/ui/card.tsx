import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { getPalette } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  elevated?: boolean;
}

export const Card = ({ children, style, onPress, elevated = true }: CardProps) => {
  const colorScheme = useColorScheme();
  const palette = getPalette(colorScheme ?? 'light');

  const styles = StyleSheet.create({
    card: {
      backgroundColor: palette.card,
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: palette.outline,
      shadowColor: elevated ? '#000' : 'transparent',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: elevated ? 0.1 : 0,
      shadowRadius: 3,
      elevation: elevated ? 3 : 0,
    },
  });

  return (
    <View style={[styles.card, style]} onTouchEnd={onPress}>
      {children}
    </View>
  );
};