<template>
  <div class="adder">
    <input type="text" placeholder="название" v-model="title" class="title" />
    <input
      type="number"
      placeholder="цена старая (если скидка)"
      v-model="price_old"
    />
    <input type="number" placeholder="цена финальная" v-model="price_final" />

    <select v-model="categoryId" class="categoryId">
      <option value="1">мышь</option>
      <option value="2">клава</option>
      <option value="3">кресло</option>
      <option value="4">стол</option>
      <option value="5">монитор</option>
      <option value="6">мерч</option>
    </select>
    <input type="text" placeholder="URL" class="url" v-model="url" />
    <input
      type="text"
      placeholder="thumbnail URL"
      class="urlt"
      v-model="thumbnailUrl"
    />
    <input type="text" placeholder="цвет (если есть)" v-model="color" />
    <input type="text" placeholder="модель (если есть)" v-model="model" />
    <input type="number" placeholder="наличие в штуках" v-model="instock" />

    <p class="loading" v-if="loading">LOADING</p>
    <button class="btn" v-else @click="add">добавить</button>
    <button class="btn" @click="show">смотреть все</button>
    <pre><code>{{ items.data }}</code></pre>
  </div>
</template>

<script setup lang="ts">
const { supabase: s } = useSupabase();
const rand = () => {
  return Math.floor(Math.random() * 100);
};
const loading = ref(false);

const title = ref("");
const price_old = ref(null);
const price_final = ref(0);
const categoryId = ref(1);
const url = ref("");
const thumbnailUrl = ref(null);
const model = ref(null);
const color = ref(null);
const instock = ref(23);

let items = ref(s.from("goods").select("*"));

const add = async () => {
  loading.value = true;
  await s.from("goods").insert({
    category_id: categoryId.value,
    title: title.value,
    old_price: price_old.value,
    final_price: price_final.value,
    image_url: url.value,
    thumbnail_url: thumbnailUrl.value,
    model: model.value,
    color: color.value,
    units_in_stock: instock.value,
  });

  categoryId.value = 1;
  title.value = "";
  price_old.value = null;
  price_final.value = 0;
  url.value = "";
  thumbnailUrl.value = null;
  model.value = null;
  color.value = null;
  instock.value = rand();
  loading.value = false;
};

const show = async () => {
  items.value = await s.from("goods").select("*");
};
</script>

<style scoped>
.adder {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  background-color: #dbe2ef;
  padding-left: 50px;
}

.loading {
  text-align: center;
  font-size: 3em;
  margin: 15px 0;
}

input,
select,
textarea {
  margin: 0 auto;

  width: 500px;
  height: 50px;
  font-size: 24px;
  margin-top: 30px;
  background: #f9f7f7;
  padding: 7px 20px;
  border-radius: 2rem;
  border: 2px solid #3f72af;
}

.btn {
  width: 180px;
  height: 40px;
  margin: 30px auto;
  font-size: 22px;
  background-color: #112d4e;
  color: white;
  border: none;
  border-radius: 2rem;
  padding: 7px 20px;
  margin-bottom: 50px;
}
</style>
