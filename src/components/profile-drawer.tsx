import { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated,
} from "react-native";

import { router } from "expo-router";

interface ProfileDrawerProps {
  visible: boolean;
  onClose: () => void;
}

export default function ProfileDrawer({
  visible,
  onClose,
}: ProfileDrawerProps) {
  const [slideAnim] = useState(() => new Animated.Value(300));

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: visible ? 0 : 300,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [slideAnim, visible]);

  if (!visible) {
    return null;
  }

  return (
    <Pressable
      style={styles.overlay}
      onPress={onClose}
    >
      <Animated.View
        style={[
          styles.drawer,
          {
            transform: [
              {
                translateX: slideAnim
              }
            ]
          }
        ]}
      >
        <Pressable>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              [FL]
            </Text>
          </View>

          <Text style={styles.name}>
            [Student Name]
          </Text>

          <Text style={styles.degree}>
            [Student Degree]
          </Text>

          <Pressable
            style={styles.item}
            onPress={() =>
              router.push("/profile")
            }
          >
            <Text style={styles.itemText}>
              Profile
            </Text>
        </Pressable>

        <Pressable style={styles.item}>
          <Text style={styles.itemText}>
            Settings
          </Text>
        </Pressable>

        <Pressable style={styles.item}>
          <Text style={styles.itemText}>
            Notification Preferences
          </Text>
        </Pressable>

        <Pressable
            onPress={() => router.replace("/")}
            style={styles.item}>
          <Text style={styles.logout}>
            Logout
          </Text>
        </Pressable>

        <Pressable
          style={styles.closeButton}
          onPress={onClose}
        >
          <Text>Close</Text>
        </Pressable>
      </Pressable>
    </Animated.View>
  </Pressable>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.35)",
    zIndex: 50,
  },

  drawer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    width: 280,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 32,
    borderBottomLeftRadius: 32,
    paddingHorizontal: 24,
    zIndex: 100,
    elevation: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },

  drawerSafeArea: {
    flex: 1,
  },

  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#FFE600",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    marginBottom: 12,
  },

  avatarText: {
    fontSize: 24,
    fontWeight: "700",
  },

  name: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 10,
  },

  degree: {
    color: "#666",
    marginBottom: 30,
  },

  item: {
    paddingVertical: 18,
  },

  itemText: {
    fontSize: 18,
  },

  logout: {
    color: "#D11A2A",
    fontSize: 18,
  },

  closeButton: {
    marginTop: 30,
  },
});
