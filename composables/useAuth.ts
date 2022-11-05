import { User } from '@supabase/gotrue-js'
import { Ref } from 'vue'
import { navigateTo, useState } from '#imports'
import { useFavoritesStore } from '~/stores/favorites'
import { useCartStore } from '~/stores/cart'
import useSupabase from '~/composables/useSupabase'

const useAuth = () => {
  const user:Ref<User | null> = useState('user', () => null)
  const { supabase } = useSupabase()
  const favoritesStore = useFavoritesStore()
  const cartStore = useCartStore()

  supabase.auth.onAuthStateChange(async (event, session) => {
    user.value = session?.user || null

    if (event === 'SIGNED_IN' && user.value) {
      cartStore.setUser(user.value.id)

      await cartStore.getCartFromDatabase()
      await favoritesStore.getCompressedFavoritesList()
    } else if (event === 'SIGNED_OUT') {
      favoritesStore.resetFavorites()
      await cartStore.resetCart()
    }
  })

  const signUp = async ({ email, password, ...metadata }: {email: string, password: string, metadata: any}) => {
    const { user: u, error } = await supabase.auth.signUp(
      { email, password },
      { data: metadata }
    )
    if (error) {
      throw error
    }
    if (u) {
      await supabase.from('carts').insert({
        user_id: u.id,
        cart: []
      })
      await supabase.from('favorites').insert({
        user_id: u.id,
        favorites: []
      })
    }

    return u
  }

  const signIn = async ({ email, password }: {email: string, password: string}) => {
    const { user: u, error } = await supabase.auth.signIn({ email, password })
    if (error) {
      throw error
    }
    return u
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    localStorage.removeItem('supabase.auth.token')

    if (error) {
      throw error
    }
    await navigateTo('/')
  }

  const isLoggedIn = () => {
    return !!user.value
  }

  return { user, signUp, signIn, signOut, isLoggedIn }
}

export default useAuth
