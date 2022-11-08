<template>
  <div>
    <UILoader v-if="!_mounted || favoritesStore._fetchingCompressed" fullscreen v2 />
    <UINoUser v-else-if="!isLoggedIn()" />

    <div v-if="favoritesStore.totalFavorites !== 0" class="favorites">
      <div class="favorites__header">
        <h1 class="favorites__title">
          Мои желания
        </h1>
        <div class="sorting-wrapper">
          <p class="sorting__title">
            Сортировка
          </p>
          <vSelect
            v-model="sortOption"
            :clearable="false"
            :options="sortingSelectOptions"
            :searchable="false"
            class="sorting__select"
          />
        </div>
      </div>
      <main class="favorites__body">
        <CardsContainer class="favorites-list">
          <UICard
            v-for="card in favoritesCardsSorted"
            :key="card.pk_id"
            :product="card"
          />
        </CardsContainer>
      </main>
    </div>
    <div v-if="favoritesStore.totalFavorites === 0 && favoritesStore.favoritesReady" class="favorites--empty">
      <p class="favorites__title">
        Добавьте то, что понравилось
      </p>
      <p class="favorites__subtitle">
        Перейдите на главную страницу и нажмите на ♡ в товаре
      </p>
      <LazyUIButton class="favorites__btn" text="На главную" @click="navigateTo('/')" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import 'vue-select/dist/vue-select.css'
import { computed, defineAsyncComponent, onMounted, ref } from 'vue'
import { useHead } from '#app'
import { useFavoritesStore } from '~/stores/favorites'
import useAuth from '~/composables/useAuth'
import { FavoritesListItemWithRating } from '~/types/favorites'

const vSelect = defineAsyncComponent({
  loader: () => import('vue-select')
})

const favoritesStore = useFavoritesStore()
const { isLoggedIn } = useAuth()

useHead({
  title: 'Избранное - FeelComfy'
})

const _mounted = ref(false)

const sortingSelectOptions = [
  {
    label: 'Популярные',
    value: 'popular'
  },
  {
    label: 'Подешевле',
    value: 'cheap'
  },
  {
    label: 'Подороже',
    value: 'expensive'
  },
  {
    label: 'Высокий рейтинг',
    value: 'rating'
  },
  {
    label: 'Много заказов',
    value: 'orders'
  }
]
const sortOption = ref(sortingSelectOptions[0])

const favoritesCardsSorted = computed(() => {
  const method = sortOption.value.value

  type Sorter = {
    [method: string]: (arr: FavoritesListItemWithRating[]) => FavoritesListItemWithRating[]
  }
  const sorter: Sorter = {
    popular: arr => arr.sort((a, b) => b.orders - a.orders),
    cheap: arr => arr.sort((a, b) => a.final_price - b.final_price),
    expensive: arr => arr.sort((a, b) => b.final_price - a.final_price),
    rating: arr => arr.sort((a, b) => parseInt(b.score) - parseInt(a.score)),
    orders: arr => arr.sort((a, b) => b.orders - a.orders)
  }

  return sorter[method](favoritesStore?.favorites || [])
})

onMounted(() => (_mounted.value = true))
</script>

<style lang="scss" scoped>
.favorites {
  padding: 0 10px;

  &--empty {
    text-align: center;
    background: url("~/assets/images/no-wishes.webp") no-repeat top/8rem;
    padding: 100px 6px 0 6px;

    .favorites__subtitle {
      font-size: 0.9rem;
    }

    .favorites__title {
      font-size: 1.2rem;
      font-weight: 500;
    }

    .favorites__btn {
      width: max-content;
    }
  }

  &__header {
    display: flex;
    flex-direction: column;
    border-bottom: 1px solid $default;
    padding: 0 0 10px 0;

    .favorites__title {
      font-size: 1.2rem;
      font-weight: 500;
    }

    .sorting-wrapper {
      display: flex;
      align-items: center;
      gap: 8px;
      align-self: flex-end;

      .sorting {
        &__title {
          color: $dark;
          font-size: 0.8rem;
        }

        &__select {
          width: 12rem;
          font-size: 0.85rem;
        }
      }
    }
  }

  &__body {
    padding: 30px 0;
  }

}
</style>
