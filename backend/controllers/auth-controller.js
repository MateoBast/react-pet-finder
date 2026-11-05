import AuthModel from '../models/auth-model.js';
import UserModel from '../models/user-model.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import nodemailer from 'nodemailer'; // Importamos Nodemailer
import { supabase } from '../supabaseClient.js'; // Importar Supabase

dotenv.config();

// Verificar las variables de entorno
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST, // por ejemplo smtp.gmail.com
  port: process.env.SMTP_PORT, // 587 o 465 según el servicio
  secure: false, // true si usás puerto 465
  auth: {
    user: process.env.GMAIL_USER, // cambió acá
    pass: process.env.GMAIL_PASS, // y acá
  },
});

// Controlador de login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { user, error } = await supabase.auth.signIn({
      email,
      password,
    });

    if (error) throw new Error(error.message);

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({ 
      success: true, 
      message: 'Inicio de sesión exitoso', 
      user: { id: user.id, email: user.email, token },
    });
  } catch (error) {
    console.log('Error en login:', error.message);
    res.status(401).json({ message: error.message });
  }
};

export const changePassword = async (req, res) => {
  const { newPassword } = req.body;

  try {
    const { user, error } = await supabase.auth.update({
      password: newPassword,
    });

    if (error) throw new Error(error.message);

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

    // Enviar el email usando Nodemailer
    await transporter.sendMail({
      from: process.env.GMAIL_USER, // Tu dirección de Gmail
      to: email, // Dirección del destinatario
      subject: 'Solicitud de reseteo de contraseña',
      text: `
        Hola ${user.name},
        Hiciste una solicitud para resetear tu contraseña. Hacé click en el siguiente enlace para continuar:
        https://react-pet-finder.onrender.com/reset-password?token=${token}
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
