<script setup>
import useAuth from '~/composables/useAuth'

const { user } = useAuth()
if (user) {
  await navigateTo('/profile/orders')
} else {
  await navigateTo('/')
}
</script>
