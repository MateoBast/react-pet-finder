import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import BotonAzul from "../ui/botonAzul"
const ModificarContrasenaPage = () => {
  const { updatePassword } = useContext(AuthContext);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    try {
      await updatePassword(password); // Llama a la función del contexto
      alert('Contraseña modificada con éxito');
    } catch (error) {
      alert('Error al modificar la contraseña: ' + error.message);
    }
  };

  return (
    <div className='contenedorModificarDatos'>
      <h1 className='tituloModificar'>Contraseña</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="password" style={{ display: 'block', marginTop: 30, marginBottom: 5, textAlign: 'left' }}>
          Nueva contraseña
        </label>
        <input
          id="password"
          type="password"
          className='inputModificar'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Nueva contraseña"
          required
        />
        <label htmlFor="confirmPassword" style={{ display: 'block', marginTop: 20, marginBottom: 5, textAlign: 'left' }}>
          Confirmar contraseña
        </label>
        <input
          id="confirmPassword"
          type="password"
          className='inputModificar'
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirmar contraseña"
          required
        />
        <BotonAzul type="submit" style={{ marginTop: 30 }}>
          Guardar
        </BotonAzul>
      </form>
    </div>
  );
};

export default ModificarContrasenaPage;
