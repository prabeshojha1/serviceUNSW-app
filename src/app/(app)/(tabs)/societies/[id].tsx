import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

import { SocietyEventCard } from '@/components/society/event-card';
import {
  AppScreen,
  Badge,
  Button,
  Card,
  EmptyState,
  Metric,
  SectionHeader,
} from '@/components/ui/app-ui';
import { useSocieties } from '@/context/society-context';
import { societies, societyEvents } from '@/data/societies';
import { colors } from '@/theme/tokens';

export default function SocietyProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const society = societies.find((item) => item.id === id);
  const { joinedIds, toggleJoined } = useSocieties();

  if (!society) {
    return (
      <AppScreen back title="Society unavailable">
        <EmptyState
          action={<Button label="Browse societies" onPress={() => router.replace('/societies')} />}
          description="This society could not be found in the current directory."
          icon="people-outline"
          title="Society not found"
        />
      </AppScreen>
    );
  }

  const joined = joinedIds.includes(society.id);
  const events = societyEvents.filter((event) => event.societyId === society.id);

  return (
    <AppScreen back subtitle={society.category} title={society.shortName}>
      <View className="gap-8">
        <View className="overflow-hidden rounded-panel border border-border bg-surface xl:flex-row">
          <Image
            accessibilityLabel=""
            className="h-64 w-full bg-surface-muted xl:h-auto xl:w-[42%]"
            contentFit="cover"
            source={society.image}
            transition={180}
          />
          <View className="min-w-0 flex-1 p-5 md:p-7">
            <Badge label={society.category} tone="info" />
            <Text className="mt-3 text-3xl font-black tracking-tight text-ink">{society.name}</Text>
            <Text className="mt-4 text-base leading-7 text-muted">{society.description}</Text>
            <View className="mt-5 flex-row gap-6 border-t border-border pt-5">
              <Metric label="Members" value={society.memberCount.toLocaleString('en-AU')} />
              <Metric label="Upcoming events" value={events.length} />
            </View>
            <View className="mt-6">
              <Button
                fullWidth
                icon={joined ? 'checkmark' : 'add'}
                label={joined ? 'Joined society' : 'Join society'}
                onPress={() => toggleJoined(society.id)}
                variant={joined ? 'secondary' : 'primary'}
              />
            </View>
          </View>
        </View>

        <View className="gap-6 xl:flex-row xl:items-start">
          <View className="min-w-0 flex-[1.3]">
            <SectionHeader title="Upcoming events" />
            <View className="gap-3">
              {events.length ? (
                events.map((event) => (
                  <SocietyEventCard
                    event={event}
                    key={event.id}
                    onPress={() => router.push(`/societies/events/${event.id}`)}
                    societyName={society.shortName}
                  />
                ))
              ) : (
                <EmptyState
                  description="New activities from this society will appear here."
                  icon="calendar-outline"
                  title="No upcoming events"
                />
              )}
            </View>
          </View>

          <View className="min-w-0 flex-1">
            <SectionHeader title="Connect" />
            <Card className="p-0">
              <ConnectRow icon="globe-outline" label="Website" value="arc.unsw.edu.au" />
              <ConnectRow icon="logo-instagram" label="Instagram" value={`@${society.id}unsw`} />
              <ConnectRow icon="mail-outline" label="Email" value={`hello@${society.id}.org.au`} last />
            </Card>
          </View>
        </View>
      </View>
    </AppScreen>
  );
}

function ConnectRow({
  icon,
  label,
  value,
  last = false,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <View className={`min-h-16 flex-row items-center gap-3 px-4 ${last ? '' : 'border-b border-border'}`}>
      <Ionicons color={colors.ink} name={icon} size={20} />
      <View className="min-w-0 flex-1">
        <Text className="text-xs font-bold uppercase tracking-wide text-muted">{label}</Text>
        <Text className="mt-1 text-sm font-semibold text-ink" numberOfLines={1}>
          {value}
        </Text>
      </View>
    </View>
  );
}
