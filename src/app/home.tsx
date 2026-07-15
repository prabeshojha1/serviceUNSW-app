import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { AppShell, EmptyPlaceholder, PrimaryButton, palette, sharedStyles } from '@/components/plan-ui';

export default function HomePlaceholder() {
  return (
    <AppShell title="Good afternoon, Alex" eyebrow="Home">
      <View style={styles.hero}>
        <Text style={styles.heroLabel}>Degree planning</Text>
        <Text style={styles.heroTitle}>Your next term is taking shape.</Text>
        <Text style={styles.heroBody}>Review your planned courses or ask the planning assistant to check prerequisites.</Text>
        <PrimaryButton label="Open MyPlan" onPress={() => router.push('/my-plan')} compact />
      </View>
      <View style={sharedStyles.section}>
        <Text style={sharedStyles.sectionTitle}>Today</Text>
        <View style={{ height: 12 }} />
        <EmptyPlaceholder
          title="Home dashboard placeholder"
          description="Person 1 owns the complete dashboard. This route is connected so MyPlan can participate in the shared app navigation now."
          actionLabel="Go to MyPlan"
          onAction={() => router.push('/my-plan')}
        />
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  hero: { marginTop: 16, backgroundColor: palette.yellow, borderRadius: 22, padding: 22, alignItems: 'flex-start' },
  heroLabel: { color: '#514700', fontSize: 12, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.8 },
  heroTitle: { color: palette.ink, fontSize: 27, lineHeight: 33, fontWeight: '800', marginTop: 6, maxWidth: 560 },
  heroBody: { color: '#4C4400', fontSize: 15, lineHeight: 22, marginTop: 8, marginBottom: 18, maxWidth: 560 },
});
