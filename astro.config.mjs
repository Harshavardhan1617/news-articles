import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

import solid from "@astrojs/solid-js";

export default defineConfig({
  integrations: [solid()],
  vite: {
    plugins: [tailwindcss()],
  },
});
