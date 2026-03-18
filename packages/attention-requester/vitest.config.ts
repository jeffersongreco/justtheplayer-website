import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config";

export default mergeConfig(
  viteConfig,
  defineConfig({
    resolve: {
      // Ensure Svelte resolves to client (browser) build, not server,
      // when tests run in a jsdom environment (needed for a11y tests).
      conditions: ["browser"],
    },
    test: {
      include: ["src/**/*.test.ts"],
      coverage: {
        provider: "v8",
        include: ["src/lib/**/*Model.svelte.ts"],
        thresholds: {
          statements: 80,
          branches: 80,
          functions: 80,
          lines: 80,
        },
      },
    },
  })
);
