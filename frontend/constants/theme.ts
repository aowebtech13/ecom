/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

export interface Palette {
  primary: string;
  secondary: string;
  surface: string;
  card: string;
  background: string;
  text: string;
  muted: string;
  outline: string;
  primaryMuted: string;
}

export const getPalette = (colorScheme: 'light' | 'dark'): Palette => {
  if (colorScheme === 'dark') {
    return {
      primary: '#0a7ea4',
      secondary: '#06b6d4',
      surface: '#0f172a',
      card: '#1e293b',
      background: '#151718',
      text: '#ECEDEE',
      muted: '#64748b',
      outline: '#334155',
      primaryMuted: '#0369a1',
    };
  }
  return {
    primary: '#0a7ea4',
    secondary: '#06b6d4',
    surface: '#f8fafc',
    card: '#ffffff',
    background: '#fff',
    text: '#11181C',
    muted: '#94a3b8',
    outline: '#e2e8f0',
    primaryMuted: '#7dd3fc',
  };
};
