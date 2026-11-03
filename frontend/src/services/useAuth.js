import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const useAuth = () => {
const { handleLogin } = useContext(AuthContext);

const login = (id, email, token) => {
  localStorage.setItem('user', JSON.stringify({ id, email, token }));
  handleLogin(id, email, token); // Pasar token también
};

  const getToken = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.token; // Retorna el token si existe
  };

  const logout = () => {
    localStorage.removeItem('user'); // Eliminar el usuario del localStorage
    handleLogin(null, null); // Limpiar el contexto
  };

  return { login, getToken, logout };
};

export default useAuth;
