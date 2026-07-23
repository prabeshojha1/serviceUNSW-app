import { Href, Redirect } from 'expo-router';

export default function EventsRedirect() {
  return <Redirect href={'/societies/events' as Href} />;
}
