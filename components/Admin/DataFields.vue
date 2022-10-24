<template>
  <div class="data-fields">
    <p class="data-fields__title">
      Дополнительная информация
    </p>

    <div v-for="(field, i) in fields" :key="i" class="data-field">
      <button class="delete-btn" @click="deleteField(i)">
        x
      </button>
      <span class="data-field__label">Поле:</span>
      <input v-model="field[0]" class="data-field__label-input" type="text" ui-input>
      <span class="data-field__value">Значение: </span>
      <input v-model="field[1]" class="data-field__value-input" type="text" ui-input>
    </div>

    <button class="add-btn" @click="addField">
      +
    </button>
  </div>
</template>

<script setup>
const fields = ref([])

const emit = defineEmits(['changed'])
const addField = () => {
  fields.value.push([])
}

const deleteField = (field) => {
  fields.value.splice(field, 1)
}

const obj = computed(() => {
  return Object.fromEntries(fields.value)
})

watch(fields.value, () => {
  emit('changed', obj.value)
})

</script>

<style lang="scss" scoped>
.data-fields {
  display: flex;
  gap: 0.4rem;
  flex-direction: column;

  &__title {
    font-size: 1.2rem;
  }

  .delete-btn {
    width: 30px;
    height: 30px;
    border-radius: 15px;
    cursor: pointer;
    outline: none;
    background: $light;
    border: 1px solid $default;
    box-shadow: 1px 1px 6px rgba(black, 0.2);
  }

  .add-btn {
    width: 60px;
    height: 30px;
    border-radius: 15px;
    cursor: pointer;
    outline: none;
    background: $light;
    border: 1px solid $default;
    box-shadow: 1px 1px 6px rgba(black, 0.2);
  }

  .data-field {
    display: grid;
    align-items: center;
    font-weight: 500;
    gap: 0.5rem;
    grid-template-columns: 30px 60px 0.5fr 80px 1fr;
    grid-template-rows: 1fr;
  }
}
</style>
