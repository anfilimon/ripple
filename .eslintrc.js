// https://eslint.org/docs/user-guide/configuring
module.exports = {
  root: true,
  parserOptions: {
    parser: '@babel/eslint-parser',
    allowImportExportEverywhere: true
  },
  env: {
    browser: true,
    jest: true,
    es2021: true
  },
  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    'plugin:vue/essential',
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    'standard',
    'plugin:jest/recommended'
  ],
  // required to lint *.vue files
  plugins: [
    'vue',
    'jest',
    '@babel'
  ],
  // add your custom rules here
  rules: {
    // allow async-await
    'generator-star-spacing': 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // TODO enable the rules to achieve lint standard consistency towards projects
    'array-bracket-spacing': 'off',
    'array-callback-return': 'off',
    'dot-notation': 'off',
    'jest/expect-expect': 'off',
    'jest/no-standalone-expect': 'off',
    'jest/no-try-expect': 'off',
    'jest/no-conditional-expect': 'off',
    'lines-between-class-members': 'off',
    'multiline-ternary': 'off',
    'no-case-declarations': 'off',
    'no-prototype-builtins': 'off',
    'node/no-deprecated-api': 'off',
    'prefer-const': 'off',
    'prefer-regex-literals': 'off',
    'quotes': 'off',
    'quote-props': 'off',
    'vue/no-mutating-props': 'off',
    'vue/no-unused-components': 'off',
    'vue/no-use-v-if-with-v-for': 'off',
    'vue/return-in-computed-property': 'off'
  }
}
