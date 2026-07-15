import { router } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import {
  Animated,
  Modal,
  PanResponder,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { AppShell, PrimaryButton, SecondaryButton, StatusBadge, palette } from '@/components/plan-ui';
import { usePlan } from '@/context/plan-context';
import { planTerms } from '@/data/plan';
import { PlanCourse, PlanTermId } from '@/types/plan';

type DropBounds = { x: number; y: number; width: number; height: number };

export default function PlannerScreen() {
  const { courses, moveCourse } = usePlan();
  const [movingCourse, setMovingCourse] = useState<PlanCourse | null>(null);
  const [dropTarget, setDropTarget] = useState<PlanTermId | null>(null);
  const columnRefs = useRef<Partial<Record<PlanTermId, View | null>>>({});
  const bounds = useRef<Partial<Record<PlanTermId, DropBounds>>>({});

  const measureColumns = () => {
    planTerms.filter((term) => term.id !== 'completed').forEach((term) => {
      columnRefs.current[term.id]?.measureInWindow((x, y, width, height) => {
        bounds.current[term.id] = { x, y, width, height };
      });
    });
  };

  const handleDrop = (course: PlanCourse, x: number, y: number) => {
    const target = planTerms.find((term) => {
      const area = bounds.current[term.id];
      return area && x >= area.x && x <= area.x + area.width && y >= area.y && y <= area.y + area.height;
    });
    if (target && target.id !== 'completed' && target.id !== course.termId) {
      moveCourse(course.id, target.id);
      setDropTarget(target.id);
      setTimeout(() => setDropTarget(null), 650);
    }
  };

  return (
    <AppShell
      title="Degree planner"
      eyebrow="MyPlan · Kanban view"
      action={<PrimaryButton label="+ Add course" onPress={() => router.push('/add-course')} compact />}>
      <View style={styles.toolbar}>
        <Text style={styles.helper}>Drag a course by its grip into another term, or use Move for an accessible alternative.</Text>
        <View style={styles.legend}>
          <StatusBadge status="in-progress" />
          <StatusBadge status="planned" />
          <StatusBadge status="recommended" />
        </View>
      </View>

      <ScrollView
        horizontal
        onContentSizeChange={measureColumns}
        onLayout={measureColumns}
        onScroll={measureColumns}
        scrollEventThrottle={32}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.board}>
        {planTerms.filter((term) => term.id !== 'completed').map((term) => {
          const termCourses = courses.filter((course) => course.termId === term.id);
          const termUoc = termCourses.reduce((sum, course) => sum + course.uoc, 0);
          return (
            <View
              key={term.id}
              ref={(node) => { columnRefs.current[term.id] = node; }}
              onLayout={measureColumns}
              style={[styles.column, dropTarget === term.id && styles.columnDropped]}>
              <Pressable onPress={() => router.push(`/term/${term.id}`)} style={styles.columnHeader}>
                <View>
                  <Text style={styles.year}>{term.year}</Text>
                  <Text style={styles.termLabel}>{term.shortLabel}</Text>
                </View>
                <View style={[styles.loadBadge, termUoc >= term.capacity && styles.loadBadgeFull]}>
                  <Text style={styles.loadText}>{termUoc}/{term.capacity} UOC</Text>
                </View>
              </Pressable>
              <View style={styles.cards}>
                {termCourses.map((course) => (
                  <DraggableCourse
                    key={course.id}
                    course={course}
                    onDragStart={measureColumns}
                    onDrop={(x, y) => handleDrop(course, x, y)}
                    onMove={() => setMovingCourse(course)}
                  />
                ))}
                {termCourses.length === 0 && (
                  <Pressable onPress={() => router.push({ pathname: '/add-course', params: { term: term.id } })} style={styles.emptyTerm}>
                    <Text style={styles.emptyPlus}>+</Text>
                    <Text style={styles.emptyText}>Add a course</Text>
                  </Pressable>
                )}
              </View>
              <Pressable onPress={() => router.push({ pathname: '/add-course', params: { term: term.id } })} style={styles.addButton}>
                <Text style={styles.addButtonText}>+ Add to {term.shortLabel}</Text>
              </Pressable>
            </View>
          );
        })}
      </ScrollView>

      <View style={styles.completedBar}>
        <View style={styles.completedIcon}><Text style={styles.completedIconText}>✓</Text></View>
        <View style={styles.completedContent}>
          <Text style={styles.completedTitle}>Completed courses</Text>
          <Text style={styles.completedCaption}>{courses.filter((course) => course.termId === 'completed').length} courses · tap to review your academic history</Text>
        </View>
        <SecondaryButton label="View" onPress={() => router.push('/term/completed')} compact />
      </View>

      <MoveCourseModal course={movingCourse} onClose={() => setMovingCourse(null)} onMove={(termId) => {
        if (movingCourse) moveCourse(movingCourse.id, termId);
        setMovingCourse(null);
      }} />
    </AppShell>
  );
}

