import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { supabase } from '../supabaseClient.js'; // Importar Supabase

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST, // smtp.gmail.com
  port: process.env.SMTP_PORT, // 587
  secure: false, // true si usás puerto 465
  auth: {
    user: process.env.GMAIL_USER, // Cambiado a GMAIL_USER
    pass: process.env.GMAIL_PASS, // Cambiado a GMAIL_PASS
  },
});

export const createReport = async (req, res) => {
  const { petId, reporterName, reporterPhone, location } = req.body;
  const reporterId = req.user.id;

  if (!petId || !reporterName || !reporterPhone || !location) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
  }

  try {
    // Crear el reporte en Supabase
    const { data: newReport, error } = await supabase
      .from('reports')
      .insert([{ petId, reporterName, reporterPhone, location, reporterId }])
      .select()
      .single();

    if (error) throw error;

    // Obtener el email del reportero
    const { data: reporterEmailData, error: emailError } = await supabase
      .from('pets')
      .select('reporterEmail') // Asegúrate de que esta columna exista
      .eq('id', petId)
      .single();

    if (emailError) throw emailError;

    const reporterEmail = reporterEmailData?.reporterEmail;

    if (reporterEmail) {
      await transporter.sendMail({
        from: `"Tu App" <${process.env.SMTP_USER}>`,
        to: reporterEmail,
        subject: `Nueva información sobre tu mascota ${petId}`,
        text: `Hola! Alguien reportó haber visto a tu mascota.\nNombre del reportero: ${reporterName}\nTeléfono: ${reporterPhone}\nUbicación: ${location}`,
      });
    }

    res.status(201).json(newReport);
  } catch (error) {
    console.error('Error al crear el avistamiento:', error);
    res.status(500).json({ error: 'Error al crear el avistamiento.' });
  }
};

export const getAllReports = async (req, res) => {
  try {
    const { data: reports, error } = await supabase
      .from('reports')
      .select('*');

    if (error) throw error;

    res.status(200).json(reports);
  } catch (error) {
    console.error('Error al obtener avistamientos:', error);
    res.status(500).json({ error: 'Error al obtener avistamientos.' });
  }
};

export const getReportById = async (req, res) => {
  const { id } = req.params;

  try {
    const { data: report, error } = await supabase
      .from('reports')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Avistamiento no encontrado.' });
      }
      throw error;
    }

    res.status(200).json(report);
  } catch (error) {
    console.error('Error al obtener el avistamiento:', error);
    res.status(500).json({ error: 'Error al obtener el avistamiento.' });
  }
};

export const updateReport = async (req, res) => {
  const { id } = req.params;
  const { petId, reporterPhone, location } = req.body;

  try {
    const { data: updatedReport, error } = await supabase
      .from('reports')
      .update({ petId, reporterPhone, location })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Avistamiento no encontrado.' });
      }
      throw error;
    }

    res.status(200).json(updatedReport);
  } catch (error) {
    console.error('Error al actualizar el avistamiento:', error);
    res.status(500).json({ error: 'Error al actualizar el avistamiento.' });
  }
};

export const deleteReport = async (req, res) => {
  const { id } = req.params;

  try {
    const { data: deletedReport, error } = await supabase
      .from('reports')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Avistamiento no encontrado.' });
      }
      throw error;
    }

    res.status(200).json({ message: 'Avistamiento eliminado correctamente.' });
  } catch (error) {
    console.error('Error al eliminar el avistamiento:', error);
    res.status(500).json({ error: 'Error al eliminar el avistamiento.' });
  }
};
