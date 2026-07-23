import { Href, Redirect, useLocalSearchParams } from 'expo-router';

export default function EventDetailsRedirect() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  return <Redirect href={(`/societies/events/${id ?? 'react-native-workshop'}`) as Href} />;
}
