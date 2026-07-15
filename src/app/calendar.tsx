import { router } from 'expo-router';
import { AppShell, EmptyPlaceholder } from '@/components/plan-ui';

export default function CalendarPlaceholder() {
  return (
    <AppShell title="Calendar" eyebrow="Schedule">
      <EmptyPlaceholder
        title="Calendar integration is ready to connect"
        description="Person 2 owns this page. Planned MyPlan courses can later supply term dates and enrolment reminders to this calendar."
        actionLabel="Review planned terms"
        onAction={() => router.push('/planner')}
      />
    </AppShell>
  );
}
