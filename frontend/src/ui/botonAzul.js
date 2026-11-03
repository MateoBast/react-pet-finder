import React from 'react';
import './botonAzul.css'; // Asegúrate de tener este archivo CSS

const BotonAzul = ({ onClick, children }) => {
  return (
    <button className="botonAzul" onClick={onClick}>
      {children}
    </button>
  );
};

export default BotonAzul;
