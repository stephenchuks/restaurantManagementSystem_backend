export default {
    root: true,
    parser: "@typescript-eslint/parser",
    parserOptions: {
      sourceType: "module",
      ecmaVersion: "latest"
    },
    env: {
      node: true,
      es2022: true,
      jest: true
    },
    plugins: ["@typescript-eslint", "import"],
    extends: [
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended",
      "plugin:import/errors",
      "plugin:import/warnings",
      "plugin:import/typescript",
      "prettier"
    ],
    settings: {
      "import/resolver": {
        typescript: {}
      }
    },
    rules: {
      "import/no-unresolved": "error",
      "import/order": [
        "warn",
        {
          "groups": [
            "builtin",
            "external",
            "internal",
            ["parent", "sibling", "index"]
          ],
          "newlines-between": "always"
        }
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/consistent-type-imports": "error"
    }
  };
  