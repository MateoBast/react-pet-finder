import React from 'react';
import './botonVerde.css'; // Asegúrate de tener este archivo CSS

const BotonVerde = ({ onClick, children }) => {
  return (
    <button className="botonVerde" onClick={onClick}>
      {children}
    </button>
  );
};

export default BotonVerde;
