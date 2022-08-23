<template>
  <div class="wrapper">
    <transition-group name="list" mode="out-in">
      <div class="popup" v-for="item in queue" :key="item.name">
        <div class="popup__title">Товар добавлен в корзину</div>
        <img :src="item.imageUrl" class="popup__image" />
        <div class="popup__name">{{ item.name }}</div>
      </div></transition-group
    >
  </div>
</template>

<script>
export default {
  data: () => ({
    queue: [],
    showTime: 2000,
  }),

  methods: {
    show(name, url) {
      this.queue.push({ name, imageUrl: url });
      setTimeout(() => this.queue.shift(), this.showTime);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~/assets/style/main.scss";
.list-enter-active,
.list-leave-active,
.list-move {
  transition: all 0.5s ease;
}
.list-enter-from {
  opacity: 0;
  transform: translateY(-30px);
}
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.wrapper {
  width: 600px;

  display: flex;
  flex-direction: column;

  position: fixed;
  margin: 0 auto;
  top: 10px;
  left: 0;
  right: 0;
  z-index: 20;
}
.popup {
  width: 100%;
  height: 100px;
  background: $light;

  &__title {
    font-size: 1.2em;
    font-weight: 600;
    color: $font;
    text-align: center;
  }

  &__image {
    width: 50px;
  }
}
</style>
