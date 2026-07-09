import { View, Pressable, Text, StyleSheet } from "react-native";
import { router, usePathname } from "expo-router";

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <View style={styles.container}>
      <NavButton
        label="Home"
        active={pathname === "/home"}
        onPress={() => router.push("/home")}
      />

      <NavButton
        label="Alerts"
        active={pathname === "/notifications"}
        onPress={() => router.push("/notifications")}
      />

      <NavButton
        label="Profile"
        active={pathname === "/profile"}
        onPress={() => router.push("/profile")}
      />
    </View>
  );
}

function NavButton({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={[styles.button, active && styles.activeButton]}
      onPress={onPress}
    >
      <Text style={[styles.label, active && styles.activeLabel]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderColor: "#E5E5E5",
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
  },

  button: {
    flex: 1,
    alignItems: "center",
  },

  activeButton: {},

  label: {
    fontSize: 15,
    color: "#777",
  },

  activeLabel: {
    color: "#000",
    fontWeight: "600",
  },
});