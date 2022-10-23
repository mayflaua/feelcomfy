<template>
  <div>
    <UILoader v-if=" _fetchingItem" fullscreen v2 />

    <div v-show="!_fetchingItem" class="product">
      <div class="product__info-card">
        <ProductImages :images="item.netlify_images" :main-image="item.netlify_name" />
        <ProductInfoBlock :item="item" @reviews:click="goToReviews" />
      </div>

      <div class="product__desc-wrapper">
        <div class="desc__tabs">
          <button :class="{'tab--current': currentTab === 'desc'}" class="tab" @click="currentTab = 'desc'">
            Описание товара
          </button>
          <button :class="{'tab--current': currentTab === 'reviews'}" class="tab" @click="currentTab = 'reviews'">
            Отзывы ({{ item.reviews }})
          </button>
        </div>

        <div ref="_reviewsBody" class="desc__body">
          <LazyHydrationWrapper>
            <ProductDescriptionTab v-if="currentTab === 'desc'" :description="item.description" />
          </LazyHydrationWrapper>
          <ClientOnly>
            <KeepAlive>
              <ProductReviewsTab
                v-if="currentTab === 'reviews'"
                :item-id="item.pk_id"
                :reviews-number="item.reviews"
              />
            </KeepAlive>
          </ClientOnly>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import slugify from 'slugify'

import { useLocalStorage } from '@vueuse/core'
import { LazyHydrationWrapper } from 'vue3-lazy-hydration'
import { useProductsStore } from '@/stores/products'

const hydrat = () => {
  console.log('hydrated')
}

const productStore = useProductsStore()

const route = useRoute()
const item = ref(null)
const _fetchingItem = ref(true)

const currentTab = ref('desc')
const _reviewsBody = ref(null)

const goToReviews = () => {
  currentTab.value = 'reviews'
  _reviewsBody.value.scrollIntoView()
}

// created()
item.value = await productStore.getProductById(route.params.id)
// check if product link is valid and return to index page if not
if (item.value.length !== 0 && item.value[0]?.length !== 0) {
  if (slugify(item.value[0].title) !== route.params.slug[0]) {
    await navigateTo('/')
  } else {
    item.value = item.value[0]
    item.value.units_in_stock === 0 ? item.value.qty = 0 : item.value.qty = 1

    // store 10 last viewed items in localstorage
    const storage = useLocalStorage('last-viewed', [])

    // remove id from storage if its in it
    if (storage.value.includes(item.value.pk_id)) {
      storage.value.splice(storage.value.findIndex(i => i === item.value.pk_id), 1)
    }
    // update storage
    storage.value.unshift(item.value.pk_id)
    storage.value = storage.value.slice(0, 10)

    _fetchingItem.value = false
  }
} else {
  await navigateTo('/')
}

</script>
<style lang="scss" scoped>

.product {
  &__info-card {
    width: 100%;
    display: flex;
    gap: 5rem;

    @media (max-width: 768px) {
      flex-direction: column;
      padding: 0 1rem;
    }
  }

  &__desc-wrapper {
    margin: 3rem auto;

    .desc__tabs {
      display: flex;
      gap: 1rem;
      padding: 0 10%;
      border-top: 1px solid $default;
      border-bottom: 1px solid $default;

      .tab {
        background: none;
        border: none;
        outline: none;
        cursor: pointer;
        color: $font;
        height: 50px;
        display: block;

        &--current {
          color: $blue;
          border-bottom: 1px solid $blue;
        }
      }
    }

    .desc__body {
      padding: 4rem 10%;
    }
  }
}

</style>
