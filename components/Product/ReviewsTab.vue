<template>
  <div class="reviews">
    <p v-if="!reviewsNumber" class="reviews--no-reviews">
      На этот товар пока нет отзывов
    </p>
    <div v-else class="reviews__list">
      <div class="reviews__title">
        Все отзывы ({{ reviewsNumber }})
      </div>
      <ProductReview v-for="review in reviews" :key="review.created_at" :review="review" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useReviewsStore } from '@/stores/reviews'
import { ProductID } from '~/types/product'

const reviewsStore = useReviewsStore()

const props = defineProps<{
  reviewsNumber: number
  itemId: ProductID
}>()

const reviews = ref([])
if (props.reviewsNumber) {
  reviews.value = await reviewsStore.getReviewsByProductId(props.itemId)
} else {
  reviews.value = []
}

</script>

<style lang="scss" scoped>
.reviews {
  &--no-reviews {
    font-size: 1.3rem;
    font-weight: 500;
  }

  &__title {
    font-size: 1.3rem;
    font-weight: 500;
    border-bottom: 1px solid $default;
    padding: 0 0 2rem 0;
  }
}
</style>
