import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cmiaazhkcxhzeatchekk.supabase.co';
const supabaseAnonKey = 'sb_publishable_oYGLoPBFFkfe3j4aMTiiCQ_r6pqmsnW';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
