<script setup lang="ts">
import Surface from '@renderer/components/ui/Surface.vue';
import LinkButton from '@renderer/components/ui/Button/LinkButton.vue';
import Container from '@renderer/components/ui/Container.vue';
import { useSession } from '@renderer/composables/useSession';

const { data: session } = useSession();
</script>

<template>
  <Surface as="header" class="app-header">
    <Container class="inner">
      <nav>
        <ul class="nav-list">
          <li>
            <LinkButton to="/" class="nav-link">Home</LinkButton>
          </li>
          <li>
            <LinkButton to="/collection" class="nav-link">
              Collection
            </LinkButton>
          </li>
          <li>
            <LinkButton to="/shop" class="nav-link">Shop</LinkButton>
          </li>
        </ul>
      </nav>
      {{ session?.username }}#{{ session?.usernameTag }}
    </Container>
  </Surface>
</template>

<style scoped lang="postcss">
.app-header {
  padding: var(--space-4);
}

nav > ul {
  display: flex;
  align-items: center;
  gap: var(--space-6);
}

.inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.play-button {
  font-size: var(--text-size-5);
}
</style>
