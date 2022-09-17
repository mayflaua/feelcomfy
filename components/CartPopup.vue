<template>
  <div class="wrapper">
    <transition-group name="list" mode="out-in">
      <div class="popup" v-for="(item, i) in queue" :key="item.name">
        <img :src="item.imageUrl" class="popup__image" />
        <div class="popup__desc">
          <div class="popup__title">Товар добавлен в корзину</div>
          <div class="popup__name">{{ item.name }}</div>
        </div>
        <div class="popup__controls">
          <button class="popup__close" @click="close(i)">
            <svg
              width="24px"
              height="24px"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g data-name="Layer 2">
                <g data-name="close">
                  <rect
                    width="24"
                    height="24"
                    transform="rotate(180 12 12)"
                    opacity="0"
                  />
                  <path
                    d="M13.41 12l4.3-4.29a1 1 0 1 0-1.42-1.42L12 10.59l-4.29-4.3a1 1 0 0 0-1.42 1.42l4.3 4.29-4.3 4.29a1 1 0 0 0 0 1.42 1 1 0 0 0 1.42 0l4.29-4.3 4.29 4.3a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42z"
                  />
                </g>
              </g>
            </svg></button
          ><nuxt-link to="/cart" class="popup__go-to-cart">К корзине</nuxt-link>
        </div>
      </div></transition-group
    >
  </div>
</template>

<script>
export default {
  // TODO: показывать если товар уже в корзине
  data: () => ({
    queue: [],
    showTime: 2000,
    timer: null,
  }),

  methods: {
    show(name, url) {
      this.queue.push({ name, imageUrl: url });
      this.timer = setTimeout(() => this.queue.shift(), this.showTime);
    },
    close(index) {
      this.queue.splice(index, 1);
      clearTimeout(this.timer);
    },
  },
};
</script>

<style lang="scss" scoped>
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
  width: 500px;

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
  padding: 10px;
  margin: 0 0 15px 0;

  background: $light;
  box-shadow: 0 6px 6px rgba(black, 0.2);

  display: flex;
  gap: 8px;
  justify-content: space-between;

  &__title {
    font-size: 1.2em;
    font-weight: 600;
    color: $font;
    text-align: center;
  }

  &__image {
    display: block;
    width: 60px;
    height: 100%;
  }

  &__desc {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }

  &__controls {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: space-around;
  }

  &__close,
  &__go-to-cart {
    border: none;
    cursor: pointer;
  }

  &__go-to-cart {
    font-size: 0.9rem;
    width: 6rem;
    font-weight: 600;
    color: white;
    background-color: $blue;
    padding: 5px 8px;
    text-decoration: none;
    text-align: center;
  }
}
</style>
