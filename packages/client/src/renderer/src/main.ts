import { createApp } from 'vue';
import App from './App.vue';
import { VueQueryPlugin } from '@tanstack/vue-query';
import { createRouter, createWebHistory } from 'vue-router';
import { setupLayouts } from 'virtual:generated-layouts';
import generatedRoutes from '~pages';
import { authService } from './api/auth';

const routes = setupLayouts(generatedRoutes);

authService.init();
createApp(App)
  .use(
    createRouter({
      history: createWebHistory(),
      routes
    })
  )
  .use(VueQueryPlugin, {
    queryClientConfig: {
      defaultOptions: {
        queries: {
          retry: false,
          refetchOnWindowFocus: false,
          staleTime: 30_000
        }
      }
    }
  })
  .mount('#app');
