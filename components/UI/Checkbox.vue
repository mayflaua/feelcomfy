<template>
  <input
    type="checkbox"
    class="checkbox"
    v-model="val"
    @change="$emit('changed', val)"
  />
</template>

<script setup>
const props = defineProps({
  defaultValue: {
    type: Boolean,
    default: true,
  },
});
const val = ref(props.defaultValue);
</script>

<style lang="scss" scoped>
.checkbox {
  width: 16px;
  height: 16px;
  position: relative;

  &:checked:before {
    background-color: $blue;
    border-color: $blue;
    background-image: url("~/assets/icons/check.png");
    background-repeat: no-repeat;
    background-size: 90%;
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
