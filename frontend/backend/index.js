import express from 'express';
import cors from 'cors';
import * as userController from './controllers/user-controller.js';
import * as petController from './controllers/pet-controller.js';
import * as reportController from "./controllers/report-controller.js";
import * as authController from './controllers/auth-controller.js';
import { authMiddleware } from './controllers/auth-controller.js';
import upload from './servicesback/multerConfig.js';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config();

// Obtener __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos de la carpeta 'uploads'
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.post('/api/upload', upload.single('file'), (req, res) => {
  console.log(req.file); // Verifica si el archivo se está recibiendo
  if (!req.file) return res.status(400).json({ error: 'No se subió ningún archivo' });

  const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.json({ url: imageUrl });
});

// Rutas de usuarios
app.post('/api/users', userController.createUser);
app.get('/api/users', userController.getAllUsers);
app.get('/api/users/:id', userController.getUserById);
app.put('/api/users/:id', userController.updateUser);
app.delete('/api/users/:id', userController.deleteUser);

// Rutas de autenticación
app.post('/api/login', authController.loginUser);
app.post('/api/cambiar-contrasena', authMiddleware, authController.changePassword);
app.post('/api/request-password-reset', authController.requestPasswordReset);
app.post('/api/reset-password', authController.resetPassword);
app.get('/reset-password', authController.showResetPasswordForm);

// Rutas de mascotas
app.post('/api/pets', authMiddleware, upload.single('image'), petController.createPet);
app.get('/api/pets', petController.getAllPets);
app.get('/api/pets/:id', petController.getPetById);
app.put('/api/pets/:id', upload.single('image'), petController.updatePet);
app.delete('/api/pets/:id', petController.deletePet);

// Rutas de reportes
app.post('/api/reports', reportController.createReport);
app.get('/api/reports', reportController.getAllReports);
app.get('/api/reports/:id', reportController.getReportById);
app.put('/api/reports/:id', reportController.updateReport);
app.delete('/api/reports/:id', reportController.deleteReport);

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Ruta para manejar cualquier otra solicitud y servir el index.html del frontend
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
