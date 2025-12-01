# Todo AI

A modern, AI-powered todo application built with React, TypeScript, and CopilotKit. This app allows you to manage your tasks with the help of an AI assistant that can help you plan trips and manage your todo list through natural language.

## Features

- ✅ **Add, Edit, Delete, and Toggle Todos** - Full CRUD operations for task management
- 🤖 **AI-Powered Assistant** - Chat with an AI to help manage your todos and plan trips
- 🌤️ **Weather Integration** - Get real-time weather info for trip planning
- 💾 **Persistent Storage** - Todos are saved to localStorage
- ✨ **Smooth Animations** - Beautiful UI with Motion/Framer Motion animations
- 🎨 **Dark Theme** - Modern dark UI with Tailwind CSS
- ♿ **Accessible** - Proper ARIA labels and keyboard navigation
- 🧪 **Tested** - Unit and integration tests with Vitest and React Testing Library

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS 4** - Styling
- **Zustand** - State management
- **CopilotKit** - AI chat integration
- **Motion (Framer Motion)** - Animations
- **Vitest** - Unit testing
- **React Testing Library** - Component testing

## Prerequisites

- Node.js 18+
- pnpm (recommended) or npm/yarn
- A CopilotKit API key (for AI features)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/habibshaban/shopify-assignment.git
cd shopify-assignment/todo-ai
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Configure CopilotKit (for AI features)

To enable the AI assistant features, you'll need to configure CopilotKit with your API endpoint. Wrap your app with the `CopilotKit` provider in `src/main.tsx`:

```tsx
import { CopilotKit } from "@copilotkit/react-core";

<CopilotKit runtimeUrl="/api/copilotkit">
  <App />
</CopilotKit>;
```

See the [CopilotKit documentation](https://docs.copilotkit.ai) for setting up a backend endpoint.

### 4. Start the development server

```bash
pnpm dev
```

The app will be available at `http://localhost:5173`

## Available Scripts

| Command              | Description                    |
| -------------------- | ------------------------------ |
| `pnpm dev`           | Start development server       |
| `pnpm build`         | Build for production           |
| `pnpm preview`       | Preview production build       |
| `pnpm lint`          | Run ESLint                     |
| `pnpm test`          | Run tests in watch mode        |
| `pnpm test:run`      | Run tests once                 |
| `pnpm test:ui`       | Run tests with Vitest UI       |
| `pnpm test:coverage` | Run tests with coverage report |

## Project Structure

```
src/
├── components/           # Shared components
│   └── ErrorFallback.tsx
├── features/
│   ├── ai/              # AI integration (CopilotKit)
│   │   ├── index.ts
│   │   └── hooks/
│   │       └── useTodoActions.ts  # AI actions for todos
│   ├── layout/          # Layout components
│   │   ├── index.ts
│   │   ├── store.ts
│   │   └── components/
│   │       └── Header.tsx
│   └── todos/           # Todo feature
│       ├── index.ts
│       ├── store.ts      # Zustand store
│       ├── store.test.ts # Store unit tests
│       ├── types.ts
│       └── components/
│           ├── TodoItem.tsx
│           ├── TodoList.tsx
│           └── TodoList.test.tsx  # Integration tests
├── test/                # Test setup
│   ├── setup.ts
│   └── test-utils.tsx
├── App.tsx              # Main app component
├── main.tsx             # Entry point
└── index.css            # Global styles
```

## Testing

The project uses **Vitest** and **React Testing Library** for testing.

### Run all tests

```bash
pnpm test:run
```

### Run tests in watch mode

```bash
pnpm test
```

### Run tests with UI

```bash
pnpm test:ui
```

### Test Coverage

Tests cover:

- **Store Tests** (`store.test.ts`)

  - Adding todos
  - Removing todos
  - Toggling completion
  - Editing todos
  - Setting todos

- **Component Tests** (`TodoList.test.tsx`)
  - Rendering empty state
  - Adding todos via form
  - Adding todos via Enter key
  - Preventing empty todos
  - Displaying multiple todos
  - Deleting todos
  - Toggling todo completion

## AI Assistant Features

The AI assistant (accessible via the chat popup) can:

- **Add todos** - "Add a todo to buy groceries"
- **Add multiple todos** - "Create a packing list for a beach vacation"
- **Remove todos** - "Remove the first todo"
- **Mark todos complete** - "Mark 'buy groceries' as done"
- **Edit todos** - "Change 'buy groceries' to 'buy organic groceries'"
- **Clear all todos** - "Clear my todo list"
- **Get weather** - "What's the weather in Paris?" (for trip planning)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Run tests (`pnpm test:run`)
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## License

MIT
