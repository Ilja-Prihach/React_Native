import * as Haptics from 'expo-haptics';
import { Pressable, type PressableProps } from 'react-native';

type HapticPressableProps = PressableProps & {
  hapticEnabled?: boolean;
};

export default function HapticPressable({
  hapticEnabled = true,
  onPress,
  disabled,
  ...props
}: HapticPressableProps) {
  async function handlePress(event: Parameters<NonNullable<PressableProps['onPress']>>[0]) {
    if (!disabled && hapticEnabled) {
      await Haptics.selectionAsync();
    }

    await onPress?.(event);
  }

  return <Pressable {...props} disabled={disabled} onPress={handlePress} />;
}
