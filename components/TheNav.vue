<template>
  <header class="header">
    <LazyAuthSignIn v-if="isAuthModalOpened" @close-modal="closeAuthModal" />
    <nav class="nav">
      <NavLogo />
      <NavSearchField @open-aside="openAside" />
      <NavUserActions @open-auth-modal="openAuthModal" />
    </nav>
    <NavCategoriesLinks />
    <ClientOnly>
      <transition name="menu">
        <LazyNavAside
          v-if="sideMenuOpened"
          @close-aside="closeAside"
          @open-auth-modal="openAuthModal"
        />
      </transition>
    </ClientOnly>
  </header>
</template>

<script>

export default {
  data: () => ({
    sideMenuOpened: false,
    isAuthModalOpened: false
  }),

  methods: {
    openAuthModal () {
      this.sideMenuOpened = false
      this.isAuthModalOpened = true
    },

    closeAuthModal () {
      this.isAuthModalOpened = false
    },

    openAside () {
      this.sideMenuOpened = true
    },

    closeAside () {
      this.sideMenuOpened = false
    }
  }
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
