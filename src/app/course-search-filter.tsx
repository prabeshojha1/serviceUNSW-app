import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { router } from "expo-router";
import { useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";

const UNSW_YELLOW = "#FFD500";

const faculties = [
  "All Faculties",
  "Engineering",
  "Science",
  "Business",
  "Arts",
];

const interestAreas = [
  "All interest areas",
  "Programming",
  "AI",
  "Security",
  "Data Science",
];

export default function CourseFiltersScreen() {
  const [faculty, setFaculty] = useState("All Faculties");
  const [terms, setTerms] = useState({
    t1: true,
    t2: true,
    t3: false,
  });
  const [level, setLevel] = useState(2);
  const [uoc, setUoc] = useState(6);
  const [hasPrereqs, setHasPrereqs] = useState(false);
  const [interest, setInterest] = useState("All interest areas");

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}

      <View style={styles.header}>
        <Pressable>
          <Ionicons onPress={() => router.push("/course-search")} name="close" size={26} />
        </Pressable>

        <Text style={styles.headerTitle}>Filters</Text>

        <Pressable>
          <Text style={styles.clear}>Clear all</Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Faculty */}

        <Text style={styles.section}>Faculty</Text>

        <Pressable style={styles.dropdown}>
          <Text>{faculty}</Text>

          <Ionicons
            name="chevron-down"
            size={18}
            color="#555"
          />
        </Pressable>

        {/* Terms */}

        <Text style={styles.section}>Term offered</Text>

        <Checkbox
          label="Term 1"
          checked={terms.t1}
          onPress={() =>
            setTerms({
              ...terms,
              t1: !terms.t1,
            })
          }
        />

        <Checkbox
          label="Term 2"
          checked={terms.t2}
          onPress={() =>
            setTerms({
              ...terms,
              t2: !terms.t2,
            })
          }
        />

        <Checkbox
          label="Term 3"
          checked={terms.t3}
          onPress={() =>
            setTerms({
              ...terms,
              t3: !terms.t3,
            })
          }
        />

        {/* Level */}

        <Text style={styles.section}>Level</Text>

        <View style={styles.levelRow}>
          {[1, 2, 3, 4].map((l) => (
            <Pressable
              key={l}
              style={[
                styles.levelButton,
                level === l && styles.levelButtonActive,
              ]}
              onPress={() => setLevel(l)}
            >
              <Text
                style={[
                  styles.levelText,
                  level === l && styles.levelTextActive,
                ]}
              >
                {l === 4 ? "Level 4+" : `Level ${l}`}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* UOC */}

        <Text style={styles.section}>UOC</Text>

        <View style={styles.sliderLabels}>
          <Text>0</Text>
          <Text>{uoc}</Text>
          <Text>12</Text>
        </View>

        <Slider
          minimumValue={0}
          maximumValue={12}
          step={6}
          value={uoc}
          minimumTrackTintColor={UNSW_YELLOW}
          maximumTrackTintColor="#ddd"
          onValueChange={setUoc}
        />

        {/* Prerequisites */}

        <Text style={styles.section}>Prerequisites</Text>

        <View style={styles.switchRow}>
          <Text>Has prerequisites only</Text>

          <Switch
            value={hasPrereqs}
            onValueChange={setHasPrereqs}
            trackColor={{
              true: UNSW_YELLOW,
            }}
          />
        </View>

        {/* Interest */}

        <Text style={styles.section}>Interest area</Text>

        <Pressable style={styles.dropdown}>
          <Text>{interest}</Text>

          <Ionicons
            name="chevron-down"
            size={18}
            color="#555"
          />
        </Pressable>

        {/* Button */}

        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>
            Apply filters
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function Checkbox({
  label,
  checked,
  onPress,
}: {
  label: string;
  checked: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={styles.checkboxRow}
      onPress={onPress}
    >
      <View
        style={[
          styles.checkbox,
          checked && styles.checkboxChecked,
        ]}
      >
        {checked && (
          <Ionicons
            name="checkmark"
            size={16}
            color="black"
          />
        )}
      </View>

      <Text>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  header: {
    backgroundColor: UNSW_YELLOW,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
  },

  clear: {
    fontWeight: "600",
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  section: {
    fontSize: 15,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 10,
  },

  dropdown: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },

  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#bbb",
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  checkboxChecked: {
    backgroundColor: UNSW_YELLOW,
    borderColor: UNSW_YELLOW,
  },

  levelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  levelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingVertical: 12,
    marginHorizontal: 4,
    alignItems: "center",
  },

  levelButtonActive: {
    backgroundColor: UNSW_YELLOW,
    borderColor: UNSW_YELLOW,
  },

  levelText: {
    color: "#555",
  },

  levelTextActive: {
    color: "#000",
    fontWeight: "700",
  },

  sliderLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },

  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  button: {
    backgroundColor: UNSW_YELLOW,
    padding: 18,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 40,
  },

  buttonText: {
    fontWeight: "700",
    fontSize: 16,
  },
});