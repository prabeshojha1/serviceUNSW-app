import { router } from 'expo-router';
import { View } from '@/components/ui/native';

import {
  AppScreen,
  Button,
  EmptyState,
  SectionHeader,
} from '@/components/ui/app-ui';
import { useSocieties } from '@/context/society-context';
import { societies } from '@/data/societies';

export default function SubscribedSocietiesScreen() {
  const { joinedIds } = useSocieties();
  const joined = societies.filter((society) => joinedIds.includes(society.id));

  return (
    <AppScreen back subtitle="Communities you follow" title="My societies">
      <SectionHeader
        description={`${joined.length} ${joined.length === 1 ? 'society' : 'societies'} joined`}
        title="Your communities"
      />
      {joined.length ? (
        <View className="gap-3">
          {joined.map((society) => (
            <Button
              fullWidth
              icon="people-outline"
              key={society.id}
              label={society.name}
              onPress={() => router.push(`/societies/${society.id}`)}
              variant="secondary"
            />
          ))}
        </View>
      ) : (
        <EmptyState
          action={<Button label="Browse societies" onPress={() => router.replace('/societies')} />}
          description="Join a society from the directory to keep it here."
          icon="people-outline"
          title="No joined societies"
        />
      )}
    </AppScreen>
  );
}
