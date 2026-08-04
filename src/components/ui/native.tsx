import {
  Text as NativeText,
  TextInput as NativeTextInput,
  TextInputProps,
  TextProps,
} from 'react-native';

export {
  ActivityIndicator,
  Animated,
  Modal,
  Pressable,
  ScrollView,
  Switch,
  useWindowDimensions,
  View,
} from 'react-native';
export type { TextInputProps } from 'react-native';

export const appFontFamily = 'Clancy';

export function Text({ style, ...props }: TextProps & { className?: string }) {
  return <NativeText {...props} style={[style, { fontFamily: appFontFamily }]} />;
}

export function TextInput({ style, ...props }: TextInputProps & { className?: string }) {
  return <NativeTextInput {...props} style={[style, { fontFamily: appFontFamily }]} />;
}
