<template>
  <div class="category-page">
    <div v-show="_mounted" class="category-page__header">
      <p class="title">
        {{ title }}
      </p>
      <div class="sorting-wrapper">
        <span class="sorting__title">Cортировка:</span>
        <v-select
          v-model="sortOption"
          :clearable="false"
          :options="sortingSelectOptions"
          :searchable="false"
          class="sorting__select"
          @option:selected="sortItems"
        />
      </div>
      <ClientOnly>
        <button class="show-filters-btn dark-invert" @click="showFilters = !showFilters">
          Фильтры
        </button>
      </ClientOnly>
    </div>
    <div v-show="_mounted" class="category-page__body">
      <CategoryAsideFilters
        v-show="showFilters || _isDesktopScreen"
        :colors="getAvailableColors()"
        :min-max-price="getMinMaxPriceValues()"
        @change="applyFilters"
      />
      <CardsContainer class="products" shorten>
        <UICard v-for="item in filteredCards" :key="item.pk_id" :product="item" />
      </CardsContainer>
    </div>
    <UILoader v-if="!_mounted" fullscreen v2 />
  </div>
</template>

<script lang="ts" setup>
import 'vue-select/dist/vue-select.css'
import { useMediaQuery } from '@vueuse/core'
import { useFetch, useHead, useRoute } from '#app'
import { defineAsyncComponent, onMounted, ref } from 'vue'
import { useProductsStore } from '@/stores/products'
import { definePageMeta } from '#imports'
import { ProductWithRating } from '~/types/product'

const route = useRoute()
const { data: categories } = await useFetch('/api/categories')
const categoryObject = categories.value.find(i => i.name === route.params.name)
const title = categoryObject.title

const _mounted = ref(false)
onMounted(() => (_mounted.value = true))

useHead({
  title: `${title} в магазине FeelComfy`
})

definePageMeta({
  middleware: 'valid-category'
})

const vSelect = defineAsyncComponent({
  loader: () => import('vue-select')
})

const _isDesktopScreen = useMediaQuery('(min-width: 768px)')
const showFilters = ref(_isDesktopScreen.value)
const applyFilters = ({ price, colors }) => {
  const selectedColors = Object.entries(colors).filter(i => i[1]).map(i => i[0])

  filteredCards.value = productCards.filter((item) => {
    if (selectedColors.length === 0) {
      return item.final_price >= price[0] &&
        item.final_price <= price[1]
    } else {
      return item.final_price >= price[0] &&
        item.final_price <= price[1] &&
        selectedColors.includes(item.color)
    }
  })
}

const productsStore = useProductsStore()

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
    rating: arr => arr.sort((a, b) => b.score - a.score),
    orders: arr => arr.sort((a, b) => b.orders - a.orders)
  }
  filteredCards.value = sorter[method](productCards)
}

let productCards: ProductWithRating[]
if (!categoryObject.filter) {
  productCards = await productsStore.getProductsByCategory(categoryObject.name, 20)
} else {
  productCards = await productsStore.getProductsByFilter(categoryObject.filter, 20)
}
const filteredCards = ref(productCards)

const getMinMaxPriceValues = (): [number, number] => {
  const arr = productCards.map(i => i.final_price)
  return [Math.min(...arr), Math.max(...arr)]
}
const getAvailableColors = (): string[] => {
  return [...new Set(productCards.map(i => i.color))].filter(i => i !== '')
}
</script>

<style lang="scss" scoped>
.category-page {
  padding: 0 10px;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid $default;
    padding: 0 0 10px 0;

    @media (max-width: 768px) {
      flex-direction: column;
      align-items: flex-start;
    }

    @media (max-width: 400px) {
      gap: 10px;
    }

    .title {
      font-size: 1.2rem;
      font-weight: 500;
    }

    .sorting-wrapper {
      display: flex;
      align-items: center;
      gap: 8px;

      @media (max-width: 400px) {
        align-self: flex-start;
      }

      .sorting {
        &__title {
          color: $dark;
          font-size: 0.8rem;

          @media (max-width: 400px) {
            display: none;
          }
        }

        &__select {
          width: 12rem;
          font-size: 0.85rem;
        }
      }
    }

    .show-filters-btn {
      border: none;
      background: url("~/assets/icons/filter.png") transparent no-repeat left/20px;
      padding: 4px 0 4px 24px;
      font-size: 0.9rem;
      font-weight: 500;
      align-self: flex-end;
      cursor: pointer;
      text-decoration: none;
      color: $font;

      display: none;

      @media (max-width: 768px) {
        display: block;
      }
    }
  }

  &__body {
    padding: 30px 0;
    display: flex;
    gap: 4rem;

    @media (max-width: 768px) {
      flex-direction: column;
      gap: 2rem;
    }
  }
}
</style>
