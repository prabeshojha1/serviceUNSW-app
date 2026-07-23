import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { Badge, Button, IconButton } from '@/components/ui/app-ui';
import { colors } from '@/theme/tokens';
import { CatalogCourse } from '@/types/plan';

export function CourseListCard({
  course,
  saved,
  compared,
  planned,
  onOpen,
  onToggleSaved,
  onToggleCompare,
}: {
  course: CatalogCourse;
  saved: boolean;
  compared: boolean;
  planned: boolean;
  onOpen: () => void;
  onToggleSaved: () => void;
  onToggleCompare: () => void;
}) {
  return (
    <View className="rounded-card border border-border bg-surface p-4 shadow-sm">
      <View className="flex-row items-start gap-3">
        <Pressable
          accessibilityLabel={`Open ${course.code} ${course.title}`}
          accessibilityRole="button"
          className="min-w-0 flex-1 active:opacity-70"
          onPress={onOpen}>
          <View className="flex-row flex-wrap items-center gap-2">
            <Text className="text-sm font-black tracking-wide text-link">{course.code}</Text>
            {planned ? <Badge label="In MyPlan" tone="success" /> : null}
          </View>
          <Text className="mt-2 text-lg font-extrabold leading-6 text-ink">{course.title}</Text>
          <Text className="mt-2 text-sm leading-5 text-muted" numberOfLines={2}>
            {course.description}
          </Text>
        </Pressable>
        <IconButton
          accessibilityLabel={saved ? `Remove ${course.code} from saved` : `Save ${course.code}`}
          icon={saved ? 'bookmark' : 'bookmark-outline'}
          onPress={onToggleSaved}
          selected={saved}
        />
      </View>

      <View className="mt-4 flex-row flex-wrap items-center gap-2 border-t border-border pt-3">
        <Meta icon="school-outline" label={`${course.uoc} UOC`} />
        <Meta icon="calendar-outline" label={`${course.terms.length} terms`} />
        <Meta icon="pricetag-outline" label={course.interest} />
        <View className="min-w-2 flex-1" />
        <Button
          icon={compared ? 'checkmark' : 'git-compare-outline'}
          label={compared ? 'Comparing' : 'Compare'}
          onPress={onToggleCompare}
          size="sm"
          variant={compared ? 'primary' : 'secondary'}
        />
      </View>
    </View>
  );
}

function Meta({
  icon,
  label,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
}) {
  return (
    <View className="flex-row items-center gap-1.5 rounded-full bg-surface-muted px-2.5 py-1.5">
      <Ionicons color={colors.muted} name={icon} size={14} />
      <Text className="text-xs font-semibold text-muted">{label}</Text>
    </View>
  );
}
