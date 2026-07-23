import { Href, Redirect, useLocalSearchParams } from 'expo-router';

export default function AddCourseRedirect() {
  const { code, course, term } = useLocalSearchParams<{
    code?: string;
    course?: string;
    term?: string;
  }>();
  return (
    <Redirect
      href={
        {
          pathname: '/my-plan/add-course',
          params: {
            ...(course || code ? { course: course ?? code } : {}),
            ...(term ? { term } : {}),
          },
        } as Href
      }
    />
  );
}
