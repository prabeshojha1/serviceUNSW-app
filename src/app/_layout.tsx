import '../global.css'; 
import React from 'react';
import { Tabs } from 'expo-router';
import { Users, Calendar } from 'lucide-react-native';

// Mock placeholders for missing global structural wrappers
const AnimatedSplashOverlay = () => null;

export default function TabLayout() {
  return (
    <>
      <AnimatedSplashOverlay />
      
      <Tabs 
        screenOptions={{ 
          tabBarActiveTintColor: '#FFDC00', // Using your primary yellow
          tabBarStyle: { backgroundColor: '#ffffff' },
          headerShown: false // Keeps navigation bars clean
        }}
      >
        {/* --- VISIBLE TABS --- */}
        <Tabs.Screen
          name="societies/index"
          options={{
            title: "Societies",
            tabBarIcon: ({ color }) => <Users size={22} color={color} />,
          }}
        />
        
        <Tabs.Screen
          name="events/index"
          options={{
            title: "Events",
            tabBarIcon: ({ color }) => <Calendar size={22} color={color} />,
          }}
        />

        {/* --- HIDDEN SCREENS --- */}
        <Tabs.Screen name="index" options={{ href: null }} />
        <Tabs.Screen name="explore" options={{ href: null }} />
        <Tabs.Screen name="societies/[id]" options={{ href: null }} />
        <Tabs.Screen name="societies/EventDetails" options={{ href: null }} />
        <Tabs.Screen name="societies/SocietyDirectory" options={{ href: null }} />
        <Tabs.Screen name="societies/SocietyEvents" options={{ href: null }} />
        <Tabs.Screen name="societies/SocietyProfile" options={{ href: null }} />
        <Tabs.Screen name="societies/subscribed" options={{ href: null }} />
      </Tabs>
    </>
  );
}