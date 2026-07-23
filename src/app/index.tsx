import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, Card } from '@/components/ui/app-ui';
import { colors } from '@/theme/tokens';

export default function LoginScreen() {
  const enterApp = () => router.replace('/home');

  return (
    <SafeAreaView className="flex-1 bg-brand">
      <StatusBar style="dark" />
      <ScrollView
        contentContainerClassName="mx-auto min-h-full w-full max-w-6xl justify-center gap-8 px-5 py-10 lg:flex-row lg:items-center lg:gap-16 lg:px-10"
        keyboardShouldPersistTaps="handled">
        <View className="flex-1">
          <View className="self-start rounded-xl bg-ink px-3 py-2">
            <Text className="text-lg font-black tracking-wide text-brand">UNSW</Text>
          </View>
          <Text className="mt-8 max-w-xl text-4xl font-black tracking-tight text-ink md:text-6xl">
            Everything UNSW, in one place.
          </Text>
          <Text className="mt-4 max-w-xl text-lg leading-7 text-ink/75">
            Plan your degree, manage your calendar, discover courses, and stay connected with
            campus life.
          </Text>

          <View className="mt-8 flex-row flex-wrap gap-3">
            <Feature icon="calendar-outline" label="One campus calendar" />
            <Feature icon="map-outline" label="Degree planning" />
            <Feature icon="people-outline" label="Student communities" />
          </View>
        </View>

        <Card className="w-full max-w-md flex-1 border-black/10 p-6 md:p-8">
          <Text className="text-3xl font-black tracking-tight text-ink">Welcome back</Text>
          <Text className="mt-2 text-base leading-6 text-muted">
            Sign in with your UNSW account or continue with the demonstration profile.
          </Text>

          <View className="mt-8 gap-3">
            <Button
              accessibilityLabel="Login with UNSW"
              fullWidth
              icon="school-outline"
              label="Login with UNSW"
              onPress={enterApp}
            />
            <Button
              fullWidth
              icon="person-outline"
              label="Continue as guest"
              onPress={enterApp}
              variant="secondary"
            />
          </View>

          <View className="mt-6 flex-row items-start gap-3 rounded-xl bg-surface-muted p-4">
            <Ionicons color={colors.muted} name="lock-closed-outline" size={18} />
            <Text className="flex-1 text-xs leading-5 text-muted">
              This prototype uses mock profile data. No credentials are collected or stored.
            </Text>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

function Feature({
  icon,
  label,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
}) {
  return (
    <View className="flex-row items-center gap-2 rounded-full bg-white/60 px-4 py-2.5">
      <Ionicons color={colors.ink} name={icon} size={18} />
      <Text className="text-sm font-bold text-ink">{label}</Text>
    </View>
  );
}
