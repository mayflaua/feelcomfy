<template>
  <div class="search">
    <LazyUILoader v-if="isSearching || !_mounted" fullscreen v2 />

    <div v-if="!isSearching" class="search__title-wrapper">
      <h2 v-if="products.length !== 0 && !isSearching" class="search__title">
        Результаты поиска по запросу "{{ route.query.q }}"
      </h2>
      <p v-else class="search__title">
        По запросу "{{ route.query.q }}" ничего не найдено.
      </p>

      <div v-show="_mounted && products.length !== 0" class="search__title-actions">
        <button class="show-filters-btn dark-invert" @click="showFilters = !showFilters">
          Фильтры
        </button>
        <vSelect
          v-model="sortOption"
          :clearable="false"
          :options="sortingSelectOptions"
          :searchable="false"
          class="sorting__select"
          @option:selected="sortItems"
        />
        <div class="appearance-switch">
          <button
            :class="{'appearance-switch__button--selected': appearanceType === 'list'}"
            class="appearance-switch__button appearance-switch__button--list"
            @click="appearanceType = 'list'"
          />
          <button
            :class="{'appearance-switch__button--selected': appearanceType === 'grid'}"
            class="appearance-switch__button appearance-switch__button--grid"
            @click="appearanceType = 'grid'"
          />
        </div>
      </div>
    </div>

    <main v-show="!isSearching && _mounted" class="search__body">
      <CategoryAsideFilters
        v-if="!isSearching && products.length !== 0"
        v-show="showFilters"
        :categories="availableCategories"
        :chars="availableCharacteristics"
        :colors="availableColors"
        :min-max-price="minMaxPrices"
        @change="applyFilters"
      />

      <p v-if="filteredProducts.length === 0 && products.length !== 0" class="no-filtered-products">
        Нет продуктов для заданных фильтров
      </p>

      <CardsContainer :extended="appearanceType === 'list'" :shorten="appearanceType === 'grid'" class="search__result">
        <UICard v-for="item in filteredProducts" :key="item.pk_id" :product="item" :wide="appearanceType === 'list'" />
      </CardsContainer>
    </main>
  </div>
</template>

<script lang="ts" setup>

import { navigateTo, useFetch, useHead, useRoute } from '#app'
import { defineAsyncComponent, onMounted, Ref, ref, watch } from 'vue'
import { useMediaQuery } from '@vueuse/core'
import { useProductsStore } from '@/stores/products'
import 'vue-select/dist/vue-select.css'

const vSelect = defineAsyncComponent({
  loader: () => import('vue-select')
})

const productsStore = useProductsStore()
const route = useRoute()

const _mounted = ref(false)
onMounted(() => _mounted.value = true)

useHead({
  title: `Результаты поиска по запросу '${route.query.q}'`
})
// return to index page if no query provided
if (!route.query.q) {
  await navigateTo('/')
}

const _isMobileScreen = useMediaQuery('(max-width: 768px)')
const showFilters = ref(!_isMobileScreen.value)
const appearanceType:Ref<'list' | 'grid'> = ref('list')

// sorting data
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
  filteredProducts.value = sorter[method](filteredProducts.value)
}
// ---------------

const products = ref(await productsStore.getProductsByQuery(String(route.query.q)))
const filteredProducts = ref(products.value)

// data for aside filters
const getMinMaxPriceValues = (): [number, number] => {
  const arr = products.value.map(i => i.final_price)
  if (arr.length === 0) {
    return null
  }
  return [Math.min(...arr), Math.max(...arr)]
}
const minMaxPrices = ref(getMinMaxPriceValues())

const getAvailableColors = (): string[] => {
  return [...new Set(products.value.map(i => i.color))].filter(i => i !== '')
}
const availableColors = ref(getAvailableColors())

const getCharacteristics = (): Array<[string, string[]]> => {
  const allCharFields = products.value.map(i => i.additional_data).filter(i => i && Object.keys(i).length !== 0)
  const allLabels = [...new Set(allCharFields.map(i => Object.keys(i)).flat())]
  const res = []
  for (const a of allLabels) {
    const allValues = [...new Set(allCharFields.filter(el => el[a]).map(el => el[a]))]
    res.push({
      [a]: allValues
    })
  }
  return res
}
const availableCharacteristics = ref(getCharacteristics())

