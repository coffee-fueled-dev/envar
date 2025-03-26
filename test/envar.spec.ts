/// <reference types="mocha" />
/// <reference types="chai" />

import { expect } from "chai";
import {
  parseEnvInt,
  parseEnvFloat,
  parseEnvBoolean,
  parseEnvJSON,
  parseEnvString,
  parseEnvEnum,
  envar,
  resolve,
} from "../src/index";

describe("Environment Variable Handling", () => {
  // Store original env vars
  const originalEnv = { ...process.env };

  // Reset env vars after each test
  afterEach(() => {
    process.env = { ...originalEnv };
  });

  describe("Core envar() function", () => {
    it("should resolve multiple environment variables", () => {
      process.env.TEST_PORT = "3000";
      process.env.TEST_HOST = "localhost";
      process.env.TEST_DEBUG = "true";

      const config = envar([
        ["TEST_PORT", { parser: parseEnvInt, default: 8080 }],
        ["TEST_HOST", { default: "127.0.0.1" }],
        ["TEST_DEBUG", { parser: parseEnvBoolean, default: false }],
        ["TEST_MISSING", { default: "default" }],
      ] as const);

      expect(config.TEST_PORT).to.equal(3000);
      expect(config.TEST_HOST).to.equal("localhost");
      expect(config.TEST_DEBUG).to.be.true;
      expect(config.TEST_MISSING).to.equal("default");
    });

    it("should throw error for missing required variables", () => {
      expect(() =>
        envar([["REQUIRED_VAR", { required: true }]] as const)
      ).to.throw("Missing required environment variable: REQUIRED_VAR");
    });

    it("should handle complex parsing scenarios", () => {
      process.env.TEST_SETTINGS = '{"timeout":5000,"retries":3}';
      process.env.TEST_MODE = "production";

      const config = envar([
        [
          "TEST_SETTINGS",
          {
            parser: parseEnvJSON as (v: string | undefined) => {
              timeout: number;
              retries: number;
            },
            default: { timeout: 1000, retries: 1 },
          },
        ],
        [
          "TEST_MODE",
          {
            parser: parseEnvEnum([
              "development",
              "staging",
              "production",
            ] as const),
            default: "development",
          },
        ],
      ] as const);

      expect(config.TEST_SETTINGS).to.deep.equal({ timeout: 5000, retries: 3 });
      expect(config.TEST_MODE).to.equal("production");
    });
  });

  describe("resolve() function", () => {
    it("should resolve simple variables", () => {
      process.env.SIMPLE_VAR = "test-value";
      const result = resolve(["SIMPLE_VAR"] as const);
      expect(result).to.equal("test-value");
    });

    it("should use default values when env var is missing", () => {
      const result = resolve([
        "MISSING_VAR",
        { default: "default-value" },
      ] as const);
      expect(result).to.equal("default-value");
    });

    it("should apply parsers correctly", () => {
      process.env.PARSED_VAR = "42";
      const result = resolve(["PARSED_VAR", { parser: parseEnvInt }] as const);
      expect(result).to.equal(42);
    });

    it("should handle both parser and default", () => {
      const result = resolve([
        "MISSING_PARSED",
        {
          parser: parseEnvInt,
          default: 123,
        },
      ] as const);
      expect(result).to.equal(123);
    });
  });

  describe("Individual Parsers", () => {
    describe("parseEnvInt", () => {
      it("should parse valid integers from env", () => {
        process.env.TEST_INT = "123";
        const config = envar([["TEST_INT", { parser: parseEnvInt }]] as const);

        expect(config.TEST_INT).to.equal(123);
      });

      it("should ignore not strictly enforce types by a default value if the parser resolves to an unexpected type", () => {
        process.env.TEST_INT = "not-a-number";
        const config = envar([
          ["TEST_INT", { parser: parseEnvInt, default: 500 }],
        ] as const);
        expect(config.TEST_INT).NaN;
      });
    });

    describe("parseEnvFloat", () => {
      it("should parse valid floats from env", () => {
        process.env.TEST_FLOAT = "123.45";
        const config = envar([
          ["TEST_FLOAT", { parser: parseEnvFloat }],
        ] as const);
        expect(config.TEST_FLOAT).to.equal(123.45);
      });
    });

    describe("parseEnvBoolean", () => {
      it("should parse boolean values from env", () => {
        process.env.TEST_BOOL = "true";
        const config = envar([
          ["TEST_BOOL", { parser: parseEnvBoolean }],
        ] as const);
        expect(config.TEST_BOOL).to.be.true;
      });
    });

    describe("parseEnvJSON", () => {
      it("should parse JSON from env", () => {
        process.env.TEST_JSON = '{"name":"test","value":123}';
        const config = envar([
          ["TEST_JSON", { parser: parseEnvJSON }],
        ] as const);
        expect(config.TEST_JSON).to.deep.equal({ name: "test", value: 123 });
      });

      it("should handle invalid JSON in env", () => {
        process.env.TEST_JSON = "{invalid:json}";
        expect(() =>
          envar([
            ["TEST_JSON", { parser: parseEnvJSON, required: true }],
          ] as const)
        ).to.throw("Invalid JSON value");
      });
    });

    describe("parseEnvString", () => {
      it("should handle string trimming from env", () => {
        process.env.TEST_STRING = "  test-value  ";
        const config = envar([
          ["TEST_STRING", { parser: parseEnvString }],
        ] as const);
        expect(config.TEST_STRING).to.equal("test-value");
      });
    });

    describe("parseEnvEnum", () => {
      it("should validate enum values from env", () => {
        process.env.TEST_ENUM = "development";
        const config = envar([
          [
            "TEST_ENUM",
            {
              parser: parseEnvEnum(["development", "production"] as const),
            },
          ],
        ] as const);
        expect(config.TEST_ENUM).to.equal("development");
      });

      it("should handle invalid enum values in env", () => {
        process.env.TEST_ENUM = "invalid";
        expect(() =>
          envar([
            [
              "TEST_ENUM",
              {
                parser: parseEnvEnum(["development", "production"] as const),
                required: true,
              },
            ],
          ] as const)
        ).to.throw("Expected one of: development, production");
      });
    });
  });
});
