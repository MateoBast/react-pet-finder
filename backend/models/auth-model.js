import { supabase } from '../servicesback/supabaseClient.js'; // Ajustá la ruta si hace falta

const login = async (email, password) => {
  const { user, error } = await supabase.auth.signIn({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return user; // Retorna el usuario si todo es correcto
};

export default { login };
