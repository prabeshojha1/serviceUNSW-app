import { Href, Redirect } from 'expo-router';

export default function CourseCompareRedirect() {
  return <Redirect href={'/courses/compare' as Href} />;
}
