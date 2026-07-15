import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Sidebar from "../components/sidebar";
import ProfileDrawer from "../components/profile-drawer";

const UNSW_YELLOW = "#FFE600";

export default function ProfileScreen() {
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
            <Text style={styles.title}>
              Profile
            </Text>

            <View style={styles.card}>
              <Text>Name: [Student Name]</Text>
              <Text>zID: [z5555555]</Text>
              <Text>Degree: [Degree]</Text>
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

  container: {
    flex: 1,
    backgroundColor: "#FFE600",
    padding: 20,
  },

  title: {
    fontSize: 32,
    fontWeight: "600",
    marginBottom: 20,
  },

  card: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
  },
});