<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
<script setup>
import { useCartStore } from "~/stores/cart";
import { useFavoritesStore } from "~/stores/favorites";
const cartStore = useCartStore();
const favoritesStore = useFavoritesStore();

onMounted(async () => {
  await cartStore.getCartFromDatabase();
  await favoritesStore.getFavoritesFromDatabase();
})

</script>
