<script setup lang="ts">
import { useOngoingGame } from '@renderer/composables/useGame';
import ButtonBase from '@renderer/components/ui/Button/ButtonBase.vue';
import Modal from '@renderer/components/ui/Modal/index.vue';
import ModalContent from '@renderer/components/ui/Modal/ModalContent.vue';

const { data: ongoingGame } = useOngoingGame();
</script>

<template>
  <Modal
    :is-opened="!!ongoingGame"
    :closable="false"
    title="You have an ongoing game !"
  >
    <ModalContent>
      <ButtonBase
        :to="{ name: 'GameSession', params: { id: ongoingGame!.id } }"
      >
        Join
      </ButtonBase>
    </ModalContent>
  </Modal>
</template>
