import 'leaflet/dist/leaflet.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserForm from './pages/UserForm';
import Home from './pages/home';
import MisDatosPage from './pages/MisDatosPage';
import Header from './components/header';
import ReportarMascotaPage from './pages/ReportarMascotaPage';
import MascotasReportadasPage from './pages/MascotasReportadasPage';
import ModificarDatosPage from './pages/ModificarDatosPage';
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import EditarMascotaPage from "./pages/editarMascotaPage";
import ModificarContrasenaPage from "./pages/ModificarContraseñaPage";
import HowItWorks from "./pages/HowItWorks";
import MascotasCercanasPage from './pages/MascotasCercanasPage'; 
import ResetPasswordPage from "./pages/ResetPasswordPage";
import RequestPasswordResetPage from "./pages/RequestPasswordResetPage"
import { useLocation } from 'react-router-dom'; // Importar aquí

function AppContent() {
  const location = useLocation(); // Mover aquí
  const disableHeader = location.pathname === '/' || location.pathname === '/reset-password';

  return (
    <>
      <Header className={disableHeader ? 'header-disabled' : ''} />
      <Routes>
        <Route path="/" element={<UserForm />} />
        <Route path="/home" element={<Home />} />
        <Route path="/mis-datos" element={<MisDatosPage />} />
        <Route path="/mascotas-reportadas" element={<MascotasReportadasPage />} />
        <Route path="/reportar-mascota" element={<ReportarMascotaPage />} />
        <Route path="/modificar-datos" element={<ModificarDatosPage />} />
        <Route path="/editar-mascota/:id" element={<EditarMascotaPage />} />
        <Route path="/modificar-contrasena" element={<ModificarContrasenaPage />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/mascotas-cercanas" element={<MascotasCercanasPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/request-password-reset" element={<RequestPasswordResetPage />} />
      </Routes>
    </>
  );
}

function App() {
  const [mascotas, setMascotas] = useState([]);
  const { user } = useContext(AuthContext);

  const fetchMascotas = async () => {
    if (!user) return;
    try {
      const response = await fetch(`http://localhost:3000/api/pets`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      console.log(data);
      setMascotas(data);
    } catch (error) {
      console.error('Error al obtener las mascotas:', error);
    }
  };

  useEffect(() => {
    fetchMascotas();
  }, [user]);

  return (
    <Router>
      <AppContent /> {/* Usar el componente que contiene el header y las rutas */}
    </Router>
  );
}

export default App;
