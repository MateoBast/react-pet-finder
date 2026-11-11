import React, { useState } from 'react';
import { createUser, loginUser } from '../services/api.js'; 
import { useNavigate } from 'react-router-dom';
import useAuth from '../services/useAuth'; 
import "./UserForm.css"
import BotonAzul from "../ui/botonAzul"

const UserForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const response = await loginUser({ email, password });
        console.log('Respuesta del backend:', response.data);

        if (response.data.success) {
          const { id, email: userEmail, token } = response.data.user;
          login(id, userEmail, token);
          alert('Inicio de sesión exitoso');
          navigate('/home');
        } else {
          alert('Email o contraseña incorrectos');
        }
      } else {
        if (password !== confirmPassword) {
          alert('Las contraseñas no coinciden');
          return;
        }

const newUserResponse = await createUser({ name, email, password });
console.log('Respuesta completa:', newUserResponse);
if (newUserResponse.data) {
  alert('Usuario creado exitosamente');
  setIsLogin(true);
} else {
  alert('Error al crear el usuario');
}

      }
    } catch (error) {
      console.error('Error:', error);
      alert('Ocurrió un error, por favor intenta nuevamente.');
    }
  };

  return (
    <div>
      {isLogin ? (
        <form onSubmit={handleSubmit} className="user-form">
          <h2 className="form-title">Iniciar Sesión</h2>
          <p className="form-subtitle">Ingresá los siguientes datos para iniciar sesión</p>

          <label htmlFor="email" className="input-label">Email</label>
          <input
            id="email"
            type="email"
            placeholder="EMAIL"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input-email"
          />

          <label htmlFor="password" className="input-label">Contraseña</label>
          <input
            id="password"
            type="password"
            placeholder="CONTRASEÑA"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input-password"
          />

          <p className="forgot-password">
<a href="/request-password-reset">Olvidé mi contraseña</a>
          </p>

          <BotonAzul type="submit" className="submit-button">Acceder</BotonAzul>

          <p className="toggle-form">
            ¿No tenés cuenta? 
            <button type="button" onClick={() => setIsLogin(false)} className="toggle-button">Registrate aquí</button>
          </p>
        </form>
      ) : (
        <form onSubmit={handleSubmit} className="user-form">
          <h2 className="form-title">Crear Usuario</h2>
          <p className="form-subtitle">Ingresá los siguientes datos para realizar el registro</p>

          <label htmlFor="name" className="input-label">Nombre</label>
          <input
            id="name"
            type="text"
            placeholder="NOMBRE"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="input-name"
          />

          <label htmlFor="email" className="input-label">Email</label>
          <input
            id="email"
            type="email"
            placeholder="EMAIL"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input-email"
          />

          <label htmlFor="password" className="input-label">Contraseña</label>
          <input
            id="password"
            type="password"
            placeholder="CONTRASEÑA"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input-password"
          />
          <label htmlFor="confirmPassword" className="input-label">Confirmar Contraseña</label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="CONFIRMAR CONTRASEÑA"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="input-password"
          />

          <BotonAzul type="submit" className="submit-button">Crear</BotonAzul>

          <p className="toggle-form">
            ¿Ya tenés cuenta? 
            <button type="button" onClick={() => setIsLogin(true)} className="toggle-button">Iniciar sesión</button>
          </p>
        </form>
      )}
    </div>
  );
};

export default UserForm;
