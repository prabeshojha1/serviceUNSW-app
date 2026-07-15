# ServiceUNSW Project Configuration

## Stack Requirements
- Framework: React Native with Expo Router / Expo UI
- Styling: NativeWind (Tailwind CSS for React Native)
- Language: TypeScript

## Person 3: Societies and Events Discovery Guidelines
- Styling Rule: Use NativeWind 'className' syntax. Do NOT use StyleSheet.create.
- Navigation: Use `<Link href="...">` from `expo-router`.
- Component Rule: Every event view must reuse the `<EventCard />` component.
- Performance: Use `<FlatList>` or `<FlashList>` for long scrolling feeds.
- Mock Images: Fall back to local assets or specified URI placeholders when server data is missing.

@"C:\Users\samin\Pictures\Screenshots\Screenshot 2026-07-12 205437.png" gemini --prompt "Analyze the layout rules in this screenshot and build the <EventCard /> component."

The font is Clancy. 

@"C:\Users\samin\OneDrive - UNSW\UNSW\Third Year\T2\VIP\serviceunsw_app_page_assignment.pdf" gemini --prompt "I am Person 3. Read this assignment PDF and look at the attached screenshot. Extract the exact UI layout rules, features, and specs outlined for the 'Societies and Events Discovery' section. Based on those criteria, generate the complete TypeScript file for our main Society Directory screen using React Native, NativeWind classNames, and Expo Router navigation."
