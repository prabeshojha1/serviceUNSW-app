import { Href, Redirect, useLocalSearchParams } from 'expo-router';

export default function SocietyProfileRedirect() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  return <Redirect href={(`/societies/${id ?? 'csesoc'}`) as Href} />;
}
