module.exports = {
  root: true,
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: ['airbnb-typescript'],
  rules: {
    'arrow-body-style': 0,

    'react/prop-types': 0,
    'react/jsx-props-no-spreading': 0,
  },
};
