<template>
  <div class="cms">
    <div class="cms__buttons">
      <LazyUIButton
        class="cms__btn"
        path=""
        text="Добавить товар"
        @click.prevent="addGoodBtnClicked = !addGoodBtnClicked"
      />
      <LazyUIButton
        class="cms__btn"
        path=""
        text="Загрузить все товары"
        @click.prevent="loadAllGoods"
      />
    </div>
    <LazyCmsAddGood v-if="addGoodBtnClicked" />
    <p class="loading-state">
      {{ loadingState }}
    </p>
    <div class="items">
      <LazyCmsItem v-for="item in loadedGoods.data" :key="item.id" :info="item" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import useSupabase from '@/composables/useSupabase'

useHead({
  title: 'Управление товарами'
})

definePageMeta({
  middleware: 'only-dev',
  meta: [
    { name: 'robots', content: 'none, noyaca, noarchive' }
  ]
})

const { supabase: db } = useSupabase()
const loadedGoods = ref({ data: [] })
const loadAllGoods = async () => {
  loadingState.value = 'Загрузка'
  loadedGoods.value = await
  db.from('goods').select('pk_id, category_id, title, old_price, final_price, units_in_stock, netlify_name, model, color, orders, description')
  loadingState.value = null
}
const loadingState = ref(null)
const addGoodBtnClicked = ref(false)
</script>

<style lang="scss" scoped>
.cms {
  padding: 30px;

  &__buttons {
    width: 100%;
    display: flex;
    justify-content: center;
    gap: 20px;
    margin: 0 0 50px 0;
  }

  .loading-state {
    text-align: center;
    font-size: 1.3rem;
    font-weight: 500;
  }

  .items {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-row-gap: 30px;
    grid-column-gap: 20px;
    justify-items: center;
  }
}
</style>
