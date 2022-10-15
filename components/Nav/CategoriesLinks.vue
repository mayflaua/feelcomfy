<template>
  <div class="categories">
    <ul class="list">
      <li v-for="item in categoriesList" :key="item.name">
        <nuxt-link :to="item.link" class="list__item">
          {{
            item.title
          }}
        </nuxt-link>
      </li>
    </ul>
  </div>
</template>

<script setup>
const categoriesList = await $fetch('/api/categories')

</script>

<style lang="scss" scoped>
.categories {
  width: 100%;
  margin: 20px 0 0 0;

  @media (max-width: 768px) {
    display: none;
  }

  .list {
    list-style: none;
    display: flex;
    justify-content: space-around;
    padding: 0;

    li {
      border-right: 1px solid $light;
      flex-grow: 1;
      text-align: center;

      &:last-child {
        border-right: none;
      }
    }

    &__item {
      text-decoration: none;
      color: $font;
      padding: 7px 15px;

      &:hover {
        border-bottom: 2px solid black;
      }
    }
  }
}

</style>
