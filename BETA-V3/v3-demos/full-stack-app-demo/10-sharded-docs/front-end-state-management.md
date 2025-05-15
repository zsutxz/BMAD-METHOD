# State Management In-Depth

> This document is a granulated shard from the main "5-front-end-architecture.md" focusing on "State Management In-Depth".

This section expands on the State Management strategy chosen (Zustand) and outlined in the "Overall Frontend Philosophy & Patterns".

- **Chosen Solution:** **Zustand** (Latest version, as per `architecture.txt`)
- **Rationale:** Zustand was chosen for its simplicity, small bundle size, and unopinionated nature, suitable for BMad DiCaster's relatively simple frontend state needs (e.g., podcast player status). Server-side data is primarily managed by Next.js Server Components.

### Store Structure / Slices

Global client-side state will be organized into distinct "slices" within `store/slices/`. Components can import and use individual stores directly.

- **Conventions:**
  - Each slice in its own file: `store/slices/camelCaseSlice.ts`.
  - Define state interface, initial state, and action functions.
- **Core Slice: `podcastPlayerSlice.ts`** (for MVP)

  - **Purpose:** Manages the state of the podcast player (current track, playback status, time, volume).
  - **Source File:** `store/slices/podcastPlayerSlice.ts`
  - **State Shape (Example):**

    ```typescript
    interface PodcastTrack {
      id: string; // Could be newsletterId or a specific audio ID
      title: string;
      audioUrl: string;
      duration?: number; // in seconds
    }

    interface PodcastPlayerState {
      currentTrack: PodcastTrack | null;
      isPlaying: boolean;
      currentTime: number; // in seconds
      volume: number; // 0 to 1
      isLoading: boolean;
      error: string | null;
    }

    interface PodcastPlayerActions {
      loadTrack: (track: PodcastTrack) => void;
      play: () => void;
      pause: () => void;
      setCurrentTime: (time: number) => void;
      setVolume: (volume: number) => void;
      setError: (message: string | null) => void;
      resetPlayer: () => void;
    }
    ```

  - **Key Actions:** `loadTrack`, `play`, `pause`, `setCurrentTime`, `setVolume`, `setError`, `resetPlayer`.
  - **Zustand Store Definition:**

    ```typescript
    import { create } from "zustand";

    // Previously defined interfaces: PodcastTrack, PodcastPlayerState, PodcastPlayerActions

    const initialPodcastPlayerState: PodcastPlayerState = {
      currentTrack: null,
      isPlaying: false,
      currentTime: 0,
      volume: 0.75,
      isLoading: false,
      error: null,
    };

    export const usePodcastPlayerStore = create<
      PodcastPlayerState & PodcastPlayerActions
    >((set) => ({
      ...initialPodcastPlayerState,
      loadTrack: (track) =>
        set({
          currentTrack: track,
          isLoading: true, // Assume loading until actual audio element confirms
          error: null,
          isPlaying: false, // Usually don't autoplay on load
          currentTime: 0,
        }),
      play: () =>
        set((state) => {
          if (!state.currentTrack) return {}; // No track loaded
          return { isPlaying: true, isLoading: false, error: null };
        }),
      pause: () => set({ isPlaying: false }),
      setCurrentTime: (time) => set({ currentTime: time }),
      setVolume: (volume) => set({ volume: Math.max(0, Math.min(1, volume)) }),
      setError: (message) =>
        set({ error: message, isLoading: false, isPlaying: false }),
      resetPlayer: () => set({ ...initialPodcastPlayerState }),
    }));
    ```

### Key Selectors

Selectors are functions that derive data from the store state. With Zustand, state is typically accessed directly from the hook, but memoized selectors can be created with libraries like `reselect` if complex derived data is needed, though for simple cases direct access is fine.

- **Convention:** For direct state access, components will use: `const { currentTrack, isPlaying, play } = usePodcastPlayerStore();`
- **Example Selectors (if using `reselect` or similar, for more complex derivations later):**
  - `selectCurrentTrackTitle`: Returns `state.currentTrack?.title || 'No track loaded'`.
  - `selectIsPodcastPlaying`: Returns `state.isPlaying`.

### Key Actions / Reducers / Thunks

Zustand actions are functions defined within the `create` call that use `set` to update state. Asynchronous operations (like fetching data, though less common for Zustand which is often for UI state) can be handled by calling async functions within these actions and then calling `set` upon completion.

- **Convention:** Actions are part of the store hook: `const { loadTrack } = usePodcastPlayerStore();`.
- **Asynchronous Example (Conceptual, if a slice needed to fetch data):**
  ```typescript
  // In a hypothetical userSettingsSlice.ts
  // fetchUserSettings: async () => {
  //   set({ isLoading: true });
  //   try {
  //     const settings = await api.fetchUserSettings(); // api is an imported service
  //     set({ userSettings: settings, isLoading: false });
  //   } catch (error) {
  //     set({ error: 'Failed to fetch settings', isLoading: false });
  //   }
  // }
  ```
  For BMad DiCaster MVP, most data fetching is via Server Components. Client-side async actions in Zustand would primarily be for client-specific operations not directly tied to server data fetching.
