import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { View } from '@/components/ui/native';

import { SocietyEventCard } from '@/components/society/event-card';
import {
  AppScreen,
  EmptyState,
  SearchField,
  SectionHeader,
} from '@/components/ui/app-ui';
import { societies, societyEvents } from '@/data/societies';

export default function SocietyEventsScreen() {
  const [search, setSearch] = useState('');
  const events = useMemo(() => {
    const query = search.trim().toLowerCase();
    return societyEvents.filter((event) => {
      const society = societies.find((item) => item.id === event.societyId);
      return (
        !query ||
        event.title.toLowerCase().includes(query) ||
        event.summary.toLowerCase().includes(query) ||
        society?.name.toLowerCase().includes(query)
      );
    });
  }, [search]);

  return (
    <AppScreen back subtitle="Activities from across campus" title="Society events">
      <View className="gap-6">
        <SearchField onChangeText={setSearch} placeholder="Search events or societies" value={search} />
        <View>
          <SectionHeader
            description={`${events.length} upcoming ${events.length === 1 ? 'event' : 'events'}`}
            title="Discover something new"
          />
          <View className="gap-3">
            {events.length ? (
              events.map((event) => {
                const society = societies.find((item) => item.id === event.societyId);
                return (
                  <SocietyEventCard
                    event={event}
                    key={event.id}
                    onPress={() => router.push(`/societies/events/${event.id}`)}
                    societyName={society?.shortName ?? 'UNSW Society'}
                  />
                );
              })
            ) : (
              <EmptyState
                description="Try another event name or society."
                icon="calendar-outline"
                title="No events found"
              />
            )}
          </View>
        </View>
      </View>
    </AppScreen>
  );
}
