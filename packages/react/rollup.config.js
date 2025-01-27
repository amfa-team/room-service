import alias from "@rollup/plugin-alias";
import babel from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import postCssValues from "postcss-modules-values";
import postcss from "rollup-plugin-postcss";
import sourcemaps from "rollup-plugin-sourcemaps";
import pkg from "./package.json";

export const extensions = [".js", ".jsx", ".ts", ".tsx"];

export default [
  {
    input: "lib/index.js",
    output: [
      {
        file: pkg.module,
        format: "es",
        sourcemap: true,
      },
    ],
    plugins: [
      alias({
        entries: {
          "react-resize-detector": "react-resize-detector/build/withPolyfill",
        },
      }),
      resolve({
        extensions,
        browser: true,
        preferBuiltins: false,
        modulesOnly: true,
        resolveOnly: [/^@amfa-team\/room-service.*$/],
      }),
      sourcemaps(),
      postcss({
        extract: true,
        minimize: !process.env.ROLLUP_WATCH,
        sourceMap: true,
        plugins: [postCssValues],
      }),
      babel({
        babelHelpers: "runtime",
        extensions,
        plugins: [["@babel/plugin-transform-runtime", { useESModules: true }]],
      }),
    ],
  },
  {
    input: "lib/index.js",
    output: [
      {
        file: pkg.main,
        format: "cjs",
        sourcemap: true,
      },
    ],
    plugins: [
      alias({
        entries: {
          "react-resize-detector": "react-resize-detector/build/withPolyfill",
        },
      }),
      resolve({
        extensions,
        browser: true,
        preferBuiltins: false,
        modulesOnly: true,
        resolveOnly: [/^@amfa-team\/room-service.*$/],
      }),
      sourcemaps(),
      postcss({
        extract: true,
        minimize: !process.env.ROLLUP_WATCH,
        sourceMap: true,
        plugins: [postCssValues],
      }),
      babel({
        babelHelpers: "runtime",
        extensions,
        plugins: [["@babel/plugin-transform-runtime", { useESModules: false }]],
      }),
    ],
  },
];
