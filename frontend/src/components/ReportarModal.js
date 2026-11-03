import React, { useState } from 'react';
import useAuth from '../services/useAuth'; // Asegúrate de importar el hook
import "./ReportarModal.css";

const ReportarModal = ({ petName, petId, onClose, onReport }) => {
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [dondeLoViste, setDondeLoViste] = useState('');
  const { getToken } = useAuth(); // Usar el hook para obtener el token

  const handleSubmit = async (e) => {
    e.preventDefault();

    const reportData = {
      petId,
      reporterName: nombre,
      reporterPhone: telefono,
      location: dondeLoViste,
    };

    const token = getToken(); // Obtener el token

    try {
      const response = await fetch('https://react-pet-finder.onrender.com/api/reports', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Enviar token en headers
        },
        body: JSON.stringify(reportData),
      });

      if (!response.ok) throw new Error('Error al reportar la información');

      alert('Información reportada con éxito');

      // Limpiar campos
      setNombre('');
      setTelefono('');
      setDondeLoViste('');

      onClose();
    } catch (error) {
      alert('Hubo un error al reportar la información. Intenta nuevamente.');
      console.error(error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Reportar info de {petName}</h2>
        <form onSubmit={handleSubmit}>
          <label>
            NOMBRE
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </label>
          <label>
            TELÉFONO
            <input
              type="text"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              required
            />
          </label>
          <label>
            ¿DÓNDE LO VISTE?
            <input
              type="text"
              value={dondeLoViste}
              onChange={(e) => setDondeLoViste(e.target.value)}
              required
            />
          </label>
          <button type="submit">Enviar información</button>
          <button type="button" onClick={onClose}>Cancelar</button>
        </form>
      </div>
    </div>
  );
};

export default ReportarModal;
