<script setup lang="ts">
import type { User } from "@dotz/shared";

const props = defineProps<{ users: User[] }>();
</script>

<template>
  <h2>User list :</h2>
  <p v-if="users.length === 0">There are no users yet</p>
  <ul>
    <li v-for="user in props.users" :key="user.id">{{ user }}</li>
  </ul>
</template>
