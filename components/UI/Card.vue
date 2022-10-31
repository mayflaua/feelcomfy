<template>
  <nuxt-link
    :class="{'card--wide': wide && !isLowResolution}"
    :to="`/product/${slugify(product.title)}-${product.pk_id}`"
    class="card"
    no-prefetch
  >
    <div class="card__wishes-btn" @click.stop.prevent="handleFavoritesClick">
      <svg
        :class="{'icon--active': isInFavorites}"
        class="icon"
        height="20"
        viewBox="0 0 20 20"
        width="20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5.95 2C8.51792 2 10 4.15234 10 4.15234C10 4.15234 11.485 2 14.05 2C16.705 2 19 4.07 19 6.95C19 11.1805 12.5604 15.6197 10.3651 17.5603C10.1582 17.7432 9.84179 17.7432 9.63488 17.5603C7.44056 15.6209 1 11.1803 1 6.95C1 4.07 3.295 2 5.95 2Z"
        />
        <path
          d="M1 6.86486C1 4.20297 3.15017 2 5.86486 2C7.98685 2 9.35921 3.35876 10 4.18673C10.6408 3.35876 12.0132 2 14.1351 2C16.8506 2 19 4.20302 19 6.86486C19 8.02987 18.5328 9.18622 17.8534 10.265C17.1716 11.3476 16.252 12.3903 15.29 13.3377C13.9567 14.6508 12.4757 15.8387 11.4134 16.6907C10.9618 17.0529 10.5859 17.3544 10.3293 17.579C10.1407 17.7439 9.85926 17.7439 9.67075 17.579C9.41405 17.3544 9.03815 17.0529 8.58659 16.6907C7.52431 15.8387 6.04326 14.6508 4.70997 13.3377C3.74802 12.3903 2.82836 11.3476 2.14659 10.265C1.46724 9.18622 1 8.02987 1 6.86486ZM5.86486 3C3.70929 3 2 4.74838 2 6.86486C2 7.76743 2.36553 8.73607 2.99277 9.73208C3.61759 10.7242 4.47833 11.706 5.41165 12.6252C6.71033 13.9042 8.08423 15.005 9.13396 15.8461C9.45728 16.1052 9.74985 16.3396 10 16.547C10.2501 16.3396 10.5427 16.1052 10.866 15.8461C11.9158 15.005 13.2897 13.9042 14.5883 12.6252C15.5217 11.706 16.3824 10.7242 17.0072 9.73208C17.6345 8.73607 18 7.76743 18 6.86486C18 4.74833 16.2914 3 14.1351 3C12.0406 3 10.8181 4.70211 10.5033 5.21028C10.2727 5.5825 9.72727 5.58249 9.4967 5.21027C9.1819 4.7021 7.95944 3 5.86486 3Z"
        />
      </svg>
    </div>

    <div class="card__image">
      <div
        v-if="product.netlify_images && product.netlify_images.length !== 0"
        class="card__image-hover-wrapper"
        @mouseleave="setImageOnHover(0)"
      >
        <div v-for="(el, i) in product.netlify_images" :key="i" class="hover-el" @mouseenter="setImageOnHover(i)" />
      </div>
      <nuxt-img
        :alt="product.title"
        :loading="lazy ? 'lazy': 'eager'"
        :src="`images/${currentImage}`"
        width="100%"
      />
    </div>

    <div class="card__info">
      <div class="info__price-wrapper">
        <span class="price__final">{{ _f.format(product.final_price) }}</span>
        <span v-if="product.old_price" class="price__old">{{ _f.format(product.old_price) }}</span>
        <span v-if="product.old_price" class="price__discount">-{{ discount }}%</span>
      </div>

      <div class="info__rating">
        <div v-if="product.score > 0" class="rating__stars">
          <span v-for="star in 5" :key="star" :class="{'star--grey': product.score < star}" class="star" />
        </div>
        <span v-if="product.reviews" class="rating__reviews">{{ product.reviews }}</span>
        <span v-else class="rating__no-reviews">Нет оценок</span>
      </div>

      <div :title="product.title" class="info__title">
        {{ product.title }}
      </div>

      <div v-if="wide" class="info__characteristics">
        <div v-if="product.color" class="characteristic-field">
          <span class="characteristic-field__label">Цвет:</span>
          <span class="characteristic-field__value">{{ product.color }}</span>
        </div>
        <div v-if="product.model" class="characteristic-field">
          <span class="characteristic-field__label">Модель:</span>
          <span class="characteristic-field__value">{{ product.model }}</span>
        </div>

        <div v-for="(value, label) of product.additional_data" :key="value" class="characteristic-field">
          <span class="characteristic-field__label">{{ label }}:</span>
          <span class="characteristic-field__value">{{ value }}</span>
        </div>
      </div>

      <div class="info__badges">
        <CardBadgeOneLeft v-if="product.units_in_stock === 1" />
        <CardBadgeHighRating v-if="product.score >= 4.5" />
        <CardBadgeManyUnitsInStock v-if="product.units_in_stock > 30" />
        <LazyCardBadgeHighDiscount v-if="discount > 30" />
      </div>

      <div v-if="isInCart" class="info__qty">
        <button class="qty__minus-btn" @click.stop.prevent="handleMinusButtonClick">
          -
        </button>
        <input
          :max="product.units_in_stock"
          :value="cartStore.getQuantity(product.pk_id)"
          class="qty__input"
          min="1"
          readonly
          type="number"
          ui-input
        >

        <button
          :disabled="cartStore.getQuantity(product.pk_id) === product.units_in_stock"
          class="qty__plus-btn"
          @click.stop.prevent="cartStore.changeQuantity(product.pk_id, 1)"
        >
          +
        </button>
      </div>
      <UIButton
        v-else
        class="info__cart-btn"
        text="В корзину"
        @click.stop.prevent="handleCartAdd"
      />
    </div>
  </nuxt-link>
