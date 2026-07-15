import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { palette, StatusBadge } from '@/components/plan-ui';
import { CatalogCourse } from '@/types/plan';

export function AIRecommendationCard({ course, reason, compact = false }: {
  course: CatalogCourse;
  reason: string;
  compact?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`View recommendation for ${course.code}`}
      onPress={() => router.push({ pathname: '/recommendation/[code]', params: { code: course.code } })}
      style={({ pressed }) => [styles.card, compact && styles.compact, pressed && styles.pressed]}>
      <View style={styles.icon}><Text style={styles.iconText}>✦</Text></View>
      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text style={styles.code}>{course.code}</Text>
          <StatusBadge status="recommended" />
        </View>
        <Text style={styles.title}>{course.title}</Text>
        <Text style={styles.reason} numberOfLines={compact ? 2 : 3}>{reason}</Text>
        <Text style={styles.link}>Why this fits your plan  →</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', gap: 14, backgroundColor: palette.card, borderRadius: 18, borderWidth: 1, borderColor: '#DCD0EE', padding: 17 },
  compact: { minWidth: 290, maxWidth: 360 },
  icon: { width: 38, height: 38, borderRadius: 12, backgroundColor: palette.purpleSoft, alignItems: 'center', justifyContent: 'center' },
  iconText: { color: palette.purple, fontSize: 18 },
  content: { flex: 1 },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  code: { color: palette.purple, fontSize: 14, fontWeight: '900', letterSpacing: 0.4 },
  title: { color: palette.ink, fontSize: 17, lineHeight: 22, fontWeight: '800', marginTop: 5 },
  reason: { color: palette.muted, fontSize: 13, lineHeight: 19, marginTop: 7 },
  link: { color: palette.purple, fontSize: 13, lineHeight: 18, fontWeight: '800', marginTop: 10 },
  pressed: { opacity: 0.7 },
});
