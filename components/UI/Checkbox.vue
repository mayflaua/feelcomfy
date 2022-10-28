<template>
  <div class="checkbox-wrapper" @click="model = !model">
    <input
      v-model="model"
      :class="{'checkbox--checked': model}"
      :value="modelValue"
      class="checkbox"
      type="checkbox"
    >
    <slot />
  </div>
</template>

<script lang="ts" setup>

import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  value: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'changed'])

const model = computed({
  get () {
    return props.modelValue
  },
  set (value) {
    emit('update:modelValue', value)
  }
})
</script>

<style lang="scss" scoped>
.checkbox {
  width: 16px;
  height: 16px;
  min-width: 16px;
  min-height: 16px;
  position: relative;

  &-wrapper {
    display: flex;
    gap: 0.6rem;
    cursor: pointer;
  }

  &:checked:before,
  &--checked:before {
    background-color: $blue;
    border-color: $blue;
    background-image: url("~/assets/icons/check.webp");
    background-repeat: no-repeat;
    background-size: 100%;
    background-position: center;
  }

  &:before {
    content: "";
    cursor: pointer;
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: $bg;

    border: 1px solid $default;
    border-radius: 2px;
  }
}
</style>
