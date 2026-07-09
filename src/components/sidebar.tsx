import { useEffect, useRef } from "react";
import {
  Text,
  Pressable,
  StyleSheet,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

interface SidebarProps {
  visible: boolean;
  onClose: () => void;
}

export default function Sidebar({
  visible,
  onClose,
}: SidebarProps) {
  const slideAnim = useRef(
    new Animated.Value(-300)
  ).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: visible ? 0 : -300,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [visible]);

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
        <SafeAreaView style={styles.drawerSafeArea}>
          <Text style={styles.title}>
            ServiceUNSW
          </Text>

          <MenuItem
            title="Calendar"
            route="/calendar"
          />

          <MenuItem
            title="Notifications"
            route="/notifications"
          />

          <MenuItem
            title="Room Bookings"
            route="/bookings"
          />

          <MenuItem
            title="Societies"
            route="/societies"
          />

          <MenuItem
            title="Courses"
            route="/courses"
          />

          <MenuItem
            title="MyPlan"
            route="/myplan"
          />

          <MenuItem
            title="AI Assistant"
            route="/myplan"
          />

          <Pressable
            style={styles.closeButton}
            onPress={onClose}
          >
            <Text style={styles.closeText}>
              Close
            </Text>
          </Pressable>
        </SafeAreaView>
      </Animated.View>
    </Pressable>
  );
}

function MenuItem({
  title,
  route,
}: {
  title: string;
  route: string;
}) {
  return (
    <Pressable
      style={styles.menuItem}
      onPress={() => {
        router.push(route as any);
      }}
    >
      <Text style={styles.menuText}>
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  drawerSafeArea: {
    flex: 1,
  },

  overlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    zIndex: 50,
  },

  drawer: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 280,
    backgroundColor: "#FFFFFF",
    zIndex: 100,
    elevation: 20,
    borderTopRightRadius: 32,
    borderBottomRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    marginTop: 28,
    marginBottom: 20,
  },

  menuItem: {
    paddingVertical: 18,
  },

  menuText: {
    fontSize: 18,
  },

  closeButton: {
    marginTop: 30,
  },

  closeText: {
    color: "#666",
    fontSize: 16,
  },
});