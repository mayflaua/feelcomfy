<template>
  <div>
    <LazyCartPopup ref="popup" />

    <IndexBannerCarousel />

    <UITitledWrapper v-show="products.popular" path="category/popular" title="Популярное">
      <div class="cards">
        <Card
          v-for="card in products.popular"
          :key="card.pk_id"
          :card="card"
          lazy
          @show-popup="_showPopup"
        />
      </div>
    </UITitledWrapper>
    <LazyUITitledWrapper v-show="products.xiaomi" path="search?q=xiaomi" title="Бренд Xiaomi">
      <div class="cards">
        <Card
          v-for="card in products.xiaomi"
          :key="card.pk_id"
          :card="card"
          lazy
          @show-popup="_showPopup"
        />
      </div>
    </LazyUITitledWrapper>
  </div>
</template>

<script setup>
import { useProductsStore } from '@/stores/products'

const productsStore = useProductsStore()

const products = reactive({})
const popup = ref(null)

const _showPopup = ({ name, url, event }) =>
  popup.value.show(name, url, event)

const handleLoadMoreClick = () => {
  productsStore.getProductsFromDatabase(10)
}

// created() hook
products.popular = await productsStore.getProductsByFilter('popular', 20)
products.xiaomi = await productsStore.getProductsByQuery('xiaomi', 20)

</script>

<style lang="scss" scoped>
.load-more-btn {
  margin: 20px auto;
  border-radius: 20px;
  display: block;
  width: 140px;
}

.cards {
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
  @media (max-width: 350px) {
    grid-template-columns: 1fr;
  }
}
</style>
