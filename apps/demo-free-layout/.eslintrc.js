const { defineConfig } = require('@flowgram.ai/eslint-config');

module.exports = defineConfig({
  preset: 'web',
  packageRoot: __dirname,
  rules: {
    'react/no-deprecated': 'off',
    '@flowgram.ai/e2e-data-testid': 'off',
  },
});
