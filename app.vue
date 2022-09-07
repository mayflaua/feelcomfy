<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
<script setup>
import { useCartStore } from "./stores/cart";
const cartStore = useCartStore();

onMounted(async () => {
  await cartStore.getCartFromDatabase();
})

</script>
