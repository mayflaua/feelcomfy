<template>
  <p class="product-description">
    {{ description }}
  </p>
</template>

<script setup>
defineProps({
  description: {
    type: String,
    default: ''
  }
})
</script>
