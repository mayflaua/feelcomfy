import { createClient } from '@supabase/supabase-js'

const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0eHZ4amppcHRocHdmeWx1d21qIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY2MTg2NzE5MSwiZXhwIjoxOTc3NDQzMTkxfQ.4V59a5276QoGzZtCCKA1DgAdwA9CwLwelvCmYzBKPRk'

const URL = 'https://ltxvxjjipthpwfyluwmj.supabase.co'

const useSupabase = () => {
  const supabase = createClient(URL, KEY)
  return {
    supabase
  }
}

export default useSupabase
