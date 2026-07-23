import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Pressable, Text, View } from 'react-native';

import { colors } from '@/theme/tokens';
import { SocietyEvent } from '@/types/society';

export function SocietyEventCard({
  event,
  societyName,
  onPress,
}: {
  event: SocietyEvent;
  societyName: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityLabel={`Open ${event.title}`}
      accessibilityRole="button"
      onPress={onPress}
      className="overflow-hidden rounded-card border border-border bg-surface active:opacity-80 md:flex-row">
      <Image
        accessibilityLabel=""
        className="h-40 w-full bg-surface-muted md:h-auto md:w-44"
        contentFit="cover"
        source={event.image}
        transition={180}
      />
      <View className="min-w-0 flex-1 p-4">
        <Text className="text-xs font-bold uppercase tracking-wide text-link">{societyName}</Text>
        <Text className="mt-1 text-lg font-extrabold leading-6 text-ink">{event.title}</Text>
        <Text className="mt-2 text-sm leading-5 text-muted" numberOfLines={2}>
          {event.summary}
        </Text>
        <View className="mt-4 gap-2">
          <Meta icon="calendar-outline" label={event.date} />
          <Meta icon="location-outline" label={event.location} />
        </View>
      </View>
      <View className="absolute bottom-4 right-4 h-9 w-9 items-center justify-center rounded-full bg-surface-muted">
        <Ionicons color={colors.ink} name="chevron-forward" size={17} />
      </View>
    </Pressable>
  );
}

function Meta({
  icon,
  label,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
}) {
  return (
    <View className="flex-row items-center gap-2">
      <Ionicons color={colors.muted} name={icon} size={15} />
      <Text className="flex-1 text-xs font-semibold text-muted">{label}</Text>
    </View>
  );
}
