import PetModel from '../models/pet-model.js';
import jwt from 'jsonwebtoken';
import algoliaClient from '../servicesback/algoliaClient.js'; // Importás el cliente

const index = algoliaClient.initIndex('pets'); // Inicializás el índice acá

export const createPet = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const reporterId = decoded.id;

    const { name, descripcion, status, location: locationStr } = req.body;
    const imageUrl = req.file ? `https://pet-finder-fvju.onrender.com/uploads/${req.file.filename}` : null;

    if (!name || !descripcion || !status || !locationStr || !imageUrl) {
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

    // Crear la mascota en la base de datos
    const newPet = await PetModel.createPet(name, status, JSON.stringify(location), imageUrl, reporterId, descripcion);

    // Guardar en Algolia
    await index.saveObject({
      objectID: newPet.id,
      name: newPet.name,
      descripcion: descripcion,
      status: newPet.status,
      location: newPet.location, // Guardar location como string
      _geoloc: { lat: location.lat, lng: location.lng }, // Guardar _geoloc como objeto
      imageUrl: newPet.imageUrl,
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

    const updatedPet = await PetModel.updatePet(petId, updateData);

    if (!updatedPet) {
      return res.status(404).json({ error: 'Mascota no encontrada.' });
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
    const deletedPet = await PetModel.deletePet(id);
    if (!deletedPet) {
      return res.status(404).json({ error: 'Mascota no encontrada.' });
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
    let pets;
    if (reporterId) {
      pets = await PetModel.getPetsByReporterId(reporterId);
    } else {
      pets = await PetModel.getAllPets();
    }
    res.status(200).json(pets);
  } catch (error) {
    console.error('Error al obtener mascotas:', error);
    res.status(500).json({ error: 'Error al obtener mascotas.' });
  }
};

export const getPetById = async (req, res) => {
  const { id } = req.params;

  try {
    const pet = await PetModel.getPetById(id);
    if (!pet) {
      return res.status(404).json({ error: 'Mascota no encontrada.' });
    }
    res.status(200).json(pet);
  } catch (error) {
    console.error('Error al obtener la mascota:', error);
    res.status(500).json({ error: 'Error al obtener la mascota.' });
  }
};
