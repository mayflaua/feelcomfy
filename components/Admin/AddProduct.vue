<template>
  <div class="add-product">
    <p class="add-product__title">
      Добавление товара
      <UIButton :text="uploadProgress" class="submit-btn" @click="handleSubmit" />
    </p>
    <div class="add-product__form">
      <div v-for="field in fields" :key="field.name" class="field">
        <p class="label">
          {{ field.label }}
        </p>
        <input
          v-if="field.type !== 'select' && field.name"
          v-model="product[field.name]"
          :type="field.type"
          ui-input
        >
        <input
          v-else-if="!field.name"
          :ref="field.ref"
          :multiple="field.multiple"
          :type="field.type"
          ui-input
          @input="field.ref ? handleUpload(field.ref) : null"
        >
        <select v-else v-model="product[field.name]" ui-input>
          <option v-for="(category, index) in categories" :key="category" :value="index + 1">
            {{ category }} ({{ index + 1 }})
          </option>
        </select>
      </div>
      <AdminDataFields @changed="e => product.additional_data = e" />
    </div>
    <div class="add-product__images">
      <p class="title">
        Изображения
      </p>
      <div class="images">
        <div v-if="imagesPreview.main" :style="{ 'background-image': `url(${imagesPreview.main})` }" class="image">
          Основное
          <div class="delete-btn" />
        </div>
        <div v-if="imagesPreview.additional.length !== 0" class="additional-images">
          <div
            v-for="(img, index) in imagesPreview.additional"
            :key="index"
            :style="{ 'background-image': `url(${img})` }"
            class="image"
          />
        </div>
      </div>
    </div>
    <pre>{{ product }}</pre>
  </div>
</template>

<script setup>
import ImageKit from 'imagekit-javascript'

const { supabase } = useSupabase()

const imagekit = new ImageKit({
  urlEndpoint: 'https://ik.imagekit.io/sweetie',
  publicKey: 'public_ztvv2RW/8vkArMlXq1pvMKKzqEM=',
  authenticationEndpoint: 'http://192.168.0.62:3000/api/ik'
})

const fields = [
  {
    label: 'Основное изображение',
    type: 'file',
    ref: 'imageInput'
  },
  {
    label: 'Доп. изображения',
    type: 'file',
    ref: 'imagesInput',
    multiple: true
  },
  {
    name: 'title',
    label: 'Название товара',
    type: 'text'
  },
  {
    name: 'category_id',
    label: 'Категория товара',
    type: 'select'
  },
  {
    name: 'old_price',
    label: 'Цена без скидки',
    type: 'number'
  },
  {
    name: 'final_price',
    label: 'Цена со скидкой',
    type: 'number'
  },
  {
    name: 'model',
    label: 'Модель',
    type: 'text'
  },
  {
    name: 'color',
    label: 'Цвет',
    type: 'text'
  },
  {
    name: 'units_in_stock',
    label: 'Штук в наличии',
    type: 'number'
  },
  {
    name: 'description',
    label: 'Описание',
    type: 'text'
  }

]

const categories = ['Мышь', 'Клавиатура', 'Кресло', 'Стол', 'Монитор', 'Мерч', 'Аксессуар']

const product = reactive({})

const imageInput = ref(null)
const imagesInput = ref(null)

const uploadProgress = ref('Добавить')

const imagesStore = {
  main: null,
  additional: []
}

const imagesPreview = reactive({
  main: null,
  additional: []
})

const handleUpload = (ref) => {
  const files = ref === 'imageInput'
    ? imageInput.value[0].files
    : imagesInput.value[0].files

  for (const file of files) {
    // store files for uploading to imagekit
    ref === 'imageInput'
      ? imagesStore.main = file
      : imagesStore.additional.push(file)

    // store images previews
    const reader = new FileReader()
    reader.onload = (e) => {
      ref === 'imageInput'
        ? imagesPreview.main = e.target.result
        : imagesPreview.additional.push(e.target.result)
    }
    reader.readAsDataURL(file)
  }
}

const uploadImages = async () => {
  uploadProgress.value = 'Загрузка основного изображения'
  const mainImage = imagesStore.main
  await imagekit.upload({
    file: mainImage,
    fileName: mainImage.name,
    useUniqueFileName: false,
    folder: 'images'
  })
  product.netlify_name = mainImage.name

  const additionalImages = imagesStore.additional
  let counter = 1
  for (const image of additionalImages) {
    uploadProgress.value = `Загрузка дополнительных изображений (${counter}/${additionalImages.length})`
    await imagekit.upload({
      file: image,
      fileName: image.name,
      useUniqueFileName: false,
      folder: 'images'
    })
    if (!product.netlify_images) {
      product.netlify_images = []
    }
    product.netlify_images.push(image.name)
    counter++
  }
}

const handleSubmit = async () => {
  await uploadImages()
  uploadProgress.value = 'Добавление товара'
  await supabase.from('goods').insert(product)
  uploadProgress.value = 'Добавить'
  for (const [key] of Object.entries(product)) {
    product[key] = null
  }
  imagesStore.main = null
  imagesPreview.main = null
  imagesStore.additional = []
  imagesPreview.additional = []
}

</script>

<style lang="scss" scoped>
.add-product {

  &__title {
    font-size: 1.4rem;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .submit-btn {
      width: max-content;
      border-radius: 25px;
    }
  }

  &__form {

    .field {
      display: flex;
      align-items: center;
      width: 100%;

      .label {
        width: 11rem;
      }
    }
  }

  &__images {
    .title {
      font-size: 1.4rem;
      font-weight: 500;
      margin: 40px 0 20px 0;
    }

    .images {
      display: flex;
      gap: 1.4rem;

      .additional-images {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
      }

      .image {
        position: relative;
        width: 200px;
        height: 200px;
        background-size: 90%;
        border: 1px solid $default;
        background-repeat: no-repeat;
        background-position: center;
        text-align: center;
        font-size: 1.1rem;
        font-weight: 600;
      }
    }
  }

}
</style>
