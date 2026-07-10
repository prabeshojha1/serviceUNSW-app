import { useState, useMemo } from 'react';
import { View, Text, ScrollView, Pressable, Platform, TextInput } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { SymbolView } from 'expo-symbols';
import { router } from 'expo-router';

// Components
import { EventCard, CalendarEvent } from '@/components/ui/event-card';
import { EventDetailModal } from '@/components/calendar/event-detail-modal';
import { SubscriptionsModal } from '@/components/calendar/subscriptions-modal';
import { NotificationSettingsModal } from '@/components/calendar/notification-settings-modal';

// Theme Spacing
import { BottomTabInset } from '@/constants/theme';

// Initial Mock Database for UNSW Semester
const INITIAL_EVENTS: CalendarEvent[] = [
  {
    id: '1',
    title: 'COMP3311 Tutorial',
    type: 'class',
    date: '2026-07-02',
    startTime: '10:00',
    endTime: '13:00',
    location: 'Ainsworth Building G03',
    courseCode: 'COMP3311',
    description: 'Solve the problem set throughout this tutorial covering database schema design, normal forms, and SQL queries.',
    remindersEnabled: true,
    reminderOffset: 10
  },
  {
    id: '2',
    title: 'Motorsport Society Trivia',
    type: 'society',
    date: '2026-07-02',
    startTime: '14:00',
    endTime: '15:00',
    location: 'UNSW Roundhouse (Main Hall)',
    organizer: 'CSESoc',
    description: 'Come join us on this day to win some trivia and some wonderful prizes throughout the night!!!! We will have food, drinks, and networking.',
    remindersEnabled: true,
    reminderOffset: 60
  },
  {
    id: '3',
    title: 'Workout with Ella',
    type: 'general',
    date: '2026-07-02',
    startTime: '19:00',
    endTime: '20:00',
    location: 'UNSW Fitness Centre',
    description: 'We will do the legs and back workout with high intensity intervals.',
    remindersEnabled: false
  },
  {
    id: '4',
    title: 'COMP2521 Lecture - BST & AVL Trees',
    type: 'class',
    date: '2026-07-06',
    startTime: '10:00',
    endTime: '12:00',
    location: 'Ainsworth Building G03',
    courseCode: 'COMP2521',
    description: 'Lecture covering binary search trees, BST balancing, and tree rotations in AVL trees.',
    remindersEnabled: true,
    reminderOffset: 10
  },
  {
    id: '5',
    title: 'MATH1081 Lecture - Induction Proofs',
    type: 'class',
    date: '2026-07-06',
    startTime: '12:00',
    endTime: '14:00',
    location: 'Mathews Theatre A',
    courseCode: 'MATH1081',
    description: 'Proof by mathematical induction, strong induction, and structural induction examples.',
    remindersEnabled: true,
    reminderOffset: 10
  },
  {
    id: '6',
    title: 'UNSW DevSoc - Hackathon Briefing',
    type: 'society',
    date: '2026-07-06',
    startTime: '17:00',
    endTime: '19:00',
    location: 'MCIC Room 120',
    organizer: 'DevSoc',
    description: 'Briefing night for the DevSoc hackathon. Find team members, select tracks, and meet the mentors.',
    remindersEnabled: true,
    reminderOffset: 10
  },
  {
    id: '7',
    title: 'MATH1081 Tutorial - Discrete Math Quiz 1',
    type: 'class',
    date: '2026-07-08',
    startTime: '09:00',
    endTime: '10:00',
    location: 'Mathews Room 309',
    courseCode: 'MATH1081',
    description: 'In-class quiz preparation and review of relations and proof methods.',
    remindersEnabled: true,
    reminderOffset: 10
  },
  {
    id: '8',
    title: 'UNSW Arc - Student Flea Market',
    type: 'society',
    date: '2026-07-08',
    startTime: '10:00',
    endTime: '16:00',
    location: 'UNSW Main Walkway',
    organizer: 'Arc',
    description: 'Browse local student stores, vintage clothing, pop-up stalls, and street food.',
    remindersEnabled: false
  },
  {
    id: '9',
    title: 'COMP2521 Assignment 1 Release',
    type: 'deadline',
    date: '2026-07-10',
    startTime: '09:00',
    courseCode: 'COMP2521',
    description: 'Assignment 1 specification is now live on the course site. Covers tree operations.',
    remindersEnabled: true,
    reminderOffset: 1440
  },
  {
    id: '10',
    title: 'MATH1081 Weekly Quiz 5 Deadline',
    type: 'deadline',
    date: '2026-07-12',
    startTime: '23:59',
    courseCode: 'MATH1081',
    description: 'Weekly discrete math online quiz on set theory. Must be submitted on Mobius portal.',
    remindersEnabled: true,
    reminderOffset: 1440
  }
];

