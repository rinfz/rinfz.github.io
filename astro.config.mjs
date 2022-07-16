import { defineConfig } from "astro/config";

import tailwind from "@astrojs/tailwind";
import { astroImageTools } from "astro-imagetools";

// https://astro.build/config
export default defineConfig({
  site: "https://rinfz.github.io",
  base: "/b5.re",
  integrations: [tailwind(), astroImageTools],
  markdown: {
    shikiConfig: {
      theme: "poimandres",
    },
  },
});
