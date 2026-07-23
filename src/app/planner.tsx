import { Href, Redirect } from 'expo-router';

export default function PlannerRedirect() {
  return <Redirect href={'/my-plan/planner' as Href} />;
}
