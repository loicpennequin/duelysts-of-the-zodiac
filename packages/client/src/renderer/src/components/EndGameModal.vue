<script setup lang="ts">
import { GameSessionDto } from '@dotz/shared';
import { useSession } from '@renderer/composables/useSession';
import ModalContent from './ui/Modal/ModalContent.vue';
import Modal from './ui/Modal/index.vue';
import ButtonBase from './ui/Button/ButtonBase.vue';

const props = defineProps<{ gameSession: GameSessionDto }>();
const { data: session } = useSession();
</script>

<template>
  <Modal :is-opened="!!props.gameSession.endedAt" :closable="false">
    <ModalContent>
      <p class="status">
        {{ session?.id === gameSession.winnerId ? 'Victory' : 'Defeat' }}
      </p>
      <ButtonBase to="/">Continue</ButtonBase>
    </ModalContent>
  </Modal>
</template>

<style scoped>
.status {
  font-size: var(--text-size-6);
  text-align: center;
}
</style>
