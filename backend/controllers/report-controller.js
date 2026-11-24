import dotenv from 'dotenv';
import fetch from 'node-fetch'; // Asegurate de tenerlo instalado
import ReportModel from '../models/report-model.js'; // Ajusta la ruta según tu estructura

dotenv.config();

export const createReport = async (req, res) => {
  const { petId, reporterName, reporterPhone, location } = req.body;
  const reporterId = req.user.id;

  if (!petId || !reporterName || !reporterPhone || !location) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
  }

  try {
    const newReport = await ReportModel.createReport(petId, reporterName, reporterPhone, location, reporterId);
    const reporterEmail = await ReportModel.getReporterEmailByPetId(petId);

    if (reporterEmail) {
      const templateParams = {
        to_email: reporterEmail,
        to_name: reporterName,
        pet_id: petId,
        reporter_phone: reporterPhone,
        location: location,
      };

    const response = await fetch('https://react-pet-finder.onrender.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: "service_sulumm9",
        template_id: "template_926vcnt",
        user_id: "gvXCoyccRgLtkMvqS",
        template_params: templateParams,
      }),
    });


      if (!response.ok) {
        throw new Error('Error enviando email con EmailJS');
      }
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