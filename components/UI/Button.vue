<template>
  <button :class="disabled && 'ui-button--disabled'" class="ui-button">
    {{ text }}
  </button>
</template>

<script setup>

defineProps({
  text: String,
  disabled: {
    type: Boolean,
    default: false
  }
})
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

  outline: none;
  border: none;

  &:hover {
    background-color: darken($blue, 8)
  }

  &--disabled {
    pointer-events: none;
    opacity: 0.7;
  }
}
</style>
