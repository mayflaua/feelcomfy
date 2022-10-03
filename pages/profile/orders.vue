<template>
  <NuxtLayout name="profile">
    <div class="profile__orders">
      <p class="orders__title">
        Мои заказы
      </p>
      <div class="orders__filter" ui-switcher>
        <div
          :class="currentFilterTab === 'all' && 'active'"
          ui-switcher-button
          @click="currentFilterTab = 'all'"
        >
          Все заказы
        </div>
        <div
          :class="currentFilterTab === 'active' && 'active'"
          ui-switcher-button
          @click="currentFilterTab = 'active'"
        >
          Активные
        </div>
        <div
          :class="currentFilterTab === 'delivered' && 'active'"
          ui-switcher-button
          @click="currentFilterTab = 'delivered'"
        >
          Подтвержденные
        </div>
      </div>
      <div
        class="
              orders__list"
      >
        <LazyProfileOrder v-for="order in ordersList" :key="order.order_id" :order-info="order" />
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { useOrdersStore } from '@/stores/orders'
import useAuth from '@/composables/useAuth'

useHead({
  title: 'Мои заказы'
})

const orderStore = useOrdersStore()
const { user } = useAuth()

const currentFilterTab = ref('all')

const ordersList = computed(() => {
  if (currentFilterTab.value === 'all') {
    return orderStore.orders
  } else if (currentFilterTab.value === 'active') {
    return orderStore.orders.filter(order => order.status === 'created')
  } else {
    return orderStore.orders.filter(order => order.status !== 'created')
  }
})

await orderStore.getOrders(user.value.id)

</script>

<style lang="scss" scoped>
.profile__orders {
  width: 75%;

  .orders {
    &__title {
      font-size: 1.4rem;
      font-weight: 600;
    }

    &__list {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    &__filter {
      margin: 20px 0;
      @media (max-width: 768px) {
        margin: 20px auto;
      }
    }
  }
}
</style>
