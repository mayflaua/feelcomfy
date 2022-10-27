<template>
  <div class="review">
    <p v-if="!admin" class="review__name">
      {{ review.is_anon ? 'Анонимный пользователь' : review.user_name }}
    </p>
    <p v-else class="review__name">
      {{ review.user_name }} ({{ review.is_anon && 'анонимно' }})
      <slot name="button" />
    </p>
    <div class="review__info">
      <div class="review__score">
        <img
          v-for="star of 5"
          :key="star"
          :alt="star"
          :class="{'star--transparent': star >
            review.score}"
          src="~/assets/icons/star.svg"
        >
      </div>
      <div class="review__date">
        {{ new Date(review.created_at).toLocaleDateString('ru-RU', {day: 'numeric', month: 'long', year: 'numeric'}) }}
      </div>
    </div>
    <div class="review__text">
      {{ review.text }}
    </div>
  </div>
</template>

<script lang="ts" setup>

import { Review } from '~/types/reviews'

defineProps<{
  review: Review
  admin?: false
}>()

</script>

<style lang="scss" scoped>
.review {
  width: 100%;
  border-bottom: 1px solid $default;
  padding: 15px 0;

  &__name {
    font-weight: 500;
    font-size: 1rem;
    margin: 0 0 5px 0;
  }

  &__info {
    display: flex;
    align-items: center;
    gap: 0.8rem;
  }

  &__score {
    .star--transparent {
      opacity: 0.6;
    }
  }

  &__date {
    font-size: 0.9rem;
    color: $dark;
  }

  &__text {
    margin: 15px 0;
  }
}
</style>
