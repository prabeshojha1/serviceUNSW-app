import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Sidebar from "../components/sidebar";
import ProfileDrawer from "../components/profile-drawer";

const UNSW_YELLOW = "#FFE600";

export default function HomeScreen() {
  const [sidebarVisible, setSidebarVisible] =
    useState(false);

  const [profileVisible, setProfileVisible] =
    useState(false);

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Header */}
            <View style={styles.topBar}>

              <Pressable
                onPress={() => setSidebarVisible(true)}
              >
                <Text style={styles.icon}>
                  ☰
                </Text>
              </Pressable>

              <Pressable
                onPress={() => setProfileVisible(true)}
              >
                <Text style={styles.icon}>
                  👤
                </Text>
              </Pressable>

            </View>

            <Text style={styles.greeting}>
              Hello [First Name] 👋
            </Text>

            <Text style={styles.subGreeting}>
              [Today's Date]
            </Text>

            {/* Calendar */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>
                [Today's Date]
              </Text>

              <View style={styles.timelineCard}>
                <TimelineItem
                  time="10:00"
                  title="COMP1531 Tutorial"
                  location="K17 Room 203"
                />

                <TimelineItem
                  time="11:00"
                  title="Library Booking"
                  location="Study Room G14"
                />

                <TimelineItem
                  time="12:00"
                  title="CSESoc Workshop"
                  location="Online"
                  last
                />
              </View>
            </View>

            {/* Announcements */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>
                Announcements
              </Text>

              <AnnouncementCard
                title="Transport Announcement"
                subtitle="L3 Light Rail disruptions between Kingsford and Central"
                />

              <AnnouncementCard
                title="COMP1531 Assignment Due"
                subtitle="Friday 11:59 PM"
              />

              <AnnouncementCard
                title="New Society Event"
                subtitle="CSESoc Networking Night"
              />
            </View>
          </ScrollView>

          <Sidebar
            visible={sidebarVisible}
            onClose={() => setSidebarVisible(false)}
          />

          <ProfileDrawer
            visible={profileVisible}
            onClose={() => setProfileVisible(false)}
          />
        </View>
      </SafeAreaView>
    </View>
);
}

function TimelineItem({
  time,
  title,
  location,
  last = false,
}: {
  time: string;
  title: string;
  location: string;
  last?: boolean;
}) {
  return (
    <View
      style={[
        styles.timelineItem,
        last && { marginBottom: 0 },
      ]}
    >
      <Text style={styles.timelineTime}>
        {time}
      </Text>

      <View style={styles.timelineContent}>
        <Text style={styles.timelineTitle}>
          {title}
        </Text>

        <Text style={styles.timelineLocation}>
          {location}
        </Text>
      </View>
    </View>
  );
}

function AnnouncementCard({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>
        {title}
      </Text>

      <Text style={styles.cardSubtitle}>
        {subtitle}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({

  screen: {
    flex: 1,
    backgroundColor: UNSW_YELLOW,
  },

  safeArea: {
    flex: 1,
  },

  content: {
    flex: 1,
    width: "100%",
    maxWidth: 560,
    alignSelf: "center",
    backgroundColor: "#FAFAFA",
    borderRadius: 32,
    marginTop: 12,
    marginHorizontal: 12,
    overflow: "hidden",
  },

  scrollContent: {
    paddingHorizontal: 30,
    paddingTop: 20,
    paddingBottom: 40,
  },

  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 20,
  },

  icon: {
    fontSize: 30,
  },

  greeting: {
    fontSize: 30,
    fontWeight: "700",
    color: "#111",
  },

  subGreeting: {
    fontSize: 16,
    color: "#777",
    marginBottom: 24,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111",
  },

  sectionContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 4,
      },
    shadowOpacity: 0.16,
    shadowRadius: 10,
    elevation: 4,
  },

  timelineCard: {
    marginTop: 12,
  },

  timelineItem: {
    flexDirection: "row",
    marginBottom: 20,
  },

  timelineTime: {
    width: 65,
    fontWeight: "700",
    fontSize: 15,
  },

  timelineContent: {
    flex: 1,
    borderLeftWidth: 3,
    borderLeftColor: UNSW_YELLOW,
    paddingLeft: 12,
  },

  timelineTitle: {
    fontWeight: "600",
    fontSize: 16,
  },

  timelineLocation: {
    color: "#666",
    marginTop: 4,
  },

  card: {
    backgroundColor: "#F8F8F8",
    borderRadius: 16,
    padding: 16,
    marginTop: 12,
    marginBottom: 3,
    borderWidth: 1,
    borderColor: "#ECECEC",
  },

  cardTitle: {
    fontSize: 17,
    fontWeight: "600",
  },

  cardSubtitle: {
    color: "#666",
    marginTop: 4,
  },
});