import { supabase } from '../supabaseClient.js'; // Asegúrate de que la ruta sea correcta

class ReportModel {
  static async createReport(petId, reporterName, reporterPhone, location, reporterId) {
    const { data: newReport, error } = await supabase
      .from('reports')
      .insert([{ petId, reporterName, reporterPhone, location, reporterId }])
      .select()
      .single();

    if (error) throw error;

    return newReport; // Retorna el nuevo reporte creado
  }

  static async getAllReports() {
    const { data: reports, error } = await supabase
      .from('reports')
      .select('*');

    if (error) throw error;

    return reports; // Retorna todos los reportes
  }

  static async getReportById(id) {
    const { data: report, error } = await supabase
      .from('reports')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Reporte no encontrado
      }
      throw error;
    }

    return report; // Retorna el reporte encontrado
  }

  static async updateReport(id, petId, reporterPhone, location) {
    const { data: updatedReport, error } = await supabase
      .from('reports')
      .update({ petId, reporterPhone, location })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Reporte no encontrado
      }
      throw error;
    }

    return updatedReport; // Retorna el reporte actualizado
  }

  static async deleteReport(id) {
    const { data: deletedReport, error } = await supabase
      .from('reports')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Reporte no encontrado
      }
      throw error;
    }

    return deletedReport; // Retorna el reporte eliminado
  }

  static async getOwnerEmailByPetId(petId) {
    const { data: ownerEmailData, error } = await supabase
      .from('pets')
      .select('ownerId(email)')
      .eq('id', petId)
      .single();

    if (error) throw error;

    return ownerEmailData?.email; // Devuelve el email o undefined si no existe
  }

  static async getReporterEmailByPetId(petId) {
    const { data: reporterEmailData, error } = await supabase
      .from('pets')
      .select('reporterId(email)')
      .eq('id', petId)
      .single();

    if (error) throw error;

    return reporterEmailData?.email; // Devuelve el email o undefined si no existe
  }
}

export default ReportModel;
