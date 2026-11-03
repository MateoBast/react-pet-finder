import ReportModel from '../models/report-model.js';
import { MailtrapClient } from 'mailtrap'; // Importamos Mailtrap
import dotenv from 'dotenv';

dotenv.config();

const client = new MailtrapClient({
  token: process.env.MAILTRAP_API_TOKEN, // Usando la API key de Mailtrap
});

export const createReport = async (req, res) => {
  const { petId, reporterName, reporterPhone, location } = req.body;
  const reporterId = req.user.id; // Suponiendo que el id del usuario está en req.user

  if (!petId || !reporterName || !reporterPhone || !location) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
  }

  try {
    const newReport = await ReportModel.createReport(petId, reporterName, reporterPhone, location, reporterId);
    const reporterEmail = await ReportModel.getReporterEmailByPetId(petId);

    if (reporterEmail) {
      await client.send({
        from: {
          email: "hello@demomailtrap.co",
          name: "Mailtrap Test",
        },
        to: [
          {
            email: reporterEmail, // Cambié esto para usar el email del reportero
          },
        ],
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
    const reports = await ReportModel.getAllReports();
    res.status(200).json(reports);
  } catch (error) {
    console.error('Error al obtener avistamientos:', error);
    res.status(500).json({ error: 'Error al obtener avistamientos.' });
  }
};

export const getReportById = async (req, res) => {
  const { id } = req.params;

  try {
    const report = await ReportModel.getReportById(id);
    if (!report) {
      return res.status(404).json({ error: 'Avistamiento no encontrado.' });
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
    const updatedReport = await ReportModel.updateReport(id, petId, reporterPhone, location);
    if (!updatedReport) {
      return res.status(404).json({ error: 'Avistamiento no encontrado.' });
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
    const deletedReport = await ReportModel.deleteReport(id);
    if (!deletedReport) {
      return res.status(404).json({ error: 'Avistamiento no encontrado.' });
    }
    res.status(200).json({ message: 'Avistamiento eliminado correctamente.' });
  } catch (error) {
    console.error('Error al eliminar el avistamiento:', error);
    res.status(500).json({ error: 'Error al eliminar el avistamiento.' });
  }
};