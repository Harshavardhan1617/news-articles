import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

import solid from "@astrojs/solid-js";

import netlify from "@astrojs/netlify";

export default defineConfig({
  integrations: [solid()],

  vite: {
    plugins: [tailwindcss()],
  },

  adapter: netlify(),
});