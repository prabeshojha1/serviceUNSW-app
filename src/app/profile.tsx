import {
  View,
  Text,
  StyleSheet,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>
        Profile
      </Text>

      <View style={styles.card}>
        <Text>Name: [Student Name]</Text>
        <Text>zID: [z5555555]</Text>
        <Text>Degree: Computer Science</Text>
      </View>
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
    marginBottom: 20,
  },

  card: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
  },
});