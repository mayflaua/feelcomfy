<template>
  <!-- TODO: product page -->
  <LazyUILoader v-if="_fetchingItem" fullscreen v2 />
  <p v-else-if="item">
    {{ item }}
  </p>
  <p v-else>
    no data
  </p>
</template>

<script setup>
import slugify from 'slugify'
import useSupabase from '@/composables/useSupabase'

const { supabase } = useSupabase()

const route = useRoute()
const item = ref(null)
const _fetchingItem = ref(true)

item.value = await supabase.from('goods').select().eq('pk_id', route.params.id)
_fetchingItem.value = false
if (item.value.data.length !== 0) {
  if (slugify(item.value?.data[0].title) !== route.params.slug[0]) {
    item.value = null
  }
}

</script>
<style lang="scss" scoped></style>
