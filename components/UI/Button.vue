<template>
  <nuxt-link :to="path" class="ui-button" :class="disabled && 'ui-button--disabled'">
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
  disabled: {
    type: Boolean,
    default: false
  }
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

    &--disabled {
      pointer-events: none;
      opacity: 0.7;
    }
  }
</style>
