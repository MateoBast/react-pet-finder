// HowItWorks.js
import React from 'react';
import './HowItWorks.css'; // Asegúrate de crear este archivo CSS

const HowItWorks = () => {
  return (
    <div className="how-it-works-container">
      <h1 className="how-it-works-title">¿Cómo funciona Pet Finder?</h1>
      <p className="how-it-works-description">
        Pet Finder es una aplicación diseñada para ayudar a las personas a reportar y encontrar mascotas perdidas.
      </p>
      <h2 className="how-it-works-steps-title">Pasos para usar Pet Finder:</h2>
      <ol className="how-it-works-steps">
        <li>Dar tu ubicación actual para encontrar mascotas cercanas.</li>
        <li>Reportar una mascota perdida proporcionando detalles como nombre, ubicación y estado.</li>
        <li>Recibir notificaciones cuando alguien reporta haber visto tu mascota.</li>
      </ol>
      <p className="how-it-works-conclusion">
        ¡Usa Pet Finder para ayudar a reunir a las mascotas con sus dueños!
      </p>
    </div>
  );
};

export default HowItWorks;
