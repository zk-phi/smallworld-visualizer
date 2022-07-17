import Path from "path";
import solidPlugin from "vite-plugin-solid";
import checkerPlugin from "vite-plugin-checker";
import { defineConfig } from "vite";

export default defineConfig({
  root: "src",
  base: "",
  plugins: [
    solidPlugin(),
    checkerPlugin({ typescript: true }),
  ],
  build: {
    outDir: Path.resolve("dist"),
  },
});
