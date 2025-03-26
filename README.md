# @very-coffee/envar

A simple way to handle environment variables in TypeScript with type safety.

## Install

```bash
npm install @very-coffee/envar
# or
bun add @very-coffee/envar
```

## Usage

```typescript
import { env } from "@very-coffee/envar";

// Define your environment variables
const config = env([
  ["PORT", { default: 3000 }],
  ["API_KEY", { required: true }],
  ["DEBUG", { default: false }],
]);

// Use them in your code
const server = app.listen(config.PORT);
```

## Features

- TypeScript support
- Required variables
- Default values
- Simple API

## License

MIT
