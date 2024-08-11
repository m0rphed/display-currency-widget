// - dependencies resolved via import map in deno.json
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import "react";
import "react-dom";

// - to resolve path we should use Deno's path utils (from '@std/path')
//  instead of NodeJS __dirname global variable
import * as path from "jsr:@std/path";
const dirname = path.dirname(path.fromFileUrl(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(dirname, "./src"),
    },
  },
});
