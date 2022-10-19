<template>
  <NuxtLayout name="profile">
    <LazyProfileAddReview v-if="_showReviewModal" :item-id="_itemIdForReview" @close="_showReviewModal = false" />
    <div v-if="isLoggedIn() && _mounted" class="profile__orders">
      <div v-if="!orderStore.fetchState">
        <p class="orders__title">
          Мои заказы
        </p>
        <div v-if="!isMobileScreen" class="orders__filter" ui-switcher>
          <div
            v-for="filter in filterTabValues"
            :key="filter.value"
            :class="currentFilterTab.value === filter.value && 'active'"
            ui-switcher-button
            @click="currentFilterTab = filter"
          >
            {{ filter.label }}
          </div>
        </div>
        <v-select
          v-else
          v-model="currentFilterTab"
          :clearable="false"
          :options="filterTabValues"
          class="orders__filter--mobile"
        />
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
import { useMediaQuery } from '@vueuse/core'
import { useOrdersStore } from '@/stores/orders'
import useAuth from '@/composables/useAuth'
import 'vue-select/dist/vue-select.css'

const vSelect = defineAsyncComponent(() => import('vue-select'))

useHead({
  title: 'Мои заказы'
})

const isMobileScreen = useMediaQuery('(max-width: 420px)')

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
// watch for user to sign in to fetch orders (once)
const unwatchUser = watch(user, async () => {
  if (user.value) {
    unwatchUser()
    await orderStore.getOrders(user.value.id)
  }
})

const filterTabValues = [{
  label: 'Все заказы',
  value: 'all'
},
{
  label: 'Активные',
  value: 'active'
},
{
  label: 'Подтвержденные',
  value: 'granted'
},
{
  label: 'Неоплаченные',
  value: 'not-paid'
}]
const currentFilterTab = ref(filterTabValues[0])

const ordersList = computed(() => {
  if (currentFilterTab.value.value === 'all') {
    return orderStore.orders
  } else if (currentFilterTab.value.value === 'active') {
    return orderStore.orders.filter(order => order.status === 'created')
  } else if (currentFilterTab.value.value === 'delivered') {
    return orderStore.orders.filter(order => order.status === 'granted')
  } else {
    return orderStore.orders.filter(order => order.status === 'not-paid')
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

      &--mobile {
        --vs-border-color: none;
        width: 170px;
        font-size: 0.9rem;
        margin: 0 0 1rem 0;
      }
    }
  }
}
</style>
