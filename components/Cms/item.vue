<template>
  <div :class="!isEditting || 'item--highlight'" class="item">
    <img
      :src="item.image_url"
      alt="Нет изображения или битая ссылка"
      class="item__image"
    >
    <div class="item__pk_id">
      pk_id:
      <input
        v-model="item.pk_id"
        :class="isEditting || 'input--disabled'"
        class="input"
        disabled
      >
    </div>
    <div class="item__title">
      title:
      <input
        v-model="item.title"
        :class="isEditting || 'input--disabled'"
        :disabled="!isEditting"
        class="input"
      >
    </div>
    <div class="item__category_id">
      category_id:
      <input
        v-model="item.category_id"
        :class="isEditting || 'input--disabled'"
        :disabled="!isEditting"
        class="input"
      >
    </div>
    <div class="item__old_price">
      old_price:
      <input
        v-model="item.old_price"
        :class="isEditting || 'input--disabled'"
        :disabled="!isEditting"
        class="input"
      >
    </div>
    <div class="item__final_price">
      final_price:
      <input
        v-model="item.final_price"
        :class="isEditting || 'input--disabled'"
        :disabled="!isEditting"
        class="input"
      >
    </div>
    <div class="item__units_in_stock">
      units_in_stock:
      <input
        v-model="item.units_in_stock"
        :class="isEditting || 'input--disabled'"
        :disabled="!isEditting"
        class="input"
      >
    </div>
    <div class="item__image_url">
      image_url:
      <input
        v-model="item.image_url"
        :class="isEditting || 'input--disabled'"
        :disabled="!isEditting"
        class="input"
      >
    </div>
    <div class="item__thumbnail_url">
      thumbnail_url:
      <input
        v-model="item.thumbnail_url"
        :class="isEditting || 'input--disabled'"
        :disabled="!isEditting"
        class="input"
      >
    </div>
    <div class="item__model">
      model:
      <input
        v-model="item.model"
        :class="isEditting || 'input--disabled'"
        :disabled="!isEditting"
        class="input"
      >
    </div>
    <div class="item__color">
      color:
      <input
        v-model="item.color"
        :class="isEditting || 'input--disabled'"
        :disabled="!isEditting"
        class="input"
      >
    </div>
    <div class="item__orders">
      orders:
      <input
        v-model="item.orders"
        :class="isEditting || 'input--disabled'"
        :disabled="!isEditting"
        class="input"
      >
    </div>
    <UIButton
      :value="isEditting ? 'Подтвердить' : 'Редактировать'"
      class="edit-btn"
      path=""
      @click.prevent="handleEditButtonClick"
    />
    <UIButton
      v-if="!isEditting"
      class="cancel-btn"
      path=""
      value="Удалить"
      @click.prevent="handleDeleteButtonClick"
    />
    <UIButton
      v-if="isEditting"
      class="cancel-btn"
      path=""
      value="Отменить"
      @click.prevent="handleCancelButtonClick"
    />
  </div>
</template>

<script setup>
import { ref, toRaw } from 'vue'
import useSupabase from '@/composables/useSupabase'

const { supabase: db } = useSupabase()
// interface ItemProps {
//   readonly pk_id: number;
//   category_id: number;
//   title: string;
//   old_price: number;
//   final_price: number;
//   units_in_stock: number;
//   image_url: string;
//   thumbnail_url: string;
//   model?: string;
//   color: string;
//   orders: number;
// }
const itemProps = defineProps({
  info: {
    type: Object,
    required: true
  }
})
const item = ref(structuredClone(toRaw(itemProps.info)))
const isEditting = ref(false)

let prevValues

const handleEditButtonClick = async () => {
  if (isEditting.value) {
    /* handle edit confirmation and update db */
    await db
      .from('goods')
      .update({ ...itemProps.info }, { returning: 'minimal' })
      .eq('pk_id', itemProps.info.pk_id)
  } else {
    prevValues = structuredClone(toRaw(item.value))
  }

  isEditting.value = !isEditting.value
}

const handleCancelButtonClick = () => {
  item.value = structuredClone(toRaw(prevValues))
  prevValues = {}
  isEditting.value = false
}

const handleDeleteButtonClick = async () => {
  await db
    .from('goods')
    .delete({ returning: 'minimal' })
    .eq('pk_id', item.value.pk_id)
}
</script>

<style lang="scss" scoped>
.item {
  &--highlight {
    border-color: $blue;
  }

  width: 400px;
  border: 2px solid $default;
  border-radius: 9px;
  padding: 10px;
  font-size: 1.2rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 5px;

  &__image {
    width: 90%;
    align-self: center;
  }

  &__pk_id,
  &__title,
  &__category_id,
  &__old_price,
  &__final_price,
  &__units_in_stock,
  &__image_url,
  &__thumbnail_url,
  &__model,
  &__color,
  &__orders {
    display: flex;
    justify-content: space-between;
    font-weight: 500;

    .input {
      display: inline-block;
      text-align: right;
      font-weight: 400;
      border: none;

      &--disabled {
        background: none;
        outline: none;
        border: none;
      }
    }
  }
}
</style>
