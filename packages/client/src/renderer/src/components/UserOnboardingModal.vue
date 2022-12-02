<script setup lang="ts">
import { useSession } from '@renderer/composables/useSession';
import { useUserOnboarding } from '@renderer/composables/useUser';
import Modal from '@renderer/components/ui/Modal/index.vue';
import ModalContent from './ui/Modal/ModalContent.vue';
import ButtonBase from './ui/Button/ButtonBase.vue';
import TextInput from './ui/TextInput.vue';
import seiyaChibi from '@renderer/assets/img/seiya-chibi.png';

const { data: session } = useSession();
const username = ref('');
const { mutate, error } = useUserOnboarding();
</script>

<template>
  <Modal v-if="session" :is-opened="!session.username" :closable="false">
    <ModalContent class="user-onboarding-modal">
      <img :src="seiyaChibi" />
      <h2>Almost done !</h2>
      <p>You're almost ready to play !</p>
      <p>We just need you to select a username below</p>

      <form @submit.prevent="mutate({ username })">
        <label for="onboarding-username" class="sr-only">My username is</label>
        <TextInput id="onboarding-username" v-model="username" class="input" />
        <ButtonBase>Let's go !</ButtonBase>
        <p v-if="error">{{ error }}</p>
      </form>
    </ModalContent>
  </Modal>
</template>

<style lang="postcss" scoped>
.user-onboarding-modal {
  & img {
    display: block;
    margin-inline: auto;
    width: 30%;
    height: auto;
  }
  & h2 {
    font-size: var(--text-size-6);
  }

  & p {
    font-size: var(--font-size-6);
    margin-block: var(--space-4);
  }

  & p,
  & h2 {
    text-align: center;
  }

  & form {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-block-start: var(--space-4);
    gap: var(--space-5);
  }

  & .input {
    font-size: var(--text-size-5);
  }
}
</style>
