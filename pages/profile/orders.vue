<template>
  <NuxtLayout name="profile">
    <LazyProfileAddReview v-if="_showReviewModal" :item-id="_itemIdForReview" @close="_showReviewModal = false" />
    <div v-if="isLoggedIn() && _mounted" class="profile__orders">
      <div v-if="!orderStore.fetchState">
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
          <ProfileOrder
            v-for="order in ordersList"
            :key="order.order_id"
            :allow-review="order.status !== 'created'"
            :order-info="order"
            @add-review="handleAddReview"
          />
        </div>
      </div>
      <UILoader v-else v2 />
    </div>

    <p v-else>
      <UILoader fullscreen v2 />
    </p>
  </NuxtLayout>
</template>

<script setup>
import { useOrdersStore } from '@/stores/orders'
import useAuth from '@/composables/useAuth'

useHead({
  title: 'Мои заказы'
})

const orderStore = useOrdersStore()
const { user, isLoggedIn } = useAuth()

const _showReviewModal = ref(false)
const _itemIdForReview = ref(0)

const handleAddReview = (id) => {
  _itemIdForReview.value = id
  _showReviewModal.value = true
}

const _mounted = ref(false)
onMounted(() => {
  _mounted.value = true
})
// watch for user to sign in to fetch orders
watch(user, async () => {
  if (user.value) {
    await orderStore.getOrders(user.value.id)
  }
})

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

</script>

<style lang="scss" scoped>
.profile__orders {
  width: 75%;

  @media (max-width: 768px) {
    width: 100%;
  }

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
