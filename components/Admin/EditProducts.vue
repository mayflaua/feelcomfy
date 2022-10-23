<template>
  <div class="admin-edit-products">
    <p class="admin-edit-products__title">
      Редактировать товары
    </p>
    <div class="filters">
      <input v-model="filterInput" class="query-filter" placeholder="Поиск по названию" type="text" ui-input>
    </div>
    <div class="products">
      <AdminProductCard
        v-for="product in filteredProducts"
        :key="product.pk_id"
        :category="ProductCategory[product.category_id]"
        :product="product"
      />
    </div>
  </div>
</template>

<script setup>
import useSupabase from '@/composables/useSupabase'

const { supabase } = useSupabase()

const ProductCategory = {
  1: 'Мышь',
  2: 'Клавиатура',
  3: 'Кресло',
  4: 'Стол',
  5: 'Монитор',
  6: 'Мерч',
  7: 'Аксессуар'
}

const filterInput = ref('')

const { data: products } = await supabase.from('goods').select()
const filteredProducts = computed(() => {
  return products.filter(i => i.title.includes(filterInput.value))
})
</script>

<style lang="scss" scoped>
.admin-edit-products {

  &__title {
    font-size: 1.4rem;
    font-weight: 500;
  }

  .filters {
    margin: 0 0 20px 0;
  }

  .products {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
}
</style>
