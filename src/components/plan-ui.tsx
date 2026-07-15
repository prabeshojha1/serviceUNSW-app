import { Href, router, usePathname } from 'expo-router';
import { PropsWithChildren, ReactNode } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { CourseStatus } from '@/types/plan';

export const palette = {
  yellow: '#FFD500',
  ink: '#171717',
  muted: '#656565',
  background: '#F5F5F2',
  card: '#FFFFFF',
  line: '#E2E2DD',
  blue: '#1C5D99',
  blueSoft: '#E8F1FA',
  green: '#176B44',
  greenSoft: '#E5F4EC',
  orange: '#9A4C00',
  orangeSoft: '#FFF0D9',
  red: '#A12B2B',
  redSoft: '#FCE8E8',
  purple: '#6236A6',
  purpleSoft: '#F0E9FA',
};

const navItems: { label: string; icon: string; href: Href; matches: string[] }[] = [
  { label: 'Home', icon: '⌂', href: '/home', matches: ['/home'] },
  { label: 'Calendar', icon: '□', href: '/calendar', matches: ['/calendar'] },
  { label: 'Societies', icon: '◎', href: '/societies', matches: ['/societies'] },
  { label: 'MyPlan', icon: '▦', href: '/my-plan', matches: ['/my-plan', '/planner', '/term', '/add-course', '/ai-assistant', '/recommendation'] },
  { label: 'Courses', icon: '⌕', href: '/course-search', matches: ['/course-search', '/course-detail'] },
];

interface AppShellProps extends PropsWithChildren {
  title?: string;
  eyebrow?: string;
  action?: ReactNode;
  scroll?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
  showBack?: boolean;
}

export function AppShell({
  children,
  title,
  eyebrow,
  action,
  scroll = true,
  contentStyle,
  showBack = false,
}: AppShellProps) {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const body = (
    <View style={[styles.content, contentStyle]}>
      {(title || eyebrow || action || showBack) && (
        <View style={styles.pageHeader}>
          <View style={styles.headerTitleRow}>
            {showBack && (
              <Pressable
                accessibilityLabel="Go back"
                onPress={() => router.back()}
                style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}>
                <Text style={styles.backText}>‹</Text>
              </Pressable>
            )}
            <View style={styles.headerText}>
              {eyebrow && <Text style={styles.eyebrow}>{eyebrow}</Text>}
              {title && <Text style={styles.pageTitle}>{title}</Text>}
            </View>
          </View>
          {action}
        </View>
      )}
      {children}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.brandBar}>
        <View style={styles.brandMark}><Text style={styles.brandMarkText}>U</Text></View>
        <View>
          <Text style={styles.brand}>UNSW</Text>
          <Text style={styles.product}>Student Hub</Text>
        </View>
        <View style={styles.headerSpacer} />
        <Pressable
          accessibilityLabel="Open AI planning assistant"
          onPress={() => router.push('/ai-assistant')}
          style={({ pressed }) => [styles.aiHeaderButton, pressed && styles.pressed]}>
          <Text style={styles.aiHeaderIcon}>✦</Text>
          <Text style={styles.aiHeaderLabel}>Ask AI</Text>
        </Pressable>
      </View>

      {scroll ? (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: 96 + insets.bottom }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {body}
        </ScrollView>
      ) : (
        <View style={[styles.staticBody, { paddingBottom: 74 + insets.bottom }]}>{body}</View>
      )}

      <View style={[styles.bottomNav, { paddingBottom: Math.max(insets.bottom, 8) }]}>
        {navItems.map((item) => {
          const active = item.matches.some((match) => pathname.startsWith(match));
          return (
            <Pressable
              key={item.label}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
              onPress={() => router.replace(item.href)}
              style={({ pressed }) => [styles.navItem, active && styles.navItemActive, pressed && styles.pressed]}>
              <Text style={[styles.navIcon, active && styles.navTextActive]}>{item.icon}</Text>
              <Text numberOfLines={1} style={[styles.navLabel, active && styles.navTextActive]}>{item.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

export function PrimaryButton({ label, onPress, compact = false, disabled = false }: {
  label: string;
  onPress: () => void;
  compact?: boolean;
  disabled?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [styles.primaryButton, compact && styles.compactButton, disabled && styles.disabled, pressed && styles.pressed]}>
      <Text style={styles.primaryButtonText}>{label}</Text>
    </Pressable>
  );
}

export function SecondaryButton({ label, onPress, compact = false }: {
  label: string;
  onPress: () => void;
  compact?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.secondaryButton, compact && styles.compactButton, pressed && styles.pressed]}>
      <Text style={styles.secondaryButtonText}>{label}</Text>
    </Pressable>
  );
}

const statusConfig: Record<CourseStatus, { label: string; color: string; background: string }> = {
  completed: { label: 'Completed', color: palette.green, background: palette.greenSoft },
  'in-progress': { label: 'In progress', color: palette.blue, background: palette.blueSoft },
  planned: { label: 'Planned', color: palette.orange, background: palette.orangeSoft },
  recommended: { label: 'Recommended', color: palette.purple, background: palette.purpleSoft },
  failed: { label: 'Needs retry', color: palette.red, background: palette.redSoft },
};

export function StatusBadge({ status }: { status: CourseStatus }) {
  const config = statusConfig[status];
  return (
    <View style={[styles.statusBadge, { backgroundColor: config.background }]}>
      <View style={[styles.statusDot, { backgroundColor: config.color }]} />
      <Text style={[styles.statusText, { color: config.color }]}>{config.label}</Text>
    </View>
  );
}

export function EmptyPlaceholder({ title, description, actionLabel, onAction }: {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.emptyCard}>
      <View style={styles.emptyIcon}><Text style={styles.emptyIconText}>↗</Text></View>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyDescription}>{description}</Text>
      {actionLabel && onAction && <PrimaryButton label={actionLabel} onPress={onAction} compact />}
    </View>
  );
}

