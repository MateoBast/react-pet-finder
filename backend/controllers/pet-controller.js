import jwt from 'jsonwebtoken';
import algoliaClient from '../servicesback/algoliaClient.js'; // Importás el cliente
import { supabase } from '../supabaseClient.js'; // Importar Supabase

const index = algoliaClient.initIndex('pets'); // Inicializás el índice acá

export const createPet = async (req, res) => {
  try {
    const reporterId = req.user.id;

    const { name, descripcion, status, location: locationStr } = req.body;
    const imageurl = req.file ? `https://react-pet-finder.onrender.com/uploads/${req.file.filename}` : null;

    if (!name || !descripcion || !status || !locationStr || !imageurl) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }

    let location;
    try {
      location = JSON.parse(locationStr);
      if (!location.lat || !location.lng) {
        throw new Error('Latitud y longitud son obligatorias');
      }
    } catch (error) {
      return res.status(400).json({ error: 'Location debe ser un JSON válido con lat y lng' });
    }

    // Crear la mascota en Supabase
    const { data: newPet, error } = await supabase
      .from('pets')
      .insert([
        {
          name,
          descripcion,
          status,
          location: JSON.stringify(location),
          imageurl,
          reporterId,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    // Guardar en Algolia
    await index.saveObject({
      objectID: newPet.id,
      name: newPet.name,
      descripcion: newPet.descripcion,
      status: newPet.status,
      location: newPet.location,
      _geoloc: { lat: location.lat, lng: location.lng },
      imageurl: newPet.imageurl,
      reporterId: newPet.reporterId,
    });

    res.status(201).json(newPet);
  } catch (error) {
    console.error('Error al crear la mascota:', error);
    res.status(500).json({ error: 'Error al crear la mascota.' });
  }
};

export const updatePet = async (req, res) => {
  try {
    const petId = req.params.id;
    const { name, location, status, imageurl, descripcion } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (location) updateData.location = location;
    if (status) updateData.status = status;
    if (imageurl) updateData.imageurl = imageurl;
    if (descripcion) updateData.descripcion = descripcion;

    const { data: updatedPet, error } = await supabase
      .from('pets')
      .update(updateData)
      .eq('id', petId)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') { // Not found
        return res.status(404).json({ error: 'Mascota no encontrada.' });
      }
      throw error;
    }

    res.json(updatedPet);
  } catch (error) {
    console.error('Error al actualizar la mascota:', error);
    res.status(500).json({ message: 'Error al actualizar la mascota' });
  }
};

export const deletePet = async (req, res) => {
  const { id } = req.params;

  try {
    const { data: deletedPet, error } = await supabase
      .from('pets')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Mascota no encontrada.' });
      }
      throw error;
    }

    res.status(200).json({ message: 'Mascota eliminada correctamente.' });
  } catch (error) {
    console.error('Error al eliminar la mascota:', error);
    res.status(500).json({ error: 'Error al eliminar la mascota.' });
  }
};

export const getAllPets = async (req, res) => {
  const { reporterId } = req.query;

  try {
    let query = supabase.from('pets').select('*');
    if (reporterId) {
      query = query.eq('reporterId', reporterId);
    }
    const { data: pets, error } = await query;

    if (error) throw error;

    res.status(200).json(pets);
  } catch (error) {
    console.error('Error al obtener mascotas:', error);
    res.status(500).json({ error: 'Error al obtener mascotas.' });
  }
};

export const getPetById = async (req, res) => {
  const { id } = req.params;

  try {
    const { data: pet, error } = await supabase
      .from('pets')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Mascota no encontrada.' });
      }
      throw error;
    }

    res.status(200).json(pet);
  } catch (error) {
    console.error('Error al obtener la mascota:', error);
    res.status(500).json({ error: 'Error al obtener la mascota.' });
  }
};
