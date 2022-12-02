<script setup lang="ts">
import QueryLoader from '@renderer/components/QueryLoader/index.vue';
import { useLogout } from '@renderer/composables/useAuth';
import { useSession } from '@renderer/composables/useSession';
import Surface from '@renderer/components/ui/Surface.vue';
import Center from '@renderer/components/ui/Center.vue';
import Spinner from '@renderer/components/ui/Spinner.vue';

const sessionQuery = useSession();
const { mutate } = useLogout();
</script>

<template>
  <QueryLoader :query="sessionQuery">
    <template #loading>
      <Center>
        <Surface>
          <Spinner />
        </Surface>
      </Center>
    </template>

    <template #default>
      <Surface>
        <button class="logout-button" @click="mutate()">Logout</button>
      </Surface>
    </template>
  </QueryLoader>
</template>

<style scoped lang="postcss">
.logout-button {
  text-decoration: underline;
}
</style>

<route lang="json">
{
  "name": "Home",
  "meta": {
    "bg": "img/main-menu.png"
  }
}
</route>
