<script setup lang="ts">
const signUp = () => {
  console.log("sign up");
};
</script>

<template>
  <form @submit.prevent="signUp">
    <fieldset>
      <label for="email">E-mail address</label>
      <input id="email" type="email" />
    </fieldset>
    <fieldset>
      <label for="password">Password</label>
      <input id="password" type="password" />
    </fieldset>
    <fieldset>
      <label for="password-confirm">Confirm password</label>
      <input id="password-confirm" type="password" />
    </fieldset>

    <button>Sign up</button>
  </form>
</template>

<style scoped></style>
