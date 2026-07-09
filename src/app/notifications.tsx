import {
  View,
  Text,
  StyleSheet,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

export default function NotificationsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>
        Notifications
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFE600",
    padding: 20,
  },

  title: {
    fontSize: 32,
    fontWeight: "600",
  },
});