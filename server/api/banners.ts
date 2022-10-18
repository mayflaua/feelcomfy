export default defineEventHandler(() => {
  const banners = [
    {
      path: '/search?q=Монитор+Xiaomi',
      alt: 'Баннер Xiaomi monitors',
      image: 'banners/mi-monitor.jpg'
    },
    {
      path: '/search?q=Беспроводная+Мышь',
      alt: 'Баннер беспроводные мыши',
      image: 'banners/wireless-mouse.jpg'
    },
    {
      path: '/search?q=Кресло',
      alt: 'Баннер игровые кресла',
      image: 'banners/chairs.jpg'
    }
  ]
  return banners
})
