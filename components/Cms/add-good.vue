<template>
  <div class="item" :class="!sending || 'item--disabled'">
    <img class="item__image" :src="itemToAdd.image_url" alt="Изображение" />

    <div class="item__title">
      title:
      <input v-model="itemToAdd.title" class="input" />
    </div>
    <div class="item__category_id">
      category_id:
      <select v-model="itemToAdd.category_id" class="input">
        <option value="1" selected>мышь</option>
        <option value="2">клава</option>
        <option value="3">кресло</option>
        <option value="4">стол</option>
        <option value="5">монитор</option>
        <option value="6">мерч</option>
      </select>
    </div>
    <div class="item__old_price">
      old_price:
      <input v-model="itemToAdd.old_price" class="input" />
    </div>
    <div class="item__final_price">
      final_price:
      <input v-model="itemToAdd.final_price" class="input" />
    </div>
    <div class="item__units_in_stock">
      units_in_stock:
      <input v-model="itemToAdd.units_in_stock" class="input" />
    </div>
    <div class="item__image_url">
      image_url:
      <input
        class="input"
        ref="fullImage"
        type="file"
        @change="handleImageUpload"
      />
    </div>
    <div class="item__thumbnail_url">
      thumbnail_url:
      <input v-model="itemToAdd.thumbnail_url" class="input" />
    </div>
    <div class="item__model">
      model:
      <input v-model="itemToAdd.model" class="input" />
    </div>
    <div class="item__color">
      color:
      <input v-model="itemToAdd.color" class="input" />
    </div>
    <div class="item__orders">
      orders:
      <input v-model="itemToAdd.orders" class="input" />
    </div>
    <UIButton
      :value="sending ? 'Отправка' : 'Добавить'"
      path=""
      class="submit-btn"
      @click.prevent="handleAddButtonClick"
    />
  </div>
</template>

<script setup lang="ts">
const { supabase: db } = useSupabase();
import { Image } from "image-js";

const sending = ref(false);
const handleAddButtonClick = async () => {
  sending.value = true;
  await db.from("goods").insert(itemToAdd.value);
  sending.value = false;
};

const itemToAdd = ref({
  category_id: 0,
  title: "",
  old_price: null,
  final_price: 0,
  units_in_stock: 0,
  image_url: "",
  thumbnail_url: "",
  model: null,
  color: "",
  orders: 0,
});

const fullImage = ref(null);
const handleImageUpload = async () => {
  /* get file, upload it to storage and get its url */
  const file = fullImage.value.files[0];
  await db.storage.from("images").upload(`full/${file.name}`, file);
  const { publicURL: url } = db.storage
    .from("images")
    .getPublicUrl(`full/${file.name}`);

  /* make thumbnail */
  let image = await Image.load(url);
  let thumb = image
    .resize({ width: 150 })
    .toBlob("image/jpeg")
    .then(
      async (blob) =>
        /* then upload it to storage */
        await db.storage.from("images").upload(`thumb/${file.name}`, blob)
    );
  /* and get thumbnail url */
  const { publicURL: thumbnailUrl } = db.storage
    .from("images")
    .getPublicUrl(`thumb/${file.name}`);
  /* push urls to form */
  itemToAdd.value.image_url = url;
  itemToAdd.value.thumbnail_url = thumbnailUrl;
};
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
  padding: 10px;
  margin: 0 0 30px 0;
  font-size: 1.2rem;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 20px 10px;
  grid-template-areas:
    "img . . . . ."
    "img . . . . ."
    "btn btn btn btn btn btn";

  &__img,
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
    height: 100px;
  }
}
</style>
