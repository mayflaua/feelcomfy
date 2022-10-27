<template>
  <header class="header">
    <LazyAuthModal v-if="isAuthModalOpened" @close="closeAuthModal" />
    <nav class="nav">
      <NavLogo />
      <NavSearchField @open-aside="openAside" />
      <NavUserActions @open-auth-modal="openAuthModal" />
    </nav>
    <NavCategoriesLinks />
    <ClientOnly>
      <transition name="menu">
        <NavAside
          v-if="sideMenuOpened"
          @close-aside="closeAside"
          @open-auth-modal="openAuthModal"
        />
      </transition>
    </ClientOnly>
  </header>
</template>

<script lang="ts" setup>
import { Ref, ref } from 'vue'

const sideMenuOpened: Ref<boolean> = ref(false)
const isAuthModalOpened: Ref<boolean> = ref(false)

const openAuthModal = (): void => {
  sideMenuOpened.value = false
  isAuthModalOpened.value = true
}
const closeAuthModal = (): void => {
  sideMenuOpened.value = true
  isAuthModalOpened.value = false
}

const openAside = (): void => {
  sideMenuOpened.value = true
}
const closeAside = (): void => {
  sideMenuOpened.value = false
}

</script>

<style lang="scss" scoped>

.menu-enter-from,
.menu-leave-to {
  transform: translateX(-100%);
}

.menu-leave-active,
.menu-enter-active {
  transition: transform 0.5s ease;
}

.header {
  width: 100%;
  padding: 15px 0 0 0;

  color: $font;
}

.nav {
  display: flex;
  height: 40px;
  width: 100%;
  gap: 20px;
  justify-content: space-between;

  @media (max-width: 768px) {
    flex-direction: column;
    height: auto;
    gap: 0;
  }

}

</style>
