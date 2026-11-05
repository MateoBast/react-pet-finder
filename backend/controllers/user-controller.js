import bcrypt from 'bcrypt';
import UserModel from '../models/user-model.js';
import jwt from 'jsonwebtoken'; // Asegúrate de que esta línea esté presente

export const createUser = async (req, res) => {
  const { name, email, password, location } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
  }

  try {
    // Verificar si el email ya existe para evitar duplicados
    const existingUser = await UserModel.getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: 'El email ya está registrado.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await UserModel.createUser(name, email, hashedPassword, location);

    // Generar token para el nuevo usuario
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      'tu_clave_secreta', // Mejor usar variable de entorno
      { expiresIn: '1d' }
    );

    // Excluir password antes de enviar
    const { password: pwd, ...userWithoutPassword } = newUser;

    res.status(201).json({
      success: true,
      user: { ...userWithoutPassword, token },
    });
  } catch (error) {
    console.error('Error al crear el usuario:', error);
    res.status(500).json({ error: 'Error al crear el usuario.' });
  }
};

export const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await UserModel.getUserById(id);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error al obtener el usuario:', error);
    res.status(500).json({ error: 'Error al obtener el usuario.' });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, location } = req.body;

  // Creamos un objeto para los campos a actualizar
  const fieldsToUpdate = {};
  if (name) fieldsToUpdate.name = name; // Solo si hay un nuevo nombre
  if (email) fieldsToUpdate.email = email; // Solo si hay un nuevo email
  if (location) fieldsToUpdate.location = location; // Solo si hay una nueva ubicación

  try {
    const updatedUser = await UserModel.updateUser(id, fieldsToUpdate);
    if (!updatedUser) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    res.status(500).json({ error: 'Error al actualizar el usuario.' });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedUser = await UserModel.deleteUser(id);
    if (!deletedUser) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }
    res.status(200).json({ message: 'Usuario eliminado correctamente.' });
  } catch (error) {
    console.error('Error al eliminar el usuario:', error);
    res.status(500).json({ error: 'Error al eliminar el usuario.' });
  }
};


export const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.getAllUsers(); // Asegúrate de que esta función esté definida en tu modelo
    res.status(200).json(users);
  } catch (error) {
    console.error('Error al obtener todos los usuarios:', error);
    res.status(500).json({ error: 'Error al obtener los usuarios.' });
  }
};
