module.exports = {
  extension: ["ts"],
  spec: "tests/**/*.spec.ts",
  require: ["ts-node/register"],
  loader: "ts-node/esm",
};
