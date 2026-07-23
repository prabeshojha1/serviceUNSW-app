# ServiceUNSW design system

ServiceUNSW uses one cross-platform UI language: semantic NativeWind tokens, shared typed
components, and Expo Router navigation. New screens should look and behave like part of the same
product without introducing a separate palette or navigation pattern.

## Navigation

- Primary destinations are Home, Calendar, Courses, MyPlan, and Societies, in that order.
- Navigation is a bottom tab bar below 1024 px and a 224 px left rail at 1024 px and above.
- Each tab owns a nested stack. Detail screens keep their owning tab selected and use the shared
  back header.
- Root screens use a title and profile avatar. Nested screens use a back button, title, and no more
  than one primary header action.
- Profile is outside the tab shell. AI is contextual to Courses and MyPlan only.

## Tokens

Semantic colour, spacing, radius, and width values are configured in `tailwind.config.js`.
JavaScript-only colour values are mirrored in `src/theme/tokens.ts`.

- `brand`: UNSW yellow, used for identity, selected states, and primary actions.
- `ink`: primary text and strong surfaces.
- `canvas`, `surface`, `surface-muted`: the three background levels.
- `border`, `muted`, `link`: structure, secondary content, and interactive text.
- `info`, `success`, `warning`, `danger`, `ai`: semantic feedback only.

Do not introduce raw hex values in product components. If a new semantic colour is genuinely
needed, add it to both token sources and document its purpose here.

## Components

Use the primitives exported by `src/components/ui/app-ui.tsx`:

- `AppScreen` for safe areas, responsive content width, page headers, and scrolling.
- `Button` and `IconButton` for actions; do not use a bare `Pressable` when one of these fits.
- `Card`, `SectionHeader`, `SearchField`, `Chip`, `Badge`, and `ProgressBar` for common content.
- `ModalSheet` for mobile sheets and desktop dialogs.
- `EmptyState`, `InlineNotice`, `ChoiceRow`, and `SwitchRow` for predictable states and forms.

Feature-specific reusable components belong in a named feature folder, such as
`components/course` or `components/society`.

## Interaction and accessibility

- Interactive targets must be at least 44 by 44 points.
- Every icon-only control needs an accessibility label.
- Selected, disabled, checked, and progress states must expose the corresponding accessibility
  state.
- Use `Pressable`; do not add `Touchable*` components.
- Use Ionicons from `@expo/vector-icons`; do not add another icon library.
- Keep web focus indicators visible and preserve operating-system text scaling.
- Use `expo-image` for product imagery and provide a stable neutral fallback surface.

## Contribution checklist

Before merging UI work:

1. Verify the screen at 375, 768, 1024, and 1440 px widths.
2. Navigate to it through the owning tab and verify nested back behaviour.
3. Test keyboard focus, larger text, empty states, and long content.
4. Run `npx tsc --noEmit`, `npm run lint`, `npx expo-doctor`, and
   `npx expo export --platform web`.
5. Confirm there are no new local palettes, duplicate primitives, or competing navigation
   controls.
