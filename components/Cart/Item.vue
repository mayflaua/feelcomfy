<template>
  <div class="item">
    <slot></slot>
    <img class="item__image" :src="itemInfo.url" />
    <div class="item__desc">
      <div class="item__head">
        <div class="item__name">{{ itemInfo.title }}</div>
        <button class="item__delete-btn" @click.prevent="handleDeleteButton">
          Удалить
        </button>
      </div>
      <div class="item__body">
        <div class="item__info" v-if="itemInfo.info">
          <p class="item__color" v-if="itemInfo.info.color">
            Цвет: <span>{{ itemInfo.info.color }}</span>
          </p>
          <p class="item__model" v-if="itemInfo.info.model">
            Модель: <span>{{ itemInfo.info.model }}</span>
          </p>
        </div>
        <div class="item__qty">
          <div class="qty-input-wrapper">
            <input
              type="number"
              class="item__qty-input"
              min="1"
              v-model="itemInfo.qty"
            />
            <button
              :disabled="itemInfo.qty == 1"
              class="qty__minus-btn"
              @click="itemInfo.qty > 1 ? handleChangeQuantity(-1) : null"
            >
              -
            </button>
            <button class="qty__plus-btn" @click="handleChangeQuantity(1)">
              +
            </button>
          </div>
          <p class="qty__price-per-item" v-show="itemInfo.qty > 1">
            {{ formatter.format(itemInfo.price.final) }}/ед.
          </p>
        </div>
        <div class="item__price">
          <div class="price__old" v-if="itemInfo.price.old">
            {{ formatter.format(itemInfo.price.old * itemInfo.qty) }}
          </div>
          <div class="price__final">
            {{ formatter.format(itemInfo.price.final * itemInfo.qty) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from "~/stores/cart";
const cartStore = useCartStore();

interface CartItem {
  readonly id: Number;
  title: String;
  url: string;
  qty: number;
  price: {
    old?: number;
    final: number;
  };
  info?: {
    model?: String;
    color?: String;
  };
}
const props = defineProps<{
  itemInfo: CartItem;
}>();
const emit = defineEmits(["delete"]);

const formatter = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  maximumFractionDigits: 0,
});

const handleDeleteButton = async () => {
  try {
    await cartStore.removeFromCart(props.itemInfo.id);
    emit("delete", props.itemInfo.id);
  } catch (err) {
    throw err;
  }
};

const handleChangeQuantity = async (value: number) => {
  try {
    props.itemInfo.qty += value;
    await cartStore.changeQuantity(props.itemInfo.id, value);
  } catch (err) {
    throw err;
  }
};
</script>

<style lang="scss" scoped>
@import "~/assets/style/main.scss";

$img: 100px;
$gap: 20px;
$padding: 10px;
$height: 150px;
$qtySize: 40px;

.item {
  height: $height - $padding * 2;
  width: 100%;
  padding: $padding $padding 20px $padding;
  gap: $gap;

  display: flex;
  justify-content: flex-start;

  &__image {
    height: $img;
    width: $img;
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
        appearance: text-field;
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
    height: 170px;
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
