<template>
  <aside class="aside-filters">
    <div class="categories">
      <p class="categories__title">
        Категории
      </p>
      <div class="categories__list">
        <nuxt-link v-for="category in categoriesList" :key="category.name" :to="category.link" class="category">
          {{ category.title }}
        </nuxt-link>
      </div>
    </div>
    <div class="price">
      <p class="price__title">
        Цена
      </p>
      <div class="price__inputs-wrapper">
        <div class="price__inputs">
          <div class="input-wrapper">
            <input
              v-model="_v[0]"
              :max="minMaxPrice[1]"
              :min="minMaxPrice[0]"
              class="input input--min"
              type="number"
              ui-input
              @change="emitChange"
            >
          </div>
          <div class="input-wrapper">
            <input
              v-model="_v[1]"
              :max="minMaxPrice[1]"
              :min="minMaxPrice[0]"
              class="input input--max"
              type="number"
              ui-input
              @change="emitChange"
            >
          </div>
        </div>
        <Slider
          v-model="_v"
          :lazy="false"
          :max="minMaxPrice[1]"
          :min="minMaxPrice[0]"
          :tooltips="false"
          class="price__range-selector"
          @change="emitChange"
        />
      </div>
    </div>
    <div v-if="colors.length !== 0" class="color">
      <p class="color__title">
        Цвет
      </p>
      <ul class="color__list">
        <li v-for="color in colors" :key="color" class="color">
          <UICheckbox v-model="selectedColors[color]" :default-value="false" @changed="emitChange" />
          {{ color }}
        </li>
      </ul>
    </div>
  </aside>
</template>

<script setup>
import '@vueform/slider/themes/default.scss'

import Slider from '@vueform/slider'

const emit = defineEmits(['change'])

const props = defineProps({
  minMaxPrice: {
    type: Array,
    required: true
  },
  colors: {
    type: Array,
    required: true
  }
})
// range selector value
const _v = ref(props.minMaxPrice)

const emitChange = () => {
  emit('change', { price: _v.value, colors: selectedColors })
}

const categoriesList = await $fetch('/api/categories')

const selectedColors = reactive({})
props.colors.forEach((i) => {
  selectedColors[i] = false
})

</script>

<style lang="scss" scoped>

.aside-filters {
  min-width: 260px;
  width: 260px;
  height: min-content;
  position: sticky;
  top: 20px;

  @media (max-width: 768px) {
    position: static;
    width: 100%;
    display: grid;

    grid-template-areas:
      "categories price"
      "categories colors";
    column-gap: 10px;
  }

  @media (max-width: 400px) {
    display: flex;
    flex-direction: column;
    min-width: initial;

  }

  .categories {
    grid-area: categories;

    &__title {
      font-size: 1.15rem;
      font-weight: 500;
    }

    &__list {
      display: flex;
      flex-direction: column;

      .category {
        margin: 0;
        width: max-content;
        font-size: 1rem;
        color: darken($dark, 30);
        text-decoration: none;
        padding: 6px 8px;

        &:hover {
          background-color: $light;
          border-radius: 4px;
        }
      }
    }
  }

  .price {
    grid-area: price;

    &__title {
      font-size: 1.15rem;
      font-weight: 500;
    }

    &__inputs-wrapper {
      display: flex;
      flex-direction: column;
      gap: 10px;

      .price__inputs {
        display: flex;
        gap: 5px;

        .input-wrapper {
          position: relative;
          flex-grow: 1;

          &:before {
            position: absolute;
            font-size: 0.85rem;
            color: $dark;
            left: 8px;
            top: 50%;
            transform: translateY(-50%);
          }

          &:first-child:before {
            content: 'от';
          }

          &:last-child:before {
            content: 'до';
          }

          &:after {
            position: absolute;
            content: '₽';
            font-size: 0.85rem;
            color: $dark;
            right: 8px;
            top: 50%;
            transform: translateY(-50%);
          }

          .input {
            display: block;
            -moz-appearance: textfield;

            &::-webkit-outer-spin-button,
            &::-webkit-inner-spin-button {
              -webkit-appearance: none;
            }

            &--min,
            &--max {
              text-align: center;

            }
          }
        }
      }
    }

    &__range-selector {
      --slider-connect-bg: #6e6edf;
      --slider-handle-border: 2px solid #6e6edf;
      --slider-handle-shadow: none;
      --slider-handle-shadow-active: none;
    }
  }

  .color {
    grid-area: colors;

    &__title {
      font-size: 1.15rem;
      font-weight: 500;
    }

    &__list {
      list-style: none;
      padding: 0;

      .color {
        display: flex;
        gap: 10px;
        margin: 10px 0 0 0;
      }
    }
  }
}
</style>
