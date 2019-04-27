module.exports = {
  "env": {
    "browser": true,
    "es6": true,
    "jest": true,
  },
  "extends": [
    "recommended/node",
    "recommended/node/style-guide",
  ],
  "parserOptions": {
    "ecmaVersion": 2018,
    "sourceType": "module"
  },
  "rules": {
    "quotes": [
      "error",
      "double"
    ],
    "semi": [
      "error",
      "always"
    ],
    "no-console": 1,
    "no-debugger": 1,
    "no-dupe-keys": 2,
    "no-empty": 1,
    "dot-notation": 1,
    "no-alert": 2,
    "indent": [2,2],
    "curly": [2, "all"],
    "quote-props": [1, "always"],
    "import/no-commonjs": 0,
    "space-before-function-paren": [1, "never"],
  },
};
