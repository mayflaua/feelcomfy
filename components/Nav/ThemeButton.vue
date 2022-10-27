<template>
  <div class="theme-button-container">
    <ClientOnly>
      <button
        v-if="!colorMode.unknown"
        :class="themeButtonName"
        class="change-theme"
        @click="changeTheme"
      />
    </ClientOnly>
  </div>
</template>

<script lang="ts" setup>

import { computed } from 'vue'
import { useColorMode } from '#imports'

const props = defineProps({
  hideOn768: {
    type: Boolean,
    default: false
  }
})

const colorMode = useColorMode()

const changeTheme = () => {
  colorMode.preference === 'light'
    ? colorMode.preference = 'dark'
    : colorMode.preference = 'light'
}

const themeButtonName = computed(() => {
  return {
    'theme-light hide-768': colorMode.preference === 'light' && props.hideOn768,
    'theme-dark hide-768': colorMode.preference === 'dark' && props.hideOn768,
    'theme-light': colorMode.preference === 'light',
    'theme-dark': colorMode.preference === 'dark'
  }
}
)
</script>

<style lang="scss" scoped>
.theme-button-container {
  width: 24px;
  height: 24px;
  align-self: center;
  margin: 0 5px 0 0;
}
.change-theme {
  min-width: 24px;
  height: 24px;
  margin: 0 10px 0 0;
  border: none;
  outline: none;

  opacity: 0.8;

  align-self: center;
  cursor: pointer;

  transition: opacity 0.2s ease;

  @keyframes theme-light {
    from {
      transform: rotate(1turn);
      opacity: 0;
    }
    to {
      transform: rotate(0.5turn);
      opacity: 0.8;
    }
  }
  @keyframes theme-dark {
    from {
      transform: rotate(0.5turn);
      opacity: 0;
    }
    to {
      transform: rotate(1turn);
      opacity: 0.8;
    }
  }

  &.theme-light {
    background: url('~/assets/icons/sun.png') transparent center/cover no-repeat;
    animation: 1s theme-light ease;
  }

  &.theme-dark {
    background: url('~/assets/icons/moon.png') transparent center/cover no-repeat;
    animation: 1s theme-dark ease;
  }

  &.hide-768 {
    @media (max-width: 768px) {
      display: none;
    }
  }

  &:hover {
    opacity: 1;
  }
}

</style>
