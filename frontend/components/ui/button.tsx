import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { getPalette } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface ButtonProps {
  onPress: () => void;
  children: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  loading?: boolean;
  disabled?: boolean;
}

export const Button = ({
  onPress,
  children,
  variant = 'primary',
  loading = false,
  disabled = false,
}: ButtonProps) => {
  const colorScheme = useColorScheme();
  const palette = getPalette(colorScheme ?? 'light');

  const getButtonStyle = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: palette.primary,
          borderWidth: 0,
        };
      case 'secondary':
        return {
          backgroundColor: palette.secondary,
          borderWidth: 0,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: palette.primary,
        };
      case 'danger':
        return {
          backgroundColor: '#ef4444',
          borderWidth: 0,
        };
      default:
        return {
          backgroundColor: palette.primary,
          borderWidth: 0,
        };
    }
  };

  const getTextColor = () => {
    if (variant === 'outline') return palette.primary;
    return '#fff';
  };

  const styles = StyleSheet.create({
    button: {
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      opacity: disabled ? 0.5 : 1,
      ...getButtonStyle(),
    },
    text: {
      color: getTextColor(),
      fontWeight: '600',
      fontSize: 16,
    },
  });

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      disabled={loading || disabled}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <Text style={styles.text}>{children}</Text>
      )}
    </TouchableOpacity>
  );
};