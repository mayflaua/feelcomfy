<template>
  <div :class="!sending || 'item--disabled'" class="item">
    <img
      :src="`https://ik.imagekit.io/sweetie/images/${itemToAdd.netlify_name}`"
      alt="Изображение"
      class="item__image"
    >
    <div class="item__title">
      title:
      <input v-model="itemToAdd.title" class="input" ui-input>
    </div>
    <div class="item__category_id">
      category_id:
      <select v-model="itemToAdd.category_id" class="input" ui-input>
        <option selected value="1">
          мышь
        </option>
        <option value="2">
          клава
        </option>
        <option value="3">
          кресло
        </option>
        <option value="4">
          стол
        </option>
        <option value="5">
          монитор
        </option>
        <option value="6">
          мерч
        </option>
      </select>
    </div>
    <div class="item__old_price">
      old_price:
      <input v-model="itemToAdd.old_price" class="input" ui-input>
    </div>
    <div class="item__final_price">
      final_price:
      <input v-model="itemToAdd.final_price" class="input" ui-input>
    </div>
    <div class="item__units_in_stock">
      units_in_stock:
      <input v-model="itemToAdd.units_in_stock" class="input" ui-input>
    </div>
    <div class="item__image_url">
      image:
      <input
        ref="fullImage"
        class="input"
        type="file"
        ui-input
        @change="handleImageUpload"
      >
    </div>
    <div class="item__model">
      model:
      <input v-model="itemToAdd.model" class="input" ui-input>
    </div>
    <div class="item__color">
      color:
      <input v-model="itemToAdd.color" class="input" ui-input>
    </div>
    <div class="item__orders">
      orders:
      <input v-model="itemToAdd.orders" class="input" ui-input>
    </div>
    <div class="item__orders">
      desc:
      <input v-model="itemToAdd.description" class="input" ui-input>
    </div>
    <UIButton
      :text="sending ? 'Отправка' : 'Добавить'"
      class="submit-btn"
      path=""
      @click.prevent="handleAddButtonClick"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ImageKit from 'imagekit-javascript'
import useSupabase from '@/composables/useSupabase'

const { supabase: db } = useSupabase()

const sending = ref(false)
const handleAddButtonClick = async () => {
  sending.value = true
  await db.from('goods').insert(itemToAdd.value)
  sending.value = false

  itemToAdd.value.category_id = 0
  itemToAdd.value.title = ''
  itemToAdd.value.old_price = null
  itemToAdd.value.final_price = 0
  itemToAdd.value.units_in_stock = 0
  itemToAdd.value.netlify_name = ''
  itemToAdd.value.model = null
  itemToAdd.value.color = ''
  itemToAdd.value.orders = 0
}

const itemToAdd = ref({
  category_id: 0,
  title: '',
  old_price: null,
  final_price: 0,
  units_in_stock: 0,
  netlify_name: '',
  model: null,
  color: '',
  orders: 0
})

const imagekit = new ImageKit({
  urlEndpoint: 'https://ik.imagekit.io/sweetie',
  publicKey: 'public_ztvv2RW/8vkArMlXq1pvMKKzqEM=',
  authenticationEndpoint: 'http://localhost:3000/api/ik'
})

const fullImage = ref(null)
const handleImageUpload = async () => {
  /* get file, upload it to storage and get its url */
  const file = fullImage.value.files[0]
  await imagekit.upload({
    file,
    fileName: file.name,
    useUniqueFileName: false,
    folder: 'images'
  })
  itemToAdd.value.netlify_name = file.name
}
</script>

<style lang="scss" scoped>
.item {
  &--disabled {
    opacity: 0.7;
    pointer-events: none;
    position: relative;
  }

  border: 2px solid $blue;
  border-radius: 9px;

  width: 27rem;
  padding: 10px;
  margin: 0 0 30px 0;
  font-size: 1.2rem;

  display: flex;
  flex-direction: column;
  gap: 1rem;

  &__img,
  &__title,
  &__category_id,
  &__old_price,
  &__final_price,
  &__units_in_stock,
  &__image_url,
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
      width: 100px;
    }
  }

  .submit-btn {
    grid-area: btn;
    display: block;
  }

  &__image {
    grid-area: img;
    display: block;
    width: 25rem;
    margin: 0 auto;
  }
}
</style>
