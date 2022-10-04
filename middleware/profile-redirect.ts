export default defineNuxtRouteMiddleware(() => {
  return navigateTo({
    path: '/profile/orders',
    replace: true
  })
})
