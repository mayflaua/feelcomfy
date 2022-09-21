<template>
  <div class="radio" :class="getClass"></div>
</template>
<script setup>
const props = defineProps({
  selected: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const getClass = computed(() => {
  if ((props.selected && props.disabled) || props.disabled) {
    return "radio--disabled";
  } else if (props.selected) {
    return "radio--selected";
  } else {
    return "";
  }
});
</script>

<style lang="scss" scoped>
.radio {
  width: 20px;
  height: 20px;
  border: 2px solid $dark;
  border-radius: 50%;
  cursor: pointer;
  position: relative;

  &::before {
    content: "";
    visibility: hidden;
    position: absolute;
    width: 12px;
    height: 12px;
    top: 2px;
    left: 2px;
    background-color: $blue;
    border-radius: 50%;
  }
  &--selected {
    border-color: $blue;

    &::before {
      visibility: visible;
    }
  }
  &--disabled {
    border-color: $dark;
    pointer-events: none;

    &::before {
      visibility: visible;
      background-color: $dark;
    }
  }
}
</style>
