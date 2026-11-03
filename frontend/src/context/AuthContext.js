import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    return savedUser || null;
  });

  const handleLogin = (id, email, token) => {
    const newUser = { id, email, token };
    localStorage.setItem('user', JSON.stringify(newUser));
    setUser(newUser);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const updateUser = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const updatePassword = async (newPassword) => {
    // Lógica para hacer la llamada a la API y cambiar la contraseña
    const response = await fetch('http://localhost:3000/api/cambiar-contrasena', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`, // Si necesitas el token para autenticar la solicitud
      },
      body: JSON.stringify({ newPassword }),
    });

    if (!response.ok) {
      throw new Error('No se pudo cambiar la contraseña');
    }
  };

  return (
    <AuthContext.Provider value={{ user, handleLogin, handleLogout, updateUser, updatePassword }}>
      {children}
    </AuthContext.Provider>
  );
};
