module.exports = {
  root: true,
  env: {
    node: true,
    es6: true,
    jest: true,
  },
  parserOptions: {
    project: 'tsconfig.eslint.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: ['airbnb-typescript/base'],
  rules: {
    'consistent-return': 0,
    'no-unused-vars': 1,
    'object-curly-newline': 0,
    'arrow-body-style': 0,
    'operator-linebreak': 0,
    'no-await-in-loop': 1,

    'import/prefer-default-export': 0,

    '@typescript-eslint/no-unused-vars': 1,
  },
};
