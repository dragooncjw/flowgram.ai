const path = require('path');

const { main } = require('./package.json');

const { defineConfig } = require(path.resolve(__dirname, main));

module.exports = defineConfig({
  packageRoot: __dirname,
  preset: 'node',
  settings: {
    react: {
      version: 'detect',
    },
  },
});
