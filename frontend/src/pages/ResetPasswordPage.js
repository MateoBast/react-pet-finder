import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import BotonAzul from "../ui/botonAzul"
const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setMessage('Token inválido o no proporcionado.');
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage('Las contraseñas no coinciden.');
      return;
    }

    try {
      const res = await fetch('https://react-pet-finder.onrender.com/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('Contraseña actualizada correctamente.');
      } else {
        setMessage(data.error || 'Error al actualizar la contraseña.');
      }
    } catch (error) {
      setMessage('Error de conexión.');
    }
  };

  if (!token) {
    return <p>{message}</p>;
  }

  return (
    <div>
      <h2>Resetear Contraseña</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Nueva Contraseña"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirmar Contraseña"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <BotonAzul type="submit">Actualizar Contraseña</BotonAzul>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
