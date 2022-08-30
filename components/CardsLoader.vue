<template>
  <div class="loader">
    <div class="loader-circles">
      <div class="circle circle1"></div>
      <div class="circle circle2"></div>
      <div class="circle circle3"></div>
    </div>
    <p class="loader-text">Загружаю товары...</p>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
@import "~/assets/style/main.scss";

$animation-speed: 1s;

.loader {
  display: flex;
  justify-content: space-between;
  width: 230px;
  margin: 0 auto;
  &-text {
    font-size: 1.1rem;
    font-weight: 600;
  }

  &-circles {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 50px;
    height: 50px;

    .circle {
      width: 15px;
      height: 15px;
      border-radius: 50%;
      background-color: $blue;
      animation: $animation-speed loading infinite alternate;

      &1 {
        animation-delay: calc($animation-speed / 3);
      }
      &3 {
        animation-delay: calc($animation-speed / -3);
      }
    }
  }
}

@keyframes loading {
  from {
    opacity: 0.9;
  }
  to {
    opacity: 1;
    transform: translateY(-5px);
  }
}
</style>
