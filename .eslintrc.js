module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: ['airbnb-base', 'plugin:security/recommended'],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'no-console': 0,
    camelcase: 0,
    'consistent-return': 0,
    'global-require': 0,
    'new-cap': 0,
    'linebreak-style': 0,
    'no-underscore-dangle': 0,
    'no-plusplus': 0,
    'max-classes-per-file': ['error', 10],
    'no-undef': 0,
  },
};
