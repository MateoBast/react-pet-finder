import AuthModel from '../models/auth-model.js';
import UserModel from '../models/user-model.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { MailtrapClient } from 'mailtrap'; // Importamos Mailtrap

dotenv.config();

const client = new MailtrapClient({
  token: process.env.MAILTRAP_API_TOKEN, // Usando la API key de Mailtrap
});

// Controlador de login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await AuthModel.login(email, password);
    const { password: userPassword, ...userWithoutPassword } = user;

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({ 
      success: true, 
      message: 'Inicio de sesión exitoso', 
      user: { ...userWithoutPassword, token },
    });
  } catch (error) {
    console.log('Error en login:', error.message);
    res.status(401).json({ message: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { newPassword } = req.body;

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await UserModel.updatePassword(userId, hashedPassword);

    res.status(200).json({ message: 'Contraseña actualizada correctamente' });
  } catch (error) {
    console.log('Error al cambiar la contraseña:', error.message);
    res.status(500).json({ error: 'Error al actualizar la contraseña' });
  }
};

// Middleware para validar el token
export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido' });
    }
    
    req.user = user;
    req.reporterId = user.id;
    next();
  });
};

// Solicitar reseteo de contraseña
export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await UserModel.getUserByEmail(email);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado.' });

    const token = crypto.randomBytes(20).toString('hex');
    const tokenExpiration = Date.now() + 3600000;

    await UserModel.savePasswordResetToken(user.id, token, tokenExpiration);

    await client.send({
      from: {
        email: "hello@demomailtrap.co", // Cambia esto por tu email verificado en Mailtrap
        name: "Mailtrap Test",
      },
      to: [
        {
          email: email,
        },
      ],
      subject: 'Solicitud de reseteo de contraseña',
      text: `
        Hola ${user.name},
        Hiciste una solicitud para resetear tu contraseña. Hacé click en el siguiente enlace para continuar:
        https://pet-finder-fvju.onrender.com/reset-password?token=${token}
        Este link es válido por 1 hora.
      `,
    });

    res.status(200).json({ message: 'Email de reseteo enviado.' });
  } catch (error) {
    console.error('Error en requestPasswordReset:', error);
    res.status(500).json({ error: 'Error al solicitar reseteo de contraseña.' });
  }
};

export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const user = await UserModel.findByResetToken(token);

    if (!user || user.resetTokenExpiration < Date.now()) {
      return res.status(400).send('Token inválido o expirado.');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await UserModel.updatePassword(user.id, hashedPassword);
    await UserModel.clearResetToken(user.id);

    // Redirigir a localhost después de actualizar la contraseña
    res.redirect('https://pet-finder-fvju.onrender.com/');
  } catch (error) {
    console.error('Error en resetPassword:', error);
    res.status(500).send('Error al actualizar la contraseña.');
  }
};

export const showResetPasswordForm = (req, res) => {
  const token = req.query.token;

  if (!token) {
    return res.status(400).send('Token inválido o no proporcionado.');
  }

  // Si el token es válido, muestra un formulario para que el usuario ingrese su nueva contraseña
res.send(`
  <form action="/api/reset-password" method="POST" style="
    max-width: 400px; 
    margin: 50px auto; 
    padding: 20px; 
    border: 1px solid #ccc; 
    border-radius: 8px; 
    font-family: Arial, sans-serif;
    background: #f9f9f9;
  ">
    <input type="hidden" name="token" value="${token}" />
    <label for="newPassword" style="
      display: block; 
      margin-bottom: 8px; 
      font-weight: bold;
      color: #333;
    ">Nueva Contraseña:</label>
    <input type="password" name="newPassword" required style="
      width: 100%; 
      padding: 10px; 
      margin-bottom: 15px; 
      border: 1px solid #ccc; 
      border-radius: 4px;
      font-size: 16px;
    " />
    <button type="submit" style="
      width: 100%; 
      padding: 10px; 
      background-color: #007bff; 
      color: white; 
      border: none; 
      border-radius: 4px; 
      font-size: 16px; 
      cursor: pointer;
    ">Resetear Contraseña</button>
  </form>
`)
};

