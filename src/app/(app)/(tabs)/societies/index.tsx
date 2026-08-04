import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, Text, View } from '@/components/ui/native';

import {
  AppScreen,
  Button,
  Chip,
  EmptyState,
  SearchField,
  SectionHeader,
} from '@/components/ui/app-ui';
import { useSocieties } from '@/context/society-context';
import { societies } from '@/data/societies';
import { colors } from '@/theme/tokens';
import { Society, SocietyCategory } from '@/types/society';

const categories: ('All' | SocietyCategory)[] = ['All', 'Academic', 'Social', 'Sports', 'Arts'];

export default function SocietiesScreen() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<(typeof categories)[number]>('All');
  const { joinedIds, toggleJoined } = useSocieties();

  const filtered = useMemo(
    () =>
      societies.filter((society) => {
        const query = search.trim().toLowerCase();
        const matchesSearch =
          !query ||
          society.name.toLowerCase().includes(query) ||
          society.description.toLowerCase().includes(query);
        return matchesSearch && (category === 'All' || society.category === category);
      }),
    [category, search],
  );

  return (
    <AppScreen
      subtitle="Find communities, events, and campus activities"
      title="Societies">
      <View className="gap-8">
        <View className="gap-3 md:flex-row">
          <DirectoryLink
            description={`${joinedIds.length} joined societies`}
            icon="checkmark-circle-outline"
            label="My societies"
            onPress={() => router.push('/societies/subscribed')}
          />
          <DirectoryLink
            description="Workshops, socials, and activities"
            icon="calendar-outline"
            label="Upcoming events"
            onPress={() => router.push('/societies/events')}
          />
        </View>

        <View>
          <SectionHeader
            description="Search by name or browse a category."
            title="Society directory"
          />
          <SearchField
            onChangeText={setSearch}
            placeholder="Search societies"
            value={search}
          />
          <View className="mt-3 flex-row flex-wrap gap-2">
            {categories.map((item) => (
              <Chip
                key={item}
                label={item}
                onPress={() => setCategory(item)}
                selected={category === item}
              />
            ))}
          </View>
        </View>

        <View>
          <SectionHeader
            description={`${filtered.length} ${
              filtered.length === 1 ? 'community' : 'communities'
            } found`}
            title={category === 'All' ? 'All societies' : category}
          />
          <View className="gap-3 md:flex-row md:flex-wrap">
            {filtered.length ? (
              filtered.map((society) => (
                <SocietyCard
                  joined={joinedIds.includes(society.id)}
                  key={society.id}
                  onOpen={() => router.push(`/societies/${society.id}`)}
                  onToggle={() => toggleJoined(society.id)}
                  society={society}
                />
              ))
            ) : (
              <View className="w-full">
                <EmptyState
                  action={
                    <Button
                      label="Clear search"
                      onPress={() => {
                        setSearch('');
                        setCategory('All');
                      }}
                      variant="secondary"
                    />
                  }
                  description="Try another name or browse all society categories."
                  icon="people-outline"
                  title="No societies found"
                />
              </View>
            )}
          </View>
        </View>
      </View>
    </AppScreen>
  );
}

function DirectoryLink({
  icon,
  label,
  description,
  onPress,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  description: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      className="min-h-24 min-w-0 flex-1 flex-row items-center gap-4 rounded-card border border-border bg-surface p-4 active:bg-surface-raised"
      onPress={onPress}>
      <View className="h-12 w-12 items-center justify-center rounded-xl bg-brand-soft">
        <Ionicons color={colors.ink} name={icon} size={23} />
      </View>
      <View className="min-w-0 flex-1">
        <Text className="text-base font-extrabold text-ink">{label}</Text>
        <Text className="mt-1 text-sm text-muted">{description}</Text>
      </View>
      <Ionicons color={colors.muted} name="chevron-forward" size={18} />
    </Pressable>
  );
}

function SocietyCard({
  society,
  joined,
  onOpen,
  onToggle,
}: {
  society: Society;
  joined: boolean;
  onOpen: () => void;
  onToggle: () => void;
}) {
  return (
    <View className="min-w-[280px] flex-1 overflow-hidden rounded-card border border-border bg-surface">
      <Pressable accessibilityRole="button" onPress={onOpen} className="active:opacity-80">
        <Image
          accessibilityLabel=""
          className="h-36 w-full bg-surface-muted"
          contentFit="cover"
          source={society.image}
          transition={180}
        />
        <View className="p-4">
          <Text className="text-xs font-bold uppercase tracking-wide text-link">
            {society.category} · {society.memberCount.toLocaleString('en-AU')} members
          </Text>
          <Text className="mt-2 text-lg font-extrabold leading-6 text-ink">{society.name}</Text>
          <Text className="mt-2 text-sm leading-5 text-muted" numberOfLines={2}>
            {society.description}
          </Text>
        </View>
      </Pressable>
      <View className="border-t border-border p-3">
        <Button
          fullWidth
          icon={joined ? 'checkmark' : 'add'}
          label={joined ? 'Joined' : 'Join society'}
          onPress={onToggle}
          size="sm"
          variant={joined ? 'secondary' : 'primary'}
        />
      </View>
    </View>
  );
}
