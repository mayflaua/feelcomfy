<template>
  <div v-if="!removed" class="product-card">
    <div class="short-info">
      <nuxt-img :src="`images/${product.netlify_name}`" class="img" fit="contain" height="150px" width="150" />

      <div class="product-card__info">
        <p class="title">
          {{ product.title }}
        </p>

        <p class="category">
          {{ category }} <span>(category_id: {{ product.category_id }})</span>
        </p>

        <UIButton
          :text="fullInfoVisible ? 'Скрыть всю информацию' : 'Показать всю информацию'"
          class="btn show-info-btn"
          @click="switchFullInfo"
        />
      </div>
    </div>
    <div v-show="fullInfoVisible" class="full-info">
      <p class="title">
        Полная информация
      </p>
      <p v-for="(field, i) in product" :key="i" class="field">
        <span>{{ i }}: </span>

        <select v-if="i==='category_id'" v-model="edittedProduct[i]" ui-input>
          <option v-for="(cat, index) in categories" :key="cat" :value="index + 1">
            {{ cat }} ({{ index + 1 }})
          </option>
        </select>

        <input v-else v-model="edittedProduct[i]" :disabled="i === 'pk_id'" ui-input>
      </p>

      <div v-if="reviewsLoaded" class="reviews">
        <p v-if="reviews.length !== 0" class="title">
          Отзывы
        </p>
        <p v-else class="title">
          Отзывов нет
        </p>
        <div v-if="reviews.length !== 0" class="reviews-list">
          <div class="review">
            <ProductReview v-for="review in reviews" :review="review" admin>
              <template #button>
                {{ review }}
                <UIButton
                  :loading-state="reviewRemoving"
                  class="btn delete-review-btn"
                  text="Удалить"
                  @click="deleteReview(review.review_id)"
                />
              </template>
            </ProductReview>
          </div>
        </div>
      </div>

      <UIButton
        v-else
        :loading-state="reviewsLoading"
        class="btn load-reviews-btn"
        text="Загрузить отзывы"
        @click="loadReviews"
      />

      <div class="buttons">
        <UIButton :loading-state="savingChanges" class="save-btn btn" text="Сохранить изменения" @click="saveChanges" />
        <UIButton
          :text="deleteGuard ? 'Удалить товар' : 'Точно удалить?'"
          class="delete-btn btn"
          @click="deleteGuard ? deleteGuard = false : removeProduct()"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import useSupabase from '@/composables/useSupabase'

const { supabase } = useSupabase()

const props = defineProps({
  product: Object,
  category: String
})
const categories = ['Мышь', 'Клавиатура', 'Кресло', 'Стол', 'Монитор', 'Мерч', 'Аксессуар']

const switchFullInfo = () => (fullInfoVisible.value = !fullInfoVisible.value)
const fullInfoVisible = ref(false)

const reviewsLoaded = ref(false)
const reviewsLoading = ref(false)
const reviews = ref(null)
const loadReviews = async () => {
  reviewsLoading.value = true
  const { data: res } = await supabase.from('reviews').select().eq('item_id', props.product.pk_id)
  reviewsLoaded.value = true
  reviews.value = res
  reviewsLoading.value = false
}
const reviewRemoving = ref(false)
const deleteReview = async (review_id) => {
  reviewRemoving.value = true
  await supabase.from('reviews').delete().eq('review_id', review_id)
  await loadReviews()
  reviewRemoving.value = false
}

const deleteGuard = ref(true)
const removed = ref(false)
const removeProduct = async () => {
  await supabase.from('goods').delete().eq('pk_id', props.product.pk_id)
  removed.value = true
}

const savingChanges = ref(false)
const saveChanges = async () => {
  savingChanges.value = true
  delete edittedProduct.fts
  await supabase.from('goods').update(edittedProduct).eq('pk_id', edittedProduct.pk_id)
  savingChanges.value = false
}

const edittedProduct = reactive(structuredClone(toRaw(props.product)))
</script>

<style lang="scss" scoped>

.product-card {
  min-height: 100px;
  width: 100%;
  background: $light;
  padding: 10px;
  border: 2px solid $dark;
  border-bottom-width: 6px;

  .btn {
    border-radius: 50px;
    width: max-content;
  }

  .short-info {
    display: flex;
    gap: 1rem;
  }

  .img {
    border: 1px solid $dark;
    border-radius: 20%;
  }

  &__info {
    flex-grow: 1;
    display: flex;
    flex-direction: column;

    .title {
      font-size: 1.1rem;
      font-weight: 500;
    }

    .category {
      font-size: 1.05rem;
      font-weight: 500;

      span {
        font-weight: 400;
        color: #333;
      }
    }

    .show-info-btn {
      align-self: flex-end;

    }

  }

  .full-info {

    .title {
      font-size: 1.1rem;
      font-weight: 500;
      border-bottom: 1px solid $default;
      text-indent: 1rem;
      padding-bottom: 1rem;
    }

    .field {
      display: flex;
      align-items: center;

      span {
        min-width: 150px;
      }

    }

    .buttons {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;

      .delete-btn {
        background-color: red;
      }
    }

  }
}
</style>
