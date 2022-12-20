<script setup lang="ts">
import QueryLoader from '@renderer/components/QueryLoader/index.vue';
import { useLogout } from '@renderer/composables/useAuth';
import { useSession } from '@renderer/composables/useSession';
import Surface from '@renderer/components/ui/Surface.vue';
import Center from '@renderer/components/ui/Center.vue';
import Container from '@renderer/components/ui/Container.vue';
import Spinner from '@renderer/components/ui/Spinner.vue';
import { useCreateSinglePlayerGame } from '@renderer/composables/useGame';
import { GameSessionDto } from '@dotz/shared';
import ButtonBase from '@renderer/components/ui/Button/ButtonBase.vue';

const sessionQuery = useSession();
const router = useRouter();
const { mutate: logout } = useLogout();

const { mutate: createSinglePlayerGame, isLoading } = useCreateSinglePlayerGame(
  {
    onSuccess(data: GameSessionDto) {
      router.push({ name: 'GameSession', params: { id: data.id } });
    }
  }
);
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
      <Container class="home-page">
        <Surface as="ul" class="home-menu">
          <li>
            <ButtonBase :disabled="isLoading" @click="createSinglePlayerGame()">
              Single player game
            </ButtonBase>
          </li>
          <li>
            <ButtonBase to="/matchmaking">Multiplayer game</ButtonBase>
          </li>
          <li>
            <ButtonBase @click="logout()">Logout</ButtonBase>
          </li>
        </Surface>
      </Container>
    </template>
  </QueryLoader>
</template>

<style scoped lang="postcss">
.home-page {
  display: grid;
  grid-template-columns: auto 1fr;
  margin-top: var(--space-8);
}

.home-menu > li * {
  font-size: var(--text-size-4);
  width: 100%;
}

.home-menu li + li {
  margin-top: var(--space-5);
}
</style>

<route lang="json">
{
  "name": "Home",
  "meta": {
    "bg": "/img/main-menu.png"
  }
}
</route>
