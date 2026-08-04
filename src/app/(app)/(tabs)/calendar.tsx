import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Pressable, Text, View } from '@/components/ui/native';

import {
  AppScreen,
  Button,
  Card,
  Chip,
  ChoiceRow,
  EmptyState,
  IconButton,
  ModalSheet,
  SearchField,
  SectionHeader,
  SwitchRow,
} from '@/components/ui/app-ui';
import { calendarEvents } from '@/data/calendar';
import { colors } from '@/theme/tokens';
import { CalendarEvent, CalendarEventType } from '@/types/calendar';

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const eventColors: Record<CalendarEventType, string> = {
  class: colors.eventClass,
  society: colors.eventSociety,
  deadline: colors.eventDeadline,
  general: colors.eventGeneral,
};
const eventLabels: Record<CalendarEventType, string> = {
  class: 'Class',
  society: 'Society',
  deadline: 'Deadline',
  general: 'General',
};

export default function CalendarScreen() {
  const [events, setEvents] = useState(calendarEvents);
  const [selectedDate, setSelectedDate] = useState('2026-07-23');
  const [selectedMonth, setSelectedMonth] = useState(new Date(2026, 6, 1));
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ class: true, society: true, deadline: true });
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [subscriptionsOpen, setSubscriptionsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [subscribedSocieties, setSubscribedSocieties] = useState(['CSESoc']);
  const [defaultOffsets, setDefaultOffsets] = useState({
    class: 10,
    society: 60,
    deadline: 1440,
  });

  const monthDays = useMemo(() => buildMonthGrid(selectedMonth), [selectedMonth]);
  const visibleEvents = useMemo(
    () =>
      events
        .filter((event) => event.date === selectedDate)
        .filter((event) => {
          const query = search.trim().toLowerCase();
          return (
            !query ||
            event.title.toLowerCase().includes(query) ||
            event.location?.toLowerCase().includes(query) ||
            event.courseCode?.toLowerCase().includes(query)
          );
        })
        .filter((event) => event.type === 'general' || filters[event.type])
        .filter(
          (event) =>
            event.type !== 'society' ||
            !event.organizer ||
            subscribedSocieties.includes(event.organizer),
        )
        .sort((a, b) => a.startTime.localeCompare(b.startTime)),
    [events, filters, search, selectedDate, subscribedSocieties],
  );

  const eventDates = useMemo(() => new Set(events.map((event) => event.date)), [events]);

  const changeMonth = (offset: number) => {
    setSelectedMonth(
      (current) => new Date(current.getFullYear(), current.getMonth() + offset, 1),
    );
  };

  const toggleFilter = (type: keyof typeof filters) => {
    setFilters((current) => ({ ...current, [type]: !current[type] }));
  };

  const updateSelectedEvent = (next: CalendarEvent) => {
    setEvents((current) => current.map((event) => (event.id === next.id ? next : event)));
    setSelectedEvent(next);
  };

  return (
    <AppScreen
      action={
        <View className="flex-row gap-2">
          <IconButton
            accessibilityLabel="Manage calendar subscriptions"
            icon="people-outline"
            onPress={() => setSubscriptionsOpen(true)}
          />
          <IconButton
            accessibilityLabel="Notification settings"
            icon="notifications-outline"
            onPress={() => setSettingsOpen(true)}
          />
        </View>
      }
      subtitle="Classes, deadlines, bookings, and campus events"
      title="Calendar">
      <View className="gap-6">
        <SearchField
          accessibilityLabel="Search calendar"
          onChangeText={setSearch}
          placeholder="Search events, courses, or locations"
          value={search}
        />

        <View className="gap-6 xl:flex-row xl:items-start">
          <Card className="min-w-0 flex-1">
            <View className="mb-4 flex-row items-center justify-between">
              <View>
                <Text className="text-xl font-black text-ink">
                  {selectedMonth.toLocaleDateString('en-AU', {
                    month: 'long',
                    year: 'numeric',
                  })}
                </Text>
                <Text className="mt-1 text-xs font-semibold text-muted">Select a day</Text>
              </View>
              <View className="flex-row gap-2">
                <IconButton
                  accessibilityLabel="Previous month"
                  icon="chevron-back"
                  onPress={() => changeMonth(-1)}
                />
                <IconButton
                  accessibilityLabel="Next month"
                  icon="chevron-forward"
                  onPress={() => changeMonth(1)}
                />
              </View>
            </View>

            <View className="mb-1 flex-row">
              {weekDays.map((day) => (
                <Text
                  className="w-[14.285%] py-2 text-center text-xs font-bold text-muted"
                  key={day}>
                  {day}
                </Text>
              ))}
            </View>

            <View className="flex-row flex-wrap">
              {monthDays.map((day) => {
                const selected = selectedDate === day.date;
                const hasEvent = eventDates.has(day.date);
                return (
                  <View className="w-[14.285%] p-1" key={day.date}>
                    <Pressable
                      accessibilityLabel={`${day.label}${hasEvent ? ', has events' : ''}`}
                      accessibilityRole="button"
                      accessibilityState={{ selected }}
                      onPress={() => setSelectedDate(day.date)}
                      className={`aspect-square min-h-10 items-center justify-center rounded-xl ${
                        selected
                          ? 'bg-ink'
                          : day.padding
                            ? 'bg-transparent'
                            : 'bg-surface-raised active:bg-surface-muted'
                      }`}>
                      <Text
                        className={`text-sm font-bold ${
                          selected ? 'text-white' : day.padding ? 'text-border-strong' : 'text-ink'
                        }`}>
                        {day.day}
                      </Text>
                      {hasEvent ? (
                        <View
                          className={`absolute bottom-1.5 h-1.5 w-1.5 rounded-full ${
                            selected ? 'bg-brand' : 'bg-info'
                          }`}
                        />
                      ) : null}
                    </Pressable>
                  </View>
                );
              })}
            </View>
          </Card>

          <View className="min-w-0 flex-1">
            <SectionHeader
              action={
                selectedDate !== '2026-07-23' ? (
                  <Button
                    icon="today-outline"
                    label="Today"
                    onPress={() => {
                      setSelectedDate('2026-07-23');
                      setSelectedMonth(new Date(2026, 6, 1));
                    }}
                    size="sm"
                  />
                ) : undefined
              }
              description={`${visibleEvents.length} ${
                visibleEvents.length === 1 ? 'event' : 'events'
              } after filters`}
              title={formatDate(selectedDate)}
            />

            <View className="mb-4 flex-row flex-wrap gap-2">
              <Chip
                dotColor={eventColors.class}
                label="Classes"
                onPress={() => toggleFilter('class')}
                selected={filters.class}
              />
              <Chip
                dotColor={eventColors.society}
                label="Societies"
                onPress={() => toggleFilter('society')}
                selected={filters.society}
              />
              <Chip
                dotColor={eventColors.deadline}
                label="Deadlines"
                onPress={() => toggleFilter('deadline')}
                selected={filters.deadline}
              />
            </View>

            <View className="gap-3">
              {visibleEvents.length ? (
                visibleEvents.map((event) => (
                  <EventCard event={event} key={event.id} onPress={() => setSelectedEvent(event)} />
                ))
              ) : (
                <EmptyState
                  description="Try another date, clear the search, or enable more event categories."
                  icon="calendar-clear-outline"
                  title="Nothing scheduled"
                />
              )}
            </View>
          </View>
        </View>
      </View>

      <ModalSheet
        footer={
          selectedEvent ? (
            <Button
              fullWidth
              label="Done"
              onPress={() => setSelectedEvent(null)}
              variant="secondary"
            />
          ) : undefined
        }
        onClose={() => setSelectedEvent(null)}
        title={selectedEvent?.title ?? 'Event details'}
        visible={!!selectedEvent}>
        {selectedEvent ? (
          <>
            <View className="flex-row flex-wrap gap-2">
              <Chip
                dotColor={eventColors[selectedEvent.type]}
                label={eventLabels[selectedEvent.type]}
                onPress={() => undefined}
                selected
              />
              {selectedEvent.courseCode ? (
                <View className="rounded-full bg-surface-muted px-3 py-2">
                  <Text className="text-sm font-bold text-ink">{selectedEvent.courseCode}</Text>
                </View>
              ) : null}
            </View>
            <DetailRow
              icon="time-outline"
              label={`${selectedEvent.startTime}${
                selectedEvent.endTime ? `–${selectedEvent.endTime}` : ''
              }`}
            />
            {selectedEvent.location ? (
              <DetailRow icon="location-outline" label={selectedEvent.location} />
            ) : null}
            <Text className="text-sm leading-6 text-muted">{selectedEvent.description}</Text>
            <SwitchRow
              description="Use the default reminder timing for this event type."
              label="Event reminder"
              onValueChange={(value) =>
                updateSelectedEvent({ ...selectedEvent, remindersEnabled: value })
              }
              value={selectedEvent.remindersEnabled}
            />
          </>
        ) : null}
      </ModalSheet>

      <ModalSheet
        description="Society events appear in your calendar when their organiser is selected."
        footer={
          <Button
            fullWidth
            label="Save subscriptions"
            onPress={() => setSubscriptionsOpen(false)}
          />
        }
        onClose={() => setSubscriptionsOpen(false)}
        title="Calendar subscriptions"
        visible={subscriptionsOpen}>
        {['CSESoc', 'UNSW Film Society', 'Motorsport Society'].map((society) => (
          <SwitchRow
            key={society}
            label={society}
            onValueChange={() =>
              setSubscribedSocieties((current) =>
                current.includes(society)
                  ? current.filter((item) => item !== society)
                  : [...current, society],
              )
            }
            value={subscribedSocieties.includes(society)}
          />
        ))}
      </ModalSheet>

      <ModalSheet
        description="Choose when new events should remind you by default."
        footer={
          <Button fullWidth label="Save settings" onPress={() => setSettingsOpen(false)} />
        }
        onClose={() => setSettingsOpen(false)}
        title="Notification settings"
        visible={settingsOpen}>
        <ReminderChoices
          label="Classes"
          onChange={(value) => setDefaultOffsets((current) => ({ ...current, class: value }))}
          value={defaultOffsets.class}
        />
        <ReminderChoices
          label="Society events"
          onChange={(value) => setDefaultOffsets((current) => ({ ...current, society: value }))}
          value={defaultOffsets.society}
        />
        <ReminderChoices
          label="Deadlines"
          onChange={(value) => setDefaultOffsets((current) => ({ ...current, deadline: value }))}
          value={defaultOffsets.deadline}
        />
      </ModalSheet>
    </AppScreen>
  );
}

