import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import { AuthContext } from '../context/AuthContext';
import HomeImg from "../imagenes/undraw_beach_day_cser.png";
import "./home.css";
import index from '../services/algolia'; // Asegurate que la ruta sea correcta
import BotonAzul from "../ui/botonAzul"
import BotonVerde from "../ui/botonVerde"
const Home = () => {
  const { user } = useContext(AuthContext);
  const userId = user?.id;
  const navigate = useNavigate(); // Inicializar useNavigate

  const [ubicacion, setUbicacion] = useState(null);
  const [error, setError] = useState(null);

  const obtenerUbicacion = () => {
    if (!navigator.geolocation) {
      setError('Geolocalización no soportada por el navegador');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUbicacion({ latitude, longitude });
        setError(null);

        // Redirigir a la nueva página con las coordenadas
        navigate(`/mascotas-cercanas?lat=${latitude}&lng=${longitude}`);
      },
      () => {
        setError('No se pudo obtener la ubicación');
      }
    );
  };

  const handleHowItWorksClick = () => {
    navigate('/how-it-works');
  };

  return (
    <div className='bodyHome'>
      <div className='contenedorHome'>
        <img src={HomeImg} alt="Logo" className='imagenHome'/>
        <h1 className='tituloHome'>Pet Finder App</h1>
        <p className='textoHome'>Encontrá y reportá mascotas perdidas cerca de tu ubicación</p>
      </div>
      <div className="contenedorboteneshome">
        <BotonAzul  onClick={obtenerUbicacion}>Dar mi ubicación actual</BotonAzul>
        <BotonVerde onClick={handleHowItWorksClick}>¿Cómo funciona Pet Finder?</BotonVerde>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Home;
