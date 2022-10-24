<template>
  <div ref="target">
    <slot />
  </div>
</template>

<script setup>

const props = defineProps({
  onIntersect: {
    type: Function,
    required: true
  },

  margin: {
    type: Number,
    default: 0
  },

  once: {
    type: Boolean,
    default: false
  }
})

const target = ref(null)

onMounted(() => {
  const options = {
    rootMargin: `${props.margin}px`
  }

  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      props.onIntersect()

      if (props.once) {
        observer.disconnect()
      }
    }
  }, options)

  observer.observe(target.value)

  onBeforeUnmount(() => {
    observer.disconnect()
  })
})

</script>
