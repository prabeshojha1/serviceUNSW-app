import React from 'react';
import { useColorScheme } from 'react-native';
import { ThemeProvider, DarkTheme, DefaultTheme, Tabs } from 'expo-router';
import { Users, Calendar } from 'lucide-react-native';

// Mock placeholders for missing global structural wrappers seen in your screenshot
const AnimatedSplashOverlay = () => null; 

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      
      <Tabs 
        screenOptions={{ 
          tabBarActiveTintColor: '#eab308', 
          tabBarStyle: { backgroundColor: '#ffffff' },
          headerShown: false // Keeps navigation bars clean
        }}
      >
        {/* 1. Societies Directory Tab */}
        <Tabs.Screen
          name="societies/index"
          options={{
            title: "Societies",
            tabBarIcon: ({ color }) => <Users size={22} color={color} />,
          }}
        />
        
        {/* 2. Hidden Profile Sub-Route */}
        <Tabs.Screen
          name="societies/[id]"
          options={{
            href: null, // Hidden from navigation bar bottom tabs
            title: "Profile",
          }}
        />
        
        {/* 3. Events Tab */}
        <Tabs.Screen
          name="events/index"
          options={{
            title: "Events",
            tabBarIcon: ({ color }) => <Calendar size={22} color={color} />,
          }}
        />
      </Tabs>
    </ThemeProvider>
  );
}
