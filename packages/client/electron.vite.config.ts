import { resolve } from 'path';
import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import vue from '@vitejs/plugin-vue';
import checker from 'vite-plugin-checker';
import Pages from 'vite-plugin-pages';
import AutoImport from 'unplugin-auto-import/vite';
import Layouts from 'vite-plugin-vue-layouts';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [
      vue(),
      Layouts({
        layoutsDirs: [
          fileURLToPath(new URL('./src/renderer/src/layouts', import.meta.url))
        ]
      }),
      checker({
        vueTsc: { tsconfigPath: './tsconfig.web.json' }
      }),

      Pages({
        extensions: ['vue'],
        pagesDir: [
          fileURLToPath(new URL('./src/renderer/src/pages', import.meta.url))
        ]
      }),
      AutoImport({
        include: [/\.[tj]sx?$/, /\.vue$/, /\.vue\?vue/, /\.md$/],
        imports: [
          'vue',
          '@vueuse/core',
          'vue-router',
          {
            '@tanstack/vue-query': [
              'useQuery',
              'useMutation',
              'useInfiniteQuery',
              'useQueryClient'
            ]
          }
        ]
      })
    ]
  }
});
