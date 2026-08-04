import { Href, Redirect, useLocalSearchParams } from 'expo-router';

export default function AssistantRedirect() {
  const { course } = useLocalSearchParams<{ course?: string }>();
  return (
    <Redirect
      href={
        {
          pathname: '/my-plan',
          params: { assistant: '1', ...(course ? { course } : {}) },
        } as Href
      }
    />
  );
}
