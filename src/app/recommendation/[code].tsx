import { Href, Redirect, useLocalSearchParams } from 'expo-router';

export default function RecommendationRedirect() {
  const { code } = useLocalSearchParams<{ code: string }>();
  return (
    <Redirect
      href={
        {
          pathname: '/my-plan/recommendation/[code]',
          params: { code },
        } as Href
      }
    />
  );
}
