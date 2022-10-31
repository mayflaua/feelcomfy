<template>
  <div>
    <div class="product">
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
          <ProductDescriptionTab v-if="currentTab === 'desc'" :description="item.description" />
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
    <Observer :margin="100" :on-intersect="getSimilarProducts">
      <LazyUITitledWrapper
        v-if="similars.length !== 0 && !gettingSimilars"
        :cards="similars"
        passive
        title="Другие товары из этой категории"
      />
      <UILoader v-else />
    </Observer>
  </div>
</template>

<script lang="ts" setup>
import { navigateTo, useRoute } from '#app'
import { ref, Ref } from 'vue'
import slugify from 'slugify'
import { useLocalStorage } from '@vueuse/core'
import { useProductsStore } from '@/stores/products'
import { ProductCategory } from '~/types/categories.d.ts'

const productStore = useProductsStore()

const route = useRoute()

const currentTab: Ref<'desc'|'reviews'> = ref('desc')
const _reviewsBody = ref(null)

const goToReviews = (): void => {
  currentTab.value = 'reviews'
  _reviewsBody.value.scrollIntoView()
}

// created()
const [item] = await productStore.getProductById(route.params.id)
// check if product link is valid and return to index page if not
if (!item || slugify(item.title) !== route.params.slug[0]) {
  await navigateTo('/')
} else {
  // store 20 last viewed items in localstorage
  const storage = useLocalStorage('last-viewed', [])

  // remove id from storage if its in it
  if (storage.value.includes(item.pk_id)) {
    storage.value.splice(storage.value.findIndex(i => i === item.pk_id), 1)
  }
  // update storage
  storage.value.unshift(item.pk_id)
  storage.value = storage.value.slice(0, 20)
}

const gettingSimilars = ref(false)
const similars = ref([])
const getSimilarProducts = async () => {
  gettingSimilars.value = true
  similars.value = await productStore.getProductsByCategory(ProductCategory[item.category_id], 15)
  gettingSimilars.value = false
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
