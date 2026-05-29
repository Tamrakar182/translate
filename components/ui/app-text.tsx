import type { TextProps } from 'react-native';
import { Text } from 'react-native';

import { colors } from '@/constants/colors';

export type AppTextProps = TextProps & {
  tone?: 'primary' | 'muted' | 'subtle' | 'faint' | 'accent';
};

const toneColor = {
  primary: colors.text,
  muted: colors.textMuted,
  subtle: colors.textSubtle,
  faint: colors.textFaint,
  accent: colors.accent,
};

export function AppText({
  style,
  tone = 'primary',
  ...props
}: AppTextProps) {
  return <Text style={[{ color: toneColor[tone] }, style]} {...props} />;
}
