<template>
  <p class="product-description">
    {{ description }}
  </p>
</template>

<script lang="ts" setup>
defineProps({
  description: {
    type: String,
    default: ''
  }
})
</script>
