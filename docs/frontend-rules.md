# NivassHub — Frontend Engineering Rules

> **Version:** 1.0.0 · **Last Updated:** 2026-06-29
> **Status:** Authoritative — all code, PRs, and AI-generated output must comply with this document.

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Project Folder Structure](#2-project-folder-structure)
3. [Feature Architecture](#3-feature-architecture)
4. [Component Architecture](#4-component-architecture)
5. [Component Guidelines](#5-component-guidelines)
6. [State Management](#6-state-management)
7. [API Architecture](#7-api-architecture)
8. [TypeScript Standards](#8-typescript-standards)
9. [Naming Conventions](#9-naming-conventions)
10. [Import Guidelines](#10-import-guidelines)
11. [Styling Standards](#11-styling-standards)
12. [Theme Architecture](#12-theme-architecture)
13. [Custom Hooks](#13-custom-hooks)
14. [Utility Functions](#14-utility-functions)
15. [Validation](#15-validation)
16. [Constants](#16-constants)
17. [Error Handling](#17-error-handling)
18. [Performance Guidelines](#18-performance-guidelines)
19. [Accessibility](#19-accessibility)
20. [Security](#20-security)
21. [Code Quality Principles](#21-code-quality-principles)
22. [Pull Request Checklist](#22-pull-request-checklist)
23. [Do's](#23-dos)
24. [Don'ts](#24-donts)
25. [AI Coding Rules](#25-ai-coding-rules)
26. [Architecture Decision Records](#26-architecture-decision-records)
27. [Project Philosophy](#27-project-philosophy)

---

## 1. Introduction

### Purpose

This document is the **single source of truth** for all frontend engineering decisions in NivassHub. It defines the architecture, coding standards, patterns, and principles that every developer and AI coding assistant must follow. When in doubt about any implementation decision, this document is the final authority.

### Project Goals

NivassHub is a React Native society management platform built for scalability, maintainability, and long-term team productivity. It manages societies, residents, visitors, maintenance requests, notices, and amenities in a unified mobile experience.

### Coding Philosophy

- **Consistency over cleverness.** Code that every team member can read, understand, and extend at first glance is far more valuable than code that is merely clever.
- **One right way.** For every class of problem—styling, state, data fetching, validation—there is one established approach in this project. We do not re-invent solutions per file.
- **Isolation by default.** Features are self-contained. A change to the `society` feature must never require editing files in the `residents` feature.
- **Types are not optional.** TypeScript is not a lint-time nicety; it is how we reason about correctness. Everything is typed.

### Why Feature-First Architecture

Traditional layer-first architectures (`screens/`, `hooks/`, `store/`) break down as an app grows: adding a feature requires touching five separate top-level folders, creating cross-cutting dependencies and merge conflicts. Feature-First Architecture collocates everything a feature needs inside a single boundary. The `society` feature owns its components, hooks, store slice, services, types, and validation. This makes it possible to understand, test, and replace features independently without touching the rest of the codebase.

### Why TypeScript Is Mandatory

TypeScript eliminates an entire class of runtime errors at compile time, makes refactoring safe via type-checked renames, serves as living documentation for API contracts, and enables IDE tooling that dramatically reduces development time. The project runs with `strict: true` in `tsconfig.json`. There are no exceptions.

### Why Consistency Is Critical

A codebase is read far more than it is written. When every screen, component, hook, and slice follows the same structure, a developer who has never seen a particular feature can navigate it confidently in seconds. Inconsistency forces readers to context-switch between different mental models on every file open.

---

## 2. Project Folder Structure

```
nivasshub/
├── app/                    # Expo Router — file-based navigation only
│   ├── _layout.tsx         # Root layout (providers, navigation shell)
│   ├── index.tsx           # Entry route (splash / auth redirect)
│   ├── splash.tsx          # Splash screen
│   ├── dashboard/          # Dashboard tab group
│   │   ├── _layout.tsx
│   │   ├── index.tsx
│   │   ├── residents.tsx
│   │   ├── visitors.tsx
│   │   ├── maintenance.tsx
│   │   ├── notices.tsx
│   │   ├── amenities.tsx
│   │   └── settings.tsx
│   ├── society/            # Society management screens
│   │   ├── _layout.tsx
│   │   ├── index.tsx
│   │   ├── add.tsx
│   │   ├── details.tsx
│   │   └── edit.tsx
│   └── profile/
│       └── index.tsx
│
├── assets/                 # Static assets — images, fonts, icons
│   └── images/
│
├── docs/                   # Engineering documentation
│   └── frontend-rules.md   # ← This file
│
└── src/                    # All application source code
    ├── components/         # Shared, reusable UI components
    ├── config/             # Environment and app configuration
    ├── constants/          # Global application constants
    ├── features/           # Feature modules (one folder per domain)
    ├── providers/          # React context providers
    ├── store/              # Redux store configuration only
    ├── theme/              # Design tokens (colors, spacing, typography…)
    ├── types/              # Shared global types
    └── utils/              # Pure utility functions
```

### `app/`

**Purpose:** Expo Router's file-based routing layer. Every file in `app/` that exports a default React component becomes a navigable route.

**What belongs here:**
- `_layout.tsx` files that configure navigators (Stack, Tabs, Drawer)
- Screen-level route files that wire a feature's container to a URL path
- The entry point `index.tsx`

**What never belongs here:**
- Business logic
- UI component definitions
- Redux interactions
- Direct API calls
- Reusable hooks

**Best practice:** Screens in `app/` should be thin wrappers. They import a container from a feature and render it. The screen file itself should rarely exceed 30 lines.

```tsx
// ✅ app/society/index.tsx — thin route wrapper
import { SocietyListScreen } from '@features/society';
export default SocietyListScreen;
```

---

### `src/components/`

**Purpose:** Shared, domain-agnostic UI components that are reused across multiple features.

**Sub-structure:**
```
components/
├── common/         # General-purpose display components (Header, EmptyState)
├── feedback/       # Loading and error states (Loader)
├── layout/         # Layout wrappers (ScreenWrapper)
├── ui/             # Atomic UI elements (Button, SearchInput)
└── index.ts        # Barrel export
```

**What belongs here:** Components that are used by two or more features, or that are domain-agnostic by nature.

**What never belongs here:** Components that are specific to a single feature (those belong in `features/<name>/components/`).

---

### `src/config/`

**Purpose:** Environment variables, build-time configuration, and app-level settings.

**Files:**
- `env.ts` — typed wrapper around `__DEV__` and environment values
- `appConfig.ts` — app-level configuration constants (timeouts, pagination sizes)
- `index.ts` — barrel export

**What never belongs here:** Feature-specific configuration. Route strings. Theme tokens.

---

### `src/constants/`

**Purpose:** Global constants that are shared across multiple features and do not belong to any single domain.

**Files:**
- `app.ts` — application-wide constants (app name, version)
- `regex.ts` — shared regular expressions
- `storage.ts` — AsyncStorage key constants
- `index.ts` — barrel export

**What never belongs here:** Feature-specific constants (those go in `features/<name>/constants.ts`). Theme values. Config values.

---

### `src/features/`

**Purpose:** The heart of the application. Every product domain lives here as a fully self-contained module.

See [Section 3: Feature Architecture](#3-feature-architecture) for the complete specification.

---

### `src/providers/`

**Purpose:** React context providers that wrap the application at a high level.

**Files:**
- `StoreProvider.tsx` — wraps the app with the Redux `<Provider>`
- `GestureProvider.tsx` — wraps the app with `GestureHandlerRootView`

**What never belongs here:** Feature-specific providers. Business logic.

---

### `src/store/`

**Purpose:** Redux store configuration only. No business logic, no slices.

**Files:**
- `store.ts` — `configureStore` call
- `rootReducer.ts` — `combineReducers` assembling all feature slices
- `hooks.ts` — typed `useAppDispatch` and `useAppSelector` hooks
- `index.ts` — barrel export

**What never belongs here:** Slice definitions (those live in `features/<name>/store/`). Selectors beyond what is needed to assemble the root type.

---

### `src/theme/`

**Purpose:** Design system tokens. The single source of truth for all visual values.

See [Section 12: Theme Architecture](#12-theme-architecture) for the complete specification.

---

### `src/types/`

**Purpose:** Shared global types used across multiple features.

**Files:**
- `common.ts` — primitives like `ID`, `Timestamp`, `AsyncResult<T>`
- `api.ts` — shared API response/error shapes
- `navigation.ts` — typed navigation params
- `index.ts` — barrel export

**What never belongs here:** Feature-specific types (those go in `features/<name>/types.ts`).

---

### `src/utils/`

**Purpose:** Pure, stateless utility functions with no side effects.

**Files:**
- `date.ts` — date formatting and comparison helpers
- `formatters.ts` — number, currency, and string formatters
- `storage.ts` — typed AsyncStorage wrapper
- `validators.ts` — reusable validation helpers
- `index.ts` — barrel export

**What never belongs here:** Functions with side effects. API calls. Redux interactions.

---

## 3. Feature Architecture

Feature-First Architecture groups all code for a product domain into a single self-contained directory. A developer working on the `residents` feature should never need to edit files outside of `src/features/residents/`.

### Standard Feature Structure

```
src/features/<featureName>/
├── api/                    # Feature-specific API calls (Axios service)
│   └── <feature>Api.ts
├── components/             # Feature-specific presentational components
│   ├── FeatureCard.tsx
│   └── index.ts
├── hooks/                  # Feature business logic (container hooks)
│   └── useFeature.ts
├── screens/                # Container components (optional; thin wrappers)
│   └── FeatureListScreen.tsx
├── store/                  # Redux slice for this feature
│   └── featureSlice.ts
├── data/                   # Static/mock data (JSON files)
│   └── feature.json
├── services/               # Non-API service layer (storage, notifications)
│   └── featureService.ts
├── constants.ts            # Feature-scoped constants
├── mapper.ts               # Data transformation between API ↔ domain models
├── validation.ts           # Zod / custom validation schemas for this feature
├── utils.ts                # Feature-scoped pure utilities
├── types.ts                # Feature-scoped TypeScript types and interfaces
└── index.ts                # Public API — the only import surface for this feature
```

Not every feature needs every file. Start with what the feature requires and add files only as needed. A simple feature may only need `components/`, `types.ts`, and `index.ts`.

### Existing Features

| Feature | Store Key | Status |
|---|---|---|
| `dashboard` | `dashboard` | Active |
| `residents` | `residents` | Active |
| `visitor` | `visitors` | Active |
| `maintenance` | `maintenance` | Active |
| `notices` | `notices` | Active |
| `society` | `societies` | Active |
| `amenities` | — | Active (no Redux) |
| `profile` | — | Active (no Redux) |
| `settings` | — | Active (no Redux) |

### File Responsibilities

| File | Responsibility |
|---|---|
| `api/<feature>Api.ts` | Axios calls for this feature only. No Redux, no state. Returns raw data or throws. |
| `components/` | Stateless UI components that receive typed props. No API calls, no Redux. |
| `hooks/useFeature.ts` | Container hook: calls the API, dispatches to Redux, exposes data and actions to screens. |
| `screens/` | Thin container component. Calls `useFeature`, passes data down to presentational components. |
| `store/featureSlice.ts` | Redux slice: state shape, reducers, and actions for this feature. |
| `constants.ts` | String keys, numeric limits, and enum-like values used only by this feature. |
| `mapper.ts` | Pure functions that transform API DTOs into domain models and vice versa. |
| `validation.ts` | Form and data validation schemas. |
| `utils.ts` | Pure helper functions specific to this domain. |
| `types.ts` | All TypeScript interfaces, types, and enums for this feature. |
| `index.ts` | Barrel export. Other features and `app/` screens import only from here. |

### The `index.ts` Rule

The `index.ts` at the root of a feature is its **public API**. External code (screens in `app/`, other features if truly necessary) must only import from the feature's `index.ts`, never from its internal files directly.

```ts
// ✅ Correct
import { SocietyCard, useSocieties, Society } from '@features/society';

// ❌ Wrong — reaching into internals
import { useSocieties } from '@features/society/hooks/useSocieties';
import type { Society } from '@features/society/types';
```

### Why Feature Isolation Improves Scalability

1. **Parallel development:** Two developers can work on `residents` and `visitors` simultaneously with zero merge conflicts on non-shared files.
2. **Refactoring safety:** Renaming an internal type inside `society/types.ts` only requires updating files within the `society` feature.
3. **Deletion:** Removing a deprecated feature means deleting one folder and one line in `rootReducer.ts`.
4. **Onboarding:** A new developer can understand a feature completely by reading one directory.
5. **Testing:** Feature hooks and services can be tested in isolation without mocking the entire app.

---

## 4. Component Architecture

NivassHub uses the **Container / Presentational Pattern** to cleanly separate business logic from rendering.

### Container Components

Container components are responsible for *what the UI does*. They are the bridge between the data layer and the visual layer.

**Responsibilities:**
- Calling hooks (`useSocieties`, `useResidents`) to access Redux state
- Dispatching actions to the store
- Triggering API calls and handling loading/error states
- Navigating between screens via Expo Router
- Transforming raw data into props for presentational children
- Managing local ephemeral state (modal open/closed, selected tab)

**Characteristics:**
- Located in `features/<name>/screens/` or directly in `app/` (thin)
- Rarely contain `StyleSheet` definitions
- Always import from the feature's `index.ts`
- Pass data down to presentational components via typed props

```tsx
// ✅ Container — features/society/screens/SocietyListScreen.tsx
import React, { useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSocieties } from '../hooks/useSocieties';
import { SocietyCard } from '../components/SocietyCard';
import { Loader } from '@components/feedback';
import { EmptyState } from '@components/common';
import spacing from '@theme/spacing';

export const SocietyListScreen: React.FC = () => {
  const router = useRouter();
  const { societies, loading, fetchSocieties } = useSocieties();

  useEffect(() => { fetchSocieties(); }, []);

  if (loading) return <Loader />;
  if (!societies.length) return <EmptyState message="No societies found." />;

  return (
    <View style={styles.container}>
      <FlatList
        data={societies}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SocietyCard
            society={item}
            onPress={() => router.push(`/society/${item.id}`)}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.screenPadding },
});
```

### Presentational Components

Presentational components are responsible for *how the UI looks*. They are pure functions of their props.

**Responsibilities:**
- Rendering a visual representation of the data they receive via props
- Calling `onPress`, `onChange`, and other callbacks passed down from the container
- Applying styles and theme tokens

**Characteristics:**
- Located in `features/<name>/components/` or `src/components/`
- Receive all data and callbacks via typed props
- No Redux (`useAppSelector`, `useAppDispatch`)
- No API calls
- No navigation
- No side effects (`useEffect` is strongly discouraged unless for animation)
- Easily testable in isolation

```tsx
// ✅ Presentational — features/society/components/SocietyCard.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import colors from '@theme/colors';
import spacing from '@theme/spacing';
import type { Society } from '../types';

interface SocietyCardProps {
  society: Society;
  onPress: () => void;
}

export const SocietyCard: React.FC<SocietyCardProps> = ({ society, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
    <Text style={styles.name}>{society.name}</Text>
    <Text style={styles.address}>{society.address}, {society.city}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.cardPadding,
    marginBottom: spacing.sm,
  },
  name: { fontSize: 16, fontWeight: '600', color: colors.textPrimary },
  address: { fontSize: 13, color: colors.textSecondary, marginTop: 4 },
});
```

---

## 5. Component Guidelines

### Functional Components Only

Class components are prohibited. All components are function components. React hooks provide all state and lifecycle management.

```tsx
// ✅ Correct
const MyComponent: React.FC<Props> = ({ title }) => <Text>{title}</Text>;

// ❌ Wrong
class MyComponent extends React.Component<Props> { ... }
```

### One Responsibility Per Component

Each component has exactly one job. If a component is doing two things, extract one into a child component.

### Strongly Typed Props

Every component defines a named `interface` for its props. Inline prop types are prohibited. All props are explicitly typed; `any` is not acceptable.

```tsx
// ✅ Correct
interface ResidentCardProps {
  name: string;
  unit: string;
  avatarUrl?: string;
  onPress: () => void;
}

const ResidentCard: React.FC<ResidentCardProps> = ({ name, unit, onPress }) => { ... };

// ❌ Wrong
const ResidentCard = ({ name, unit, onPress }: any) => { ... };
```

### Composition Over Inheritance

Build complex components by composing simple ones, never by extending them.

### `React.memo` Where Beneficial

Wrap presentational components that receive stable reference props and appear in lists in `React.memo` to prevent unnecessary re-renders. Do not wrap every component — measure first.

```tsx
export const ResidentCard = React.memo<ResidentCardProps>(({ name, unit, onPress }) => (
  // ...
));
```

### Avoid Prop Drilling

If a prop is passed more than two levels deep without being used at intermediate levels, it belongs in Redux state or a context, not in a prop chain.

### Extract Reusable Logic Into Hooks

If the same `useState` + `useEffect` combination appears in two components, extract it into a named custom hook.

---

## 6. State Management

### Decision Hierarchy

Choose the simplest state mechanism that satisfies the requirement:

| Requirement | Solution |
|---|---|
| UI state used by one component only (modal open, input value) | `useState` |
| Complex UI state with multiple sub-values | `useReducer` |
| State shared between sibling components within one feature | Lift state to the parent container, or use the feature's Redux slice |
| State shared across multiple features | Redux Toolkit slice |
| Theme or authentication session | React Context API |

### Redux Architecture

Redux in NivassHub is powered by Redux Toolkit (`@reduxjs/toolkit`). The store is assembled as follows:

```
src/store/
├── store.ts          — configureStore({ reducer: rootReducer })
├── rootReducer.ts    — combineReducers of all feature slices
├── hooks.ts          — useAppDispatch, useAppSelector
└── index.ts
```

**Strict rules:**
- The global `src/store/` folder contains only store configuration. Never place slice logic here.
- Every feature that needs shared state owns a slice in `features/<name>/store/featureSlice.ts`.
- Slice state keys in `rootReducer.ts` are **stable** — do not rename them once established (they are stored in persisted state and used in `useAppSelector` selectors throughout the codebase).
- Selectors (`state.societies`, `state.residents`) are written inline in hooks, not in separate selector files, unless they become complex enough to warrant memoisation with `createSelector`.

### Typed Hooks

Always use the typed hooks from `@store/hooks`, never the raw `useSelector` and `useDispatch` from `react-redux`.

```ts
// ✅ Correct
import { useAppDispatch, useAppSelector } from '@store/hooks';

// ❌ Wrong
import { useSelector, useDispatch } from 'react-redux';
```

### When to Use Context API

Use React Context for values that are:
- Truly global (theme, locale, authenticated user)
- Infrequently updated (to avoid expensive re-renders)
- Not appropriate for Redux (e.g., non-serializable values like refs)

---

## 7. API Architecture

### Current Service Layer

While NivassHub currently operates primarily with local/mock data services, the architecture is designed to accommodate a real HTTP layer without structural changes.

### Service Layer Pattern

API and service logic lives in `features/<name>/services/` or `features/<name>/api/`. Services are plain TypeScript modules that export async functions. They do not know about Redux.

```ts
// ✅ features/society/services/societyService.ts
import type { Society, SocietyFormData } from '../types';
import societiesData from '../data/societies';

export const societyService = {
  async getSocieties(): Promise<Society[]> {
    return societiesData;
  },

  async createSociety(data: SocietyFormData): Promise<Society> {
    const society: Society = {
      id: String(Date.now()),
      ...data,
      createdAt: new Date().toISOString(),
    };
    return society;
  },
};
```

### Future HTTP Layer

When the backend is integrated, the service layer adopts a centralized Axios instance:

```ts
// src/config/axiosInstance.ts (future)
import axios from 'axios';
import { ENV } from '@config/env';

export const apiClient = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor — attach auth token
apiClient.interceptors.request.use((config) => {
  const token = getStoredToken(); // from secure storage
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor — normalize errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) handleUnauthorized();
    return Promise.reject(error);
  },
);
```

### Rules

- API calls must never appear directly inside a component's render function or JSX.
- All API calls go through the service layer.
- The hook (`useFeature`) is the only caller of service functions.
- Errors thrown by services must be caught in the hook and dispatched to Redux or returned via `AsyncResult<T>`.
- Network timeouts must always be configured.

### `AsyncResult<T>` Pattern

Operations that can fail return `AsyncResult<T>` from `src/types/common.ts`:

```ts
export interface AsyncResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}
```

This allows callers to check `result.success` without try/catch at the call site.

---

## 8. TypeScript Standards

The project runs with `"strict": true` in `tsconfig.json`. All rules below are enforced at compile time or by code review.

### No Implicit Any

TypeScript's `noImplicitAny` is active. Every variable, parameter, and return value must have an inferable or explicit type. Untyped code will not compile.

### Avoid Explicit `any`

`any` disables type checking. It is prohibited. Use `unknown` when the type is genuinely unknown and narrow it with type guards.

```ts
// ❌ Wrong
function processData(data: any) { ... }

// ✅ Correct
function processData(data: unknown) {
  if (typeof data === 'string') { ... }
}
```

### Interfaces vs Type Aliases

- Use `interface` for object shapes and domain models (they support declaration merging and are displayed more clearly in IDE tooltips).
- Use `type` for union types, intersection types, mapped types, and conditional types.

```ts
// ✅ Domain model — interface
interface Resident {
  id: string;
  name: string;
  unit: string;
  phone: string;
}

// ✅ Union type — type alias
type ResidentStatus = 'active' | 'inactive' | 'pending';
```

### Enums

Use string enums for values that are both human-readable and type-safe:

```ts
enum MaintenanceStatus {
  Pending = 'pending',
  InProgress = 'in_progress',
  Resolved = 'resolved',
}
```

Avoid numeric enums — they produce confusing reverse mappings and difficult-to-read logs.

### Utility Types

Use TypeScript's built-in utility types to avoid duplicating type definitions:

```ts
type CreateSocietyInput = Omit<Society, 'id' | 'createdAt'>;
type PartialSociety = Partial<Society>;
type ReadonlySociety = Readonly<Society>;
```

### Typing Everything

| Location | Requirement |
|---|---|
| Component props | Named `interface`, never inline `{}` |
| Hook return values | Explicit return type annotation |
| Redux state | Inferred from `initialState` in the slice |
| `useAppSelector` | Returns typed state via `RootState` |
| API service functions | Explicit return type `Promise<T>` |
| `AsyncResult` callers | Always check `result.success` before accessing `result.data` |
| Async callbacks | Return type annotation required |
| Event handlers | Type the event (`(e: GestureResponderEvent) => void`) |
| Refs | `React.useRef<TextInput>(null)` |
| Navigation params | Type via `src/types/navigation.ts` |

### Path Aliases

Use the configured TypeScript path aliases. Never use long relative paths.

```ts
// ✅ Correct
import colors from '@theme/colors';
import { Button } from '@components/ui';
import { useSocieties } from '@features/society';

// ❌ Wrong
import colors from '../../../../../../theme/colors';
```

**Configured aliases:**

| Alias | Resolves to |
|---|---|
| `@/*` | `src/*` |
| `@components/*` | `src/components/*` |
| `@features/*` | `src/features/*` |
| `@store/*` | `src/store/*` |
| `@hooks/*` | `src/hooks/*` |
| `@theme/*` | `src/theme/*` |
| `@utils/*` | `src/utils/*` |
| `@constants/*` | `src/constants/*` |
| `@config/*` | `src/config/*` |

---

## 9. Naming Conventions

Consistent naming makes a codebase navigable without an IDE.

### Summary Table

| Token | Convention | Example |
|---|---|---|
| Folder names | `camelCase` | `features/`, `society/`, `components/` |
| Component files | `PascalCase.tsx` | `SocietyCard.tsx`, `ScreenWrapper.tsx` |
| Non-component files | `camelCase.ts` | `useSocieties.ts`, `societySlice.ts` |
| Component names | `PascalCase` | `SocietyCard`, `DashboardCard` |
| Hook names | `usePascalCase` | `useSocieties`, `useDashboard` |
| Interface names | `PascalCase` | `Society`, `ResidentCardProps` |
| Type alias names | `PascalCase` | `ResidentStatus`, `AsyncResult` |
| Enum names | `PascalCase` | `MaintenanceStatus` |
| Enum values | `PascalCase` or `UPPER_SNAKE_CASE` | `MaintenanceStatus.InProgress` |
| Redux slice files | `featureSlice.ts` | `societySlice.ts` |
| Redux action names | `camelCase` (from createSlice) | `setSocieties`, `addSociety` |
| Constants | `UPPER_SNAKE_CASE` | `MAX_RETRIES`, `API_TIMEOUT` |
| Theme tokens | `camelCase` | `colors.primaryLight`, `spacing.screenPadding` |
| Boolean props | `is`, `has`, `can`, `should` prefix | `isLoading`, `hasError`, `canEdit` |

### File Naming Examples

```
src/
├── features/
│   └── society/
│       ├── components/
│       │   └── SocietyCard.tsx      ← PascalCase (component)
│       ├── hooks/
│       │   └── useSocieties.ts      ← camelCase (hook)
│       ├── store/
│       │   └── societySlice.ts      ← camelCase (slice)
│       ├── types.ts                 ← camelCase
│       └── index.ts                 ← camelCase
```

---

## 10. Import Guidelines

### Import Order

All imports follow this order, with a blank line separating each group:

```ts
// 1. React and React Native core
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

// 2. Third-party libraries
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// 3. Absolute imports — path aliases
import { useSocieties } from '@features/society';
import { Button } from '@components/ui';
import colors from '@theme/colors';
import spacing from '@theme/spacing';

// 4. Relative imports (same feature)
import { SocietyCard } from '../components/SocietyCard';
import type { Society } from '../types';

// 5. Styles (always last)
import { styles } from './styles';
```

### Barrel Exports

Every folder that contains multiple modules exposes an `index.ts` barrel:

```ts
// src/components/ui/index.ts
export { Button } from './Button';
export { SearchInput } from './SearchInput';

// src/components/index.ts
export * from './common';
export * from './feedback';
export * from './layout';
export * from './ui';
```

This allows consumers to import from the folder, not from individual files:

```ts
// ✅ Clean barrel import
import { Button, SearchInput } from '@components/ui';

// ❌ Deep import — reveals internal structure
import { Button } from '@components/ui/Button';
```

### Avoid Circular Dependencies

Features must never import from each other directly. If two features need to share a type, that type belongs in `src/types/`. If they need to share a component, it belongs in `src/components/`.

---

## 11. Styling Standards

### `StyleSheet.create()` Is Mandatory

All styles are defined with `StyleSheet.create()`. Never use plain object literals as styles:

```tsx
// ✅ Correct
const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.screenPadding },
});

// ❌ Wrong
<View style={{ flex: 1, padding: 16 }} />
```

### No Hardcoded Visual Values

All colors, spacing, radii, shadows, and font sizes must reference theme tokens. Hardcoded hex strings and pixel literals are prohibited.

```tsx
// ✅ Correct
import colors from '@theme/colors';
import spacing from '@theme/spacing';

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    padding: spacing.cardPadding,
    borderRadius: 12,
  },
});

// ❌ Wrong
const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
  },
});
```

### No Inline Styles in JSX

Inline styles force React to create a new object on every render, bypassing StyleSheet's optimization. Exceptions are only permitted when a style value is dynamic (e.g., animated values, calculated widths).

```tsx
// ✅ Acceptable inline style (dynamic value)
<View style={{ width: progress * 100 + '%' }} />

// ❌ Static inline style — move to StyleSheet
<View style={{ backgroundColor: '#FFFFFF', padding: 16 }} />
```

### Style Co-location

Place `StyleSheet.create()` at the **bottom** of the component file, after the component definition and exports. This keeps the rendering logic at the top where readers look first.

---

## 12. Theme Architecture

The theme is the single source of truth for all design values. Located in `src/theme/`.

### Tokens

#### `colors.ts`

```ts
const colors = {
  // Brand
  primary: '#1A237E',
  primaryLight: '#3949AB',
  primaryDark: '#0D1457',
  secondary: '#FF6F00',
  // Semantic
  success: '#4CAF50',
  warning: '#FF9800',
  danger: '#F44336',
  info: '#2196F3',
  // Neutrals
  white: '#FFFFFF',
  black: '#000000',
  background: '#F5F7FA',
  surface: '#FFFFFF',
  border: '#E0E0E0',
  // Text
  textPrimary: '#212121',
  textSecondary: '#757575',
  textLight: '#BDBDBD',
} as const;
```

#### `spacing.ts`

```ts
const spacing = {
  xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48,
  screenPadding: 16,
  cardPadding: 16,
  sectionGap: 20,
} as const;
```

#### `typography.ts`

Font sizes, weights, and line heights. Import and use these instead of hardcoding `fontSize`.

#### `radius.ts`

Border radius values for consistent rounding across cards and inputs.

#### `shadows.ts`

Platform-compatible shadow presets.

### `index.ts` — Central Export

```ts
// src/theme/index.ts
export { default as colors } from './colors';
export { default as spacing } from './spacing';
export { default as typography } from './typography';
export { default as radius } from './radius';
export { default as shadows } from './shadows';
```

### Dark Mode Readiness

Color values are referenced by **semantic name** (`colors.background`, `colors.surface`, `colors.textPrimary`), not by raw hex. When dark mode is implemented, only `colors.ts` needs to change — not a single component file.

### Adding New Tokens

Do not add new token categories outside of `src/theme/`. If a token is needed (e.g., `elevation`, `opacity`), create a new file in `src/theme/` and export it from `src/theme/index.ts`.

---

## 13. Custom Hooks

### Rules

1. **Always start with `use`.** This is not just a convention — it is required for React's lint rules to enforce the Rules of Hooks.
2. **Encapsulate one concern.** A hook that does both data fetching and form state management should be split into two hooks.
3. **Never return JSX.** Hooks are logic, not components.
4. **Always provide a typed return value.** Use an explicit return type or ensure TypeScript infers it fully.
5. **Keep side effects inside effects.** `useEffect` teardowns (subscriptions, timers) must always return a cleanup function.
6. **Avoid logic duplication.** Before writing a new hook, verify no existing hook provides the needed functionality.

### Placement

| Hook type | Location |
|---|---|
| Used only by one feature | `features/<name>/hooks/useFeatureName.ts` |
| Used by multiple features | `src/hooks/useHookName.ts` |
| Used only by one component | Inline in the component file (if simple) or extracted into the same folder |

### Example: Feature Hook

```ts
// features/residents/hooks/useResidents.ts
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { setResidents, setLoading, setError } from '../store/residentSlice';
import { residentService } from '../services/residentService';
import type { Resident } from '../types';

interface UseResidentsReturn {
  residents: Resident[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export const useResidents = (): UseResidentsReturn => {
  const dispatch = useAppDispatch();
  const { residents, loading, error } = useAppSelector((s) => s.residents);

  const refresh = async (): Promise<void> => {
    dispatch(setLoading(true));
    try {
      const data = await residentService.getResidents();
      dispatch(setResidents(data));
    } catch (err) {
      dispatch(setError((err as Error).message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => { refresh(); }, []);

  return { residents, loading, error, refresh };
};
```

---

## 14. Utility Functions

### Requirements

Every utility function in `src/utils/` must satisfy all of the following:

- **Pure:** given the same inputs, always returns the same output
- **No side effects:** does not modify external state, does not call APIs, does not dispatch Redux actions
- **Strongly typed:** explicit parameter and return types
- **Single purpose:** does exactly one thing
- **Documented only when non-obvious:** only add a comment if the function's behavior is surprising

### Examples

```ts
// utils/formatters.ts

/** Formats a number as Indian currency (₹) */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

// utils/date.ts
export function formatRelativeDate(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / 86_400_000);
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  return `${diffDays} days ago`;
}
```

### Storage Utility

The `utils/storage.ts` wrapper provides a typed interface over `AsyncStorage`, keeping raw `AsyncStorage` calls out of components and hooks.

---

## 15. Validation

### Placement

Validation logic lives in `features/<name>/validation.ts`. It must never be inlined into screen or component files.

### Pattern

Use pure validation functions (or a schema library like Zod when added) that accept raw form data and return typed error objects:

```ts
// features/society/validation.ts
import type { SocietyFormData } from './types';

export interface SocietyFormErrors {
  name?: string;
  address?: string;
  city?: string;
  state?: string;
  totalBlocks?: string;
  totalUnits?: string;
}

export function validateSocietyForm(data: SocietyFormData): SocietyFormErrors {
  const errors: SocietyFormErrors = {};

  if (!data.name.trim()) errors.name = 'Society name is required.';
  if (data.name.length > 100) errors.name = 'Name must be under 100 characters.';
  if (!data.address.trim()) errors.address = 'Address is required.';
  if (!data.city.trim()) errors.city = 'City is required.';
  if (!data.state.trim()) errors.state = 'State is required.';
  if (data.totalBlocks < 1) errors.totalBlocks = 'Must have at least one block.';
  if (data.totalUnits < 1) errors.totalUnits = 'Must have at least one unit.';

  return errors;
}

export function isSocietyFormValid(errors: SocietyFormErrors): boolean {
  return Object.keys(errors).length === 0;
}
```

### Reusable Validators

Atomic validators that apply across features belong in `src/utils/validators.ts`:

```ts
export const isValidPhone = (phone: string): boolean =>
  /^[6-9]\d{9}$/.test(phone);

export const isValidEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const isNonEmpty = (value: string): boolean => value.trim().length > 0;
```

---

## 16. Constants

### Placement Rules

| Constant scope | Location |
|---|---|
| Used only within one feature | `features/<name>/constants.ts` |
| Used across multiple features | `src/constants/app.ts` or a relevant file in `src/constants/` |
| AsyncStorage keys | `src/constants/storage.ts` |
| Regular expressions | `src/constants/regex.ts` |
| Environment / build values | `src/config/env.ts` |

### Style

```ts
// ✅ Feature constant
export const SOCIETY_MAX_NAME_LENGTH = 100;
export const SOCIETY_MAX_BLOCKS = 50;

// ✅ Global constant
export const APP_NAME = 'NivassHub';
export const PAGINATION_PAGE_SIZE = 20;
```

### Never Duplicate

Before adding a constant, search the codebase. If a constant with the same meaning exists, import it instead of re-declaring it.

---

## 17. Error Handling

### Principles

1. **Never swallow errors silently.** A caught error that produces no feedback (no dispatch, no log, no user message) hides bugs.
2. **Dispatch errors to Redux.** Feature slices have an `error` field. Set it when an operation fails.
3. **Display meaningful messages.** Error messages shown to users must be human-readable. Do not display raw exception messages.
4. **Provide fallback UI.** Every screen that loads async data must handle the error state with a visible message and a retry action.
5. **Log errors in development.** Use `__DEV__` guards around `console.error` calls.

### Pattern in Hooks

```ts
try {
  const data = await featureService.getData();
  dispatch(setData(data));
} catch (err) {
  const message = err instanceof Error ? err.message : 'An unexpected error occurred.';
  dispatch(setError(message));
  if (__DEV__) console.error('[useFeature]', err);
} finally {
  dispatch(setLoading(false));
}
```

### Error State in Slices

Every feature slice that performs async operations must include:

```ts
interface FeatureState {
  data: FeatureItem[];
  loading: boolean;
  error: string | null;   // ← always present
}
```

---

## 18. Performance Guidelines

### `React.memo`

Wrap list-item components in `React.memo` to prevent re-renders when the parent updates but the item's props have not changed.

### `useMemo`

Use `useMemo` to memoize expensive computations that depend on specific state values. Do not over-apply it to trivial computations — the memoization overhead exceeds the savings for cheap operations.

```ts
const filteredResidents = useMemo(
  () => residents.filter((r) => r.name.toLowerCase().includes(query.toLowerCase())),
  [residents, query],
);
```

### `useCallback`

Use `useCallback` for callbacks passed as props to memoized child components. Without it, a new function reference is created on every render, breaking `React.memo`.

```ts
const handlePress = useCallback(() => {
  router.push(`/society/${society.id}`);
}, [society.id]);
```

### `FlatList` Optimization

- Always provide `keyExtractor`
- Always set `initialNumToRender` to the number of items visible without scrolling
- Use `getItemLayout` when items have fixed height (eliminates layout measurement)
- Avoid arrow functions in `renderItem` — use `useCallback` instead
- Use `removeClippedSubviews` for very long lists on Android

```tsx
<FlatList
  data={residents}
  keyExtractor={(item) => item.id}
  initialNumToRender={10}
  renderItem={renderResidentCard}
  removeClippedSubviews={true}
/>
```

### Avoid Anonymous Functions in JSX

Anonymous functions in JSX create new references on every render:

```tsx
// ❌ New function on every render
<Button onPress={() => handleDelete(item.id)} />

// ✅ Stable reference
const handleDelete = useCallback(() => deleteItem(item.id), [item.id]);
<Button onPress={handleDelete} />
```

### Image Optimization

- Use `resizeMode="contain"` or `"cover"` to prevent layout thrashing
- Provide explicit `width` and `height` to avoid reflow
- Use `FastImage` (if added) for network images with caching

---

## 19. Accessibility

Accessibility is not an afterthought. Every interactive element must be usable by someone relying on a screen reader or assistive technology.

### Required Attributes

| Element | Required attributes |
|---|---|
| `TouchableOpacity` with icon only | `accessibilityLabel`, `accessibilityRole="button"` |
| `Image` (meaningful) | `accessibilityLabel` |
| `Image` (decorative) | `accessible={false}` |
| `TextInput` | `accessibilityLabel`, `placeholder` |
| Tab bar items | `accessibilityLabel` |
| Modal | `accessibilityViewIsModal={true}` |

### Touch Target Sizes

Interactive elements must have a minimum touch target of **44×44 points** per Apple HIG and Android Material guidelines. Use `hitSlop` for elements that are visually smaller:

```tsx
<TouchableOpacity
  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
  onPress={handleClose}
  accessibilityLabel="Close modal"
  accessibilityRole="button"
>
  <Ionicons name="close" size={24} />
</TouchableOpacity>
```

### Color Contrast

Text must meet WCAG AA contrast requirements:
- Normal text (< 18pt): minimum 4.5:1 contrast ratio
- Large text (≥ 18pt or bold ≥ 14pt): minimum 3:1 contrast ratio

Do not rely on color alone to communicate status — pair it with text or an icon.

### Screen Reader Support

Test all interactive flows with TalkBack (Android) and VoiceOver (iOS) before marking a feature complete.

---

## 20. Security

### Never Commit Secrets

API keys, credentials, and secrets must never appear in source code or be committed to the repository. Use environment variables loaded via `.env.local` (already in `.gitignore`).

```ts
// ✅ Correct
const apiKey = ENV.API_KEY;

// ❌ Wrong — never hard-code secrets
const apiKey = 'sk-live-abc123';
```

### Secure Token Storage

Authentication tokens must be stored in `expo-secure-store`, not in AsyncStorage. AsyncStorage is unencrypted and readable on rooted/jailbroken devices.

```ts
// When auth is implemented:
import * as SecureStore from 'expo-secure-store';

await SecureStore.setItemAsync('auth_token', token);
const token = await SecureStore.getItemAsync('auth_token');
```

### Input Validation

All user input must be validated before use. Do not trust user-provided data. Use the validation functions in `features/<name>/validation.ts`.

### Sensitive Data in Logs

Never log authentication tokens, passwords, personal data (Aadhaar, PAN, phone numbers) or payment information — even in development.

```ts
// ❌ Wrong
console.log('User logged in:', { email, password, token });

// ✅ Correct — log only non-sensitive context
console.log('User logged in:', { userId: user.id });
```

### API Authorization

All API calls to authenticated endpoints must include the Authorization header. The Axios interceptor (when implemented) handles this automatically. Never bypass it.

---

## 21. Code Quality Principles

### SOLID

| Principle | In practice |
|---|---|
| **S**ingle Responsibility | One component, one job. One hook, one concern. |
| **O**pen/Closed | Extend features by adding new files, not modifying shared ones. |
| **L**iskov Substitution | Props interfaces should be addable-to, not breaking-changeable. |
| **I**nterface Segregation | Keep prop interfaces small. Split large interfaces. |
| **D**ependency Inversion | Features depend on abstractions (service interfaces), not concrete implementations. |

### DRY — Don't Repeat Yourself

Before writing a function, component, constant, or type, verify that one does not already exist. Duplication is a maintenance liability — a bug must be fixed in every copy.

### KISS — Keep It Simple

The simplest solution that meets the requirement is the right solution. Abstraction is only warranted when there is proven duplication or when the complexity of the problem genuinely demands it.

### YAGNI — You Aren't Gonna Need It

Do not write code for features that are not currently required. Future requirements should drive future code. Speculative code increases complexity and is rarely used as imagined.

### Readable Over Clever

```ts
// ❌ Clever — hard to read at 3am during an incident
const status = items.reduce((a, v) => ({ ...a, [v.id]: v.status }), {});

// ✅ Readable
const statusById: Record<string, string> = {};
for (const item of items) {
  statusById[item.id] = item.status;
}
```

### Clean Code

- Function bodies should not exceed 40 lines. Extract if longer.
- No commented-out code in commits.
- No `TODO` comments unless tracked in a ticket.
- No magic numbers — name them as constants.

---

## 22. Pull Request Checklist

Every pull request author must verify each item before requesting review.

### Functionality

- [ ] The feature works end-to-end as described in the ticket
- [ ] Edge cases (empty state, loading state, error state) are handled
- [ ] No regressions in adjacent features have been introduced

### Code Quality

- [ ] Builds successfully (`expo start` exits without errors)
- [ ] No TypeScript errors (`tsc --noEmit` passes)
- [ ] No ESLint errors
- [ ] No dead code or unused variables
- [ ] No unused imports
- [ ] No commented-out code

### Architecture

- [ ] Feature follows Feature-First structure
- [ ] No business logic inside presentational components
- [ ] No direct API calls inside components
- [ ] No hardcoded colors or spacing values
- [ ] Theme tokens used throughout
- [ ] No new duplicate constants, types, or utilities
- [ ] Barrel exports (`index.ts`) updated for any new public exports
- [ ] No circular dependency introduced
- [ ] No deep relative imports where path aliases are available

### Types

- [ ] All new code is fully typed
- [ ] No `any` introduced
- [ ] Props interfaces defined for all new components
- [ ] Return types annotated on all new hooks and service functions

### Reusability

- [ ] No new component that duplicates an existing shared component
- [ ] No new hook that duplicates an existing hook
- [ ] Reusable logic extracted from screens into hooks or utilities

### Documentation

- [ ] `docs/frontend-rules.md` updated if a new pattern or deviation is introduced
- [ ] Complex business logic has a comment explaining *why* (not what)

---

## 23. Do's

**Architecture**
- Do organize new features as self-contained modules in `src/features/`
- Do expose features only through their `index.ts` public API
- Do use the Container / Presentational separation for every screen
- Do keep `app/` route files as thin wrappers delegating to feature containers
- Do use `src/store/` only for store configuration, never for slice logic
- Do use `src/components/` only for domain-agnostic, shared components
- Do add new Redux slices inside the feature they belong to

**TypeScript**
- Do enable `strict: true` and keep it enabled
- Do use `interface` for domain models and `type` for unions
- Do use utility types (`Omit`, `Partial`, `Pick`, `Record`) to derive types
- Do type all hook return values explicitly
- Do use the typed `useAppDispatch` and `useAppSelector` hooks

**Styling**
- Do use `StyleSheet.create()` for all styles
- Do reference `colors`, `spacing`, `typography`, `radius`, and `shadows` from the theme
- Do place `StyleSheet.create()` at the bottom of the component file
- Do extract repeated style patterns into shared components

**State**
- Do reach for `useState` first; escalate to Redux only when state is shared across features
- Do dispatch `setLoading(true)` and `setLoading(false)` around every async operation
- Do dispatch `setError(message)` in every catch block
- Do use `AsyncResult<T>` for operation return values that can succeed or fail

**Naming**
- Do use `PascalCase` for all component files and names
- Do prefix all hook names with `use`
- Do use `UPPER_SNAKE_CASE` for constant values
- Do use semantic names for theme tokens, not visual ones (`colors.primary`, not `colors.darkBlue`)

**Performance**
- Do wrap list-item components in `React.memo`
- Do use `useCallback` for callbacks passed to memoized children
- Do use `useMemo` for expensive derived values
- Do provide `keyExtractor` and `initialNumToRender` on every `FlatList`

**Imports**
- Do use path aliases (`@features/`, `@components/`, `@theme/`) instead of relative paths
- Do maintain import group order: React → third-party → aliases → relative → styles
- Do use barrel exports and import from `index.ts`

**Quality**
- Do write self-documenting code with descriptive variable and function names
- Do keep functions under 40 lines
- Do check for existing utilities before writing a new one
- Do check for existing components before creating a new one

---

## 24. Don'ts

**Architecture**
- Don't place business logic inside presentational components
- Don't call API or service functions directly from component bodies
- Don't import from a feature's internal files — only from its `index.ts`
- Don't put slice definitions in `src/store/` — they belong in the feature
- Don't rename stable Redux state keys in `rootReducer.ts` without a migration plan
- Don't create a new folder at the `src/` level without updating this document
- Don't import from one feature's internals into another feature

**TypeScript**
- Don't use `any` — use `unknown` and narrow with type guards
- Don't disable TypeScript with `// @ts-ignore` or `// @ts-nocheck`
- Don't cast with `as` to hide a type error — fix the underlying type
- Don't write props as inline objects without a named interface
- Don't omit return type annotations on hooks and service functions

**Styling**
- Don't use hardcoded color hex values (`'#1A237E'`) — use `colors.primary`
- Don't use hardcoded spacing numbers (`padding: 16`) — use `spacing.md`
- Don't use inline styles for static values
- Don't use plain object literals for styles — use `StyleSheet.create()`
- Don't duplicate style blocks across files — extract to a shared component

**State**
- Don't access `result.data` without first checking `result.success`
- Don't mutate Redux state directly — always use the slice's reducer actions
- Don't put ephemeral UI state (modal open/closed) into Redux
- Don't call `useSelector` or `useDispatch` directly — use the typed wrappers

**Code Quality**
- Don't leave commented-out code in commits
- Don't add `TODO` comments without a corresponding issue ticket
- Don't write speculative code for features that are not yet required
- Don't write a clever one-liner when a readable four-liner is easier to understand
- Don't duplicate constants, types, utilities, or components
- Don't commit `console.log` statements (use `__DEV__` guards if debugging output is needed)

**Security**
- Don't commit `.env` files or any file containing credentials
- Don't store auth tokens in AsyncStorage — use `expo-secure-store`
- Don't log sensitive personal data
- Don't trust user input without validation

**Performance**
- Don't define components or `StyleSheet.create()` inside a render function
- Don't use anonymous arrow functions in `renderItem` without `useCallback`
- Don't call `Object.keys()` or spread objects in render hot paths without memoization

---

## 25. AI Coding Rules

This section governs the behavior of all AI coding assistants interacting with this repository. The following rules are **mandatory** and apply to every AI tool, including but not limited to:

- Claude Code
- GitHub Copilot
- Cursor
- Windsurf
- Cline
- Roo Code
- Continue.dev
- ChatGPT Code Interpreter
- Any future AI coding assistant

### Mandatory Pre-task Behavior

Before making **any** code change to this repository, an AI assistant must:

1. Read `docs/frontend-rules.md` in full.
2. Read the existing files in the affected feature directory.
3. Check existing `index.ts` barrel exports to understand the current public API.
4. Identify whether the task requires a new file, a new feature, or a change to an existing one.

### Architecture Rules

- Always maintain Feature-First Architecture. New domain features go in `src/features/<featureName>/`.
- Never create a new top-level folder under `src/` without explicit instruction and without updating this document.
- Never introduce a duplicate folder (e.g., a second `components/` directory, a second `hooks/` directory outside the intended locations).
- Never place business logic inside presentational components or route files.
- Never place slice files in `src/store/` — they belong in `features/<name>/store/`.
- Never create a service file outside of `features/<name>/services/` or `features/<name>/api/`.

### Duplication Prevention

- Never create a duplicate constant. Search `src/constants/` and `features/<name>/constants.ts` before declaring a new one.
- Never create a duplicate type. Search `src/types/` and `features/<name>/types.ts` before defining a new interface or type.
- Never create a duplicate utility function. Search `src/utils/` before writing a new helper.
- Never create a duplicate component. Search `src/components/` and the relevant feature's `components/` directory before building a new one.
- Never create a duplicate hook. Search `src/hooks/` and `features/<name>/hooks/` before writing a new `use*` function.

### TypeScript Rules

- Never write `any`. Use `unknown` and narrow, or define a proper type.
- Never use `// @ts-ignore` or `// @ts-nocheck`.
- Always define a named `interface` for component props.
- Always annotate hook return types explicitly.
- Always use path aliases (`@features/`, `@theme/`, `@components/`) — never use long relative paths.

### Import Rules

- Always update `index.ts` barrel exports when adding new public exports.
- Always import from a feature's `index.ts`, not from its internal files.
- Always maintain import group ordering: React → third-party → aliases → relative → styles.

### Styling Rules

- Never use hardcoded color strings — use `colors.*` from `@theme/colors`.
- Never use hardcoded spacing numbers — use `spacing.*` from `@theme/spacing`.
- Always use `StyleSheet.create()`.
- Never add inline static styles.

### State Rules

- Never add state to `src/store/`. Add slices to `features/<name>/store/`.
- Never rename existing Redux state keys in `rootReducer.ts`.
- Always use `useAppDispatch` and `useAppSelector` from `@store/hooks`.

### Preservation Rules

- Never remove or modify existing functionality unless explicitly instructed.
- Always verify that refactoring does not break existing imports before completing a task.
- When renaming a file or export, update every import site.
- When moving a file, update the barrel export and all consumers.

### Output Quality

- Always produce complete, compilable code — never partial snippets that leave the codebase broken.
- Always produce TypeScript, never JavaScript, for files in `src/`.
- Always follow the naming conventions in Section 9.

---

## 26. Architecture Decision Records

These records document *why* the project is built the way it is. Understanding the reasoning prevents well-intentioned refactors that undermine the architectural intent.

### ADR-001: Feature-First Architecture

**Decision:** Organize all application code by feature domain, not by technical layer.

**Context:** Layer-first architectures (`screens/`, `hooks/`, `reducers/`) group code by what it does technically rather than what it delivers to the user. As applications grow, adding a feature requires changes spread across every layer, creating cross-cutting merge conflicts.

**Consequences:**
- A developer working on one feature rarely needs to touch files belonging to another feature.
- Features can be developed and tested in parallel without contention.
- Removing a feature is a single directory deletion plus one line in `rootReducer.ts`.
- The cost is a slightly less obvious place for shared code — which is why `src/components/`, `src/utils/`, and `src/types/` exist as explicit shared zones.

---

### ADR-002: Container / Presentational Pattern

**Decision:** Separate business logic (container) from rendering (presentational) in all screens.

**Context:** Components that mix data fetching, Redux, navigation, and JSX are difficult to test, reuse, and reason about. Small changes to business logic risk unintended rendering side effects.

**Consequences:**
- Presentational components are deterministic functions of their props, making them trivially testable.
- Business logic in hooks is testable without rendering a component tree.
- The split introduces slightly more files per screen, which is acceptable.

---

### ADR-003: Redux Toolkit

**Decision:** Use Redux Toolkit (RTK) as the sole state management library for shared state.

**Context:** Plain Redux requires significant boilerplate and is prone to accidental state mutation. RTK provides `createSlice` (immutable reducers via Immer), `configureStore` (sensible defaults, Redux DevTools), and a standardized async pattern.

**Consequences:**
- All feature state is predictable and inspectable via Redux DevTools.
- RTK's Immer integration allows readable reducer code without manual spreading.
- The store is the single source of truth for all cross-feature state.

---

### ADR-004: TypeScript with `strict: true`

**Decision:** Enforce TypeScript's strictest compilation mode across the entire codebase.

**Context:** Without strict mode, TypeScript degrades to a best-effort annotation system. `noImplicitAny`, `strictNullChecks`, and related flags are the rules that eliminate the most common runtime errors.

**Consequences:**
- More type annotations are required upfront, but the investment pays off in prevented bugs and safer refactors.
- IDE autocompletion is more accurate and comprehensive.
- Onboarding developers benefit from type-checked API contracts rather than tribal knowledge.

---

### ADR-005: Barrel Exports via `index.ts`

**Decision:** Every module folder exposes its public API exclusively through an `index.ts` file.

**Context:** Without barrel exports, consumers must know the internal file structure of a module. When a file is renamed or moved, every consumer import breaks. With barrel exports, consumers depend only on the folder's public interface.

**Consequences:**
- Internal file restructuring requires only updating `index.ts`, not every consumer.
- Import statements are shorter and more intention-revealing.
- Circular dependency risk is managed by ensuring `index.ts` only re-exports, never imports from other barrels in the same scope.

---

### ADR-006: Centralized Theme Tokens

**Decision:** All visual values (colors, spacing, typography, radii, shadows) are defined once in `src/theme/` and referenced by name everywhere.

**Context:** Hardcoded values scattered across hundreds of files make consistent visual updates, dark mode support, and brand changes prohibitively expensive.

**Consequences:**
- A brand color change requires editing one line in `colors.ts`.
- Dark mode requires swapping the color map, not touching component files.
- Design reviews become meaningful because every component accurately reflects the design tokens.

---

### ADR-007: Expo Router for Navigation

**Decision:** Use Expo Router (file-based routing) rather than React Navigation with manual stack configuration.

**Context:** Expo Router provides file-system–based routing (analogous to Next.js) that eliminates manual `NavigationContainer` and stack configuration boilerplate. It also enables deep linking automatically.

**Consequences:**
- Route files in `app/` double as documentation of the app's navigation tree.
- Adding a new screen is as simple as creating a new file in the correct directory.
- Route files must remain thin; business logic must not accumulate in them.

---

### ADR-008: Axios for HTTP (Future)

**Decision:** When the backend is integrated, use a centralized Axios instance configured with interceptors.

**Context:** Fetch API lacks interceptors and requires manual timeout handling. Axios provides a cleaner API, automatic JSON serialization, request/response interceptors for auth token injection and error normalization, and a configurable timeout.

**Consequences:**
- Auth token injection happens in one place, not in every service function.
- 401 handling and token refresh are centralized.
- All feature API files call the shared Axios instance, not raw `fetch`.

---

### ADR-009: Feature-Level Types, Validation, and Constants

**Decision:** Types, validation schemas, and constants that belong to a feature live inside the feature, not in global folders.

**Context:** Centralizing all types in a global `types/` folder creates a file that grows without bound and couples unrelated features. When a feature is deleted, its orphaned types remain.

**Consequences:**
- Feature types are colocated with the code that uses them — easy to find, easy to delete.
- Global `src/types/` is reserved for types that are genuinely shared across multiple features (e.g., `AsyncResult`, `ID`, navigation params).
- Feature isolation is maintained: changing the `Society` interface requires only reviewing the `society` feature.

---

## 27. Project Philosophy

NivassHub is built on the belief that **great software engineering is mostly about communication** — communication between the developer and the machine through types, between developers through naming and structure, and between today's team and tomorrow's team through consistency and predictability.

The following principles guide every decision in this project:

### Simplicity Over Complexity

The right solution is the simplest one that fully solves the problem. Complexity is a cost paid by every future reader and every future change. Add complexity only when there is no simpler path.

### Reusability Over Duplication

Duplicated code is a bug waiting to propagate. Every component, hook, utility, type, and constant that exists serves a contract. Respect it by reusing it rather than recreating it.

### Readability Over Cleverness

Code is read far more than it is written. A function that communicates its intent clearly in six lines is more valuable than a one-liner that requires a mental debugger to parse. Write for the next developer, not for the compiler.

### Feature Isolation

A feature should be an island. Changes to one domain should not cause ripple effects in another. This is not just architectural elegance — it is what allows a team to ship confidently.

### Strong Typing Everywhere

TypeScript is the project's primary tool for expressing intent and catching errors before they reach production. Weakening it — with `any`, type assertions, or ignored errors — undermines every other engineering practice in this document.

### Consistency as a Force Multiplier

A codebase where every file follows the same patterns allows a developer to work productively from their first day. Consistency is not about personal preference; it is about reducing the cognitive load of every person who will ever read this code.

### Predictability

Given a requirement, there should be exactly one obvious place to put the code and exactly one established pattern to follow. Predictability makes reviews faster, onboarding shorter, and bugs less likely.

### Scalability Through Architecture

The Feature-First architecture, the Container/Presentational pattern, the typed theme, and the centralized store are not bureaucratic overhead. They are the foundation that allows this application to grow from a handful of screens to dozens without becoming a maintenance burden.

### Enterprise-Grade Discipline

NivassHub is built to production standards from day one. Security practices, accessibility standards, performance guidelines, and error handling are not deferred to "after launch." They are part of how the team works.

### Long-Term Sustainability

Every decision in this codebase is made with the assumption that this project will be maintained for years, by developers who have not yet joined the team. Write code that you would be proud for those developers to read.

---

### ADR-010: Mock Data Lives Inside Each Feature

**Decision:** Static/mock JSON data files live in `features/<name>/data/`, not in a centralized `src/data/dummy/` folder.

**Context:** When mock data is centralized, it couples unrelated features together — a developer must navigate away from the feature they are working on to find or change its test data. Feature-first architecture values co-location over centralization.

**Consequences:**

- All files relevant to a feature (types, store, data, components) are in one place.
- Deleting a feature also deletes its mock data automatically — no orphaned files.
- When the real backend is integrated, each feature's service file replaces its own data import — no global cleanup needed.
- The tradeoff: mock data is not centrally browsable. This is acceptable because developers work within a feature, not across all features simultaneously.

---

> **End of Document**
>
> For questions about this document, raise a discussion in the project repository.
> To propose a rule change, open a PR against `docs/frontend-rules.md` with your rationale.
> All changes to this document require team review before merging.
