import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ReactNode, RefObject, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Modal,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TextInputProps,
  useWindowDimensions,
  View,
} from '@/components/ui/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, layout } from '@/theme/tokens';
import { CourseStatus } from '@/types/plan';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

type AppScreenProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  action?: ReactNode;
  back?: boolean;
  scroll?: boolean;
  showProfile?: boolean;
  contentClassName?: string;
  scrollViewRef?: RefObject<ScrollView | null>;
};

export function AppScreen({
  title,
  subtitle,
  children,
  action,
  back = false,
  scroll = true,
  showProfile = !back,
  contentClassName = '',
  scrollViewRef,
}: AppScreenProps) {
  const header = (
    <View className="border-b border-border bg-surface">
      <View className="mx-auto w-full max-w-content flex-row items-center gap-3 px-4 py-3 md:px-6 lg:px-8">
        {back ? (
          <IconButton
            accessibilityLabel="Go back"
            icon="chevron-back"
            onPress={() => router.back()}
          />
        ) : (
          <View className="h-11 w-2 rounded-full bg-brand" />
        )}

        <View className="min-w-0 flex-1">
          <Text className="text-2xl font-extrabold tracking-tight text-ink md:text-3xl">
            {title}
          </Text>
          {subtitle ? (
            <Text className="mt-0.5 text-sm text-muted" numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>

        {action}

        {showProfile ? (
          <Pressable
            accessibilityLabel="Open profile"
            accessibilityRole="button"
            onPress={() => router.push('/profile')}
            className="h-11 w-11 items-center justify-center rounded-full border border-border bg-brand active:opacity-70 focus-visible:ring-2 focus-visible:ring-link">
            <Text className="text-sm font-extrabold text-ink">PS</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );

  const bodyClassName = `mx-auto w-full max-w-content px-4 py-6 md:px-6 md:py-8 lg:px-8 ${contentClassName}`;

  return (
    <SafeAreaView className="flex-1 bg-canvas" edges={['top', 'left', 'right']}>
      {header}
      {scroll ? (
        <ScrollView
          ref={scrollViewRef}
          className="flex-1"
          contentContainerClassName={`${bodyClassName} grow pb-10`}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {children}
        </ScrollView>
      ) : (
        <View className={`${bodyClassName} flex-1`}>{children}</View>
      )}
    </SafeAreaView>
  );
}

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'ai';
type ButtonSize = 'sm' | 'md';

const buttonClasses: Record<ButtonVariant, string> = {
  primary: 'border-brand bg-brand',
  secondary: 'border-border bg-surface',
  ghost: 'border-transparent bg-transparent',
  danger: 'border-danger bg-danger',
  ai: 'border-ai bg-ai',
};

const buttonTextClasses: Record<ButtonVariant, string> = {
  primary: 'text-ink',
  secondary: 'text-ink',
  ghost: 'text-link',
  danger: 'text-white',
  ai: 'text-white',
};

const buttonIconColors: Record<ButtonVariant, string> = {
  primary: colors.ink,
  secondary: colors.ink,
  ghost: colors.link,
  danger: colors.white,
  ai: colors.white,
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  disabled = false,
  fullWidth = false,
  accessibilityLabel,
}: {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: IconName;
  disabled?: boolean;
  fullWidth?: boolean;
  accessibilityLabel?: string;
}) {
  return (
    <Pressable
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      className={`flex-row items-center justify-center gap-2 rounded-xl border px-4 ${
        size === 'sm' ? 'min-h-10 py-2' : 'min-h-12 py-3'
      } ${buttonClasses[variant]} ${fullWidth ? 'w-full' : ''} ${
        disabled ? 'opacity-40' : 'active:opacity-70'
      } focus-visible:ring-2 focus-visible:ring-link`}>
      {icon ? <Ionicons name={icon} size={18} color={buttonIconColors[variant]} /> : null}
      <Text
        className={`${size === 'sm' ? 'text-sm' : 'text-base'} font-bold ${
          buttonTextClasses[variant]
        }`}>
        {label}
      </Text>
    </Pressable>
  );
}

export function IconButton({
  icon,
  onPress,
  accessibilityLabel,
  selected = false,
  tone = 'neutral',
}: {
  icon: IconName;
  onPress: () => void;
  accessibilityLabel: string;
  selected?: boolean;
  tone?: 'neutral' | 'brand' | 'danger';
}) {
  const iconColor = tone === 'danger' ? colors.danger : colors.ink;
  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      className={`h-11 w-11 items-center justify-center rounded-xl border ${
        selected || tone === 'brand'
          ? 'border-brand bg-brand'
          : tone === 'danger'
            ? 'border-danger/20 bg-danger-soft'
            : 'border-border bg-surface'
      } active:opacity-70 focus-visible:ring-2 focus-visible:ring-link`}>
      <Ionicons name={icon} size={21} color={iconColor} />
    </Pressable>
  );
}

export function Card({
  children,
  className = '',
  tone = 'surface',
}: {
  children: ReactNode;
  className?: string;
  tone?: 'surface' | 'ink';
}) {
  return (
    <View
      className={`rounded-card border p-4 shadow-sm ${
        tone === 'ink' ? 'border-ink bg-ink' : 'border-border bg-surface'
      } ${className}`}>
      {children}
    </View>
  );
}

export function SectionHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <View className="mb-3 flex-row items-end justify-between gap-4">
      <View className="min-w-0 flex-1">
        <Text className="text-xl font-extrabold text-ink">{title}</Text>
        {description ? <Text className="mt-1 text-sm leading-5 text-muted">{description}</Text> : null}
      </View>
      {action}
    </View>
  );
}

