import { useState } from "react";

import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// import { Ionicons } from "@expo/vector-icons";

import CourseCard from "../components/course-card";
import { courses } from "../data/courses";
import { Colours } from "../themes/colours";

export default function SearchScreen() {
  const [search, setSearch] = useState("");

  const filtered = courses.filter(course =>
    `${course.code} ${course.title}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>UNSW</Text>

        <TouchableOpacity>
          {/* <Ionicons
            name="notifications-outline"
            size={24}
          /> */}
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>
        Course Search
      </Text>

      <View style={styles.searchBar}>
        {/* <Ionicons
          name="search"
          size={20}
          color="#777"
        /> */}

        <TextInput
          placeholder="Search courses..."
          value={search}
          onChangeText={setSearch}
          style={styles.input}
        />

        {/* <Ionicons
          name="options-outline"
          size={22}
        /> */}
      </View>

      <Text style={styles.heading}>
        Popular Searches
      </Text>

      <View style={styles.popularRow}>
        {[
          "COMP1511",
          "COMP2521",
          "COMP1531",
          "MATH1081",
        ].map(course => (
          <TouchableOpacity
            key={course}
            style={styles.popularChip}
          >
            <Text>{course}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.heading}>
        Recommended
      </Text>

      <FlatList
        data={filtered}
        keyExtractor={item => item.code}
        renderItem={({ item }) => (
          <CourseCard
            course={item}
            onPress={() => {}}
          />
        )}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colours.background,
    paddingHorizontal: 20,
  },

  header: {
    backgroundColor: Colours.primary,
    marginHorizontal: -20,
    paddingHorizontal: 20,
    paddingVertical: 18,

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  logo: {
    fontWeight: "700",
    fontSize: 26,
  },

  title: {
    marginTop: 25,
    fontSize: 30,
    fontWeight: "700",
  },

  searchBar: {
    marginTop: 20,

    flexDirection: "row",
    alignItems: "center",

    backgroundColor: "white",

    borderRadius: 14,

    paddingHorizontal: 16,

    height: 55,
  },

  input: {
    flex: 1,
    marginLeft: 12,
  },

  heading: {
    fontWeight: "700",
    fontSize: 18,
    marginTop: 30,
    marginBottom: 15,
  },

  popularRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 15,
  },

  popularChip: {
    backgroundColor: "white",
    borderRadius: 30,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colours.border,
  },
});