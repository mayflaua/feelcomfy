export default defineNuxtRouteMiddleware((to, from) => {
  if (to.query.referrer !== "order") {
    return navigateTo("/")
  }
});
