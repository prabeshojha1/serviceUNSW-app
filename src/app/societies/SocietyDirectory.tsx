import { Href, Redirect } from 'expo-router';

export default function SocietyDirectoryRedirect() {
  return <Redirect href={'/societies' as Href} />;
}
