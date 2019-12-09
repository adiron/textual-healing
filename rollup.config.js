/* eslint-disable import/extensions */
import commonjs from "rollup-plugin-commonjs";
import pkg from "./package.json";
import resolve from "rollup-plugin-node-resolve";

export default [
  // browser-friendly UMD build
  {
    "input": "src/index.js",
    "output": {
      "name": "textual-healing",
      "file": pkg.browser,
      "format": "umd",
    },
    "plugins": [
      resolve(), // so Rollup can find `ms`
      commonjs(), // so Rollup can convert `ms` to an ES module
    ],
  },
];