export function SearchField({
  value,
  onChangeText,
  placeholder = 'Search',
  onSubmitEditing,
  accessibilityLabel,
}: Pick<TextInputProps, 'value' | 'onChangeText' | 'onSubmitEditing'> & {
  placeholder?: string;
  accessibilityLabel?: string;
}) {
  return (
    <View className="min-h-12 flex-row items-center gap-3 rounded-xl border border-border bg-surface px-4 focus-within:border-link">
      <Ionicons name="search" size={20} color={colors.muted} />
      <TextInput
        accessibilityLabel={accessibilityLabel ?? placeholder}
        className="min-h-12 flex-1 py-2 text-base text-ink outline-none"
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        returnKeyType="search"
        value={value}
      />
      {value ? (
        <Pressable
          accessibilityLabel="Clear search"
          accessibilityRole="button"
          hitSlop={8}
          onPress={() => onChangeText?.('')}
          className="h-8 w-8 items-center justify-center rounded-full active:bg-surface-muted">
          <Ionicons name="close" size={18} color={colors.muted} />
        </Pressable>
      ) : null}
    </View>
  );
}

export function Chip({
  label,
  selected,
  onPress,
  dotColor,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  dotColor?: string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      className={`min-h-10 flex-row items-center justify-center gap-2 rounded-full border px-4 ${
        selected ? 'border-brand bg-brand-soft' : 'border-border bg-surface'
      } active:opacity-70 focus-visible:ring-2 focus-visible:ring-link`}>
      {dotColor ? (
        <View className="h-2 w-2 rounded-full" style={{ backgroundColor: dotColor }} />
      ) : null}
      <Text className={`text-sm font-semibold ${selected ? 'text-ink' : 'text-muted'}`}>
        {label}
      </Text>
    </Pressable>
  );
}

type BadgeTone = 'neutral' | 'brand' | 'info' | 'success' | 'warning' | 'danger' | 'ai';

const badgeClasses: Record<BadgeTone, string> = {
  neutral: 'bg-surface-muted text-muted',
  brand: 'bg-brand text-ink',
  info: 'bg-info-soft text-info',
  success: 'bg-success-soft text-success',
  warning: 'bg-warning-soft text-warning',
  danger: 'bg-danger-soft text-danger',
  ai: 'bg-ai-soft text-ai',
};

export function Badge({ label, tone = 'neutral' }: { label: string; tone?: BadgeTone }) {
  return (
    <View className={`self-start rounded-full px-2.5 py-1 ${badgeClasses[tone].split(' ')[0]}`}>
      <Text className={`text-xs font-bold ${badgeClasses[tone].split(' ')[1]}`}>{label}</Text>
    </View>
  );
}

