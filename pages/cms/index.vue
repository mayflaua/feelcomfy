<template>
  <div class="cms">
    <div class="cms__buttons">
      <UIButton
        value="Добавить товар"
        path=""
        class="cms__btn"
        @click.prevent="addGoodBtnClicked = !addGoodBtnClicked"
      />
      <UIButton
        value="Загрузить все товары"
        path=""
        class="cms__btn"
        @click.prevent="loadAllGoods"
      />
    </div>
    <CmsAddGood v-if="addGoodBtnClicked" />
    <p class="loading-state">{{ loadingState }}</p>
    <div class="items">
      <CmsItem :info="item" v-for="item in loadedGoods.data" :key="item.id" />
    </div>
  </div>
</template>

<script setup lang="ts">
const { supabase: db } = useSupabase();
let loadedGoods = ref({ data: [] });
const loadAllGoods = async () => {
  loadingState.value = "Загрузка";
  loadedGoods.value = await db.from("goods").select("*");
  loadingState.value = null;
};
const loadingState = ref(null);
const addGoodBtnClicked = ref(false);
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
    grid-template-columns: repeat(5, 1fr);
    grid-row-gap: 30px;
    grid-column-gap: 20px;
    justify-items: center;

    @media (max-width: 1500px) {
      grid-template-columns: repeat(4, 1fr);
    }
    @media (max-width: 1300px) {
      grid-template-columns: repeat(3, 1fr);
      grid-column-gap: 10px;
    }
    @media (max-width: 800px) {
      grid-template-columns: repeat(2, 1fr);
    }
  }
}
</style>
