import React from 'react';
import { TextInput, View, Text, StyleSheet, ViewStyle } from 'react-native';
import { getPalette } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface InputProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  label?: string;
  error?: string;
  multiline?: boolean;
  numberOfLines?: number;
  style?: ViewStyle;
}

export const Input = ({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  label,
  error,
  multiline = false,
  numberOfLines = 1,
  style,
}: InputProps) => {
  const colorScheme = useColorScheme();
  const palette = getPalette(colorScheme ?? 'light');

  const styles = StyleSheet.create({
    container: {
      marginVertical: 8,
    },
    label: {
      color: palette.text,
      fontWeight: '600',
      marginBottom: 6,
      fontSize: 14,
    },
    input: {
      borderWidth: 1,
      borderColor: error ? '#ef4444' : palette.outline,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 10,
      fontSize: 14,
      color: palette.text,
      backgroundColor: palette.card,
    },
    errorText: {
      color: '#ef4444',
      fontSize: 12,
      marginTop: 4,
    },
  });

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          multiline && { minHeight: numberOfLines * 40, textAlignVertical: 'top' },
        ]}
        placeholder={placeholder}
        placeholderTextColor={palette.muted}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={numberOfLines}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};