const statusConfig: Record<CourseStatus, { label: string; tone: BadgeTone }> = {
  completed: { label: 'Completed', tone: 'success' },
  'in-progress': { label: 'In progress', tone: 'info' },
  planned: { label: 'Planned', tone: 'warning' },
  failed: { label: 'Needs retry', tone: 'danger' },
};

export function StatusBadge({ status }: { status: CourseStatus }) {
  const config = statusConfig[status];
  return <Badge label={config.label} tone={config.tone} />;
}

export function ProgressBar({
  value,
  tone = 'brand',
}: {
  value: number;
  tone?: 'brand' | 'success' | 'info';
}) {
  const clampedValue = Math.min(100, Math.max(0, value));
  const fillClass = tone === 'success' ? 'bg-success' : tone === 'info' ? 'bg-info' : 'bg-brand';
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: clampedValue }}
      className="h-2.5 overflow-hidden rounded-full bg-surface-muted">
      <View className={`h-full rounded-full ${fillClass}`} style={{ width: `${clampedValue}%` }} />
    </View>
  );
}

export function EmptyState({
  icon = 'file-tray-outline',
  title,
  description,
  action,
}: {
  icon?: IconName;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <View className="items-center justify-center rounded-panel border border-dashed border-border bg-surface px-6 py-12">
      <View className="h-14 w-14 items-center justify-center rounded-full bg-brand-soft">
        <Ionicons name={icon} size={26} color={colors.ink} />
      </View>
      <Text className="mt-4 text-center text-lg font-extrabold text-ink">{title}</Text>
      <Text className="mt-2 max-w-md text-center text-sm leading-5 text-muted">{description}</Text>
      {action ? <View className="mt-5">{action}</View> : null}
    </View>
  );
}

