<template>
  <div class="list__item">
    <div class="item__image-wrapper">
      <nuxt-link :to="link" target="_blank">
        <nuxt-img
          :alt="item.title"
          :src="`images/${item.netlify_name}`"
          class="item__image"
          format="webp"
          height="100%"
          placeholder="/assets/images/img-placeholder.webp"
          preload
          quality="60"
          width="90px"
        />
      </nuxt-link>
    </div>
    <div class="item__info">
      <nuxt-link :to="link" class="title" target="_blank">
        {{ item.title }}
      </nuxt-link>
      <div v-if="item.model" class="model">
        <span>Модель:</span> <span>{{ item.model }}</span>
      </div>
      <div v-if="item.color" class="color">
        <span>Цвет:</span> <span>{{ item.color }}</span>
      </div>
      <div class="quantity">
        <span>Количество</span> <span>{{ item.qty }}</span>
      </div>
      <div class="price">
        <span>Стоимость</span> <span>{{ item.price }}</span>
      </div>
      <button v-if="allowReviews" class="add-review-btn" @click="emit('add-review', item.pk_id)">
        Оставить отзыв
      </button>
    </div>
  </div>
</template>

<script setup>

import slugify from 'slugify'

const emit = defineEmits(['add-review'])

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  allowReviews: {
    type: Boolean,
    default: false
  }
})

const link = `/product/${slugify(props.item.title)}-${props.item.id}`

</script>

<style lang="scss" scoped>
.list__item {
  display: flex;
  gap: 20px;
  padding: 15px 0;
  margin: 0 20px;
  border-bottom: 1px solid $default;

  &:last-child {
    border: none;
  }

  .item__info {
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-size: 0.9rem;
    color: $font;
    width: 100%;

    .title {
      font-size: 1rem;
      margin: 0 0 20px 0;
      text-decoration: none;
      color: inherit;
    }

    .model, .color, .quantity, .price {
      display: flex;

      span {
        color: $dark;
        width: max(90px, 17%);

        &:last-child {
          color: $font;
          width: 83%;
        }
      }
    }

    .add-review-btn {
      background: none;
      outline: none;
      border: none;
      width: max-content;
      align-self: flex-end;
      font-size: 1rem;
      color: $blue;
      cursor: pointer;
      font-weight: 500;

      text-transform: uppercase;
    }
  }

}

</style>
