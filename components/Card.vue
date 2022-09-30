<template>
  <div class="card">
    <div class="card__image">
      <nuxt-img
        :alt="card.title"
        :src="card.image_url"
        class="img"
        format="webp"
        preload
        sizes="450:150px 600:200px sm:250px"
      />
    </div>
    <div class="card__favorites-btn" @click="_handleFavoritesAction">
      <svg
        :class="isInFavorites ? 'icon--favorite' : ''"
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
    <div class="card__title">
      {{ card.title }}
    </div>
    <div class="card__orders">
      <!-- TODO: система оценок -->
      <div class="rating">
        5.0
      </div>
      <!-- TODO: заменить кол-во заказов на кол-во оценок -->
      <div class="evaluations">
        ({{ formattedOrders }})
      </div>
    </div>
    <div class="card__info">
      <div class="card__price">
        <div class="card__final-price">
          {{ formatter.format(card.final_price) }}
        </div>
        <div v-if="card.old_price" class="card__old-price">
          {{ formatter.format(card.old_price) }}
        </div>
      </div>
      <div
        :class="
          isInCart ? 'card__cart-btn card__cart-btn--incart' : 'card__cart-btn'
        "
        @click="_handleCartAction"
      />
    </div>
  </div>
</template>

<script>
import { useFavoritesStore } from '@/stores/favorites'
import { useCartStore } from '~/stores/cart'

export default {
  props: {
    card: { type: Object, required: true }
  },
  data: () => ({
    favoritesStore: useFavoritesStore(),
    cartStore: useCartStore(),
    /* currency formatter */
    formatter: new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      maximumFractionDigits: 0
    })
  }),

  computed: {
    isInFavorites () {
      return this.favoritesStore.isInFavorites(this.card.pk_id)
    },
    isInCart () {
      return this.cartStore.isInCart(this.card.pk_id)
    },
    formattedOrders () {
      if (this.card.orders === 0) {
        return '0 оценок'
      } else if (this.card.orders.toString().endsWith('1')) {
        return `${this.card.orders} оценка`
      } else if (
        ['2', '3', '4'].includes(this.card.orders.toString().slice(-1))
      ) {
        return `${this.card.orders} оценки`
      } else {
        return `${this.card.orders} оценок`
      }
    }
  },

  methods: {
    async _handleFavoritesAction () {
      await this.favoritesStore.handleFavoritesAction(this.card.pk_id)
    },
    async _handleCartAction () {
      await this.cartStore.handleCartAction(this.card.pk_id)
      this.$emit('show-popup', {
        name: this.card.title,
        url: this.card.image_url,
        event: this.isInCart ? 'add' : 'remove'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.card {
  width: 250px;
  min-height: 350px;
  background: #eee;
  border: 1px solid $light;
  border-radius: 7px;
  overflow: hidden;

  transition: box-shadow 0.2s ease;

  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  @media (max-width: 600px) {
    width: 200px;
    min-height: 300px;
  }
  @media (max-width: 450px) {
    width: 150px;
    min-height: 250px;
    font-size: 14px;
  }

  &__image {
    transition: transform 0.2s ease;
    height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: white;
    overflow: hidden;

    @media (max-width: 450px) {
      height: 220px;
    }
  }

  &__favorites-btn {
    position: absolute;
    right: 12px;
    top: 15px;
    transition: opacity 0.3s ease;
    cursor: pointer;
    opacity: 0.8;

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

    &:hover {
      opacity: 1;
    }
  }

  &__title {
    width: 100%;
    padding: 5px 10px;
    font-size: 1.1rem;
  }

  &__orders {
    display: flex;
    gap: 5px;
    padding: 0 10px;
    margin: -7px 0 0 0;
    font-size: 0.7rem;
    color: $dark;

    .rating {
      background: url("~/assets/icons/star.svg") no-repeat left/14px;
      background-position: 0 -1px;
      padding-left: 14px;
    }
  }

  &__info {
    width: 100%;

    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__price {
    padding: 0 10px;
    font-size: 1.2rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 5px;

    .card__old-price {
      font-size: 0.8rem;
      color: $dark;
      text-decoration: line-through;
    }
  }

  &__cart-btn {
    width: 30px;
    height: 30px;
    margin: 3px 8px;

    box-sizing: border-box;
    border: 1px solid $default;
    border-radius: 50%;

    background-image: url("~/assets/icons/cart-add.png");
    background-size: 100%;
    background-repeat: no-repeat;
    background-position: 0 0;

    cursor: pointer;
    transition: background 0.2s ease;

    &--incart {
      background-position: 0 100%;
    }

    &:hover {
      background-color: $default;
    }
  }

  @media (min-width: 768px) {
    &:hover {
      box-shadow: 0 7px 6px rgba(black, 0.2);

      & > .card__image {
        transform: scale(1.05);
      }
    }
  }
}
</style>
