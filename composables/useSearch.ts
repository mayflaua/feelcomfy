import useSupabase from '~/composables/useSupabase'

const { supabase } = useSupabase()
// TODO: добавить как то поиск по частичному совпадению в title к результату fts а то ищет херово
const useSearch = () => {
  const findByQuery = async (query) => {
    const { data: res } = await supabase
      .from('goods')
      .select('pk_id, title, old_price, final_price, netlify_name, model, color,' +
        ' orders')
      .textSearch('fts', query, { config: 'russian', type: 'websearch' })
    return res
  }
  return {
    findByQuery
  }
}

export default useSearch