function EventCard({ event, onPress }: { event: CalendarEvent; onPress: () => void }) {
  return (
    <Pressable
      accessibilityLabel={`Open ${event.title}`}
      accessibilityRole="button"
      onPress={onPress}
      className="min-h-20 flex-row items-center gap-4 rounded-card border border-border bg-surface p-4 active:bg-surface-raised">
      <View className="w-14 items-center">
        <Text className="text-base font-black text-ink">{event.startTime}</Text>
        <Text className="mt-1 text-xs text-muted">{event.endTime ?? 'Due'}</Text>
      </View>
      <View
        className="h-12 w-1 rounded-full"
        style={{ backgroundColor: eventColors[event.type] }}
      />
      <View className="min-w-0 flex-1">
        <Text className="text-base font-extrabold text-ink" numberOfLines={1}>
          {event.title}
        </Text>
        <Text className="mt-1 text-sm text-muted" numberOfLines={1}>
          {event.location ?? event.courseCode ?? eventLabels[event.type]}
        </Text>
      </View>
      {event.remindersEnabled ? (
        <Ionicons color={colors.muted} name="notifications-outline" size={17} />
      ) : null}
      <Ionicons color={colors.muted} name="chevron-forward" size={18} />
    </Pressable>
  );
}

function DetailRow({
  icon,
  label,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
}) {
  return (
    <View className="flex-row items-center gap-3">
      <View className="h-10 w-10 items-center justify-center rounded-xl bg-surface-muted">
        <Ionicons color={colors.ink} name={icon} size={20} />
      </View>
      <Text className="flex-1 text-sm font-semibold text-ink">{label}</Text>
    </View>
  );
}

