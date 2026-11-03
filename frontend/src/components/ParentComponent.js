import React, { useEffect, useState } from 'react';
import ReportarMascotaPage from './ReportarMascotaPage'; // Asegúrate de que la ruta sea correcta

const ParentComponent = () => {
  const [mascotas, setMascotas] = useState([]);

  // Función para obtener las mascotas desde la API
  const fetchMascotas = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/pets');
      if (!response.ok) {
        throw new Error('Error al obtener las mascotas');
      }
      const data = await response.json();
      setMascotas(data); // Actualiza el estado con la lista de mascotas
      console.log('Mascotas obtenidas:', data);
    } catch (error) {
      console.error('Error al obtener mascotas:', error);
    }
  };

  // Llama a fetchMascotas al cargar el componente
  useEffect(() => {
    fetchMascotas();
  }, []);

  return (
    <div>
      <h1>Reportar Mascota</h1>
      <ReportarMascotaPage fetchMascotas={fetchMascotas} />
      {/* Aquí podrías renderizar la lista de mascotas si lo deseas */}
      <ul>
        {mascotas.map((mascota) => (
          <li key={mascota.id}>{mascota.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default ParentComponent;
