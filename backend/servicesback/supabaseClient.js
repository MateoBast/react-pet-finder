import { createClient } from '@supabase/supabase-js';

// Reemplazá estos valores con los de tu proyecto en Supabase
const supabaseUrl = 'https://plsbapihwuinfdevkzgp.supabase.co';
const supabaseAnonKey = 'sb_publishable_pRCXCfla2RGJUHvROGmkUg_T6XJt-ZW';

// Inicializa el cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
