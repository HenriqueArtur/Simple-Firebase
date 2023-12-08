/// <reference types="vitest" />
import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  resolve: {
    preserveSymlinks: true,
    alias: {
      "@src": path.resolve(__dirname, "./lib/src"),
      "@tests": path.resolve(__dirname, "./lib/tests")
    }
  },
  test: {
    threads: true,
    globals: true,
    include: ["./lib/tests/**"]
  }
});