const WEEK_DAYS_LABEL = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function CalendarScreen() {
  const safeAreaInsets = useSafeAreaInsets();
  const bottomInset = Platform.OS === 'web' ? 24 : safeAreaInsets.bottom + BottomTabInset + 16;

  // Calendar States
  const [selectedDate, setSelectedDate] = useState('2026-07-02'); // Default selected date matching mockup index
  const [selectedMonth, setSelectedMonth] = useState(new Date(2026, 6, 1)); // July 2026
  const [searchQuery, setSearchQuery] = useState('');
  
  // Events Database
  const [events, setEvents] = useState<CalendarEvent[]>(INITIAL_EVENTS);
  
  // Toggles and Filters
  const [filters, setFilters] = useState({
    class: true,
    society: true,
    deadline: true,
  });
  const [subscribedSocieties, setSubscribedSocieties] = useState<string[]>(['CSESoc', 'Arc', 'DevSoc']);
  
  // Modals visibility
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [subsModalVisible, setSubsModalVisible] = useState(false);
  const [notifModalVisible, setNotifModalVisible] = useState(false);

  // Default reminder offsets
  const [defaultNotifs, setDefaultNotifs] = useState({
    classOffset: 10,
    societyOffset: 60,
    deadlineOffset: 1440,
  });

  // Handle reminder changes from details modal
  const handleUpdateEvent = (updatedEvent: CalendarEvent) => {
    setEvents((prev) => prev.map((ev) => (ev.id === updatedEvent.id ? updatedEvent : ev)));
    setSelectedEvent(updatedEvent);
  };

  // Toggle subscriptions for societies
  const handleToggleSubscription = (socId: string) => {
    setSubscribedSocieties((prev) =>
      prev.includes(socId) ? prev.filter((id) => id !== socId) : [...prev, socId]
    );
  };

  // Toggle category filters
  const toggleFilter = (type: 'class' | 'society' | 'deadline') => {
    setFilters((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  // Reset to today (July 6, 2026)
  const handleJumpToToday = () => {
    setSelectedDate('2026-07-06');
    setSelectedMonth(new Date(2026, 6, 1));
  };

  // Compute calendar dates in current selectedMonth starting on MONDAY, padding previous/next month dates
  const daysInMonth = useMemo(() => {
    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth(); // 0-indexed
    
    // First day of current month
    const firstDay = new Date(year, month, 1);
    // getDay() is 0 (Sun) to 6 (Sat)
    // Convert to Mon-Sun (0 = Mon, ..., 6 = Sun)
    const dayOfWeek = firstDay.getDay();
    const firstDayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

    const grid = [];
    
    // 1. Get days of previous month for padding
    const prevMonthLastDate = new Date(year, month, 0).getDate();
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dayNum = prevMonthLastDate - i;
      const prevMonth = month === 0 ? 11 : month - 1;
      const prevYear = month === 0 ? year - 1 : year;
      const dateString = `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
      grid.push({ dayNumber: dayNum, dateString, isPadding: true });
    }

    // 2. Populate current month
    const totalDays = new Date(year, month + 1, 0).getDate();
    for (let day = 1; day <= totalDays; day++) {
      const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      grid.push({ dayNumber: day, dateString, isPadding: false });
    }

    // 3. Populate next month padding to make a multiple of 7 (full grid rows)
    const remaining = 42 - grid.length;
    for (let day = 1; day <= remaining; day++) {
      const nextMonth = month === 11 ? 0 : month + 1;
      const nextYear = month === 11 ? year + 1 : year;
      const dateString = `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      grid.push({ dayNumber: day, dateString, isPadding: true });
    }

    return grid;
  }, [selectedMonth]);

  // Filter and select events corresponding to selectedDate
  const filteredEventsForSelectedDate = useMemo(() => {
    return events.filter((event) => {
      // 1. Match date
      if (event.date !== selectedDate) return false;

      // 2. Check filters
      if (event.type === 'class' && !filters.class) return false;
      if (event.type === 'society' && !filters.society) return false;
      if (event.type === 'deadline' && !filters.deadline) return false;

      // 3. Check society subscriptions
      if (event.type === 'society' && event.organizer && !subscribedSocieties.includes(event.organizer)) {
        return false;
      }

      // 4. Check search query text filter
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesTitle = event.title.toLowerCase().includes(query);
        const matchesDesc = event.description?.toLowerCase().includes(query) || false;
        const matchesOrg = event.organizer?.toLowerCase().includes(query) || false;
        const matchesCode = event.courseCode?.toLowerCase().includes(query) || false;
        if (!matchesTitle && !matchesDesc && !matchesOrg && !matchesCode) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      // Sort by start time if available
      if (!a.startTime) return 1;
      if (!b.startTime) return -1;
      return a.startTime.localeCompare(b.startTime);
    });
  }, [events, selectedDate, filters, subscribedSocieties, searchQuery]);

  // Helper to check what events are present on a specific date (for indicators/dots in the grid)
  const getEventTypesForDate = (dateString: string) => {
    const list = events.filter((ev) => ev.date === dateString);
    const types = new Set<string>();
    list.forEach((ev) => {
      if (ev.type === 'class' && filters.class) types.add('class');
      if (ev.type === 'deadline' && filters.deadline) types.add('deadline');
      if (ev.type === 'society' && filters.society && ev.organizer && subscribedSocieties.includes(ev.organizer)) {
        types.add('society');
      }
    });
    return Array.from(types);
  };

  // Change month navigators
  const changeMonth = (direction: 'prev' | 'next') => {
    setSelectedMonth((prev) => {
      const copy = new Date(prev);
      copy.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      return copy;
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-unsw-yellow" edges={['top', 'left', 'right']}>
      {/* Top Header Section in Yellow Background */}
      <View className="px-6 pt-2 pb-5 flex-row items-center justify-between bg-unsw-yellow">
        <View className="flex-row items-center">
          <Pressable onPress={() => router.replace('/home')} className="p-1 active:opacity-75">
            <SymbolView name={{ ios: 'chevron.left', android: 'chevron_left', web: 'chevron_left' }} size={24} tintColor="#000" />
          </Pressable>
          <Text className="text-2xl font-black text-black ml-2">
            Calendar
          </Text>
        </View>

        {/* Sync & Setting Controls */}
        <View className="flex-row items-center gap-3">
          <Pressable
            onPress={() => setSubsModalVisible(true)}
            className="p-2.5 bg-black/5 active:bg-black/10 rounded-full"
          >
            <SymbolView name={{ ios: 'person.2.fill', android: 'group', web: 'people' }} size={18} tintColor="#000" />
          </Pressable>
          <Pressable
            onPress={() => setNotifModalVisible(true)}
            className="p-2.5 bg-black/5 active:bg-black/10 rounded-full"
          >
            <SymbolView name={{ ios: 'bell.fill', android: 'notifications', web: 'notifications' }} size={18} tintColor="#000" />
          </Pressable>
        </View>
      </View>

      {/* Nested white card content container */}
      <View className="flex-1 bg-neutral-50 dark:bg-neutral-950 rounded-t-[36px] overflow-hidden pt-6">
        <ScrollView 
          className="flex-1 px-5"
          contentContainerStyle={{ paddingBottom: bottomInset }}
          showsVerticalScrollIndicator={false}
        >
          {/* Search Bar Pill & Filter icon */}
          <View className="flex-row items-center gap-2 mb-5">
            <View className="flex-1 flex-row items-center bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800 rounded-full px-4.5 py-3 shadow-sm">
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search"
                placeholderTextColor="#8e8e93"
                className="flex-1 text-sm font-bold text-neutral-800 dark:text-neutral-200 py-0"
              />
              <SymbolView name={{ ios: 'magnifyingglass', android: 'search', web: 'search' }} size={16} tintColor="#888" />
            </View>
            <View className="p-3.5 bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800 rounded-full shadow-sm">
              <SymbolView name={{ ios: 'slider.horizontal.3', android: 'filter_list', web: 'filter_list' }} size={16} tintColor="#888" />
            </View>
          </View>

          {/* Month Selector Row */}
          <View className="flex-row items-center justify-between mb-4 px-2">
            <View>
              <Text className="text-lg font-black text-neutral-900 dark:text-white">
                {selectedMonth.toLocaleDateString('en-AU', { month: 'long' })}
              </Text>
              <Text className="text-xs font-bold text-neutral-400">
                {selectedMonth.getFullYear()}
              </Text>
            </View>
            <View className="flex-row items-center gap-3">
              <Pressable onPress={() => changeMonth('prev')} className="p-1 active:opacity-60">
                <SymbolView name={{ ios: 'chevron.left', android: 'chevron_left', web: 'chevron_left' }} size={16} tintColor="#a3a3a3" />
              </Pressable>
              <Pressable onPress={() => changeMonth('next')} className="p-1 active:opacity-60">
                <SymbolView name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }} size={16} tintColor="#a3a3a3" />
              </Pressable>
            </View>
          </View>

          {/* Monthly Calendar Grid with Monday start and padding dates */}
          <View className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 p-4 rounded-3xl mb-5 shadow-sm">
            {/* Week Day Header Labels (Mon to Sun) */}
            <View className="flex-row mb-3">
              {WEEK_DAYS_LABEL.map((label, idx) => (
                <Text key={idx} className="flex-1 text-center text-xs font-bold text-neutral-400">
                  {label}
                </Text>
              ))}
            </View>

            {/* Calendar Grid Cells */}
            <View className="flex-row flex-wrap">
              {daysInMonth.map((dayObj, idx) => {
                const isSelected = selectedDate === dayObj.dateString;
                const isToday = dayObj.dateString === '2026-07-06';
                const eventTypes = getEventTypesForDate(dayObj.dateString);

                return (
                  <Pressable
                    key={`${dayObj.dateString}-${idx}`}
                    onPress={() => {
                      setSelectedDate(dayObj.dateString);
                      // If padding date clicked, automatically scroll the selected month
                      const clickedDate = new Date(dayObj.dateString);
                      if (clickedDate.getMonth() !== selectedMonth.getMonth()) {
                        setSelectedMonth(new Date(clickedDate.getFullYear(), clickedDate.getMonth(), 1));
                      }
                    }}
                    className="w-[14.28%] aspect-square items-center justify-center p-0.5"
                  >
                    <View
                      className={`w-full h-full rounded-2xl items-center justify-center relative ${
                        isSelected
                          ? 'bg-unsw-yellow shadow-sm'
                          : isToday
                          ? 'bg-neutral-100 dark:bg-neutral-800'
                          : 'active:bg-neutral-50 dark:active:bg-neutral-850/40'
                      }`}
                    >
                      <Text
                        className={`text-sm ${
                          isSelected
                            ? 'text-black font-extrabold'
                            : dayObj.isPadding
                            ? 'text-neutral-300 dark:text-neutral-700 font-semibold'
                            : 'text-neutral-800 dark:text-neutral-200 font-bold'
                        }`}
                      >
                        {dayObj.dayNumber}
                      </Text>

                      {/* Event Dot Indicators */}
                      <View className="absolute bottom-1.5 flex-row justify-center gap-0.5 w-full">
                        {eventTypes.map((type) => (
                          <View
                            key={type}
                            className={`w-1 h-1 rounded-full ${
                              type === 'class'
                                ? 'bg-accent-blue'
                                : type === 'society'
                                ? 'bg-accent-pink'
                                : 'bg-accent-purple'
                            }`}
                          />
                        ))}
                      </View>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Filter Chips Toggles Row */}
          <View className="flex-row gap-2 mb-6 flex-wrap">
            <Pressable
              onPress={() => toggleFilter('class')}
              className={`flex-row items-center gap-1.5 px-3.5 py-2 rounded-full border ${
                filters.class
                  ? 'bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-900/50'
                  : 'bg-transparent border-neutral-200 dark:border-neutral-800'
              }`}
            >
              <View className={`w-2 h-2 rounded-full ${filters.class ? 'bg-accent-blue' : 'bg-neutral-300'}`} />
              <Text className={`text-xs font-semibold ${filters.class ? 'text-accent-blue dark:text-blue-300' : 'text-neutral-500'}`}>
                Classes
              </Text>
            </Pressable>

            <Pressable
              onPress={() => toggleFilter('society')}
              className={`flex-row items-center gap-1.5 px-3.5 py-2 rounded-full border ${
                filters.society
                  ? 'bg-pink-50 border-pink-200 dark:bg-pink-950/20 dark:border-pink-900/50'
                  : 'bg-transparent border-neutral-200 dark:border-neutral-800'
              }`}
            >
              <View className={`w-2 h-2 rounded-full ${filters.society ? 'bg-accent-pink' : 'bg-neutral-300'}`} />
              <Text className={`text-xs font-semibold ${filters.society ? 'text-accent-pink dark:text-pink-300' : 'text-neutral-500'}`}>
                Society Events
              </Text>
            </Pressable>

            <Pressable
              onPress={() => toggleFilter('deadline')}
              className={`flex-row items-center gap-1.5 px-3.5 py-2 rounded-full border ${
                filters.deadline
                  ? 'bg-purple-50 border-purple-200 dark:bg-purple-950/20 dark:border-purple-900/50'
                  : 'bg-transparent border-neutral-200 dark:border-neutral-800'
              }`}
            >
              <View className={`w-2 h-2 rounded-full ${filters.deadline ? 'bg-accent-purple' : 'bg-neutral-300'}`} />
              <Text className={`text-xs font-semibold ${filters.deadline ? 'text-accent-purple dark:text-purple-300' : 'text-neutral-500'}`}>
                Deadlines
              </Text>
            </Pressable>
          </View>

          {/* Jump to Today & Selected Day Header Row */}
          <View className="flex-row justify-between items-end mb-4">
            <View>
              <Text className="text-lg font-extrabold text-neutral-900 dark:text-white">
                {new Date(selectedDate).toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long' })}
              </Text>
              <Text className="text-xs font-bold text-neutral-400">
                {filteredEventsForSelectedDate.length} {filteredEventsForSelectedDate.length === 1 ? 'event' : 'events'} scheduled
              </Text>
            </View>

            {selectedDate !== '2026-07-06' && (
              <Pressable
                onPress={handleJumpToToday}
                className="flex-row items-center gap-1.5 bg-unsw-yellow px-3.5 py-2 rounded-full active:bg-yellow-400 shadow-sm"
              >
                <SymbolView name={{ ios: 'clock.arrow.2.circlepath', android: 'history', web: 'history' }} size={12} tintColor="#000" />
                <Text className="text-xs font-black text-black">Today</Text>
              </Pressable>
            )}
          </View>

          {/* Scrollable List of Cards */}
          {filteredEventsForSelectedDate.length > 0 ? (
            <View>
              {filteredEventsForSelectedDate.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onPress={() => {
                    setSelectedEvent(event);
                    setDetailModalVisible(true);
                  }}
                />
              ))}
            </View>
          ) : (
            /* agenda empty state */
            <View className="items-center justify-center py-10 bg-white dark:bg-neutral-900 rounded-3xl border border-dashed border-neutral-200 dark:border-neutral-800 shadow-sm">
              <SymbolView
                name={{ ios: 'cup.and.saucer.fill', android: 'free_breakfast', web: 'free_breakfast' }}
                size={32}
                tintColor="#d4d4d8"
              />
              <Text className="text-base font-bold text-neutral-800 dark:text-neutral-200 mt-3">
                Nothing Scheduled Today
              </Text>
              <Text className="text-xs text-neutral-400 text-center mt-1 px-8 leading-relaxed">
                No classes, deadlines, or society events matching your search or filters. Take a break!
              </Text>
            </View>
          )}
        </ScrollView>
      </View>

      {/* Modals */}
      <EventDetailModal
        visible={detailModalVisible}
        event={selectedEvent}
        onClose={() => {
          setDetailModalVisible(false);
          setSelectedEvent(null);
        }}
        onUpdateEvent={handleUpdateEvent}
      />

      <SubscriptionsModal
        visible={subsModalVisible}
        onClose={() => setSubsModalVisible(false)}
        subscribedSocieties={subscribedSocieties}
        onToggleSubscription={handleToggleSubscription}
      />

      <NotificationSettingsModal
        visible={notifModalVisible}
        onClose={() => setNotifModalVisible(false)}
        defaultSettings={defaultNotifs}
        onSave={setDefaultNotifs}
      />
    </SafeAreaView>
  );
}
