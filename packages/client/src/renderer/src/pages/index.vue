<script setup lang="ts">
import QueryLoader from '@renderer/components/QueryLoader/index.vue';
import UserOnboardingModal from '@renderer/components/UserOnboardingModal.vue';
import { useLogout } from '@renderer/composables/useAuth';
import { useOngoingGame } from '@renderer/composables/useGame';
import { useSession } from '@renderer/composables/useSession';
import Surface from '@renderer/components/ui/Surface.vue';
import ButtonBase from '@renderer/components/ui/Button/ButtonBase.vue';

const sessionQuery = useSession();

const { mutate } = useLogout();
const { data: ongoingGame } = useOngoingGame();
</script>

<template>
  <Surface>
    <QueryLoader :query="sessionQuery">
      <template #loading>
        <div>Loading profile...</div>
      </template>

      <template #default="{ data: session }">
        <UserOnboardingModal v-if="!session.username" />

        <template v-else>
          <h2 v-if="session.username">
            Welcome back, {{ session.username }}#{{ session.usernameTag }}
          </h2>
          <h2 v-else>Hello, There</h2>
          <ButtonBase @click="mutate()">Logout</ButtonBase>

          <ButtonBase
            v-if="ongoingGame"
            :to="{ name: 'GameSession', params: { id: ongoingGame.id } }"
          >
            Join ongoing game
          </ButtonBase>
          <ButtonBase v-else to="/matchmaking">Play</ButtonBase>
        </template>
      </template>
    </QueryLoader>
  </Surface>
</template>

<route lang="json">
{
  "name": "Home"
}
</route>
