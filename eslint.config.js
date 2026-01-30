// eslint.config.js
const js = require("@eslint/js");
const typescript = require("@typescript-eslint/eslint-plugin");
const typescriptParser = require("@typescript-eslint/parser");
const react = require("eslint-plugin-react");
const reactHooks = require("eslint-plugin-react-hooks");
const jsxA11y = require("eslint-plugin-jsx-a11y");
const prettier = require("eslint-plugin-prettier");
const prettierConfig = require("eslint-config-prettier");

module.exports = [
  // Базовые правила JavaScript
  js.configs.recommended,

  // Конфигурация для TypeScript и React файлов
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        // Browser globals
        window: "readonly",
        document: "readonly",
        console: "readonly",
        localStorage: "readonly",
        sessionStorage: "readonly",
        fetch: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
        requestAnimationFrame: "readonly",
        URL: "readonly",
        URLSearchParams: "readonly",
        File: "readonly",
        Buffer: "readonly",
        btoa: "readonly",
        atob: "readonly",
        React: "readonly",
        KeyboardEvent: "readonly",
        NodeJS: "readonly",
        // Node.js globals
        process: "readonly",
        require: "readonly",
        module: "readonly",
        exports: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        global: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": typescript,
      react,
      "react-hooks": reactHooks,
      "jsx-a11y": jsxA11y,
      prettier,
    },
    rules: {
      // TypeScript правила
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",

      // React правила
      "react/react-in-jsx-scope": "off", // Next.js не требует импорта React
      "react/prop-types": "off", // TypeScript уже проверяет типы
      "react-hooks/rules-of-hooks": "warn",
      "react-hooks/exhaustive-deps": "off",

      // Accessibility правила
      "jsx-a11y/alt-text": "warn",
      "jsx-a11y/anchor-is-valid": "warn",

      // Prettier интеграция - только форматирование
      "prettier/prettier": "error",

      // Общие правила
      "no-console": "off",
      "no-undef": "off",
      "no-debugger": "error",
      "no-unused-vars": "off", // Отключаем в пользу @typescript-eslint/no-unused-vars
      "no-useless-escape": "warn",
      "no-shadow-restricted-names": "warn",
      "prefer-const": "error",
      "no-var": "error",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },

  // Конфигурация Prettier (отключает конфликтующие правила)
  prettierConfig,

  // Игнорирование определенных файлов
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "dist/**",
      "*.config.js",
      "*.config.mjs",
      "next-env.d.ts",
      "public/**",
      "prisma/dev.db",
      "prisma/migrations/**",
      "*.log",
      "npm-debug.log*",
      "yarn-debug.log*",
      "yarn-error.log*",
      "coverage/**",
      ".env",
      ".env.*",
      ".vscode/**",
      ".idea/**",
      ".DS_Store",
      "Thumbs.db",
      "pids/**",
      "*.pid",
      "*.seed",
      "*.pid.lock",
    ],
  },
];
