<template>
  <div class="add-review-wrapper" @click.self="emit('close')">
    <div class="add-review">
      <h2 class="add-review__header">
        Мой отзыв
        <button class="close dark-invert" @click="emit('close')" />
      </h2>

      <div class="add-review__body">
        <div class="body__stars">
          <p class="body__stars-label">
            Общая оценка
          </p>
          <div class="stars">
            <img
              v-for="star of 5"
              :key="star"
              :class="{'star--highlighted': star <= highlightedStars ||star <= selectedStars }"
              alt="star"
              class="star"
              src="~/assets/icons/star.svg"
              @click="selectedStars = star"
              @mouseenter="highlightedStars = star"
              @mouseleave="highlightedStars = 0"
            >
          </div>
        </div>
        <textarea v-model="reviewText" class="body__text" placeholder="Напишите отзыв" ui-input />
        <div class="body__anon">
          <UICheckbox v-model="isAnon" :default-value="false" />
          <span>Анонимно</span>
        </div>
        <UIButton
          :disabled="!(reviewText && selectedStars)"
          :loading-state="_sending"
          class="body__submit"
          text="Готово"
          @click="submit"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useReviewsStore } from '@/stores/reviews'
import { ProductID } from '~/types/product'

const reviewsStore = useReviewsStore()

const emit = defineEmits(['close'])

const highlightedStars = ref(0)
const selectedStars = ref(0)
const isAnon = ref(false)

const reviewText = ref()

const props = defineProps<{
  itemId: ProductID
}>()

const _sending = ref(false)
const submit = async (): Promise<void> => {
  _sending.value = true
  await reviewsStore.uploadReview({
    item_id: props.itemId,
    text: reviewText.value,
    score: selectedStars.value,
    is_anon: isAnon.value
  })

  _sending.value = false
  emit('close')
}
</script>

<style lang="scss" scoped>
.add-review-wrapper {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;

  background-color: rgba(0, 0, 0, 0.4);

  display: flex;
  justify-content: center;
  align-items: center;
}

.add-review {
  width: 350px;
  height: max-content;
  background-color: $bg;

  &__header {
    font-size: 1.2rem;
    font-weight: 500;
    padding: 1.2rem 1rem;
    background-color: $light;
    margin: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .close {
      outline: none;
      border: none;
      width: 16px;
      height: 16px;
      background: url("~/assets/icons/close.webp") center/contain;
      cursor: pointer;
    }
  }

  &__body {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    padding: 1.2rem 1rem;

    .body__stars {

      &-label {
        color: $dark;
        font-size: 0.9rem;
        margin: 5px 0;
      }

      .stars {
        margin: 0 auto;
        width: max-content;

        .star {
          width: 40px;
          filter: grayscale(1);
          cursor: pointer;

          &--highlighted {
            filter: none;
          }
        }
      }
    }

    .body__text {
      resize: vertical;
      max-height: 180px;
      min-height: 50px;

      padding: 15px 20px;
    }

    .body__anon {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
  }
}
</style>
