import { svelte } from "@sveltejs/vite-plugin-svelte";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [svelte()],
  test: {
    include: ["src/**/*.test.ts"],
    passWithNoTests: true,
    coverage: {
      provider: "v8",
      include: ["src/lib/**/*Model.svelte.ts"],
      // Thresholds disabled until tests are written.
      // Enable when movable has a behavioral spec and Model tests.
    },
  },
});
