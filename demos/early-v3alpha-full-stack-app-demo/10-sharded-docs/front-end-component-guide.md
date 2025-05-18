# Component Breakdown & Implementation Details

> This document is a granulated shard from the main "5-front-end-architecture.md" focusing on "Component Library, Reusable UI Components Guide, Atomic Design Elements, or Component Breakdown & Implementation Details".

This section outlines the conventions and templates for defining UI components. While a few globally shared or foundational components (e.g., main layout structures) might be specified here upfront to ensure consistency, the detailed specification for most feature-specific components will emerge as user stories are implemented. The key is for the development team (or AI agent) to follow the "Template for Component Specification" below whenever a new component is identified for development.

### Component Naming & Organization

- **Component File Naming:**

  - React component files will use `PascalCase.tsx`. For example, `NewsletterCard.tsx`, `PodcastPlayer.tsx`.
  - Next.js special files like `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `global-error.tsx`, and `not-found.tsx` will use their conventional lowercase or kebab-case names.

- **Component Organization (Reiteration from Directory Structure):**

  - **Application-Specific Core Components:** Reusable components specific to BMad DiCaster (e.g., `NewsletterCard`, `PodcastPlayer`) will reside in `app/components/core/`.
  - **Application-Specific Layout Components:** Components used for structuring page layouts (e.g., `PageWrapper.tsx`) will reside in `app/components/layout/`.
  - **Shadcn UI Components:** Components added via the Shadcn UI CLI will reside in `components/ui/` (e.g., `Button.tsx`, `Card.tsx`).
  - **Page-Specific Components:** If a component is complex but _only_ used on a single page, it can be co-located with that page's route file, for instance, in a `components` subfolder within that route's directory. However, the preference is to place reusable components in `app/components/core/` or `app/components/layout/`.

### Template for Component Specification

This template should be used to define and document each significant UI component identified from the UI/UX Specification (`docs/ui-ux-spec.txt`) and any subsequent design iterations. The goal is to provide sufficient detail for a developer or an AI agent to implement the component with minimal ambiguity. Most feature-specific components will be detailed emergently during development, following this template.

---

#### Component: `{ComponentName}` (e.g., `NewsletterCard`, `PodcastPlayerControls`)

- **Purpose:** {Briefly describe what this component does and its primary role in the user interface. What user need does it address?}
- **Source File(s):** {e.g., `app/components/core/NewsletterCard.tsx`}
- **Visual Reference:** {Link to specific Figma frame/component if available, or a detailed description/sketch if not. If based on a Shadcn UI component, note that and any key customizations.}
- **Props (Properties):**
  {List each prop the component accepts. Specify its name, TypeScript type, whether it's required, any default value, and a clear description.}
  | Prop Name | Type | Required? | Default Value | Description |
  | :------------ | :------------------------------------ | :-------- | :------------ | :--------------------------------------------------- |
  | `exampleProp` | `string` | Yes | N/A | Example string prop. |
  | `items` | `Array<{id: string, name: string}>` | Yes | N/A | An array of item objects to display. |
  | `variant` | `'primary' \| 'secondary'` | No | `'primary'` | Visual variant of the component. |
  | `onClick` | `(event: React.MouseEvent) => void` | No | N/A | Optional click handler. |
- **Internal State (if any):**
  {Describe any significant internal state the component manages using React hooks (e.g., `useState`).}
  | State Variable | Type | Initial Value | Description |
  | :---------------- | :-------- | :------------ | :------------------------------------------------ |
  | `isLoading` | `boolean` | `false` | Tracks if data for the component is loading. |
  | `selectedItem` | `string \| null` | `null` | Stores the ID of the currently selected item. |
- **Key UI Elements / Structure (Conceptual):**
  {Describe the main visual parts of the component and their general layout. Reference Shadcn UI components if used as building blocks.}
  ```jsx
  // Example for a Card component
  <Card>
    <CardHeader>
      <CardTitle>{"{{titleProp}}"}</CardTitle>
      <CardDescription>{"{{descriptionProp}}"}</CardDescription>
    </CardHeader>
    <CardContent>{/* {list of items or main content} */}</CardContent>
    <CardFooter>{/* {action buttons or footer content} */}</CardFooter>
  </Card>
  ```
- **Events Handled / Emitted:**
  - **Handles:** {List significant DOM events the component handles directly.}
  - **Emits (Callbacks):** {If the component uses props to emit events (callbacks) to its parent, list them here.}
- **Actions Triggered (Side Effects):**
  - **State Management (Zustand):** {If the component interacts with a Zustand store, specify which store and actions.}
  - **API Calls / Data Fetching:** {Specify how Client Components trigger mutations or re-fetches (e.g., Server Actions).}
- **Styling Notes:**
  - {Reference to specific Shadcn UI components used.}
  - {Key Tailwind CSS classes or custom styles for the "synthwave" theme.}
  - {Specific responsiveness behavior.}
- **Accessibility (AX) Notes:**
  - {Specific ARIA attributes needed.}
  - {Keyboard navigation considerations.}
  - {Focus management details.}
  - {Notes on color contrast.}

---

_This template will be applied to each new significant component during the development process._
