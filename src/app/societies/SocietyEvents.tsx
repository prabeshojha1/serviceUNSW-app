import { Href, Redirect } from 'expo-router';

export default function SocietyEventsRedirect() {
  return <Redirect href={'/societies/events' as Href} />;
}
