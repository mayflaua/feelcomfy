export default defineEventHandler(() => {
  const provider = 'imagekit_banners'

  const banners = [
    {
      path: '/search?q=Монитор+Xiaomi',
      alt: 'Баннер Xiaomi monitors',
      image: 'mi-monitor.jpg'
    },
    {
      path: '/search?q=Беспроводная+Мышь',
      alt: 'Баннер беспроводные мыши',
      image: 'wireless-mouse.jpg'
    }
  ]

  banners.map(i => (i.provider = provider))

  return banners
})
