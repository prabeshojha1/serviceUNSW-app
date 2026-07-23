import { Href, Redirect, useLocalSearchParams } from 'expo-router';

export default function TermRedirect() {
  const { term } = useLocalSearchParams<{ term: string }>();
  return (
    <Redirect
      href={
        {
          pathname: '/my-plan/term/[term]',
          params: { term },
        } as Href
      }
    />
  );
}
