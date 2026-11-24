import AuthModel from '../models/auth-model.js';
import UserModel from '../models/user-model.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import fetch from 'node-fetch'; // Asegurate de tenerlo instalado

dotenv.config();

export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    console.log('Email recibido:', email); // Log del email recibido

    const user = await UserModel.getUserByEmail(email);
    if (!user) {
      console.log('Usuario no encontrado para el email:', email); // Log si no se encuentra el usuario
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    const token = crypto.randomBytes(20).toString('hex');
    const tokenExpiration = Date.now() + 3600000;

    await UserModel.savePasswordResetToken(user.id, token, tokenExpiration);
    console.log('Token generado:', token); // Log del token generado

    // Limpiamos el email de espacios
    const cleanEmail = user.email.trim();
    console.log('Email limpio:', cleanEmail); // Log del email limpio

    const templateParams = {
      to_name: user.name,
      to_email: cleanEmail, // Usamos el email limpio
      reset_link: `https://react-pet-finder.onrender.com/reset-password?token=${token}`,
    };

    console.log('Parámetros del template:', templateParams); // Log de los parámetros del template

    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: "service_sulumm9",
        template_id: "template_2qjsalt",
        user_id: "gvXCoyccRgLtkMvqS", // Usa tu user_id aquí
        template_params: templateParams,
      }),
    });

    console.log('Respuesta de EmailJS:', response); // Log de la respuesta de EmailJS

    if (!response.ok) {
      const errorText = await response.text(); // Obtener el cuerpo de la respuesta
      console.log('EmailJS response status:', response.status); // Log del status
      console.log('EmailJS response body:', errorText); // Log del cuerpo
      throw new Error('Error enviando email con EmailJS');
    }

    res.status(200).json({ message: 'Email de reseteo enviado con EmailJS.' });
  } catch (error) {
    console.error('Error en requestPasswordReset con EmailJS:', error);
    res.status(500).json({ error: 'Error al solicitar reseteo de contraseña.' });
  }
};



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
    res.redirect('https://react-pet-finder.onrender.com');
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
        background-color: #5A8FEC; 
        color: white; 
        border: none; 
        border-radius: 4px; 
        font-size: 16px; 
        cursor: pointer;
      ">Resetear Contraseña</button>
    </form>
  `);
};
