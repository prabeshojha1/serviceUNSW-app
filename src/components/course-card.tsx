import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
// import { Ionicons } from "@expo/";

import { Colours } from "../themes/colours";
import { Course } from "../types/course";

interface Props {
  course: Course;
  onPress?: () => void;
}

export default function CourseCard({
  course,
  onPress,
}: Props) {
  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <View style={styles.header}>
        <Text style={styles.code}>{course.code}</Text>

        {/* <Ionicons
          name="bookmark-outline"
          size={22}
          color="#666"
        /> */}
      </View>

      <Text style={styles.title}>{course.title}</Text>

      <Text style={styles.meta}>
        {course.uoc} UOC • Level {course.level}
      </Text>

      <View style={styles.termContainer}>
        {course.terms.map(term => (
          <View key={term} style={styles.badge}>
            <Text style={styles.badgeText}>{term}</Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colours.card,
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,

    elevation: 3,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  code: {
    fontWeight: "700",
    fontSize: 18,
    color: "#0047AB",
  },

  title: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "600",
    color: Colours.text,
  },

  meta: {
    marginTop: 8,
    color: Colours.secondaryText,
  },

  termContainer: {
    flexDirection: "row",
    marginTop: 14,
  },

  badge: {
    backgroundColor: Colours.badge,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginRight: 8,
  },

  badgeText: {
    fontWeight: "600",
    color: Colours.badgeText,
  },
});