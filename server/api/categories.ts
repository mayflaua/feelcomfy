export default defineEventHandler(() => {
  const categoriesList = [
    {
      categoryID: 1,
      name: 'mouse',
      title: 'Мыши',
      link: '/category/mouse'
    },
    {
      categoryID: 2,
      name: 'keyboards',
      title: 'Клавиатуры',
      link: '/category/keyboards'
    },
    {
      categoryID: 3,
      name: 'chairs',
      title: 'Кресла',
      link: '/category/chairs'
    },
    {
      categoryID: 4,
      name: 'tables',
      title: 'Столы',
      link: '/category/tables'
    },
    {
      categoryID: 5,
      name: 'monitors',
      title: 'Мониторы',
      link: '/category/monitors'
    },
    {
      categoryID: 6,
      name: 'merch',
      title: 'Мерч',
      link: '/category/merch'
    },
    {
      categoryID: 7,
      name: 'accessories',
      title: 'Аксессуары',
      link: '/category/accessories'
    },
    {
      filter: 'POPULAR',
      name: 'popular',
      title: 'Популярное',
      link: '/category/popular'
    }

  ]
  return categoriesList
})
