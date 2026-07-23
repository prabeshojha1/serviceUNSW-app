import { Href, Redirect } from 'expo-router';

export default function CourseSearchRedirect() {
  return <Redirect href={'/courses' as Href} />;
}
