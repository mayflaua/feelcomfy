export default defineNuxtRouteMiddleware(async (to) => {
  const categories = await $fetch('/api/categories')
  const name = to.params.name
  if (!categories.some(i => i.name === name)) {
    return navigateTo('/')
  }
})
