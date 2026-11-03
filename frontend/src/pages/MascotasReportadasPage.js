import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './MascotasReportadas.css'; // Importá el CSS
import { useNavigate } from 'react-router-dom';
import groupImage from '../imagenes/Group.png';

const MascotasReportadasPage = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [mascotas, setMascotas] = useState([]);

  useEffect(() => {
    if (user?.id) {
      const fetchMascotas = async () => {
        try {
          const response = await fetch(`http://localhost:3000/api/pets?reporterId=${user.id}`);
          const data = await response.json();
          
          // Filtrar las mascotas para excluir las que están como "found"
          const filteredMascotas = data.filter(mascota => mascota.status !== 'found');
          setMascotas(filteredMascotas);
        } catch (error) {
          console.error('Error al cargar mascotas:', error);
        }
      };

      fetchMascotas();
    }
  }, [user]);

  return (
    <div className="container">
      <h1 className="tituloMascotaReportadas">Mascotas Reportadas</h1>
      <div className="mascotas-container">
        {mascotas.length > 0 ? (
          mascotas.map((mascota) => {
            return (
              <div key={mascota.id} className="mascota-card">
                <img 
  src={mascota.imageurl} 
  className="mascota-image" 
  onError={(e) => { e.target.onerror = null; e.target.src = 'ruta/por/defecto.png'; }} 
/>

                <div className="mascota-info">
                  <h2 className="mascota-name">{mascota.name}</h2>
                  <p className="mascota-location">{mascota.descripcion}</p>
                  <button 
                    className="btn-editar" 
                    onClick={() => navigate(`/editar-mascota/${mascota.id}`)}
                  >
                    Editar
                  </button>
                </div>
              </div>
            );
          })
        ) : (
<div className="no-mascotas">
  <p className="descripMascReport">No has reportado ninguna mascota aún.</p>
  <img src={groupImage} alt="No hay mascotas" className="imagen-no-mascotas" />

  <div className="cont-boton-reportes">
  <button 
    className="btn-publicar-reporte" 
    onClick={() => navigate('/reportar-mascota')}
  >
    Publicar reporte
  </button>
  </div>
</div>
        )}
      </div>
    </div>
  );
};

export default MascotasReportadasPage;
