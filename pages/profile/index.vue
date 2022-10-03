<template />
<script setup>
const { user } = useAuth()
if (user) {
  await navigateTo('/profile/orders')
} else {
  await navigateTo('/')
}
</script>
<style>
a {

}
</style>
