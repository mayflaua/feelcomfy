<template>
  <NuxtLayout>
    <NuxtLoadingIndicator color="lightblue" />
    <NuxtPage />
  </NuxtLayout>
</template>
<script setup>
import { useFavoritesStore } from '@/stores/favorites'
import { useCartStore } from '~/stores/cart'

const { supabase } = useSupabase()

const favoritesStore = useFavoritesStore()
const cartStore = useCartStore()

// created() hook
supabase.auth.onAuthStateChange(async (event, session) => {
  // TODO: не срабатывает при логине
  if (event === 'SIGNED_IN') {
    await favoritesStore.getCompressedFavoritesList()
    await cartStore.getCompressedCart()
  }
})
</script>
