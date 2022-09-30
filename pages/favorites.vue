<template>
  <div class="favorites">
    <CartPopup ref="popup" />
    <div class="favorites__header">
      <h1 class="favorites__title">
        Мои желания
      </h1>
      <div class="sorting-wrapper">
        <p class="sorting__title">
          Сортировка
        </p>
        <v-select
          v-model="sortOption"
          :clearable="false"
          :options="sortingSelectOptions"
          :searchable="false"
          class="sorting__select"
          @option:selected="sortItems"
        />
      </div>
    </div>
    <main class="favorites__body">
      <div class="favorites-list">
        <Card
          v-for="card in favoritesCards"
          :key="card.id"
          :card="card"
          @unlike="handleUnlikeEvent"
          @show-popup="_showPopup"
        />
      </div>
    </main>
  </div>
</template>

<script setup>
import 'vue-select/dist/vue-select.css'
import { useFavoritesStore } from '~~/stores/favorites'

const vSelect = defineAsyncComponent({
  loader: () => import('vue-select')
})

useHead({
  title: 'Избранное - FeelComfy'
})

const favoritesStore = useFavoritesStore()

const { supabase } = useSupabase()

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

const sortItems = () => {
  const method = sortOption.value.value

  const sorter = {
    popular: arr => arr.sort((a, b) => b.orders - a.orders),
    cheap: arr => arr.sort((a, b) => a.final_price - b.final_price),
    expensive: arr => arr.sort((a, b) => b.final_price - a.final_price),
    // TODO: sort by rating when implement rating system
    rating: arr => arr,
    orders: arr => arr.sort((a, b) => b.orders - a.orders)
  }
  favoritesCards.value = sorter[method](favoritesCards.value)
}

const popup = ref()

const _showPopup = ({ name, url }) => {
  popup.value.show(name, url)
}

const favoritesCards = computed(() => favoritesStore.favoritesList)

const handleUnlikeEvent = async (id) => {
  await favoritesStore.handleFavoritesAction(id)
}

// created()
await favoritesStore.getFavoritesFromDatabase()
</script>

<style lang="scss" scoped>
.favorites {
  padding: 0 10px;

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

  &-list {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-row-gap: 30px;
    grid-column-gap: 20px;
    justify-items: center;

    @media (max-width: 1500px) {
      grid-template-columns: repeat(4, 1fr);
    }
    @media (max-width: 1300px) {
      grid-template-columns: repeat(3, 1fr);
      grid-column-gap: 10px;
    }
    @media (max-width: 800px) {
      grid-template-columns: repeat(2, 1fr);
    }
  }
}
</style>
