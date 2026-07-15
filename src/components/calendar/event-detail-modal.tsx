import { useState } from 'react';
import { Modal as RNModal, View, Text, Switch, Pressable, ScrollView } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { CalendarEvent } from '../ui/event-card';

interface EventDetailModalProps {
  visible: boolean;
  event: CalendarEvent | null;
  onClose: () => void;
  onUpdateEvent: (updatedEvent: CalendarEvent) => void;
}

export function EventDetailModal({ visible, event, onClose, onUpdateEvent }: EventDetailModalProps) {
  const [remindersEnabled, setRemindersEnabled] = useState(event?.remindersEnabled ?? false);
  const [reminderOffset, setReminderOffset] = useState(event?.reminderOffset ?? 10);
  const [showOffsetPicker, setShowOffsetPicker] = useState(false);

  // Sync state during prop change (render phase adjustment)
  const [prevEventId, setPrevEventId] = useState<string | undefined>(event?.id);
  if (event && event.id !== prevEventId) {
    setPrevEventId(event.id);
    setRemindersEnabled(event.remindersEnabled ?? false);
    setReminderOffset(event.reminderOffset ?? 10);
    setShowOffsetPicker(false);
  }

  if (!event) return null;

  const handleToggleReminders = (value: boolean) => {
    setRemindersEnabled(value);
    onUpdateEvent({
      ...event,
      remindersEnabled: value,
      reminderOffset: value ? reminderOffset : undefined,
    });
  };

  const handleSelectOffset = (offset: number) => {
    setReminderOffset(offset);
    onUpdateEvent({
      ...event,
      remindersEnabled: true,
      reminderOffset: offset,
    });
    setShowOffsetPicker(false);
  };

  // Format date in mockup style: "Thu 2 Sept 2021"
  const formattedDateString = (() => {
    try {
      const dateObj = new Date(event.date);
      const weekday = dateObj.toLocaleDateString('en-AU', { weekday: 'short' });
      const day = dateObj.getDate();
      const month = dateObj.toLocaleDateString('en-AU', { month: 'short' });
      const year = dateObj.getFullYear();
      const timeStr = event.startTime ? `, ${event.startTime}` : '';
      return `${weekday} ${day} ${month} ${year}${timeStr}`;
    } catch {
      return event.date;
    }
  })();

  // Determine category display and dot color
  let categoryLabel = 'General';
  let dotColor = '#888';
  if (event.type === 'class') {
    categoryLabel = 'Classes';
    dotColor = '#0066cc';
  } else if (event.type === 'society') {
    categoryLabel = 'Societies';
    dotColor = '#e91e63';
  } else if (event.type === 'deadline') {
    categoryLabel = 'Deadlines';
    dotColor = '#8e44ad';
  }

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/50">
        {/* Backdrop tap to close */}
        <Pressable className="absolute inset-0" onPress={onClose} />

        {/* Bottom Sheet Card */}
        <View className="w-full max-w-md mx-auto bg-white dark:bg-neutral-950 rounded-t-[32px] border-t border-neutral-100 dark:border-neutral-800 shadow-2xl p-6 pb-8 max-h-[85vh]">
          
          {/* Top grab handle */}
          <View className="w-12 h-1.5 bg-neutral-200 dark:bg-neutral-850 rounded-full self-center mb-6" />

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Title - Centered */}
            <Text className="text-xl font-black text-center text-neutral-950 dark:text-white mb-6 px-4">
              {event.title}
            </Text>

            {/* Description */}
            {event.description && (
              <Text className="text-sm text-neutral-500 dark:text-neutral-400 mb-6 leading-relaxed">
                {event.description}
              </Text>
            )}

            {/* Event Time detail row */}
            <View className="flex-row items-center gap-3.5 mb-4">
              <SymbolView
                name={{ ios: 'clock', android: 'schedule', web: 'clock' } as any}
                size={20}
                tintColor="#c7c7cc"
              />
              <Text className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">
                {formattedDateString}
              </Text>
            </View>

            {/* Event Location detail row */}
            {event.location && (
              <View className="flex-row items-center gap-3.5 mb-6">
                <SymbolView
                  name={{ ios: 'mappin.and.ellipse', android: 'place', web: 'pin' }}
                  size={20}
                  tintColor="#c7c7cc"
                />
                <Text className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">
                  {event.location}
                </Text>
              </View>
            )}

            {/* Category selection */}
            <View className="mb-6">
              <Text className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-3">
                Categories
              </Text>
              <View className="flex-row">
                <View className="flex-row items-center gap-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 px-4 py-2 rounded-full">
                  <View className="w-2 h-2 rounded-full" style={{ backgroundColor: dotColor }} />
                  <Text className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                    {categoryLabel}
                  </Text>
                </View>
              </View>
            </View>

            {/* Reminders section */}
            <View className="border-t border-neutral-100 dark:border-neutral-900 pt-5 gap-4">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-2.5">
                  <SymbolView name={{ ios: 'bell.fill', android: 'notifications', web: 'notifications' }} size={18} tintColor="#ffe600" />
                  <Text className="text-sm font-bold text-neutral-900 dark:text-white">Set Event Reminder</Text>
                </View>
                <Switch
                  value={remindersEnabled}
                  onValueChange={handleToggleReminders}
                  trackColor={{ false: '#d1d1d6', true: '#ffe600' }}
                  thumbColor={remindersEnabled ? '#000' : '#f4f3f4'}
                />
              </View>

              {remindersEnabled && (
                <View className="gap-2 bg-neutral-50 dark:bg-neutral-900 p-3.5 rounded-xl border border-neutral-100 dark:border-neutral-800">
                  <Pressable
                    onPress={() => setShowOffsetPicker(!showOffsetPicker)}
                    className="flex-row items-center justify-between"
                  >
                    <Text className="text-sm text-neutral-600 dark:text-neutral-400 font-semibold">Remind me:</Text>
                    <View className="flex-row items-center gap-1">
                      <Text className="text-sm font-bold text-black dark:text-white">
                        {reminderOffset === 0 ? 'At start of event' :
                         reminderOffset === 10 ? '10 minutes before' :
                         reminderOffset === 60 ? '1 hour before' :
                         reminderOffset === 1440 ? '1 day before' : `${reminderOffset}m before`}
                      </Text>
                      <SymbolView name={{ ios: 'chevron.down', android: 'keyboard_arrow_down', web: 'keyboard_arrow_down' }} size={14} tintColor="#888" />
                    </View>
                  </Pressable>

                  {showOffsetPicker && (
                    <View className="mt-3 pt-3 border-t border-neutral-200 dark:border-neutral-800 gap-2">
                      {[
                        { value: 0, label: 'At start of event' },
                        { value: 10, label: '10 minutes before' },
                        { value: 60, label: '1 hour before' },
                        { value: 1440, label: '1 day before' }
                      ].map((option) => (
                        <Pressable
                          key={option.value}
                          onPress={() => handleSelectOffset(option.value)}
                          className={`p-2.5 rounded-lg ${reminderOffset === option.value ? 'bg-unsw-yellow' : 'active:bg-neutral-200 dark:active:bg-neutral-800'}`}
                        >
                          <Text className={`text-sm ${reminderOffset === option.value ? 'text-black font-bold' : 'text-neutral-700 dark:text-neutral-300'}`}>
                            {option.label}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  )}
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </RNModal>
  );
}
