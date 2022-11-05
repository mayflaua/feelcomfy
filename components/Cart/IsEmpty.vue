<template>
  <div class="cart__empty-block">
    <p class="empty-block__title">
      В корзине пока нет товаров
    </p>
    <p class="empty-block__subtitle">
      Начните с подборок на главной странице или найдите нужный товар через
      поиск
    </p>
    <LazyUIButton class="empty-block__btn" text="На главную" @click="$router.push('/')" />
  </div>
</template>

<style lang="scss" scoped>
.cart__empty-block {
  text-align: center;
  background: url("~/assets/images/empty-cart-bg.webp") no-repeat top/8rem;
  padding: 100px 6px 0 6px;

  .empty-block__subtitle {
    font-size: 0.9rem;
  }

  .empty-block__title {
    border: none;
  }

  .empty-block__btn {
    width: max-content;
  }
}
</style>
