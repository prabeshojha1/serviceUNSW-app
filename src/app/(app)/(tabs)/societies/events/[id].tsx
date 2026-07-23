import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

import {
  AppScreen,
  Badge,
  Button,
  Card,
  EmptyState,
  InlineNotice,
  SectionHeader,
} from '@/components/ui/app-ui';
import { societies, societyEvents } from '@/data/societies';
import { colors } from '@/theme/tokens';

export default function SocietyEventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const event = societyEvents.find((item) => item.id === id);
  const society = societies.find((item) => item.id === event?.societyId);

  if (!event || !society) {
    return (
      <AppScreen back title="Event unavailable">
        <EmptyState
          action={<Button label="Browse events" onPress={() => router.replace('/societies/events')} />}
          description="This event could not be found in the current directory."
          icon="calendar-outline"
          title="Event not found"
        />
      </AppScreen>
    );
  }

  return (
    <AppScreen back subtitle={society.shortName} title="Event details">
      <View className="mx-auto w-full max-w-4xl gap-8">
        <View className="overflow-hidden rounded-panel border border-border bg-surface">
          <Image
            accessibilityLabel=""
            className="h-64 w-full bg-surface-muted md:h-80"
            contentFit="cover"
            source={event.image}
            transition={180}
          />
          <View className="p-5 md:p-7">
            <Badge label={society.shortName} tone="info" />
            <Text className="mt-4 text-3xl font-black tracking-tight text-ink md:text-4xl">
              {event.title}
            </Text>
            <Text className="mt-4 text-base leading-7 text-muted">{event.summary}</Text>
            <View className="mt-6 gap-3 border-t border-border pt-5 md:flex-row md:gap-8">
              <EventFact icon="calendar-outline" label="Date" value={event.date} />
              <EventFact icon="time-outline" label="Time" value={event.time} />
              <EventFact icon="location-outline" label="Location" value={event.location} />
            </View>
          </View>
        </View>

        <InlineNotice
          action={
            <Button
              label="View society"
              onPress={() => router.push(`/societies/${society.id}`)}
              size="sm"
              variant="secondary"
            />
          }
          description={`Hosted by ${society.name}.`}
          icon="people-outline"
          title="About the organiser"
          tone="brand"
        />

        <View>
          <SectionHeader title="Registration" />
          <Card>
            <Text className="text-base font-extrabold text-ink">Ready to attend?</Text>
            <Text className="mt-2 text-sm leading-6 text-muted">
              Registration is simulated in this prototype. Confirm final event details with the
              society before attending.
            </Text>
            <View className="mt-5">
              <Button fullWidth icon="ticket-outline" label="Register interest" onPress={() => undefined} />
            </View>
          </Card>
        </View>
      </View>
    </AppScreen>
  );
}

function EventFact({
  icon,
  label,
  value,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  value: string;
}) {
  return (
    <View className="min-w-0 flex-1 flex-row items-start gap-3">
      <View className="h-10 w-10 items-center justify-center rounded-xl bg-surface-muted">
        <Ionicons color={colors.ink} name={icon} size={20} />
      </View>
      <View className="min-w-0 flex-1">
        <Text className="text-xs font-bold uppercase tracking-wide text-muted">{label}</Text>
        <Text className="mt-1 text-sm font-semibold leading-5 text-ink">{value}</Text>
      </View>
    </View>
  );
}
