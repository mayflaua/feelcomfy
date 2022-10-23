<template>
  <div class="admin-info-page">
    <p class="admin-info-page__title">
      FeelComfy Admin Panel
    </p>
    <div class="info-block">
      <div class="total-products">
        Всего продуктов: {{ totalProducts }}
      </div>
    </div>
  </div>
</template>

<script setup>
import useSupabase from '@/composables/useSupabase'

const { supabase } = useSupabase()

const { count: totalProducts } = await supabase.from('goods').select('pk_id', { count: 'exact' })

</script>

<style lang="scss" scoped>
.admin-info-page {
  &__title {
    font-size: 1.4rem;
    font-weight: 600;
  }

  .info-block {
    .total-products {
      font-size: 1.3rem;
      font-weight: 500;
    }
  }
}
</style>