export function ModalSheet({
  visible,
  onClose,
  title,
  description,
  children,
  footer,
  presentation = 'dialog',
}: {
  visible: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  presentation?: 'dialog' | 'responsive-drawer';
}) {
  const { width } = useWindowDimensions();
  const desktop = width >= layout.desktopNavigationBreakpoint;
  const drawer = presentation === 'responsive-drawer' && desktop;
  const [slideProgress] = useState(() => new Animated.Value(1));

  useEffect(() => {
    if (!visible || presentation !== 'responsive-drawer') return;
    slideProgress.setValue(1);
    Animated.timing(slideProgress, {
      duration: 240,
      toValue: 0,
      useNativeDriver: true,
    }).start();
  }, [presentation, slideProgress, visible]);

  const slideStyle =
    presentation === 'responsive-drawer'
      ? {
          transform: [
            drawer
              ? {
                  translateX: slideProgress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, Math.min(width, 576)],
                  }),
                }
              : {
                  translateY: slideProgress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 720],
                  }),
                },
          ],
        }
      : undefined;
  const panelStyle = {
    backgroundColor: colors.canvas,
    borderColor: colors.border,
    borderWidth: drawer ? 0 : 1,
    borderLeftWidth: 1,
    borderBottomLeftRadius: drawer || desktop ? 24 : 0,
    borderBottomRightRadius: desktop && !drawer ? 24 : 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: drawer ? 0 : 24,
    height: drawer ? ('100%' as const) : undefined,
    maxWidth: 576,
    overflow: 'hidden' as const,
    width: '100%' as const,
  };

  return (
    <Modal
      animationType={presentation === 'responsive-drawer' ? 'fade' : desktop ? 'fade' : 'slide'}
      onRequestClose={onClose}
      transparent
      visible={visible}>
      <Pressable
        accessibilityLabel="Close dialog"
        className={`flex-1 bg-black/50 ${
          drawer ? 'items-end justify-center' : desktop ? 'items-center justify-center p-4' : 'justify-end p-4'
        }`}
        onPress={onClose}>
        <Animated.View
          className={`w-full max-w-xl overflow-hidden border border-border bg-canvas ${
            drawer ? 'h-full rounded-l-panel border-y-0 border-r-0' : desktop ? 'rounded-panel' : 'rounded-t-panel'
          }`}
          style={[panelStyle, slideStyle]}>
          <Pressable
            accessibilityRole="none"
            className={`${drawer ? 'flex-1' : ''} bg-canvas`}
            onPress={(event) => event.stopPropagation()}>
            <View className="flex-row items-start gap-4 border-b border-border bg-surface px-5 py-4">
              <View className="min-w-0 flex-1">
                <Text className="text-xl font-extrabold text-ink">{title}</Text>
                {description ? (
                  <Text className="mt-1 text-sm leading-5 text-muted">{description}</Text>
                ) : null}
              </View>
              <IconButton accessibilityLabel="Close" icon="close" onPress={onClose} />
            </View>
            <ScrollView
              className={`${drawer ? 'flex-1' : 'max-h-[65vh]'} bg-canvas`}
              contentContainerClassName="gap-4 p-5"
              keyboardShouldPersistTaps="handled">
              {children}
            </ScrollView>
            {footer ? <View className="border-t border-border bg-surface p-4">{footer}</View> : null}
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

export function ChoiceRow({
  label,
  description,
  selected,
  onPress,
}: {
  label: string;
  description?: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      onPress={onPress}
      className={`min-h-14 flex-row items-center gap-3 rounded-xl border p-3 ${
        selected ? 'border-link bg-info-soft' : 'border-border bg-surface'
      } active:opacity-70`}>
      <View
        className={`h-5 w-5 items-center justify-center rounded-full border-2 ${
          selected ? 'border-link' : 'border-border-strong'
        }`}>
        {selected ? <View className="h-2.5 w-2.5 rounded-full bg-link" /> : null}
      </View>
      <View className="min-w-0 flex-1">
        <Text className="text-sm font-bold text-ink">{label}</Text>
        {description ? <Text className="mt-0.5 text-xs leading-4 text-muted">{description}</Text> : null}
      </View>
    </Pressable>
  );
}

export function SwitchRow({
  label,
  description,
  value,
  onValueChange,
}: {
  label: string;
  description?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}) {
  return (
    <View className="min-h-14 flex-row items-center gap-4 rounded-xl border border-border bg-surface p-3">
      <View className="min-w-0 flex-1">
        <Text className="text-sm font-bold text-ink">{label}</Text>
        {description ? <Text className="mt-0.5 text-xs leading-4 text-muted">{description}</Text> : null}
      </View>
      <Switch
        accessibilityLabel={label}
        onValueChange={onValueChange}
        thumbColor={colors.surface}
        trackColor={{ false: colors.borderStrong, true: colors.success }}
        value={value}
      />
    </View>
  );
}

export function InlineNotice({
  icon,
  title,
  description,
  tone = 'info',
  action,
}: {
  icon: IconName;
  title: string;
  description: string;
  tone?: 'info' | 'brand' | 'ai' | 'warning';
  action?: ReactNode;
}) {
  const containerClass =
    tone === 'ai'
      ? 'border-ai/20 bg-ai-soft'
      : tone === 'warning'
        ? 'border-warning/20 bg-warning-soft'
        : tone === 'brand'
          ? 'border-brand-pressed/30 bg-brand-soft'
          : 'border-info/20 bg-info-soft';
  const iconColor =
    tone === 'ai'
      ? colors.ai
      : tone === 'warning'
        ? colors.warning
        : tone === 'brand'
          ? colors.ink
          : colors.info;

  return (
    <View className={`flex-row flex-wrap items-center gap-4 rounded-card border p-4 ${containerClass}`}>
      <View className="h-11 w-11 items-center justify-center rounded-xl bg-surface">
        <Ionicons name={icon} size={22} color={iconColor} />
      </View>
      <View className="min-w-[200px] flex-1">
        <Text className="text-base font-extrabold text-ink">{title}</Text>
        <Text className="mt-1 text-sm leading-5 text-muted">{description}</Text>
      </View>
      {action}
    </View>
  );
}

export function Metric({
  value,
  label,
}: {
  value: string | number;
  label: string;
}) {
  return (
    <View className="min-w-24 flex-1">
      <Text className="text-2xl font-extrabold text-ink">{value}</Text>
      <Text className="mt-1 text-xs font-semibold uppercase tracking-wide text-muted">{label}</Text>
    </View>
  );
}

export function LoadingState({ label = 'Loading' }: { label?: string }) {
  return (
    <View className="flex-row items-center justify-center gap-3 py-12">
      <ActivityIndicator color={colors.ink} />
      <Text className="text-sm font-semibold text-muted">{label}</Text>
    </View>
  );
}
