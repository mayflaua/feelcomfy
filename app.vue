<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
<script setup>
import { useFavoritesStore } from '~/stores/favorites'
import { useCartStore } from '~/stores/cart'

const { supabase } = useSupabase()
const { user } = useAuth()

const favoritesStore = useFavoritesStore()
const cartStore = useCartStore()

// created() hook
supabase.auth.onAuthStateChange(async (event, session) => {
  if (event === 'SIGNED_IN') {
    await favoritesStore.getFavoritesFromDatabase()
    await cartStore.getCartFromDatabase(user.value.id)
  }
})

</script>
