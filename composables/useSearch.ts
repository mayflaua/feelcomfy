import useSupabase from '~/composables/useSupabase'

const { supabase } = useSupabase()

const useSearch = () => {
  const findByQuery = async (query) => {
    const { data: res } = await supabase
      .from('goods')
      .select('pk_id, title, old_price, final_price, image_url, model, color,' +
        ' orders')
      .textSearch('fts', query, { config: 'russian', type: 'websearch' })
    return res
  }
  return {
    findByQuery
  }
}

export default useSearch
