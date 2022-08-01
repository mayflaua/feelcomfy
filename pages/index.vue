<template>
  <div class="cards">
    <div class="card" v-for="item in 10" :key="item">{{ item }}</div>
  </div>
</template>

<style scoped>

.cards {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}

.card {
  width: 250px;
  height: 350px;
  margin: 50px;
  background: #eee;
}

</style>