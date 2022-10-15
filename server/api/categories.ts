export default defineEventHandler(() => {
  const categoriesList = [
    {
      categoryID: 1,
      name: 'mouse',
      title: 'Мыши',
      link: ''
    },
    {
      categoryID: 2,
      name: 'keyboards',
      title: 'Клавиатуры',
      link: ''
    },
    {
      categoryID: 3,
      name: 'chairs',
      title: 'Кресла',
      link: ''
    },
    {
      categoryID: 4,
      name: 'tables',
      title: 'Столы',
      link: ''
    },
    {
      categoryID: 5,
      name: 'monitors',
      title: 'Мониторы',
      link: ''
    },
    {
      categoryID: 6,
      name: 'merch',
      title: 'Мерч',
      link: ''
    },
    {
      categoryID: 7,
      name: 'accessories',
      title: 'Аксессуары',
      link: ''
    }

  ]
  return categoriesList
})
