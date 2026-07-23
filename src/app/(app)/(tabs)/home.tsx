import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import {
  AppScreen,
  Button,
  Card,
  ProgressBar,
  SectionHeader,
} from '@/components/ui/app-ui';
import { usePlan } from '@/context/plan-context';
import { calendarEvents } from '@/data/calendar';
import { DEGREE_TOTAL_UOC } from '@/data/plan';
import { societyEvents, societies } from '@/data/societies';
import { colors } from '@/theme/tokens';

const today = new Date(2026, 6, 23);
const todayKey = '2026-07-23';

export default function HomeScreen() {
  const { completedUoc, plannedUoc } = usePlan();
  const progress = Math.round((completedUoc / DEGREE_TOTAL_UOC) * 100);
  const todaysEvents = calendarEvents.filter((event) => event.date === todayKey).slice(0, 3);
  const featuredEvent = societyEvents[0];
  const featuredSociety = societies.find((society) => society.id === featuredEvent.societyId);

  return (
    <AppScreen
      subtitle={today.toLocaleDateString('en-AU', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      })}
      title="Hello, Pat">
      <View className="gap-8">
        <View className="gap-6 xl:flex-row">
          <View className="min-w-0 flex-[1.4]">
            <SectionHeader
              action={
                <Button
                  label="Open calendar"
                  onPress={() => router.push('/calendar')}
                  size="sm"
                  variant="ghost"
                />
              }
              description="Your next commitments across classes and campus life."
              title="Today"
            />
            <Card className="p-0">
              {todaysEvents.map((event, index) => (
                <Pressable
                  accessibilityRole="button"
                  key={event.id}
                  onPress={() => router.push('/calendar')}
                  className={`min-h-20 flex-row items-center gap-4 px-4 py-3 active:bg-surface-muted ${
                    index < todaysEvents.length - 1 ? 'border-b border-border' : ''
                  }`}>
                  <View className="w-14">
                    <Text className="text-base font-black text-ink">{event.startTime}</Text>
                    <Text className="mt-0.5 text-xs text-muted">{event.endTime ?? 'Deadline'}</Text>
                  </View>
                  <View className="h-10 w-1 rounded-full bg-info" />
                  <View className="min-w-0 flex-1">
                    <Text className="text-base font-bold text-ink" numberOfLines={1}>
                      {event.title}
                    </Text>
                    <Text className="mt-1 text-sm text-muted" numberOfLines={1}>
                      {event.location ?? event.courseCode}
                    </Text>
                  </View>
                  <Ionicons color={colors.muted} name="chevron-forward" size={18} />
                </Pressable>
              ))}
            </Card>
          </View>

          <View className="min-w-0 flex-1">
            <SectionHeader
              action={
                <Button
                  label="View MyPlan"
                  onPress={() => router.push('/my-plan')}
                  size="sm"
                  variant="ghost"
                />
              }
              description={`${completedUoc} UOC completed · ${plannedUoc} UOC planned`}
              title="Degree progress"
            />
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push('/my-plan')}
              className="rounded-card border border-border bg-ink p-5 active:opacity-90">
              <View className="flex-row items-end justify-between gap-4">
                <View>
                  <Text className="text-sm font-bold uppercase tracking-wide text-white/60">
                    Bachelor of Computer Science
                  </Text>
                  <Text className="mt-2 text-4xl font-black text-white">{progress}%</Text>
                </View>
                <View className="h-12 w-12 items-center justify-center rounded-xl bg-brand">
                  <Ionicons color={colors.ink} name="map" size={24} />
                </View>
              </View>
              <View className="mt-5">
                <ProgressBar value={progress} />
              </View>
              <Text className="mt-4 text-sm leading-5 text-white/70">
                {DEGREE_TOTAL_UOC - completedUoc} UOC remain in your current degree plan.
              </Text>
            </Pressable>
          </View>
        </View>

        <View className="gap-6 xl:flex-row">
          <View className="min-w-0 flex-1">
            <SectionHeader title="Important updates" />
            <View className="gap-3">
              <DashboardLink
                description="L3 Light Rail services have changed between Kingsford and Central."
                icon="train-outline"
                onPress={() => router.push('/calendar')}
                title="Transport notice"
              />
              <DashboardLink
                description="COMP3311 database assignment is released next Thursday."
                icon="document-text-outline"
                onPress={() => router.push('/courses/COMP3311')}
                title="Upcoming coursework"
              />
            </View>
          </View>

          <View className="min-w-0 flex-1">
            <SectionHeader
              action={
                <Button
                  label="Explore"
                  onPress={() => router.push('/societies')}
                  size="sm"
                  variant="ghost"
                />
              }
              title="Campus life"
            />
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push(`/societies/events/${featuredEvent.id}`)}
              className="rounded-card border border-border bg-surface p-4 active:bg-surface-raised">
              <View className="flex-row items-start gap-4">
                <View className="h-12 w-12 items-center justify-center rounded-xl bg-brand-soft">
                  <Ionicons color={colors.ink} name="people-outline" size={23} />
                </View>
                <View className="min-w-0 flex-1">
                  <Text className="text-xs font-bold uppercase tracking-wide text-muted">
                    {featuredSociety?.shortName}
                  </Text>
                  <Text className="mt-1 text-lg font-extrabold text-ink">{featuredEvent.title}</Text>
                  <Text className="mt-2 text-sm leading-5 text-muted">
                    {featuredEvent.date} · {featuredEvent.location}
                  </Text>
                </View>
                <Ionicons color={colors.muted} name="chevron-forward" size={18} />
              </View>
            </Pressable>
          </View>
        </View>
      </View>
    </AppScreen>
  );
}

function DashboardLink({
  icon,
  title,
  description,
  onPress,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  title: string;
  description: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className="min-h-20 flex-row items-center gap-4 rounded-card border border-border bg-surface p-4 active:bg-surface-raised">
      <View className="h-11 w-11 items-center justify-center rounded-xl bg-surface-muted">
        <Ionicons color={colors.ink} name={icon} size={21} />
      </View>
      <View className="min-w-0 flex-1">
        <Text className="text-base font-extrabold text-ink">{title}</Text>
        <Text className="mt-1 text-sm leading-5 text-muted">{description}</Text>
      </View>
      <Ionicons color={colors.muted} name="chevron-forward" size={18} />
    </Pressable>
  );
}
