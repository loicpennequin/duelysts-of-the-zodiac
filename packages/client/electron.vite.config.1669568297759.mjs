// electron.vite.config.ts
import { resolve } from "path";
import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import vue from "@vitejs/plugin-vue";
import checker from "vite-plugin-checker";
import Pages from "vite-plugin-pages";
import AutoImport from "unplugin-auto-import/vite";
import Layouts from "vite-plugin-vue-layouts";
import { fileURLToPath, URL } from "node:url";
var __electron_vite_injected_import_meta_url = "file:///C:/Users/Lo%C3%AFc/web/duelysts-of-the-zodiac/packages/client/electron.vite.config.ts";
var electron_vite_config_default = defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        "@renderer": resolve("src/renderer/src")
      }
    },
    plugins: [
      vue(),
      Layouts({
        layoutsDirs: [
          fileURLToPath(new URL("./src/renderer/src/layouts", __electron_vite_injected_import_meta_url))
        ]
      }),
      checker({
        vueTsc: { tsconfigPath: "./tsconfig.web.json" }
      }),
      Pages({
        extensions: ["vue"],
        pagesDir: [
          fileURLToPath(new URL("./src/renderer/src/pages", __electron_vite_injected_import_meta_url))
        ]
      }),
      AutoImport({
        include: [/\.[tj]sx?$/, /\.vue$/, /\.vue\?vue/, /\.md$/],
        imports: [
          "vue",
          "@vueuse/core",
          "vue-router",
          {
            "@tanstack/vue-query": [
              "useQuery",
              "useMutation",
              "useInfiniteQuery",
              "useQueryClient"
            ]
          }
        ]
      })
    ]
  }
});
export {
  electron_vite_config_default as default
};
