import React, { useState } from 'react';
import BotonAzul from "../ui/botonAzul"
const RequestPasswordResetPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:3000/api/request-password-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('Email de reseteo enviado. Revisa tu bandeja de entrada.');
      } else {
        setMessage(data.error || 'Error al enviar el email.');
      }
    } catch (error) {
      setMessage('Error de conexión.');
    }
  };

  return (
    <div style={{
      maxWidth: '400px',
      margin: '50px auto',
      padding: '20px',
      border: '1px solid #ccc',
      borderRadius: '8px',
      fontFamily: 'Arial, sans-serif',
      background: '#f9f9f9',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ textAlign: 'center', color: '#333' }}>Solicitar reseteo de contraseña</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
        <input
          type="email"
          placeholder="Tu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            padding: '10px',
            marginBottom: '15px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '16px'
          }}
        />
        <BotonAzul type="submit">
          Enviar email
        </BotonAzul>
      </form>
      {message && <p style={{ marginTop: '15px', color: '#555', textAlign: 'center' }}>{message}</p>}
    </div>
  );
};

export default RequestPasswordResetPage;