const { data: categories } = await useFetch('/api/categories')
const getCategories = () => {
  const productCategories = [...new Set(products.value.map(product => product.category_id))]
  return categories.value.filter(category => productCategories.includes(category.categoryID))
}
const availableCategories = ref(getCategories())

const applyFilters = ({ categories, price, colors, chars }) => {
  // price & colors filters
  const selectedColors = Object.entries(colors).filter(i => i[1]).map(i => i[0])

  filteredProducts.value = products.value.filter((item) => {
    if (selectedColors.length === 0) {
      // filter by price if no colors were specified
      return item.final_price >= price[0] &&
        item.final_price <= price[1]
    } else {
      // else filter by both price and colors
      return item.final_price >= price[0] &&
        item.final_price <= price[1] &&
        selectedColors.includes(item.color)
    }
  })

  // characteristic filter
  const hasTruthyValues = Object.values(chars).some(obj => obj.some(val => Object.values(val).some(b => Boolean(b))))
  if (hasTruthyValues) {
    const matchedProducts = []

    const allFilterFields = Object.values(chars).flat().filter(obj => Object.values(obj)[0])
    const allFilterValues = []
    for (const field of allFilterFields) {
      allFilterValues.push(Object.entries(field)[0][0])
    }
    for (const product of filteredProducts.value) {
      if (product.additional_data) {
        const allValues = Object.values(product.additional_data)
        if (allValues.some(val => allFilterValues.includes(val))) {
          matchedProducts.push(product)
        }
      }
    }
    filteredProducts.value = matchedProducts
  }

  // categories filter
  if (Object.values(categories).some(Boolean)) {
    filteredProducts.value = filteredProducts.value.filter(product => categories[product.category_id])
  }
}
// ---------------

const isSearching = ref(false)

watch(() => route.query.q, async () => {
  isSearching.value = true
  products.value = await productsStore.getProductsByQuery(String(route.query.q))
  filteredProducts.value = products.value
  availableCharacteristics.value = getCharacteristics()
  availableCategories.value = getCategories()
  availableColors.value = getAvailableColors()
  minMaxPrices.value = getMinMaxPriceValues()
  isSearching.value = false
})

</script>

<style lang="scss" scoped>
.search {

  &__title-wrapper {
    display: flex;
    flex-direction: column;
    margin: 0 0 20px 0;

    .search__title-actions {
      align-self: flex-end;
      display: flex;
      gap: 0.5rem;
    }

    .sorting__select {
      width: 12rem;
      font-size: 0.85rem;
    }

    .appearance-switch {
      width: fit-content;
      height: 16px;
      display: flex;
      gap: 4px;
      align-self: center;

      &__button {
        width: 16px;
        height: 100%;
        background: url("~/assets/icons/appearance-filters.png") transparent no-repeat left/cover;
        outline: none;
        border: none;
        opacity: 0.4;
        cursor: pointer;

        @media (max-width: 768px) {
          width: 24px;
        }

        &:hover:not(&--selected) {
          opacity: 0.6;
        }

        &--selected {
          opacity: 1;
        }

        &--grid {
          background-position: right;
        }
      }
      @media (max-width: 768px) {
        height: 24px;
      }
      @media (max-width: 420px) {
        display: none;
      }
    }

    .show-filters-btn {
      border: none;
      background: url("~/assets/icons/filter.png") transparent no-repeat left/20px;
      padding: 4px 0 4px 24px;
      font-size: 0.9rem;
      font-weight: 500;
      cursor: pointer;
      width: max-content;
      text-decoration: none;
      color: $font;

      display: none;

      @media (max-width: 768px) {
        display: block;
      }
    }
  }

  &__title {
    font-size: 1.4rem;
    font-weight: 500;
  }

  &__body {
    display: flex;
    gap: 2rem;

    .no-filtered-products {
      font-size: 1.2rem;
      font-weight: 500;
      text-align: center;
      width: 100%;
    }

    @media (max-width: 768px) {
      flex-direction: column;
    }
  }
}
</style>
