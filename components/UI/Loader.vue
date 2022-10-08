<template>
  <div v-if="!v2" :class="{'fullscreen': fullscreen}" class="loader">
    <div class="loader-circles">
      <div class="circle circle1" />
      <div class="circle circle2" />
      <div class="circle circle3" />
    </div>
    <p v-if="text" class="loader-text">
      {{ text }}
    </p>
  </div>
  <div v-else :class="{'fullscreen': fullscreen}" class="new-loader">
    <div class="circles">
      <div class="circle circle-outer" />
      <div class="circle circle-inner" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  text: {
    type: String,
    default: ''
  },

  v2: {
    type: Boolean,
    default: false
  },

  fullscreen: {
    type: Boolean,
    default: false
  }
})
</script>

<style lang="scss" scoped>

$animation-speed: 1s;
@keyframes animate-new {
  from {
    transform: scale(0)
  }
  to {
    transform: none;
  }
}

@keyframes animate {
  from {
    opacity: 0.9;
  }
  to {
    opacity: 1;
    transform: translateY(-5px);
  }
}

.loader {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  max-width: 230px;
  margin: 0 auto;

  z-index: 5;

  &-text {
    font-size: 1.1rem;
    font-weight: 600;
  }

  &-circles {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 50px;
    height: 30px;

    .circle {
      width: 15px;
      height: 15px;
      border-radius: 50%;
      background-color: $blue;
      animation: $animation-speed animate infinite alternate;

      &1 {
        animation-delay: calc($animation-speed / 3);
      }

      &3 {
        animation-delay: calc($animation-speed / -3);
      }
    }
  }
}

.new-loader {
  margin: 35px auto;

  z-index: 5;

  .circles {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;

    .circle {
      position: absolute;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: $blue;
      opacity: 0.7;
      animation: $animation-speed animate-new linear infinite alternate;

      &-outer {
        animation-direction: alternate-reverse;
      }
    }
  }
}

.fullscreen {
  width: 100vw;
  height: 100vh;

  position: fixed;
  top: 0;
  left: 0;
  margin: 0;
  max-width: none;

  background-color: rgba(0, 0, 0, 0.2);

  display: flex;
  align-items: center;
  justify-content: center;
}

</style>
