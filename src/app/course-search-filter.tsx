import { Href, Redirect } from 'expo-router';

export default function CourseFilterRedirect() {
  return <Redirect href={'/courses?filters=1' as Href} />;
}