</template>

<script lang="ts" setup>
import slugify from 'slugify'
import { computed, ref } from 'vue'
import { useMediaQuery } from '@vueuse/core'
import { ProductWithRating } from '~/types/product'
import { useFavoritesStore } from '~/stores/favorites'
import { useCartStore } from '~/stores/cart'

const favoritesStore = useFavoritesStore()
const cartStore = useCartStore()

const props = defineProps<{
  product: ProductWithRating
  lazy?: boolean
  wide?: boolean
}>()

const isLowResolution = useMediaQuery('(max-width: 400px)')

// currency formatter
const _f = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  maximumFractionDigits: 0
})

const discount = computed(() => Math.floor((1 - props.product.final_price / props.product.old_price) * 100))

const currentImage = ref(props.product.netlify_name)
const setImageOnHover = (index: number): void => {
  if (!index) {
    currentImage.value = props.product.netlify_name
  } else {
    currentImage.value = props.product.netlify_images[index - 1]
  }
}
const isInFavorites = computed(() => favoritesStore.isInFavorites(props.product.pk_id))
const isInCart = computed(() => cartStore.isInCart(props.product.pk_id))

const handleFavoritesClick = async (): Promise<void> => {
  await favoritesStore.handleFavoritesAction(props.product.pk_id)
}

const handleCartAdd = async (): Promise<void> => {
  await cartStore.handleCartAction(props.product.pk_id)
}
const handleMinusButtonClick = async (): Promise<void> => {
  if (cartStore.getQuantity(props.product.pk_id) === 1) {
    await cartStore.handleCartAction(props.product.pk_id)
  } else {
    await cartStore.changeQuantity(props.product.pk_id, -1)
  }
}

</script>

