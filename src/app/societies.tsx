import { router } from 'expo-router';
import { AppShell, EmptyPlaceholder } from '@/components/plan-ui';

export default function SocietiesPlaceholder() {
  return (
    <AppShell title="Societies" eyebrow="Discover">
      <EmptyPlaceholder
        title="Society discovery placeholder"
        description="Person 3 owns this section. Interests selected here can later inform MyPlan elective recommendations."
        actionLabel="Ask for elective ideas"
        onAction={() => router.push('/ai-assistant')}
      />
    </AppShell>
  );
}
