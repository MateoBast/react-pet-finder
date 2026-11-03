import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import "./ModificarDatosPage.css";
import BotonAzul from "../ui/botonAzul"
const ModificarDatosPage = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');

  // Cargo datos guardados en localStorage o del contexto user al montar o cuando user cambia
  useEffect(() => {
    const savedData = localStorage.getItem('userData');
    if (savedData) {
      const { name, location } = JSON.parse(savedData);
      setName(name);
      setLocation(location);
    } else if (user) {
      setName(user.name);
      setLocation(user.location);
    }
  }, [user]);

  const handleSave = () => {
    updateUser({ name, location }); // Actualiza en contexto/backend
    localStorage.setItem('userData', JSON.stringify({ name, location })); // Guarda localmente
    alert('Datos guardados');
  };

  return (
    <div className='contenedorModificarDatos'>
      <h1 className='tituloModificar'>Datos personales</h1>
      <label htmlFor="nombre" style={{ display: 'block', textAlign: 'left', marginBottom: 5, marginTop: 100 }}>
        <b>NOMBRE</b>
      </label>
      <input
        className='inputModificar'
        type='text'
        placeholder='NOMBRE'
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label htmlFor="localidad" style={{ display: 'block', textAlign: 'left', marginBottom: 5, marginTop: 20 }}>
        <b>LOCALIDAD</b>
      </label>
      <input
        className='inputModificar'
        type='text'
        placeholder='LOCALIDAD'
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <BotonAzul className='botonGuardar' onClick={handleSave}>Guardar</BotonAzul>
    </div>
  );
};

export default ModificarDatosPage;
