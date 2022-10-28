<template>
  <aside class="aside-filters">
    <div v-if="categories && categories.length > 1" class="categories">
      <p class="categories__title">
        Категории
      </p>

      <ul class="categories__list">
        <li v-for="category in categories" :key="category.categoryID" class="category">
          <UICheckbox v-model="selectedCategories[category.categoryID]" @update:modelValue="emitChange">
            {{ category.title }}
          </UICheckbox>
        </li>
      </ul>
    </div>

    <div v-if="minMaxPrice" class="price">
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

    <div v-if="colors && colors.length > 1" class="color">
      <p class="color__title">
        Цвет
      </p>
      <ul class="color__list">
        <li v-for="color in colors" :key="color" class="color">
          <UICheckbox v-model="selectedColors[color]" @update:modelValue="emitChange">
            {{ color }}
          </UICheckbox>
        </li>
      </ul>
    </div>

    <div v-if="chars && chars.length > 1" class="characteristics">
      <div v-for="(char, i) of chars" :key="i" class="characteristics-wrapper">
        <div v-for="(values, label) of char" :key="label" class="characteristic__item">
          <p class="item__label">
            {{ label }}
          </p>
          <ul class="item__list">
            <li v-for="(item, i) in values" :key="item" class="list__item">
              <UICheckbox
                v-model="selectedCharacteristics[label][i][item]"
                @update:modelValue="emitChange"
              >
                {{ item }}
              </UICheckbox>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </aside>
</template>

<script lang="ts" setup>
import '@vueform/slider/themes/default.scss'

import Slider from '@vueform/slider'
import { reactive, ref } from 'vue'
import { CategoryObject } from '~/types/categories'

const emit = defineEmits(['change'])

const props = defineProps<{
  minMaxPrice?: [number, number]
  colors?: Array<string>
  categories?: Array<CategoryObject>
  chars?: Array<[string, string[]]>
}>()
// range selector value
const _v = ref(props.minMaxPrice)

const emitChange = () => {
  emit('change', {
    categories: selectedCategories,
    price: _v.value,
    colors: selectedColors,
    chars:
  selectedCharacteristics
  })
}

const selectedCategories = reactive({})
props?.categories.forEach((i) => {
  selectedCategories[i.categoryID] = false
})

const selectedColors = reactive({})
props?.colors.forEach((i) => {
  selectedColors[i] = false
})

const selectedCharacteristics = reactive({})
props?.chars.forEach((char) => {
  const [key, value] = Object.entries(char)[0]
  selectedCharacteristics[key] = []
  value.forEach((val) => {
    selectedCharacteristics[key].push({ [val]: false })
  })
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
    grid-template-columns: repeat(3, 1fr);

    column-gap: 10px;
  }

  @media (max-width: 400px) {
    display: flex;
    flex-direction: column;
    min-width: initial;

  }

  .categories {

    &__title {
      font-size: 1.15rem;
      font-weight: 500;
    }

    &__list {
      list-style: none;
      padding: 0;

      .category {
        display: flex;
        gap: 10px;
        margin: 10px 0 0 0;
      }
    }
  }

  .price {

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

  .characteristics {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    grid-column: 1/4;

    @media (max-width: 768px) {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
    }
    .characteristic__item {
      .item__label {
        font-size: 1.15rem;
        font-weight: 500;
      }

      .item__list {
        list-style: none;
        padding: 0;

        .list__item {
          display: flex;
          gap: 10px;
          margin: 10px 0 0 0;
        }
      }
    }
  }
}
</style>
