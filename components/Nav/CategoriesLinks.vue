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
const categoriesList = [
  {
    name: 'mouse',
    title: 'Мыши',
    link: ''
  },
  {
    name: 'keyboards',
    title: 'Клавиатуры',
    link: ''
  },
  {
    name: 'chairs',
    title: 'Кресла',
    link: ''
  },
  {
    name: 'tables',
    title: 'Столы',
    link: ''
  },
  {
    name: 'monitors',
    title: 'Мониторы',
    link: ''
  },
  {
    name: 'merch',
    title: 'Мерч',
    link: ''
  }
]

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
