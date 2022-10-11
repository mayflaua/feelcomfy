<template>
  <div>
    <LazyCartPopup ref="popup" />
    <UILoader v-if="!_splideMounted || _fetchingItem" fullscreen v2 />
    <div v-show="_splideMounted && !_fetchingItem" class="product">
      <div class="product__info-card">
        <div class="info__image-wrapper">
          <!--          TODO: maybe more images? -->
          <!--THUMBS-->
          <Splide
            ref="thumbsSplide"
            :options="{
              direction: 'ttb',
              arrows: false,
              pagination: false,
              height: '100%',
              fixedWidth: '100%',
              fixedHeight: 'auto',
              isNavigation: true,
            }"
            class="splide-thumbs"
          >
            <SplideSlide>
              <nuxt-img
                :alt="item.title"
                :src="item.netlify_name"
                class="info__image"
                fit="cover"
                format="webp"
                height="100%"
                placeholder="/assets/images/img-placeholder.webp"
                width="160"
              />
            </SplideSlide>
          </Splide>
          <!--  MAIN SPLIDE-->
          <Splide
            ref="mainSplide"
            :options="{
              pagination: false,
            }"
            class="splide-main"
            @splide:mounted="_splideMounted = true"
          >
            <SplideSlide class="splide-slide">
              <nuxt-img
                :alt="item.title"
                :src="item.netlify_name"
                class="info__image"
                format="webp"
                placeholder="/assets/images/img-placeholder.webp"
                @click="openImage"
              />
            </SplideSlide>
          </Splide>
        </div>
        <div class="product__info">
          <div class="info__stats">
            <span class="stats__rating">
              {{ item.rating }}
              <span class="stats__reviews" @click="goToReviews">
                (<span>{{ reviewsFormatted }}</span>)
              </span>
            </span>

            <span class="stats__orders">{{ item.orders }} заказов</span>
            <button class="stats__favorites-btn" @click="favoritesStore.handleFavoritesAction(item.pk_id)">
              <svg
                :class="{'icon--favorite': isInFavorites}"
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
              {{ isInFavorites ? 'В желаниях' : 'В желания' }}
            </button>
          </div>
          <h1 class="info__title">
            {{ item.title }}
          </h1>
          <div class="info__qty">
            <div class="qty__title">
              Количество:
            </div>
            <div class="qty-input-wrapper">
              <input
                v-model="item.qty"
                :readonly="item.units_in_stock === 0"
                class="item__qty-input"
                type="number"
                ui-input
                @change="checkInputValue"
              >
              <button
                :disabled="item.qty <= 1 || item.qty === 0"
                class="qty__minus-btn"
                @click="handleChangeQuantity(-1)"
              >
                -
              </button>
              <button
                :disabled="item.qty >= item.units_in_stock || item.qty === 0"
                class="qty__plus-btn"
                @click="handleChangeQuantity(1)"
              >
                +
              </button>
              <span :class="{'qty__in-stock--no-stock' : item.units_in_stock === 0}" class="qty__in-stock">{{
                inStockFormatted
              }}</span>
            </div>
          </div>
          <div class="info__price">
            <div class="price__title">
              Цена:
            </div>
            <div class="price__price-wrapper">
              <span class="final-price">{{ formatter.format(item.final_price * Math.max(item.qty, 1)) }}</span>
              <span v-if="item.old_price" class="old-price">{{
                formatter.format(item.old_price * Math.max(item.qty, 1))
              }}</span>
            </div>
          </div>
          <UIButton
            v-if="isLoggedIn()"
            :disabled="item.units_in_stock === 0 || isInCart"
            :text="isInCart ? 'Уже в корзине' : 'Добавить в корзину'"
            class="add-to-cart-btn"
            @click="handleAddToCartClick"
          />
        </div>
      </div>
      <div class="product__desc-wrapper">
        <div class="desc__tabs">
          <button :class="{'tab--current': currentTab === 'desc'}" class="tab" @click="currentTab = 'desc'">
            Описание товара
          </button>
          <button :class="{'tab--current': currentTab === 'reviews'}" class="tab" @click="handleReviewsClick">
            Отзывы ({{ item.reviews }})
          </button>
        </div>
        <div ref="_reviewsBody" class="desc__body">
          <div v-if="currentTab === 'desc'" class="desc">
            {{ item.description }}
          </div>
          <p v-if="item.reviews === 0 && currentTab === 'reviews'" class="reviews--no-reviews">
            На этот товар пока нет отзывов
          </p>
          <div v-if="currentTab === 'reviews' && reviewsList && item.reviews !== 0" class="reviews">
            <div class="reviews__title">
              Все отзывы ({{ item.reviews }})
            </div>
            <ProductReview v-for="review in reviewsList" :key="review.created_at" :review="review" />
          </div>
          <UILoader v-if="currentTab === 'reviews' && !reviewsList" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import slugify from 'slugify'
