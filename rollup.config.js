import typescript from "rollup-plugin-typescript2";
import tslint from "rollup-plugin-tslint";
import { uglify } from "rollup-plugin-uglify";

export default {
  input: "src/viewer/index.ts",
  output: {
    file: "example/module/viewer.js",
    format: "esm",
  },
  plugins: [
    typescript({ clean: true, sourceMap: false, declaration: true }),
    tslint(),
    // uglify(),
  ],
  onwarn(warning, warn) {
    if (warning.code === "EVAL") {
      return;
    }
    warn(warning);
  },
};
