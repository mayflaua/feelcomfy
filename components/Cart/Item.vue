<template>
  <div class="item">
    <UICheckbox
      :checked="cartStore.getCheckValue(itemInfo.pk_id)"
      class="item__checkbox"
      @change="cartStore.handleCheck(itemInfo.pk_id)"
    />
    <div class="item__image">
      <nuxt-img
        :alt="itemInfo.title"
        :src="itemInfo.image_url"
        format="webp"
        height="100%"
        prelaod
        quality="60"
        width="100px"
      />
    </div>
    <div class="item__desc">
      <div class="item__head">
        <div class="item__name">
          {{ itemInfo.title }} {{ itemInfo.pk_id }}
        </div>
        <button
          v-if="!noInput"
          class="item__delete-btn"
          @click.prevent="handleDeleteButton"
        >
          Удалить
        </button>
      </div>
      <div class="item__body">
        <div class="item__info">
          <p v-if="itemInfo.color" class="item__color">
            Цвет: <span>{{ itemInfo.color }}</span>
          </p>
          <p v-if="itemInfo.model" class="item__model">
            Модель: <span>{{ itemInfo.model }}</span>
          </p>
        </div>
        <div class="item__qty">
          <div v-if="!noInput" class="qty-input-wrapper">
            <input
              :max="itemInfo.units_in_stock"
              :value="itemInfo.qty"
              class="item__qty-input"
              min="1"
              readonly
              type="number"
            >
            <button
              :disabled="itemInfo.qty <= 1"
              class="qty__minus-btn"
              @click="itemInfo.qty > 1 ? handleChangeQuantity(-1) : null"
            >
              -
            </button>
            <button class="qty__plus-btn" @click="handleChangeQuantity(1)">
              +
            </button>
          </div>
          <p
            v-if="!noInput"
            v-show="itemInfo.qty > 1"
            class="qty__price-per-item"
          >
            {{ formatter.format(itemInfo.final_price) }}/ед.
          </p>
          <div v-if="noInput" class="qty__qty-label">
            Количество: <span>{{ itemInfo.qty }} шт.</span>
          </div>
        </div>
        <div class="item__price">
          <div v-if="itemInfo.old_price" class="price__old">
            {{ formatter.format(itemInfo.old_price * itemInfo.qty) }}
          </div>
          <div class="price__final">
            {{ formatter.format(itemInfo.final_price * itemInfo.qty) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '~/stores/cart'

const cartStore = useCartStore()

const props = defineProps({
  itemInfo: {
    type: Object,
    required: true
  },

  noInput: {
    type: Boolean,
    default: false
  }
})

defineEmits(['delete'])

const formatter = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  maximumFractionDigits: 0
})

const handleDeleteButton = async () => {
  await cartStore.handleCartAction(props.itemInfo.pk_id)
}

const handleChangeQuantity = async (value) => {
  await cartStore.changeQuantity(props.itemInfo.pk_id, value)
}
</script>

<style lang="scss" scoped>
$img: 100px;
$gap: 20px;
$padding: 10px;
$height: 150px;
$qtySize: 40px;

.item {
  //height: $height - $padding * 2;
  width: 100%;
  padding: $padding $padding 20px $padding;
  gap: $gap;

  display: flex;
  justify-content: flex-start;
  align-items: center;

  &__image {
    height: $img;
    width: $img;
    display: flex;
    align-items: center;
  }

  &__delete-btn {
    padding: 0 0 0 16px;
    font-size: 0.7rem;
    line-height: 13px;

    border: none;
    outline: none;
    background: transparent url("~/assets/icons/bin.png") no-repeat left/contain;
    cursor: pointer;
    opacity: 0.7;

    &:hover {
      opacity: 1;
    }
  }

  &__desc {
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    width: calc(100% - $padding - $img - $gap);
    height: 100%;
  }

  &__head,
  &__body {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  &__info {
    display: flex;
    flex-direction: column;
    width: 25%;

    .item__model,
    .item__color {
      margin: 3px 0;
      color: $dark;

      span {
        color: $font;
      }
    }
  }

  &__qty {
    position: relative;

    .qty-input-wrapper {
      display: flex;
      height: $qtySize;

      .item__qty-input {
        display: block;
        width: $qtySize;
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

    .qty__price-per-item {
      position: absolute;
      margin: 3px 0 0 0;
      width: 100%;

      color: $default;
      text-align: center;
      font-size: 0.8rem;
    }

    .qty__minus-btn,
    .qty__plus-btn {
      width: $qtySize;
      border: none;
      border-top: 1px solid $default;
      border-bottom: 1px solid $default;
      background: transparent;
      cursor: pointer;
      font-size: 1.5rem;
      font-weight: 300;
      color: $font;
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

    .qty__qty-label {
      color: $dark;
      font-size: 0.9rem;

      span {
        color: black;
      }
    }
  }

  &__price {
    display: flex;
    align-items: flex-end;
    gap: 5px;

    .price__old {
      color: $dark;
      text-decoration: line-through;
      font-size: 0.8rem;
    }

    .price__final {
      font-size: 1rem;
      font-weight: 500;
    }
  }
}

@media (max-width: 768px) {
  $qtySize: 35px;

  .item {
    // padding-bottom: 20px;
    &__qty {
      .qty-input-wrapper {
        height: $qtySize;

        .item__qty-input {
          width: $qtySize;
        }
      }

      .qty__minus-btn,
      .qty__plus-btn {
        width: $qtySize;
      }
    }
  }
}

@media (max-width: 600px) {
  $qtySize: 30px;
  $img: 70px;
  $gap: 10px;

  .item {
    min-height: 170px;
    height: unset;
    gap: $gap;

    &__body {
      flex-direction: column;
      gap: 14px;
    }

    &__image {
      width: $img;
      height: $img;
    }

    &__qty {
      display: flex;
      align-items: center;
      order: 3;

      width: 100%;
      margin: 0 0 0 -80px;

      .qty__price-per-item {
        text-align: left;
        display: block;
        position: relative;
        margin: 0 0 0 8px;
      }

      .qty-input-wrapper {
        height: $qtySize;

        .item__qty-input {
          width: $qtySize;
        }
      }

      .qty__minus-btn,
      .qty__plus-btn {
        width: $qtySize;
      }
    }

    &__price {
      flex-direction: row-reverse;
    }
  }
}
</style>
