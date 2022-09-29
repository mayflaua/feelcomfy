<template>
  <div>
    <CartPopup ref="popup" />
    <div v-if="productsStore.totalProductsLoaded" ref="cardsTable" class="cards">
      <Card
        v-for="card in products"
        :key="card.pk_id"
        :card="card"
        @show-popup="_showPopup"
      />
    </div>
    <UIButton
      v-if="canLoadMore"
      class="load-more-btn"
      value="Загрузить еще"
      @click.prevent="handleLoadMoreClick"
    />
    <UILoader v-if="productsStore.isLoading" text="Загружаю товары" />
  </div>
</template>

<script setup>
import { useProductsStore } from '@/stores/products'

const productsStore = useProductsStore()

const products = ref([])
const popup = ref(null)

const _showPopup = ({ name, url, event }) =>
  popup.value.show(name, url, event)

const handleLoadMoreClick = () => {
  productsStore.getProductsFromDatabase(10)
}

const canLoadMore = computed(() => {
  return !productsStore.isLoading && productsStore.totalProductsLoaded && productsStore.productsCanBeLoaded !== 0
})

// created() hook
productsStore.getProductsFromDatabase(10).then(() => (products.value = productsStore.productsList))

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
}
</style>
