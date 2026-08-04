import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { appFontFamily, useWindowDimensions } from '@/components/ui/native';

import { colors, layout } from '@/theme/tokens';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

const tabs: {
  name: 'home' | 'calendar' | 'courses' | 'my-plan' | 'societies';
  title: string;
  icon: IconName;
  activeIcon: IconName;
}[] = [
  { name: 'home', title: 'Home', icon: 'home-outline', activeIcon: 'home' },
  { name: 'calendar', title: 'Calendar', icon: 'calendar-outline', activeIcon: 'calendar' },
  { name: 'courses', title: 'Courses', icon: 'book-outline', activeIcon: 'book' },
  { name: 'my-plan', title: 'MyPlan', icon: 'map-outline', activeIcon: 'map' },
  { name: 'societies', title: 'Societies', icon: 'people-outline', activeIcon: 'people' },
];

export default function TabLayout() {
  const { width } = useWindowDimensions();
  const desktop = width >= layout.desktopNavigationBreakpoint;

  return (
    <Tabs
      backBehavior="history"
      screenOptions={{
        animation: 'fade',
        freezeOnBlur: true,
        headerShown: false,
        sceneStyle: { backgroundColor: colors.canvas },
        tabBarActiveBackgroundColor: colors.brandSoft,
        tabBarActiveTintColor: colors.ink,
        tabBarAllowFontScaling: true,
        tabBarHideOnKeyboard: true,
        tabBarInactiveTintColor: colors.muted,
        tabBarItemStyle: desktop
          ? { borderRadius: 12, marginHorizontal: 12, marginVertical: 4, minHeight: 52 }
          : { borderRadius: 12, marginHorizontal: 3, marginVertical: 5 },
        tabBarLabelPosition: desktop ? 'beside-icon' : 'below-icon',
        tabBarLabelStyle: {
          fontFamily: appFontFamily,
          fontSize: desktop ? 15 : 11,
          fontWeight: '700',
        },
        tabBarPosition: desktop ? 'left' : 'bottom',
        tabBarStyle: desktop
          ? {
              width: layout.desktopRailWidth,
              minWidth: layout.desktopRailWidth,
              maxWidth: layout.desktopRailWidth,
              borderRightColor: colors.border,
              borderRightWidth: 1,
              borderTopWidth: 0,
              backgroundColor: colors.surface,
              paddingTop: 18,
              paddingBottom: 18,
            }
          : {
              minHeight: layout.mobileTabHeight,
              borderTopColor: colors.border,
              borderTopWidth: 1,
              backgroundColor: colors.surface,
            },
        tabBarVariant: desktop ? 'material' : 'uikit',
      }}>
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarAccessibilityLabel: `${tab.title} tab`,
            tabBarIcon: ({ color, focused, size }) => (
              <Ionicons
                color={color}
                name={focused ? tab.activeIcon : tab.icon}
                size={Math.min(size, desktop ? 23 : 22)}
              />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
