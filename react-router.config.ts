import type { Config } from "@react-router/dev/config";

// Potpuno statična stranica: nema runtime servera, svaka ruta se
// pri buildu renderira u HTML (build/client) i hosta na Cloudflare Pagesu.
export default {
  ssr: false,
  prerender: true,
} satisfies Config;
