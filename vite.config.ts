import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig(async ({ command }) => {
  const plugins = [react()]

  if (command === "serve") {
    try {
      const { inspectAttr } = await import("kimi-plugin-inspect-react")
      plugins.unshift(inspectAttr())
    } catch {
      console.warn(
        "[vite] Optional plugin 'kimi-plugin-inspect-react' is not installed; continuing without it.",
      )
    }
  }

  return {
    base: "./",
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      proxy: {
        "/api": {
          target: "http://127.0.0.1:3001",
          changeOrigin: true,
        },
      },
    },
  }
});
