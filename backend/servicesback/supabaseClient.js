import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config(); // Cargar las variables de entorno

// Reemplazá estos valores con los de tu proyecto en Supabase desde las variables de entorno
const supabaseUrl = process.env.SUPABASE_URL; // Asegúrate de que esta variable esté en tu .env
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY; // Asegúrate de que esta variable esté en tu .env

// Inicializa el cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
