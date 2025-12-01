# OTP Input Component

A modern, accessible OTP (One-Time Password) input component built with React and TypeScript.

## Features

- 🎯 Configurable input length
- ⌨️ Full keyboard navigation (arrow keys, home, end)
- 📋 Paste support
- ✨ Smooth animations with Framer Motion
- ♿ Accessible with ARIA labels
- 🔢 Validation types: numeric, alpha, alphanumeric
- 🎨 Error state with shake animation

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Vitest (Testing)

## Getting Started

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Run tests
pnpm test

# Build for production
pnpm build
```

## Usage

```tsx
import OtpInput from "./components/opt-input/opt-input";

<OtpInput
  length={6}
  value={otp}
  onChange={setOtp}
  onComplete={(value) => console.log(value)}
  validationType="numeric"
  autoFocus
/>;
```

## Demo

Enter `123456` to see the success animation.
