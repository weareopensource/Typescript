module.exports = {
  root: true,
  env: {
    node: true,
    es2021: true,
    browser: true,
    jest: true,
  },
  extends: ['airbnb-typescript/base', 'plugin:markdown/recommended', 'plugin:prettier/recommended'],
  plugins: ['@typescript-eslint', 'prettier', 'markdown'],
  ignorePatterns: ['*.js'],
  rules: {
    'prettier/prettier': 'error',
    'no-console': 0,
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'max-len': 0,
    'no-param-reassign': 0,
    'global-require': 0,
    'prefer-destructuring': ['error', { object: false, array: false }],
    'import/no-dynamic-require': 0,
    'consistent-return': 0,
    'no-underscore-dangle': 0,
    'no-shadow': 0,
    'operator-linebreak': 0,
    '@typescript-eslint/naming-convention': 0,
  },
  parserOptions: {
    project: './tsconfig.json',
    createDefaultProgram: true,
    ecmaVersion: 12,
    sourceType: 'module',
  },
  overrides: [
    {
      files: ['**/__tests__/*.{j,t}s?(x)', '**/tests/unit/**/*.spec.{j,t}s?(x)'],
      env: {
        jest: true,
      },
    },
  ],
};
