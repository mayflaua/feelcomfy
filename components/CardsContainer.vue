<template>
  <div :class="{'cards-container--shortened': shorten, 'cards-container--extended': extended}" class="cards-container">
    <slot />
  </div>
</template>

<script lang="ts" setup>

defineProps<{
  shorten?: boolean
  extended?: boolean
}>()

</script>

<style lang="scss" scoped>
.cards-container {
  max-width: 100%;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-row-gap: 1.5rem;
  grid-column-gap: 1rem;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 500px) {
    grid-template-columns: 1fr 1fr;
  }

  &--extended {
    grid-template-columns: 1fr;
    grid-auto-rows: 15rem;

    @media (max-width: 400px) {
      grid-template-columns: 1fr 1fr;
      grid-auto-rows: auto;
    }
  }

  &--shortened {
    grid-template-columns: repeat(4, 1fr);

    @media (max-width: 1100px) {
      grid-template-columns: repeat(3, 1fr);
    }

    @media (max-width: 1000px) {
      grid-template-columns: 1fr 1fr;
    }

    @media (max-width: 768px) {
      grid-template-columns: repeat(3, 1fr);
    }
    @media (max-width: 560px) {
      grid-template-columns: 1fr 1fr;
    }
  }
}
</style>