import '@splidejs/vue-splide/css'
import 'viewerjs/dist/viewer.css'
import { Splide, SplideSlide } from '@splidejs/vue-splide'
import { useReviewsStore } from '@/stores/reviews'
import { useFavoritesStore } from '@/stores/favorites'
import { useCartStore } from '@/stores/cart'
import { useProductsStore } from '@/stores/products'
import useAuth from '@/composables/useAuth'

const VueViewer = await import('v-viewer')
const { supabase } = useSupabase()
const { isLoggedIn } = useAuth()
const reviewsStore = useReviewsStore()
const favoritesStore = useFavoritesStore()
const cartStore = useCartStore()
const productStore = useProductsStore()

const mainSplide = ref(null)
const thumbsSplide = ref(null)

const route = useRoute()
const item = ref(null)
const reviewsList = ref(null)
const _fetchingItem = ref(true)
const _splideMounted = ref(false)

const currentTab = ref('desc')
const _reviewsBody = ref()

/* currency formatter */
const formatter = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  maximumFractionDigits: 0
})

const reviewsFormatted = computed(() => {
  const count = item.value.reviews
  if (count.toString().endsWith('1')) {
    return `${count} оценка`
  } else if (['2', '3', '4'].includes(count.toString().slice(-1))) {
    return `${count} оценки`
  } else {
    return `${count} оценок`
  }
})

const isInFavorites = computed(() => favoritesStore.isInFavorites(item.value.pk_id))
const isInCart = computed(() => cartStore.isInCart(item.value.pk_id))

const goToReviews = async () => {
  await handleReviewsClick()
  _reviewsBody.value.scrollIntoView()
}

const openImage = function () {
  VueViewer.api({
    images: [`https://ik.imagekit.io/sweetie/images/${item.value.netlify_name}`]
  }, {
    title: item.value.title,
    loop: true
  })
}
const popup = ref()
const handleAddToCartClick = () => {
  if (!isInCart.value) {
    cartStore.handleCartAction(item.value.pk_id, item.value.qty)
    popup.value.show(item.value.title, item.value.netlify_name, 'add')
  }
}

const handleChangeQuantity = (value) => {
  if (value === -1 && item.value.qty > 1) {
    item.value.qty--
  } else if (value === 1 && item.value.qty < item.value.units_in_stock) {
    item.value.qty++
  }
}
const checkInputValue = () => {
  if (item.value.units_in_stock === 0) {
    item.value.qty = 0
  } else if (item.value.qty < 1) {
    item.value.qty = 1
  } else if (item.value.qty > item.value.units_in_stock) {
    item.value.qty = item.value.units_in_stock
  }
}

const inStockFormatted = computed(() => {
  if (item.value.units_in_stock === 0) {
    return 'Нет в наличии'
  } else {
    return `В наличии ${item.value.units_in_stock} шт.`
  }
})

const handleReviewsClick = async () => {
  currentTab.value = 'reviews'
  if (!reviewsList.value) {
    reviewsList.value = await reviewsStore.getReviewsByProductId(item.value.pk_id)
  }
}

// created()
item.value = await productStore.getProductById(route.params.id)
if (item.value[0].length !== 0) {
  if (slugify(item.value[0].title) !== route.params.slug[0]) {
    item.value = null
  } else {
    item.value = item.value[0]
    item.value.units_in_stock === 0 ? item.value.qty = 0 : item.value.qty = 1

    _fetchingItem.value = false
  }
}

