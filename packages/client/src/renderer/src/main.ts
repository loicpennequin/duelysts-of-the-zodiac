import { createApp } from 'vue';
import App from './App.vue';
import { VueQueryPlugin } from '@tanstack/vue-query';
import { createRouter, createWebHistory } from 'vue-router/auto';
import { authService } from './api/auth';
import { routes } from 'vue-router/auto/routes';
console.log(routes);

authService.init().finally(() => {
  createApp(App)
    .use(
      createRouter({
        history: createWebHistory()
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
});
