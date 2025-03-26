# @coffee-fueled-dev/envar

Type-safe environment variables manager with runtime validation, flexible transformations, and first-class TypeScript support.

## Installation

```bash
# If you have access to GitHub Packages
npm install @coffee-fueled-dev/envar

# For projects using Bun
bun add @coffee-fueled-dev/envar
```

## Quick Start

```typescript
import { env } from "@coffee-fueled-dev/envar";
import { parseEnvInt, parseEnvBoolean } from "@coffee-fueled-dev/envar/parsers";

// Define your environment schema
const config = env([
  ["PORT", { parser: parseEnvInt, default: 3000 }],
  ["API_KEY", { required: true }],
  ["DEBUG", { parser: parseEnvBoolean, default: false }],
]);

// TypeScript knows the types:
// - config.PORT: number
// - config.API_KEY: string
// - config.DEBUG: boolean

// Use your environment variables
const server = app.listen(config.PORT);
```

## Key Features

- **Type Safety**: Full TypeScript support with precise type inference
- **Runtime Validation**: Automatic validation of required variables
- **Built-in Parsers**: Support for common types (numbers, booleans, JSON, enums)
- **Custom Parsing**: Create your own parsers for special needs
- **Default Values**: Fallbacks when variables aren't defined

## Built-in Parsers

```typescript
import {
  parseEnvInt,
  parseEnvFloat,
  parseEnvBoolean,
  parseEnvJSON,
  parseEnvEnum,
} from "@coffee-fueled-dev/envar/parsers";

const config = env([
  ["PORT", { parser: parseEnvInt, default: 8080 }],
  ["RATE_LIMIT", { parser: parseEnvFloat, default: 10.5 }],
  ["ENABLE_FEATURE", { parser: parseEnvBoolean, default: false }],
  ["SERVER_CONFIG", { parser: parseEnvJSON }],
  [
    "LOG_LEVEL",
    {
      parser: parseEnvEnum(["debug", "info", "warn", "error"]),
      default: "info",
    },
  ],
]);
```

## Custom Validation

```typescript
// Custom parser with validation
const parsePort = (v: string | undefined) => {
  const port = parseEnvInt(v);
  if (port && (port < 1 || port > 65535)) {
    throw new Error("Port must be between 1 and 65535");
  }
  return port;
};

const config = env([["PORT", { parser: parsePort, required: true }]]);
```

## Error Handling

The library will throw clear errors when:

- A required variable is missing
- A value fails parsing or validation
- An enum value isn't in the allowed list

## License

MIT
