import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import CourseCard from '@/components/course-card';
import { AppShell, PrimaryButton, palette, sharedStyles } from '@/components/plan-ui';
import { courses } from '@/data/courses';
import { Ionicons } from '@expo/vector-icons';

export default function SearchScreen() {
  const [search, setSearch] = useState('');
  const filtered = courses.filter((course) => `${course.code} ${course.title}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <AppShell
      title="Course search"
      eyebrow="Catalogue"
      action={<PrimaryButton label="Add to MyPlan" onPress={() => router.push('/add-course')} compact />}>
      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>⌕</Text>
        <TextInput
          placeholder="Search by course code or title…"
          placeholderTextColor="#777770"
          value={search}
          onChangeText={setSearch}
          style={styles.input}
        />
        <Ionicons
          onPress={() => router.push("/course-search-filter")}
          name="options-outline"
          size={22}
        />
      </View>

      <Text style={styles.heading}>Popular searches</Text>
      <View style={styles.popularRow}>
        {['COMP1511', 'COMP2521', 'COMP1531', 'MATH1081'].map((code) => (
          <Pressable key={code} onPress={() => setSearch(code)} style={styles.popularChip}>
            <Text style={styles.popularText}>{code}</Text>
          </Pressable>
        ))}
      </View>

      <View style={sharedStyles.sectionHeader}>
        <View>
          <Text style={sharedStyles.sectionTitle}>{search ? 'Search results' : 'Recommended'}</Text>
          <Text style={sharedStyles.sectionCaption}>{filtered.length} courses</Text>
        </View>
      </View>
      <View>
        {filtered.map((course) => (
          <CourseCard key={course.code} course={course} onPress={() => router.push(`/course-detail/${course.code}`)} />
        ))}
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  searchBar: { marginTop: 18, flexDirection: 'row', alignItems: 'center', backgroundColor: palette.card, borderWidth: 1, borderColor: palette.line, borderRadius: 14, paddingHorizontal: 16, minHeight: 55 },
  searchIcon: { color: palette.muted, fontSize: 22, marginRight: 10 },
  input: { flex: 1, color: palette.ink, fontSize: 15, paddingVertical: 12 },
  heading: { color: palette.ink, fontWeight: '800', fontSize: 16, marginTop: 24, marginBottom: 12 },
  popularRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 26 },
  popularChip: { backgroundColor: palette.card, borderRadius: 22, paddingHorizontal: 14, paddingVertical: 9, borderWidth: 1, borderColor: palette.line },
  popularText: { color: palette.blue, fontSize: 12, fontWeight: '800' },
});
