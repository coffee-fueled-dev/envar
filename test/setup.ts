// Set up test environment variables
process.env.TEST_PORT = "3000";
process.env.TEST_HOST = "localhost";
process.env.TEST_DEBUG = "true";

process.env.TEST_SETTINGS = '{"timeout":5000,"retries":3}';
process.env.TEST_MODE = "production";

process.env.TEST_INT = "123";
process.env.TEST_FLOAT = "123.45";
process.env.TEST_BOOL = "true";
process.env.TEST_JSON = '{"name":"test","value":123}';
process.env.TEST_STRING = "  test-value  ";
process.env.TEST_ENUM = "development";

// Run the tests (this will be handled by the test script)
