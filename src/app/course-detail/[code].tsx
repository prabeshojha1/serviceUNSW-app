import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { getCatalogCourse } from '@/context/plan-context';
import { outlineTopics } from '@/data/course-outline-data';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

const UNSW_YELLOW = "#FFD500";
const LIGHT_GREY = "#F6F6F6";
const BORDER = "#E5E5E5";
const BLUE = "#0047AB";

export default function CourseDetailsPlaceholder() {
  const [selectedTab, setSelectedTab] = useState("Outline");
  const { code } = useLocalSearchParams<{ code: string }>();
  const course = getCatalogCourse(code);

  const terms = (course?.terms ?? []).map(term =>
    term.replace(/202\d-/, "").replace("t", "T")
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}

      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons onPress={() => router.push("/course-search")} name="arrow-back" size={24} />
        </TouchableOpacity>

        <View style={styles.headerIcons}>
          <TouchableOpacity style={{ marginRight: 18 }}>
            <Ionicons name="share-outline" size={22} />
          </TouchableOpacity>

          <TouchableOpacity>
            <Ionicons name="bookmark-outline" size={22} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Course */}

        <View style={styles.content}>
          <Text style={styles.code}>{code}</Text>

          <Text style={styles.title}>
            {course?.description}
          </Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoText}>UOC {course?.uoc}</Text>

            <Text style={styles.dot}>•</Text>

            <Text style={styles.infoText}>Level {course?.code.match("[1-9]")}</Text>

            <Text style={styles.dot}>•</Text>

            <Text style={styles.infoText}>Offered in</Text>

            <View style={styles.termBadge}>
              <Text style={styles.termText}>{terms.join(", ")}</Text>
            </View>
          </View>

          {/* Buttons */}

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.primaryButton}>
              <Ionicons name="add" size={20} color="black" />

              <Text style={styles.primaryText}>Add to MyPlan</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton}>
              <Ionicons
                name="bookmark-outline"
                size={18}
                color="black"
              />

              <Text style={styles.secondaryText}>Save course</Text>
            </TouchableOpacity>
          </View>

          {/* Tabs */}

          <View style={styles.tabs}>
            {["Overview", "Outline", "Assessment", "Resources"].map(
              (tab) => (
                <TouchableOpacity
                  key={tab}
                  style={styles.tab}
                  onPress={() => setSelectedTab(tab)}
                >
                  <Text
                    style={[
                      styles.tabText,
                      selectedTab === tab && styles.activeTab,
                    ]}
                  >
                    {tab}
                  </Text>

                  {selectedTab === tab && (
                    <View style={styles.activeLine} />
                  )}
                </TouchableOpacity>
              )
            )}
          </View>

          {/* Outline Card */}

          {selectedTab === "Outline" && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>
                Course outline summary
              </Text>

              <Text style={styles.cardDescription}>
                Below is a summary of the key topics covered in
                this course.
              </Text>

              {outlineTopics.map((topic) => (
                <TouchableOpacity
                  key={topic.id}
                  style={styles.topic}
                >
                  <View>
                    <Text style={styles.topicTitle}>
                      {topic.id}. {topic.title}
                    </Text>

                    <Text style={styles.topicSubtitle}>
                      {topic.subtitle}
                    </Text>
                  </View>

                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    color="#999"
                  />
                </TouchableOpacity>
              ))}

              <TouchableOpacity style={styles.pdfButton}>
                <Ionicons
                  name="document-text-outline"
                  size={18}
                />

                <Text style={{ flex: 1, marginLeft: 10 }}>
                  View full course outline (PDF)
                </Text>

                <Ionicons
                  name="open-outline"
                  size={18}
                />
              </TouchableOpacity>
            </View>
          )}

          {/* Overview */}

          <View style={{ marginTop: 25 }}>
            <Text style={styles.sectionTitle}>Overview</Text>

            <Text style={styles.overview}>
              Introduction to fundamental data structures and
              algorithms and their applications in solving
              computational problems efficiently.
            </Text>

            <TouchableOpacity>
              <Text style={styles.showMore}>Show more ▼</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}

      <View style={styles.bottomNav}>
        {[
          ["search-outline", "Search"],
          ["bookmark-outline", "Saved"],
          ["git-compare-outline", "Compare"],
          ["calendar-outline", "MyPlan"],
          ["person-outline", "Profile"],
        ].map(([icon, label]) => (
          <TouchableOpacity
            key={label}
            style={styles.navItem}
          >
            <Ionicons
              name={icon as any}
              size={22}
              color={label === "Search" ? UNSW_YELLOW : "#666"}
            />

            <Text
              style={{
                fontSize: 11,
                color:
                  label === "Search"
                    ? UNSW_YELLOW
                    : "#666",
              }}
            >
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },

  header: {
    height: 60,
    backgroundColor: UNSW_YELLOW,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
  },

  headerIcons: {
    flexDirection: "row",
  },

  content: {
    padding: 20,
  },

  code: {
    fontSize: 34,
    fontWeight: "700",
  },

  title: {
    fontSize: 24,
    fontWeight: "600",
    marginTop: 5,
    marginBottom: 18,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },

  infoText: {
    color: "#666",
    fontSize: 15,
  },

  dot: {
    marginHorizontal: 8,
    color: "#888",
  },

  termBadge: {
    backgroundColor: "#FFE680",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginLeft: 8,
  },

  termText: {
    fontWeight: "600",
  },

  buttonRow: {
    flexDirection: "row",
    marginTop: 25,
    justifyContent: "space-between",
  },

  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: UNSW_YELLOW,
    flex: 1,
    padding: 14,
    borderRadius: 10,
    marginRight: 10,
  },

  secondaryButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BORDER,
  },

  primaryText: {
    fontWeight: "700",
    marginLeft: 8,
  },

  secondaryText: {
    marginLeft: 8,
    fontWeight: "600",
  },

  tabs: {
    flexDirection: "row",
    marginTop: 28,
    marginBottom: 20,
  },

  tab: {
    marginRight: 28,
  },

  tabText: {
    color: "#777",
    fontWeight: "500",
  },

  activeTab: {
    color: "black",
    fontWeight: "700",
  },

  activeLine: {
    height: 3,
    backgroundColor: UNSW_YELLOW,
    marginTop: 8,
    borderRadius: 5,
  },

  card: {
    backgroundColor: LIGHT_GREY,
    borderRadius: 12,
    padding: 18,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
  },

  cardDescription: {
    color: "#666",
    marginVertical: 10,
  },

  topic: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },

  topicTitle: {
    fontWeight: "600",
  },

  topicSubtitle: {
    color: "#777",
    marginTop: 4,
    fontSize: 13,
  },

  pdfButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 18,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 14,
    borderRadius: 10,
    backgroundColor: "white",
  },

  sectionTitle: {
    fontWeight: "700",
    fontSize: 20,
    marginBottom: 10,
  },

  overview: {
    color: "#555",
    lineHeight: 22,
  },

  showMore: {
    marginTop: 10,
    color: BLUE,
    fontWeight: "600",
  },

  bottomNav: {
    height: 70,
    borderTopWidth: 1,
    borderColor: BORDER,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },

  navItem: {
    alignItems: "center",
  },
});
