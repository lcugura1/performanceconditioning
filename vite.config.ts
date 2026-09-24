import { fileURLToPath } from "node:url";
import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";

const stylesDir = fileURLToPath(new URL("./app/styles", import.meta.url));

export default defineConfig({
  plugins: [reactRouter()],
  resolve: {
    tsconfigPaths: true,
  },
  css: {
    preprocessorOptions: {
      scss: {
        // tokeni, mixini i breakpointi dostupni u svakom .scss bez ručnog importa
        loadPaths: [stylesDir],
        additionalData: `@use "abstracts" as *;\n`,
      },
    },
  },
});
