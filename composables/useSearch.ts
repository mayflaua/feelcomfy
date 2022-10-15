import { useLocalStorage } from '@vueuse/core'
import useSupabase from '~/composables/useSupabase'

const storage = useLocalStorage('search-history', [])
const { supabase } = useSupabase()

const MAX_SEARCH_HISTORY_SIZE = 5

const useSearch = () => {
  const findByQuery = async (query: string, limit?: number, fetch: boolean = false) => {
    // do not update search history if fetching
    if (!fetch) {
      addQueryToHistory(query)
    }

    // find products matches based on title (find titles that contains query)
    const columnsToFetch = fetch
      ? 'title'
      : 'pk_id, title, old_price, final_price, netlify_name, model, color,' +
      ' orders, reviews!left(score)'

    const { data: matchedByTitle } = await supabase
      .from('goods')
      .select(columnsToFetch)
      .ilike('title', `%${query}%`)
    // find products matches based on fts vector
    const { data: matchedByFts } = await supabase
      .from('goods')
      .select(columnsToFetch)
      .textSearch('title', query, { config: 'russian', type: 'websearch' })

    // concat results and remove duplicates
    const res = matchedByFts.concat(matchedByTitle).filter((value, index, arr) =>
      index === arr.findIndex(temp =>
        fetch ? temp.title === value.title : temp.pk_id === value.pk_id
      )
    )

    return limit ? res.slice(0, limit) : res
  }

  const fetchSuggestions = async (query: string) => {
    const result = await findByQuery(query, null, true)
    return {
      res: result.map(obj => obj.title),
      history: storage.value
    }
  }

  const addQueryToHistory = (query): string[] => {
    if (!storage.value.includes(query)) {
      storage.value.unshift(query)
      storage.value = storage.value.slice(0, MAX_SEARCH_HISTORY_SIZE)
    }
    return storage.value
  }

  return {
    findByQuery,
    fetchSuggestions
  }
}

export default useSearch
