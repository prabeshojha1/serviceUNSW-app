import { Href, Redirect } from 'expo-router';

export default function SavedCoursesRedirect() {
  return <Redirect href={'/courses/saved' as Href} />;
}
