<template>
  <div>
    <IndexBannerCarousel />

    <UITitledWrapper
      v-show="products.popular"
      :cards="products.popular"
      path="category/popular"
      title="Популярное"
    />
    <Observer :margin="200" :on-intersect="loadXiaomi" once>
      <UITitledWrapper
        v-if="products.xiaomi"
        :cards="products.xiaomi"
        path="search?q=xiaomi"
        title="Бренд Xiaomi"
      />
    </Observer>

    <Observer :margin="100" :on-intersect="loadRecommendations" once>
      <UITitledWrapper
        v-if="products.recommendations"
        :cards="products.recommendations"
        passive
        title="Рекомендовано вам"
      />
    </Observer>
    <UILoader v-if="_fetching" />
  </div>
</template>

<script lang="ts" setup>
import { useProductsStore } from '@/stores/products'
import useRecommendations from '@/composables/useRecommendations'
import useAuth from '@/composables/useAuth'
import { Filter } from '@/types/categories.d'

const { getSimilarsByCategories } = useRecommendations()
const { isLoggedIn } = useAuth()

const productsStore = useProductsStore()
const products = reactive({})

const _fetching = ref(false)
// created() hook
products.popular = await productsStore.getProductsByFilter(Filter.POPULAR, 20)

const loadXiaomi = async () => {
  _fetching.value = true
  products.xiaomi = await productsStore.getProductsByQuery('xiaomi', 20)
  _fetching.value = false
}

const loadRecommendations = async () => {
  if (isLoggedIn()) {
    _fetching.value = true
    products.recommendations = await getSimilarsByCategories()
    _fetching.value = false
  }
}
</script>

<style lang="scss" scoped>
.load-more-btn {
  margin: 20px auto;
  border-radius: 20px;
  display: block;
  width: 140px;
}

</style>
