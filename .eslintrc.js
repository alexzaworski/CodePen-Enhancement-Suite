module.exports = {
  env: {
    browser: true,
    node: true,
    es6: true
  },
  extends: 'eslint:recommended',
  parserOptions: {
    sourceType: 'module'
  },
  globals: {
    chrome: false,
    $: false,
    CES: false,
    CP: false,
    Hub: false
  },
  rules: {
    indent: ['error', 2],
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    'no-console': ['error', { allow: ['warn', 'error'] }],
    'space-before-function-paren': ['error', 'never'],
    'eol-last': ['error', 'always']
  }
};
