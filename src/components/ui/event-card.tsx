import { View, Text, Pressable } from 'react-native';
import { SymbolView } from 'expo-symbols';

export type EventType = 'class' | 'society' | 'deadline' | 'general';

export interface CalendarEvent {
  id: string;
  title: string;
  type: EventType;
  date: string; // YYYY-MM-DD
  startTime?: string; // HH:MM
  endTime?: string; // HH:MM
  location?: string;
  organizer?: string; // e.g. CSESoc, DevSoc
  courseCode?: string; // e.g. COMP2521
  description?: string;
  remindersEnabled?: boolean;
  reminderOffset?: number; // minutes before
}

interface EventCardProps {
  event: CalendarEvent;
  onPress?: () => void;
}

export function EventCard({ event, onPress }: EventCardProps) {
  // Styles depending on event type
  let dotColorClass = 'bg-neutral-300';
  
  switch (event.type) {
    case 'class':
      dotColorClass = 'bg-accent-blue';
      break;
    case 'society':
      dotColorClass = 'bg-accent-pink';
      break;
    case 'deadline':
      dotColorClass = 'bg-accent-purple';
      break;
  }

  return (
    <Pressable
      onPress={onPress}
      className="bg-white dark:bg-neutral-900 p-4 mb-3 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm flex-row items-center justify-between"
      style={({ pressed }) => pressed ? { transform: [{ scale: 0.99 }], opacity: 0.9 } : {}}
    >
      <View className="flex-1 pr-3">
        {/* Category dot indicator + Time range */}
        <View className="flex-row items-center gap-2 mb-1">
          <View className={`w-2.5 h-2.5 rounded-full ${dotColorClass}`} />
          {event.startTime && (
            <Text className="text-xs font-bold text-neutral-500 dark:text-neutral-400">
              {event.startTime} {event.endTime ? `- ${event.endTime}` : ''}
            </Text>
          )}
        </View>

        {/* Event Title */}
        <Text className="text-base font-extrabold text-neutral-950 dark:text-white mb-0.5 leading-tight">
          {event.title}
        </Text>

        {/* Event Description Snippet */}
        {event.description && (
          <Text className="text-xs text-neutral-400 dark:text-neutral-500" numberOfLines={1}>
            {event.description}
          </Text>
        )}
      </View>

      {/* Right Ellipsis Menu Icon */}
      <View className="p-1">
        <SymbolView
          name={{ ios: 'ellipsis', android: 'more_vert', web: 'more' }}
          size={16}
          tintColor="#c7c7cc"
        />
      </View>
    </Pressable>
  );
}
