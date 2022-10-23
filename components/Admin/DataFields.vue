<template>
  <div class="data-field">
    <span class="data-field__label">Поле:</span>
    <input class="data-field__label-input" type="text" ui-input>
    <span class="data-field__value">Значение: </span>
    <input class="data-field__value-input" type="text" ui-input>
  </div>
</template>

<script setup>
const fields = reactive({})
</script>

<style lang="scss" scoped>
.data-field {
  display: grid;
  grid-template-columns: 100px 1fr;
  grid-template-rows: 1fr 1fr;
}
</style>
