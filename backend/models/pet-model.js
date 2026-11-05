import { supabase } from '../supabaseClient.js'; // Asegúrate de que la ruta sea correcta

class PetModel {
  static async createPet(name, status, location, imageUrl, reporterId = null, descripcion) {
    const { data: newPet, error } = await supabase
      .from('pets')
      .insert([{ name, status, location, imageUrl, reporterId, descripcion }])
      .select()
      .single();

    if (error) throw error;

    return newPet; // Retorna la nueva mascota creada
  }

  static async getAllPets() {
    const { data: pets, error } = await supabase
      .from('pets')
      .select('*')
      .neq('status', 'found'); // Filtrar mascotas encontradas

    if (error) throw error;

    return pets; // Retorna todas las mascotas
  }

  static async getPetById(id) {
    const { data: pet, error } = await supabase
      .from('pets')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Mascota no encontrada
      }
      throw error;
    }

    return pet; // Retorna la mascota encontrada
  }

  static async updatePet(id, updateData) {
    const { data: updatedPet, error } = await supabase
      .from('pets')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Mascota no encontrada
      }
      throw error;
    }

    return updatedPet; // Retorna la mascota actualizada
  }

  static async getPetsByReporterId(reporterId) {
    const { data: pets, error } = await supabase
      .from('pets')
      .select('*')
      .eq('reporterId', reporterId);

    if (error) throw error;

    return pets; // Retorna las mascotas del reportero
  }

  static async deletePet(id) {
    const { data: deletedPet, error } = await supabase
      .from('pets')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Mascota no encontrada
      }
      throw error;
    }

    return deletedPet; // Retorna la mascota eliminada
  }
}

export default PetModel;
