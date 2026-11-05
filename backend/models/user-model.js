import { supabase } from '../supabaseClient.js'; // Ajustá la ruta si hace falta

class UserModel {
  static async savePasswordResetToken(userId, token, expiration) {
    const { data, error } = await supabase
      .from('users')
      .update({ reset_token: token, reset_token_expiration: expiration })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async createUser(name, email, password, location) {
    const { data, error } = await supabase
      .from('users')
      .insert([{ name, email, password, location: location || null }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async findByResetToken(token) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('reset_token', token)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data;
  }

  static async clearResetToken(userId) {
    const { data, error } = await supabase
      .from('users')
      .update({ reset_token: null, reset_token_expiration: null })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getAllUsers() {
    const { data, error } = await supabase
      .from('users')
      .select('*');

    if (error) throw error;
    return data;
  }

  static async getUserById(id) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data;
  }

  static async getUserByEmail(email) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data;
  }

  static async updateUser(id, fieldsToUpdate) {
    const { data, error } = await supabase
      .from('users')
      .update(fieldsToUpdate)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data;
  }

  static async updatePassword(userId, hashedPassword) {
    const { data, error } = await supabase
      .from('users')
      .update({ password: hashedPassword })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteUser(id) {
    const { data, error } = await supabase
      .from('users')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data;
  }
}

export default UserModel;
