import { resolve } from 'path';
import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import vue from '@vitejs/plugin-vue';
// import checker from 'vite-plugin-checker';
import AutoImport from 'unplugin-auto-import/vite';
import VueRouter from 'unplugin-vue-router/vite';
import Icons from 'unplugin-icons/vite';

import { VueRouterAutoImports } from 'unplugin-vue-router';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    css: { postcss: './postcss.config.cjs' },

    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [
      VueRouter({
        routesFolder: fileURLToPath(
          new URL('./src/renderer/src/pages', import.meta.url)
        ),
        dts: './src/renderer/typed-router.d.ts'
      }),
      vue(),
      // checker({
      //   vueTsc: { tsconfigPath: './tsconfig.web.json' }
      // }),

      Icons({
        compiler: 'vue3'
      }),

      AutoImport({
        include: [/\.[tj]sx?$/, /\.vue$/, /\.vue\?vue/, /\.md$/],
        imports: [
          'vue',
          '@vueuse/core',
          VueRouterAutoImports,
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