function DraggableCourse({ course, onDrop, onDragStart, onMove }: {
  course: PlanCourse;
  onDrop: (x: number, y: number) => void;
  onDragStart: () => void;
  onMove: () => void;
}) {
  const [drag] = useState(() => new Animated.ValueXY());
  const [dragging, setDragging] = useState(false);
  const panResponder = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      setDragging(true);
      onDragStart();
      drag.setOffset({ x: 0, y: 0 });
      drag.setValue({ x: 0, y: 0 });
    },
    onPanResponderMove: Animated.event([null, { dx: drag.x, dy: drag.y }], { useNativeDriver: false }),
    onPanResponderRelease: (_event, gesture) => {
      onDrop(gesture.moveX, gesture.moveY);
      setDragging(false);
      Animated.spring(drag, { toValue: { x: 0, y: 0 }, useNativeDriver: false, speed: 22, bounciness: 4 }).start();
    },
    onPanResponderTerminate: () => {
      setDragging(false);
      Animated.spring(drag, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
    },
  }), [drag, onDragStart, onDrop]);

  return (
    <Animated.View style={[styles.courseCard, dragging && styles.courseDragging, { transform: drag.getTranslateTransform() }]}>
      <View style={styles.courseTop}>
        <Text style={styles.courseCode}>{course.code}</Text>
        <View accessibilityLabel={`Drag ${course.code}`} style={styles.dragGrip} {...panResponder.panHandlers}>
          <Text style={styles.dragGripText}>⠿</Text>
        </View>
      </View>
      <Text style={styles.courseTitle}>{course.title}</Text>
      <View style={styles.courseMetaRow}>
        <StatusBadge status={course.status} />
        <Text style={styles.uoc}>{course.uoc} UOC</Text>
      </View>
      <View style={styles.cardActions}>
        <Pressable onPress={onMove} style={styles.textButton}><Text style={styles.textButtonLabel}>Move</Text></Pressable>
        <Pressable onPress={() => router.push(`/course-detail/${course.code}`)} style={styles.textButton}><Text style={styles.textButtonLabel}>Details</Text></Pressable>
      </View>
    </Animated.View>
  );
}

