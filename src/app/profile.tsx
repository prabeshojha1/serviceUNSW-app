import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Text, View } from '@/components/ui/native';

import { AppScreen, Button, Card, SectionHeader } from '@/components/ui/app-ui';
import { colors } from '@/theme/tokens';

export default function ProfileScreen() {
  return (
    <AppScreen back showProfile={false} subtitle="Account and preferences" title="Profile">
      <View className="mx-auto w-full max-w-2xl gap-6">
        <Card className="items-center p-6">
          <View className="h-24 w-24 items-center justify-center rounded-full bg-brand">
            <Text className="text-3xl font-black text-ink">PS</Text>
          </View>
          <Text className="mt-4 text-2xl font-black text-ink">Pat Student</Text>
          <Text className="mt-1 text-sm text-muted">z5555555 · Bachelor of Computer Science</Text>
        </Card>

        <View>
          <SectionHeader title="Student details" />
          <Card className="p-0">
            <ProfileRow icon="person-outline" label="Preferred name" value="Pat" />
            <ProfileRow icon="id-card-outline" label="Student ID" value="z5555555" />
            <ProfileRow icon="school-outline" label="Program" value="3778 · Computer Science" />
            <ProfileRow icon="location-outline" label="Campus" value="Kensington" last />
          </Card>
        </View>

        <View>
          <SectionHeader
            description="Calendar reminders and society subscriptions are managed in their relevant sections."
            title="Preferences"
          />
          <Card className="p-0">
            <ProfileRow icon="notifications-outline" label="Notifications" value="Enabled" />
            <ProfileRow icon="contrast-outline" label="Appearance" value="Light" last />
          </Card>
        </View>

        <Button
          fullWidth
          icon="log-out-outline"
          label="Log out"
          onPress={() => router.replace('/')}
          variant="danger"
        />
      </View>
    </AppScreen>
  );
}

function ProfileRow({
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
      <View className="h-10 w-10 items-center justify-center rounded-xl bg-surface-muted">
        <Ionicons color={colors.ink} name={icon} size={20} />
      </View>
      <Text className="flex-1 text-sm font-bold text-ink">{label}</Text>
      <Text className="max-w-[55%] text-right text-sm text-muted">{value}</Text>
    </View>
  );
}
