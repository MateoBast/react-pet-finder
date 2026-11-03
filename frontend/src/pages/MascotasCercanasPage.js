import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import index from '../services/algolia';
import ReportarModal from "../components/ReportarModal";
const MascotasCercanasPage = () => {
  const [mascotas, setMascotas] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null); // Para almacenar la mascota seleccionada
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const latitude = queryParams.get('lat');
  const longitude = queryParams.get('lng');

  useEffect(() => {
    const fetchMascotasCercanas = async () => {
      try {
        const { hits } = await index.search('', {
          aroundLatLng: `${latitude},${longitude}`,
          aroundRadius: 5000,
        });

        const petIds = hits.map(pet => pet.objectID);
        const response = await fetch(`https://react-pet-finder.onrender.com/api/pets?ids=${petIds.join(',')}`);
        const data = await response.json();

        const orderedData = petIds.map(id => data.find(pet => String(pet.id) === String(id))).filter(Boolean);
        setMascotas(orderedData);
      } catch (error) {
        console.error('Error buscando mascotas cercanas:', error);
      }
    };

    if (latitude && longitude) {
      fetchMascotasCercanas();
    }
  }, [latitude, longitude]);

  const handleReport = async (reportData) => {
    try {
      const response = await fetch('https://react-pet-finder.onrender.com/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...reportData, petId: selectedPet.id }), // Incluye el ID de la mascota
      });

      if (!response.ok) {
        throw new Error('Error al reportar la información');
      }

      console.log('Información reportada con éxito');
      // Aquí podrías mostrar un mensaje de éxito o cerrar el modal
    } catch (error) {
      console.error('Error al reportar:', error);
    }
  };

  return (
    <div>
      <h1>Mascotas Cercanas</h1>
      {mascotas.length > 0 ? (
        <ul>
          {mascotas.map(pet => (
            <li key={pet.id} style={{ marginBottom: '20px' }}>
              <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '10px', display: 'flex', alignItems: 'center',width: "95%" }}>
                <img
                  src={pet.imageurl}
                  alt={pet.name}
                  style={{ width: '100px', borderRadius: '8px', marginRight: '10px' }}
                  onError={e => { e.target.onerror = null; e.target.src = 'ruta/por/defecto.png'; }}
                />
                <div>
                  <h2>{pet.name}</h2>
                  <p>{pet.descripcion}</p>
                  <button
                    style={{ backgroundColor: '#ff4081', color: '#fff', border: 'none', borderRadius: '5px', padding: '5px 10px' }}
                    onClick={() => {
                      setSelectedPet(pet); // Guardar la mascota seleccionada
                      // Aquí podrías abrir el modal
                    }}
                  >
                    Reportar
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No se encontraron mascotas cercanas.</p>
      )}

      {selectedPet && (
        <ReportarModal
  petName={selectedPet.name}
  petId={selectedPet.id} // Pasar el id también
  onClose={() => setSelectedPet(null)}
  onReport={handleReport}
/>
      )}
    </div>
  );
};

export default MascotasCercanasPage;
