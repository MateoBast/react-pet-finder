import bcrypt from 'bcrypt';
import UserModel from './user-model.js'; // Asegúrate de la ruta correcta

const login = async (email, password) => {
  const user = await UserModel.getUserByEmail(email);
  
  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  // Comparar la contraseña
  const isMatch = await bcrypt.compare(password, user.password);
  
  if (!isMatch) {
    throw new Error('Contraseña incorrecta');
  }

  return user; // Retorna el usuario si todo es correcto
};

export default { login };
