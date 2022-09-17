<template>
  <nuxt-link :to="path" class="ui-button">
    {{ value }}
  </nuxt-link>
</template>

<script setup>

// interface ButtonProps {
//   value: string,
//   path: string
// }

const btnProps = defineProps({
  value: String,
  path: String,
});
</script>

<style lang="scss" scoped>
  .ui-button {
    display: inline-block;
    padding: 10px 17px;
    background-color: $blue;
    text-decoration: none;
    font-size: 0.9rem;
    color: $bg;
    text-align: center;
    cursor: pointer;

    &:hover {
      background-color: darken($blue, 8)
    }
  }
</style>
