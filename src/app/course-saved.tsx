import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const UNSW_YELLOW = "#FFD500";

type Course = {
  code: string;
  title: string;
  uoc: number;
  level: number;
  terms: string[];
};

const SAVED_COURSES: Course[] = [
  {
    code: "COMP2521",
    title: "Data Structures and Algorithms",
    uoc: 6,
    level: 2,
    terms: ["T1", "T2"],
  },
  {
    code: "MATH1081",
    title: "Mathematics 1A",
    uoc: 6,
    level: 1,
    terms: ["T1"],
  },
  {
    code: "COMP2041",
    title: "Software Construction",
    uoc: 6,
    level: 2,
    terms: ["T1"],
  },
  {
    code: "ECON1101",
    title: "Microeconomics 1",
    uoc: 6,
    level: 1,
    terms: ["T2", "T3"],
  },
  {
    code: "PHYS1131",
    title: "Physics 1A",
    uoc: 6,
    level: 1,
    terms: ["T1"],
  },
];

const BORDER_COLOURS = [
  "#3B82F6",
  "#8B5CF6",
  "#22C55E",
  "#EF4444",
  "#A855F7",
];

export default function SavedCoursesScreen() {
  const [tab, setTab] = useState<"saved" | "recent">("saved");

  const [savedCourses, setSavedCourses] =
    useState(SAVED_COURSES);

  const recentCourses = useMemo(
    () => SAVED_COURSES.slice().reverse(),
    []
  );

  const courses =
    tab === "saved" ? savedCourses : recentCourses;

  function removeCourse(code: string) {
    setSavedCourses((prev) =>
      prev.filter((c) => c.code !== code)
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}

      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          Saved courses
        </Text>

        <Ionicons
          name="notifications-outline"
          size={24}
        />
      </View>

      {/* Tabs */}

      <View style={styles.tabRow}>
        <Pressable
          style={[
            styles.tab,
            tab === "saved" && styles.activeTab,
          ]}
          onPress={() => setTab("saved")}
        >
          <Text
            style={[
              styles.tabText,
              tab === "saved" && styles.activeTabText,
            ]}
          >
            Saved ({savedCourses.length})
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.tab,
            tab === "recent" && styles.activeTab,
          ]}
          onPress={() => setTab("recent")}
        >
          <Text
            style={[
              styles.tabText,
              tab === "recent" && styles.activeTabText,
            ]}
          >
            Recently viewed
          </Text>
        </Pressable>
      </View>

      {/* Course List */}

      <FlatList
        data={courses}
        keyExtractor={(item) => item.code}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item, index }) => (
          <SavedCourseCard
            course={item}
            colour={
              BORDER_COLOURS[
                index % BORDER_COLOURS.length
              ]
            }
            removable={tab === "saved"}
            onRemove={() => removeCourse(item.code)}
          />
        )}
      />
    </SafeAreaView>
  );
}

type CardProps = {
  course: Course;
  colour: string;
  removable: boolean;
  onRemove: () => void;
};

function SavedCourseCard({
  course,
  colour,
  removable,
  onRemove,
}: CardProps) {
  return (
    <Pressable
      onPress={() =>
        router.push(`/course-detail/${course.code}`)
      }
      style={[
        styles.card,
        {
          borderLeftWidth: 5,
          borderLeftColor: colour,
        },
      ]}
    >
      <View style={styles.cardHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.code}>
            {course.code}
          </Text>

          <Text style={styles.title}>
            {course.title}
          </Text>
        </View>

        {removable && (
          <Pressable onPress={onRemove}>
            <Ionicons
              name="close"
              size={20}
              color="#666"
            />
          </Pressable>
        )}
      </View>

      <View style={styles.metaRow}>
        <Text style={styles.meta}>
          UOC {course.uoc}
        </Text>

        <Text style={styles.meta}>
          Level {course.level}
        </Text>

        <View style={styles.termRow}>
          {course.terms.map((term) => (
            <View
              key={term}
              style={styles.termChip}
            >
              <Text style={styles.termText}>
                {term}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },

  header: {
    backgroundColor: UNSW_YELLOW,
    paddingHorizontal: 20,
    paddingVertical: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
  },

  tabRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#eee",
  },

  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 14,
  },

  activeTab: {
    borderBottomWidth: 3,
    borderColor: UNSW_YELLOW,
  },

  tabText: {
    color: "#666",
    fontWeight: "500",
  },

  activeTabText: {
    color: "#000",
    fontWeight: "700",
  },

  card: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,

    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },

    elevation: 2,
  },

  cardHeader: {
    flexDirection: "row",
  },

  code: {
    color: "#1D4ED8",
    fontWeight: "700",
    fontSize: 15,
  },

  title: {
    fontSize: 18,
    marginTop: 4,
    fontWeight: "600",
  },

  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
  },

  meta: {
    color: "#666",
    marginRight: 14,
    fontSize: 13,
  },

  termRow: {
    flexDirection: "row",
  },

  termChip: {
    backgroundColor: "#FFF4B3",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 5,
    marginRight: 5,
  },

  termText: {
    fontSize: 12,
    fontWeight: "600",
  },
});