<template>
  <div class="order-success">
    <img
      alt="success"
      class="order-success__image"
      src="~/assets/images/order-success.webp"
    >
    <p class="order-success__title">
      Спасибо за заказ!
    </p>
    <p class="order-success__subtitle">
      Ваши личные данные не были сохранены
    </p>
    <p class="order-success__subtitle">
      Заказ не будет выполнен, ведь это ненастоящий интернет-магазин :)
    </p>
    <UIButton class="order-success__btn" path="/" text="На главную" />
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'order',
  meta: [
    { name: 'robots', content: 'none, noyaca, noarchive' }
  ]
})
useHead({
  title: 'Спасибо за заказ! - FeelComfy'
})

</script>

<style lang="scss" scoped>
.order-success {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 0 0 50px 0;

  &__image {
    width: 250px;
  }

  &__title {
    font-size: 1.6rem;
    font-weight: 600;
  }

  &__subtitle {
    font-size: 1.3rem;
    font-weight: 500;
    color: $dark;
    margin: 10px 0;
  }

  &__btn {
    margin: 30px 0 0 0;
    width: 150px;
    font-size: 1.2rem;
  }
}
</style>
