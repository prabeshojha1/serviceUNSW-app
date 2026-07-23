import { Href, Redirect, useLocalSearchParams } from 'expo-router';

export default function CourseDetailRedirect() {
  const { code } = useLocalSearchParams<{ code: string }>();
  return (
    <Redirect
      href={
        {
          pathname: '/courses/[code]',
          params: { code },
        } as Href
      }
    />
  );
}
