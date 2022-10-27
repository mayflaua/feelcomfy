<template>
  <div class="item">
    <UICheckbox
      v-if="!noInput"
      :checked="cartStore.getCheckValue(itemInfo.pk_id)"
      class="item__checkbox"
      @change="cartStore.handleCheck(itemInfo.pk_id)"
    />
    <nuxt-link :to="link" class="item__image" target="_blank">
      <nuxt-img
        :alt="itemInfo.title"
        :modifiers="{w: 100, h: 100, cm: 'pad_resize'}"
        :src="`images/${itemInfo.netlify_name}`"
        format="webp"
        height="100"
        placeholder="/assets/images/img-placeholder.webp"
        prelaod
        quality="60"
        sizes="md:70px lg:100px"
        width="100"
      />
    </nuxt-link>
    <div class="item__desc">
      <nuxt-link :to="link" class="item__name" target="_blank">
        {{ itemInfo.title }}
      </nuxt-link>
      <button
        v-if="!noInput"
        class="item__delete-btn dark-invert"
        @click.prevent="handleDeleteButton"
      >
        Удалить
      </button>
      <div class="item__info">
        <p v-if="itemInfo.color" class="item__color">
          Цвет: <span class="dark-invert">{{ itemInfo.color }}</span>
        </p>
        <p v-if="itemInfo.model" class="item__model">
          Модель: <span class="dark-invert">{{ itemInfo.model }}</span>
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
            ui-input
          >
          <button
            :disabled="itemInfo.qty <= 1"
            class="qty__minus-btn"
            @click="itemInfo.qty > 1 ? handleChangeQuantity(-1) : null"
          >
            -
          </button>
          <button
            :disabled="itemInfo.qty >= itemInfo.units_in_stock"
            class="qty__plus-btn"
            @click="handleChangeQuantity(1)"
          >
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
</template>

<script setup>
import slugify from 'slugify'
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

const link = `/product/${slugify(props.itemInfo.title)}-${props.itemInfo.pk_id}`
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
  width: 100%;
  padding: $padding $padding 20px $padding;
  gap: $gap;

  display: flex;
  justify-content: flex-start;
  align-items: center;

  &__image {
    max-height: $img;
    max-width: $img;
    display: flex;
    align-items: center;

  }

  &__delete-btn {
    grid-area: delete;
    align-self: start;
    justify-self: end;
    width: max-content;
    padding-left: 18px;

    font-size: 0.7rem;
    line-height: 13px;

    border: none;
    outline: none;
    background: transparent url("~/assets/icons/bin.webp") no-repeat left/16px;
    cursor: pointer;
    opacity: 0.7;

    &:hover {
      opacity: 1;
    }
  }

  &__name {
    grid-area: title;
    color: inherit;
    text-decoration: none;
  }

  &__desc {
    display: grid;
    grid-template-rows: 40px 1fr;
    grid-template-columns: 1fr 120px 120px;
    grid-template-areas:
      "title title delete"
      "info qty price";
    gap: 1rem;
    flex-grow: 1;
    height: 100%;
  }

  &__info {
    grid-area: info;
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
    grid-area: qty;
    width: fit-content;
    align-self: end;

    position: relative;

    .qty-input-wrapper {
      display: flex;
      height: $qtySize;

      .item__qty-input {
        display: block;
        width: $qtySize;
        height: $qtySize;
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

      &[disabled] {
        color: $dark;
        pointer-events: none;
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

    .qty__qty-label {
      color: $dark;
      font-size: 0.9rem;

      span {
        color: black;
      }
    }
  }

  &__price {
    grid-area: price;
    display: flex;
    justify-content: flex-end;
    align-items: center;
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
          height: $qtySize;

        }
      }

      .qty__minus-btn,
      .qty__plus-btn {
        width: $qtySize;
      }
    }
  }
}

@media (max-width: 500px) {
  .item {
    &__desc {
      gap: 0.5rem;
      grid-template-rows: 1fr 1fr 20px 40px;
      grid-template-columns: 1fr 1fr;
      grid-template-areas:
        "title title"
        "info info"
        "price price"
        "qty delete";
    }

    &__image {
      align-self: flex-start;
    }

    &__delete-btn {
      align-self: center;
      font-size: 0.9rem;
      font-weight: 500;
    }

    &__price {
      flex-direction: row-reverse;
      justify-self: end;
    }

    &__qty {
      display: flex;
      align-items: center;
      margin-left: -120px;

      .qty__price-per-item {
        text-align: left;
        display: block;
        position: relative;
        margin: 0 0 0 8px;
      }
    }

  }
}
</style>
