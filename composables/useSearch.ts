import useSupabase from '~/composables/useSupabase'

const { supabase } = useSupabase()
const useSearch = () => {
  const findByQuery = async (query) => {
    // find products matches based on title (title contains query)
    const { data: matchedByTitle } = await supabase
      .from('goods')
      .select('pk_id, title, old_price, final_price, netlify_name, model, color,' +
        ' orders')
      .ilike('title', `%${query}%`)

    // find products matches based on fts vector
    const { data: matchedByFts } = await supabase
      .from('goods')
      .select('pk_id, title, old_price, final_price, netlify_name, model, color,' +
        ' orders')
      .textSearch('title', query, { config: 'russian', type: 'websearch' })

    // concat results and remove duplicates
    const res = matchedByFts.concat(matchedByTitle).filter((value, index, arr) =>
      index === arr.findIndex(temp =>
        temp.pk_id === value.pk_id
      )
    )
    return res
  }
  return {
    findByQuery
  }
}

export default useSearch