export const sharedStyles = StyleSheet.create({
  section: { marginTop: 28 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 14 },
  sectionTitle: { color: palette.ink, fontSize: 20, lineHeight: 26, fontWeight: '700' },
  sectionCaption: { color: palette.muted, fontSize: 14, lineHeight: 20 },
  card: { backgroundColor: palette.card, borderRadius: 18, borderWidth: 1, borderColor: palette.line, padding: 18 },
  row: { flexDirection: 'row', alignItems: 'center' },
});

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: palette.background },
  brandBar: { minHeight: 64, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, backgroundColor: palette.yellow, borderBottomWidth: 1, borderBottomColor: '#E5C000' },
  brandMark: { width: 30, height: 36, backgroundColor: palette.ink, alignItems: 'center', justifyContent: 'center', marginRight: 10, borderBottomLeftRadius: 8, borderBottomRightRadius: 8 },
  brandMarkText: { color: palette.yellow, fontSize: 18, fontWeight: '900' },
  brand: { fontSize: 18, lineHeight: 20, color: palette.ink, fontWeight: '900', letterSpacing: 0.4 },
  product: { fontSize: 11, lineHeight: 14, color: '#4A4100', fontWeight: '600' },
  headerSpacer: { flex: 1 },
  aiHeaderButton: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 18, paddingHorizontal: 12, paddingVertical: 8, backgroundColor: 'rgba(255,255,255,0.55)' },
  aiHeaderIcon: { color: palette.purple, fontSize: 15 },
  aiHeaderLabel: { color: palette.ink, fontSize: 13, fontWeight: '700' },
  scroll: { flex: 1 },
  staticBody: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  content: { width: '100%', maxWidth: 1080, alignSelf: 'center', paddingHorizontal: 20, paddingTop: 22 },
  pageHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 8 },
  headerTitleRow: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  headerText: { flex: 1 },
  eyebrow: { color: palette.muted, fontSize: 13, lineHeight: 18, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 3 },
  pageTitle: { color: palette.ink, fontSize: 30, lineHeight: 36, fontWeight: '800', letterSpacing: -0.5 },
  backButton: { width: 38, height: 38, borderRadius: 19, backgroundColor: palette.card, alignItems: 'center', justifyContent: 'center', marginRight: 12, borderWidth: 1, borderColor: palette.line },
  backText: { color: palette.ink, fontSize: 30, lineHeight: 32, marginTop: -4 },
  bottomNav: { position: 'absolute', left: 0, right: 0, bottom: 0, minHeight: 68, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingHorizontal: 8, paddingTop: 7, backgroundColor: palette.card, borderTopWidth: 1, borderTopColor: palette.line, ...Platform.select({ web: { boxShadow: '0 -4px 16px rgba(0,0,0,0.05)' } as ViewStyle, default: {} }) },
  navItem: { flex: 1, minWidth: 54, maxWidth: 100, alignItems: 'center', justifyContent: 'center', borderRadius: 12, paddingVertical: 5 },
  navItemActive: { backgroundColor: '#FFF7BF' },
  navIcon: { color: palette.muted, fontSize: 19, lineHeight: 22, fontWeight: '700' },
  navLabel: { color: palette.muted, fontSize: 10, lineHeight: 14, fontWeight: '600' },
  navTextActive: { color: palette.ink },
  primaryButton: { minHeight: 46, borderRadius: 13, backgroundColor: palette.ink, paddingHorizontal: 18, paddingVertical: 12, alignItems: 'center', justifyContent: 'center' },
  primaryButtonText: { color: '#FFFFFF', fontSize: 14, lineHeight: 20, fontWeight: '700' },
  secondaryButton: { minHeight: 46, borderRadius: 13, backgroundColor: palette.card, borderWidth: 1, borderColor: '#CFCFC8', paddingHorizontal: 18, paddingVertical: 12, alignItems: 'center', justifyContent: 'center' },
  secondaryButtonText: { color: palette.ink, fontSize: 14, lineHeight: 20, fontWeight: '700' },
  compactButton: { minHeight: 38, paddingVertical: 8, paddingHorizontal: 14 },
  disabled: { opacity: 0.4 },
  pressed: { opacity: 0.68 },
  statusBadge: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 12, paddingHorizontal: 9, paddingVertical: 5 },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 11, lineHeight: 14, fontWeight: '800' },
  emptyCard: { minHeight: 280, borderWidth: 1, borderStyle: 'dashed', borderColor: '#C8C8C0', borderRadius: 20, backgroundColor: palette.card, alignItems: 'center', justifyContent: 'center', padding: 28 },
  emptyIcon: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF7BF', marginBottom: 16 },
  emptyIconText: { fontSize: 24, color: palette.ink },
  emptyTitle: { color: palette.ink, fontSize: 21, lineHeight: 27, fontWeight: '800', textAlign: 'center' },
  emptyDescription: { color: palette.muted, fontSize: 15, lineHeight: 22, textAlign: 'center', maxWidth: 430, marginTop: 8, marginBottom: 18 },
});
