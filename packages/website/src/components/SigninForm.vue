<script setup lang="ts">
const signIn = () => {
  console.log("sign in");
};
</script>

<template>
  <form @submit.prevent="signIn">
    <fieldset>
      <label for="email">Email</label>
      <input id="email" />
    </fieldset>

    <fieldset>
      <label for="password">Password</label>
      <input id="password" type="password" />
    </fieldset>

    <fieldset>
      <label for="password-confirm">Confirm Password</label>
      <input id="password-confirm" type="password" />
    </fieldset>

    <button>Sign in</button>
  </form>
</template>