function MoveCourseModal({ course, onClose, onMove }: {
  course: PlanCourse | null;
  onClose: () => void;
  onMove: (termId: PlanTermId) => void;
}) {
  return (
    <Modal visible={!!course} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.modalBackdrop} onPress={onClose}>
        <Pressable style={styles.modalCard} onPress={() => undefined}>
          <Text style={styles.modalEyebrow}>Move course</Text>
          <Text style={styles.modalTitle}>{course?.code} · {course?.title}</Text>
          <Text style={styles.modalBody}>Choose a destination term. This updates the overview and both term pages immediately.</Text>
          <View style={styles.termOptions}>
            {planTerms.filter((term) => term.id !== 'completed').map((term) => (
              <Pressable
                key={term.id}
                disabled={term.id === course?.termId}
                onPress={() => onMove(term.id)}
                style={({ pressed }) => [styles.termOption, term.id === course?.termId && styles.termOptionCurrent, pressed && styles.pressed]}>
                <Text style={styles.termOptionLabel}>{term.label}</Text>
                <Text style={styles.termOptionMeta}>{term.id === course?.termId ? 'Current term' : 'Move here →'}</Text>
              </Pressable>
            ))}
          </View>
          <SecondaryButton label="Cancel" onPress={onClose} />
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  toolbar: { marginTop: 12, gap: 12 },
  helper: { color: palette.muted, fontSize: 14, lineHeight: 20, maxWidth: 680 },
  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  board: { alignItems: 'flex-start', gap: 14, paddingVertical: 20, paddingRight: 20 },
  column: { width: 286, minHeight: 420, borderRadius: 19, backgroundColor: '#EAEAE5', borderWidth: 2, borderColor: 'transparent', padding: 12 },
  columnDropped: { borderColor: palette.green, backgroundColor: palette.greenSoft },
  columnHeader: { minHeight: 58, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 4, paddingBottom: 10 },
  year: { color: palette.muted, fontSize: 11, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.7 },
  termLabel: { color: palette.ink, fontSize: 20, lineHeight: 26, fontWeight: '900', marginTop: 2 },
  loadBadge: { borderRadius: 12, backgroundColor: palette.card, paddingHorizontal: 9, paddingVertical: 6 },
  loadBadgeFull: { backgroundColor: palette.orangeSoft },
  loadText: { color: palette.muted, fontSize: 10, fontWeight: '800' },
  cards: { gap: 10, minHeight: 270 },
  courseCard: { zIndex: 1, backgroundColor: palette.card, borderWidth: 1, borderColor: '#D7D7D0', borderRadius: 15, padding: 14 },
  courseDragging: { zIndex: 50, opacity: 0.9, borderColor: palette.blue, shadowColor: '#000000', shadowOpacity: 0.2, shadowRadius: 12, elevation: 10 },
  courseTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  courseCode: { color: palette.blue, fontSize: 13, lineHeight: 18, fontWeight: '900', letterSpacing: 0.4 },
  dragGrip: { width: 38, height: 30, borderRadius: 9, backgroundColor: '#EEEEEA', alignItems: 'center', justifyContent: 'center' },
  dragGripText: { color: palette.muted, fontSize: 19 },
  courseTitle: { color: palette.ink, fontSize: 16, lineHeight: 21, fontWeight: '800', marginTop: 8 },
  courseMetaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 13 },
  uoc: { color: palette.muted, fontSize: 11, fontWeight: '700' },
  cardActions: { flexDirection: 'row', gap: 8, marginTop: 13, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#EEEEEA' },
  textButton: { flex: 1, paddingVertical: 5, alignItems: 'center' },
  textButtonLabel: { color: palette.blue, fontSize: 12, fontWeight: '800' },
  emptyTerm: { minHeight: 160, borderWidth: 1, borderStyle: 'dashed', borderColor: '#BDBDB5', borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  emptyPlus: { color: palette.muted, fontSize: 27, lineHeight: 31 },
  emptyText: { color: palette.muted, fontSize: 13, fontWeight: '700', marginTop: 4 },
  addButton: { minHeight: 42, alignItems: 'center', justifyContent: 'center', marginTop: 10, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.7)' },
  addButtonText: { color: palette.ink, fontSize: 12, fontWeight: '800' },
  completedBar: { flexDirection: 'row', alignItems: 'center', gap: 13, backgroundColor: palette.card, borderWidth: 1, borderColor: palette.line, borderRadius: 17, padding: 16, marginTop: 2 },
  completedIcon: { width: 38, height: 38, borderRadius: 19, backgroundColor: palette.greenSoft, alignItems: 'center', justifyContent: 'center' },
  completedIconText: { color: palette.green, fontSize: 18, fontWeight: '900' },
  completedContent: { flex: 1 },
  completedTitle: { color: palette.ink, fontSize: 15, fontWeight: '800' },
  completedCaption: { color: palette.muted, fontSize: 12, lineHeight: 17, marginTop: 3 },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.48)', alignItems: 'center', justifyContent: 'center', padding: 20 },
  modalCard: { width: '100%', maxWidth: 500, backgroundColor: palette.background, borderRadius: 22, padding: 22 },
  modalEyebrow: { color: palette.blue, fontSize: 11, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 0.8 },
  modalTitle: { color: palette.ink, fontSize: 21, lineHeight: 27, fontWeight: '800', marginTop: 5 },
  modalBody: { color: palette.muted, fontSize: 13, lineHeight: 19, marginTop: 8 },
  termOptions: { gap: 8, marginVertical: 18 },
  termOption: { backgroundColor: palette.card, borderWidth: 1, borderColor: palette.line, borderRadius: 13, padding: 13 },
  termOptionCurrent: { opacity: 0.5, backgroundColor: '#EAEAE5' },
  termOptionLabel: { color: palette.ink, fontSize: 14, fontWeight: '800' },
  termOptionMeta: { color: palette.blue, fontSize: 11, fontWeight: '700', marginTop: 3 },
  pressed: { opacity: 0.65 },
});
