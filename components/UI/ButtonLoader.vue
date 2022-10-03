<template>
  <div class="button-loader">
    <div class="circle circle1" />
    <div class="circle circle2" />
    <div class="circle circle3" />
    <div class="circle circle4" />
  </div>
</template>

<style lang="scss" scoped>

.button-loader {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 13px;

  .circle {
    position: absolute;
    top: 0;
    width: 13px;
    height: 13px;
    border-radius: 50%;
    background: $light;
    animation-timing-function: ease;

    &1 {
      left: 8px;
      animation: animate1 0.6s infinite;
    }

    &2 {
      left: 8px;
      animation: animate2 0.6s infinite;
    }

    &3 {
      left: 32px;
      animation: animate2 0.6s infinite;
    }

    &4 {
      left: 56px;
      animation: animate3 0.6s infinite;
    }
  }
}

@keyframes animate1 {
  from {
    transform: scale(0);
  }
  to {
    transform: scale(1);
  }
}

@keyframes animate2 {
  from {
    transform: translate(0, 0);
  }
  to {
    transform: translate(24px, 0);
  }
}

@keyframes animate3 {
  from {
    transform: scale(1);
  }
  to {
    transform: scale(0);
  }
}

</style>
