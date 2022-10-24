import { useLocalStorage } from '@vueuse/core'
import useSupabase from '~/composables/useSupabase'

const { supabase } = useSupabase()

const useRecommendations = () => {
  const storage = useLocalStorage('last-viewed', null)

  const getAllTouchedProductsStructured = async (): Promise<Number[][]> => {
    // get 3 arrays (cart, wishes, last viewed)
    const lastViewedList: Array<number> | null = JSON.parse(storage?.value) || null
    const { data } = await supabase
      .from('favorites')
      .select('favorites, carts!inner(cart)')
      .eq('user_id', supabase.auth.user().id)

    // concatenate arrays of wishes, cart and last viewed products
    const allTouchedProducts: Array<number> = [...lastViewedList, ...data[0].favorites, ...data[0].carts[0].cart.map(i => i.pk_id)]

    // structure it to sorted array of [product_id: count]
    return allTouchedProducts
      .map(value => [value, allTouchedProducts.filter(i => i === value).length])
      .sort((a, b) => b[1] - a[1])
      .filter((value, index, arr) => index === arr.findIndex(temp => temp[0] === value[0]
      ))
  }

  const getSimilarsByCategories = async (): Promise<Object[]> => {
    const touchedProducts = await getAllTouchedProductsStructured()
    // fetch all touched products
    const { data } = await supabase
      .from('goods')
      .select()
      .in('pk_id', touchedProducts.map(i => i[0]))

    // sorted array of [product: categoryRelevance]
    const productsBasedOnTouchedCategories: [object, number][] | any[] = data
      .map(a => [a, data.filter(i => i.category_id === a.category_id).length])
      .sort((a, b) => b[1] - a[1])
      .filter((value, index, arr) => index === arr.findIndex(temp => temp[0] === value[0]))

    // return products sorted by category and product_id relevance
    return productsBasedOnTouchedCategories
      .map(value => [value[0], value[1] + touchedProducts.find(i => i[0] === value[0].pk_id)[1]])
      .map(i => i[0])
  }

  return {
    getSimilarsByCategories
  }
}
export default useRecommendations
