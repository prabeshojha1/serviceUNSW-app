import { Href, Redirect, useLocalSearchParams } from 'expo-router';

export default function AssistantRedirect() {
  const { course } = useLocalSearchParams<{ course?: string }>();
  return (
    <Redirect
      href={
        {
          pathname: '/my-plan/assistant',
          params: course ? { course } : {},
        } as Href
      }
    />
  );
}