onMounted(() => {
  mainSplide.value.sync(thumbsSplide.value.splide)
  _splideMounted.value = true
})
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

    .info {
      &__image-wrapper {
        width: clamp(450px, 70%, 550px);
        display: flex;
        gap: 1rem;

        @media(max-width: 768px) {
          width: 90%;
          align-self: center;
        }

        .splide-thumbs {
          .splide__slide.is-active {
            border: 1px solid $dark;
          }
        }
      }

      &__image {
        width: 100%;
      }
    }
  }

  &__info {
    display: flex;
    gap: 20px;
    flex-grow: 1;
    flex-direction: column;

    .info {
      &__title {
        font-size: 1.4rem;
        font-weight: 400;
        border-bottom: 1px solid $default;
        margin: 0;
        padding: 0 0 1rem 0;
      }

      &__stats {
        display: flex;
        align-items: center;
        gap: 10px;

        font-size: 0.9rem;
        color: $dark;

        .stats {
          &__rating {
            background: url("~/assets/icons/star.svg") no-repeat left/14px;
            background-position: 0 35%;
            padding-left: 14px;
          }

          &__reviews {
            span {
              border-bottom: 1px dotted $default;
              cursor: pointer;

              &:hover {
                border: none;
              }
            }
          }

          &__orders {
            flex-grow: 1
          }

          &__favorites-btn {
            color: $font;
            border: none;
            outline: none;
            background: none;
            cursor: pointer;

            display: flex;
            align-items: center;
            gap: 5px;

            .icon {
              fill: none;
              stroke: black;
              stroke-opacity: 0.6;
              transition: stroke-opacity 0.1s ease;

              &:hover {
                stroke-opacity: 1;
              }

              &--favorite {
                stroke: red;
                fill: red;
                animation: like 0.3s ease;

                @keyframes like {
                  0%,
                  100% {
                    transform: none;
                  }
                  40% {
                    transform: scale(1.2);
                  }
                }
              }
            }
          }
        }
      }

      &__qty {
        display: flex;
        flex-direction: column;
        gap: 0.6rem;
        font-size: 0.9rem;

        .qty-input-wrapper {
          display: flex;
          height: 40px;

          .qty__minus-btn,
          .qty__plus-btn {
            width: 40px;
            border: none;
            border-top: 1px solid $default;
            border-bottom: 1px solid $default;
            background: transparent;
            cursor: pointer;
            font-size: 1.5rem;
            font-weight: 300;
            color: $font;

            &[disabled] {
              color: $default;
            }
          }

          .qty__minus-btn {
            order: -1;
            border-radius: 3px 0 0 3px;
            border-left: 1px solid $default;

          }

          .qty__plus-btn {
            border-radius: 0 3px 3px 0;
            border-right: 1px solid $default;
          }

          .item__qty-input {
            display: block;
            width: 40px;
            height: 40px;
            padding: 0;

            border: none;
            border-radius: 0;
            outline: none;

            border-top: 1px solid $default;
            border-bottom: 1px solid $default;
            text-align: center;
            appearance: textfield;
            font-size: 0.8rem;

            &:focus {
              border-color: black;

              & ~ button {
                border-color: black;
              }
            }

            &::-webkit-inner-spin-button,
            &::-webkit-outer-spin-button {
              display: none;
            }
          }
        }

        .qty__in-stock {
          align-self: center;
          color: rgb(0, 200, 83);
          margin: 0 0 0 1rem;

          &--no-stock {
            color: $dark;
          }
        }
      }

      &__price {
        display: flex;
        flex-direction: column;
        gap: 0.6rem;

        .price__title {
          font-size: 0.9rem;
        }

        .price__price-wrapper {
          display: flex;
          align-items: center;
          gap: 1rem;

          .final-price {
            font-size: 1.2rem;
            font-weight: 500;
          }

          .old-price {
            font-size: 0.85rem;
            color: $dark;
            text-decoration: line-through;
          }
        }
      }

    }

    .add-to-cart-btn {
      border-radius: 8px;
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

      .desc {

      }

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
    }
  }
}

</style>