<style lang="scss" scoped>
.card {
  min-height: 100%;
  text-decoration: none;
  color: $font;

  display: flex;
  flex-direction: column;

  &__wishes-btn {
    align-self: flex-end;
    fill: none;
    stroke: $dark;
    cursor: pointer;

    .icon {
      transition: all 0.2s ease;
      stroke-width: 1.5px;

      &:hover {
        stroke: black;
      }

      &--active {
        stroke: red;
        fill: red;

        &:hover {
          stroke: none;
        }
      }
    }

  }

  &__image {
    width: 100%;
    height: 50%;
    max-height: 200px;
    position: relative;

    &-hover-wrapper {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;

      .hover-el {
        flex-grow: 1;

        &:hover {
          border-bottom: 2px solid $dark;
        }
      }
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }

  &__info {
    margin-top: 5px;
    flex-grow: 1;
    width: 100%;
    display: flex;
    flex-direction: column;

    .info {
      &__price-wrapper {
        display: flex;
        align-items: center;
        gap: 0.4rem;
        .price {
          &__final {
            font-size: 1.2rem;
            font-weight: 500;
          }
          &__old {
            font-size: 0.8rem;
            text-decoration: line-through;
            color: $dark;
          }
          &__discount {
            color: $bg;
            padding: 2px 5px;
            font-size: 0.8rem;
            background-color: #fc5230;
            border-radius: 5px;
          }
        }
      }

      &__rating {
        display: flex;
        gap: 0.5rem;
        align-items: center;
        .rating {
          &__stars {
            display: flex;
            align-items: center;
            height: 20px;

            .star {
              width: 16px;
              height: 16px;
              margin-left: -2px;
              background: url("~/assets/icons/star.svg") transparent no-repeat center/contain;

              &--grey {
                filter: grayscale(40);
              }
            }
          }
          &__reviews {
            color: lighten($font, 40);
            font-size: 1rem;
          }

          &__no-reviews {
            color: $dark;
            font-size: 0.85rem;
          }
        }
      }

      &__title {
        margin: 3px 0 0 0;
        line-height: 1.2rem;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      &__badges {
        display: flex;
        flex-wrap: wrap;
        flex-grow: 1;
        align-items: flex-end;
        align-content: flex-end;
        gap: 4px;
        margin-bottom: 5px;
      }

      &__cart-btn {
        border-radius: 10px;
        font-size: 1.12rem;
        height: 40px;
        margin: auto 0 0 0;
      }

      &__qty {
        display: flex;
        border: 1px solid $default;
        height: 40px;

        .qty {
          &__plus-btn,
          &__minus-btn {
            border: none;
            background: transparent;
            width: 40px;
            font-size: 1.2rem;
            cursor: pointer;
          }

          &__input {
            flex-grow: 1;
            height: 100%;
            text-align: center;
            font-weight: 500;
            border: none;
          }
        }
      }

      &__characteristics {
        @media (max-width: 420px) {
          display: none;
        }
      }
    }
  }

}

.card--wide {
  flex-direction: row;
  gap: 1rem;
  border-bottom: 1px solid $light;
  padding-bottom: 1rem;

  @media (max-width: 420px) {
    gap: 0.5rem;
  }

  .card {
    &__image {
      height: 100%;
      width: 25%;
    }

    &__wishes-btn {
      order: 3;
      align-self: flex-start;
    }

    &__info {
      display: grid;
      grid-template-columns: 75% 25%;
      grid-template-rows: auto 1fr 40px;
      gap: 0.3rem;
      grid-template-areas: "title price"
      "info badges"
      "score cart";

      @media (max-width: 630px) {
        grid-template-columns: 60% 40%;
        grid-template-areas: "title title"
        "info info"
        "price badges"
        "score cart"
      }

      .info {

        &__title {
          grid-area: title;
          font-size: 1.2rem;
          font-weight: 500;
        }

        &__characteristics {
          grid-area: info;
          font-size: 0.9rem;
          display: flex;
          flex-direction: column;
          gap: 0.3rem;

          .characteristic-field {
            display: flex;
            gap: 5px;

            &__label {
              color: $dark;
            }
          }
        }

        &__price-wrapper {
          grid-area: price;
        }

        &__cart-btn {
          grid-area: cart;

          @media (max-width: 420px) {
            font-size: 0.9rem;
            height: 30px;
            line-height: 30px;
            padding: 0;
          }
        }

        &__badges {
          grid-area: badges;
        }

        &__rating {
          grid-area: score;
        }
      }
    }
  }
}
</style>
