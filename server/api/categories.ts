import { defineEventHandler } from 'h3'
// @ts-ignore
import type { CategoryObject } from '~/types/categories.d.ts'
// @ts-ignore
import { Filter, ProductCategory } from '~/types/categories.d.ts'

export default defineEventHandler(() => {
  const categoriesList:CategoryObject[] = [
    {
      categoryID: ProductCategory.MOUSE,
      name: 'mouse',
      title: 'Мыши',
      link: '/category/mouse'
    },
    {
      categoryID: ProductCategory.KEYBOARDS,
      name: 'keyboards',
      title: 'Клавиатуры',
      link: '/category/keyboards'
    },
    {
      categoryID: ProductCategory.CHAIRS,
      name: 'chairs',
      title: 'Кресла',
      link: '/category/chairs'
    },
    {
      categoryID: ProductCategory.TABLES,
      name: 'tables',
      title: 'Столы',
      link: '/category/tables'
    },
    {
      categoryID: ProductCategory.MONITORS,
      name: 'monitors',
      title: 'Мониторы',
      link: '/category/monitors'
    },
    {
      categoryID: ProductCategory.MERCH,
      name: 'merch',
      title: 'Мерч',
      link: '/category/merch'
    },
    {
      categoryID: ProductCategory.ACCESSORIES,
      name: 'accessories',
      title: 'Аксессуары',
      link: '/category/accessories'
    },
    {
      filter: Filter.POPULAR,
      name: 'popular',
      title: 'Популярное',
      link: '/category/popular'
    }

  ]
  return categoriesList
})
