<template>
  <div class="search">
    <LazyUILoader v-if="isSearching" v2 />
    <div v-if="!isSearching" class="search__title-wrapper">
      <h2 v-if="products.length !== 0 && !isSearching" class="search__title">
        Результаты поиска по запросу "{{ route.query.q }}"
      </h2>
      <p v-else class="search__title">
        По запросу "{{ route.query.q }}" ничего не найдено.
      </p>
    </div>

    <CardsContainer class="search__result">
      <UICard v-for="item in products" :key="item.pk_id" :product="item" />
    </CardsContainer>
  </div>
</template>

<script setup>

import { useProductsStore } from '@/stores/products'

const productsStore = useProductsStore()
const route = useRoute()

useHead({
  title: `Результаты поиска по запросу '${route.query.q}'`
})

const products = ref(await productsStore.getProductsByQuery(route.query.q))
// return to index page if no query provided
if (!route.query.q) {
  await navigateTo('/')
}

const isSearching = ref(false)

watch(() => route.query.q, async () => {
  isSearching.value = true
  const res = await productsStore.getProductsByQuery(route.query.q)
  isSearching.value = false
  products.value = res
})

</script>

<style lang="scss" scoped>
.search {

  &__title {
    font-size: 1.4rem;
    font-weight: 500;
  }
}
</style>