function ReminderChoices({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  const options = [
    { label: '10 minutes before', value: 10 },
    { label: '1 hour before', value: 60 },
    { label: '1 day before', value: 1440 },
  ];
  return (
    <View className="gap-2">
      <Text className="mb-1 text-sm font-extrabold text-ink">{label}</Text>
      {options.map((option) => (
        <ChoiceRow
          key={option.value}
          label={option.label}
          onPress={() => onChange(option.value)}
          selected={value === option.value}
        />
      ))}
    </View>
  );
}

function buildMonthGrid(month: Date) {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const firstDay = new Date(year, monthIndex, 1);
  const mondayIndex = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
  const days: { day: number; date: string; label: string; padding: boolean }[] = [];
  const previousMonthDays = new Date(year, monthIndex, 0).getDate();

  for (let offset = mondayIndex - 1; offset >= 0; offset -= 1) {
    const day = previousMonthDays - offset;
    const date = new Date(year, monthIndex - 1, day);
    days.push({
      day,
      date: dateKey(date),
      label: formatDate(dateKey(date)),
      padding: true,
    });
  }

  const currentMonthDays = new Date(year, monthIndex + 1, 0).getDate();
  for (let day = 1; day <= currentMonthDays; day += 1) {
    const date = new Date(year, monthIndex, day);
    days.push({
      day,
      date: dateKey(date),
      label: formatDate(dateKey(date)),
      padding: false,
    });
  }

  let nextDay = 1;
  while (days.length < 42) {
    const date = new Date(year, monthIndex + 1, nextDay);
    days.push({
      day: nextDay,
      date: dateKey(date),
      label: formatDate(dateKey(date)),
      padding: true,
    });
    nextDay += 1;
  }

  return days;
}

function dateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
    date.getDate(),
  ).padStart(2, '0')}`;
}

function formatDate(date: string) {
  return new Date(`${date}T12:00:00`).toLocaleDateString('en-AU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}
