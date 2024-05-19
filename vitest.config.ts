/// <reference types="vitest" />
import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  resolve: {
    preserveSymlinks: true,
    alias: {
      "@src": path.resolve(__dirname, "./lib"),
    }
  },
  test: {
    threads: false,
    globals: true,
    include: ["./lib/**/*.{test,spec}.?(c|m)[jt]s?(x)"],
  }
});
