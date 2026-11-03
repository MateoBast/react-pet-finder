import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import useAuth from '../services/useAuth';
import "./ReportarMascotaPage.css";
import BotonAzul from "../ui/botonAzul"
import BotonVerde from "../ui/botonVerde"
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const LocationSelector = ({ location, setLocation }) => {
  useMapEvents({
    click(e) {
      setLocation({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return location ? <Marker position={[location.lat, location.lng]} /> : null;
};

const ReportarMascotaPage = () => {
  const { getToken } = useAuth();
  const [nombre, setNombre] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [location, setLocation] = useState(null);
  const [foto, setFoto] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFoto(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!location || !selectedFile) {
    console.error('Faltan ubicación o imagen');
    return;
  }

  const formData = new FormData();
  formData.append('name', nombre);
  formData.append('descripcion', ubicacion);
  formData.append('status', 'lost');
  formData.append('location', JSON.stringify(location));
  formData.append('image', selectedFile);

  try {
    const token = getToken();
    console.log('Token desde hook:', token);

    const response = await fetch('https://react-pet-finder.onrender.com/api/pets', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    console.log('Status de la respuesta:', response.status);
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error al reportar la mascota:', errorText);
      throw new Error('Error al reportar la mascota');
    }

    const newPet = await response.json();
    console.log('Mascota reportada con éxito:', newPet);

    // Actualizar el estado con la URL real de la imagen
    setFoto(newPet.imageUrl);

    // Resetear el formulario (podés decidir si querés resetear o no)
    setNombre('');
    setUbicacion('');
    setLocation(null);
    setSelectedFile(null);

  } catch (err) {
    console.error('Error al reportar mascota:', err);
  }
};


  return (
    <>
      <div style={{ maxWidth: 400, margin: 'auto', padding: 20, fontFamily: 'Arial, sans-serif' }}>
        <h2 style={{ fontWeight: 'bold', fontSize: 24, marginBottom: 10 }}>Reportar mascota</h2>
        <p>Ingresá la siguiente información para realizar el reporte de la mascota</p>

        <form onSubmit={handleSubmit}>
          <label><b>NOMBRE</b></label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            style={{ width: '95%', padding: 8, marginBottom: 15, borderRadius: 4, border: '1px solid #ccc' }}
            required
          />

          <label><b>UBICACIÓN (escribí la dirección)</b></label>
          <input
            type="text"
            value={ubicacion}
            onChange={(e) => setUbicacion(e.target.value)}
            placeholder="Escribí la ubicación"
            style={{ width: '95%', padding: 8, marginBottom: 15, borderRadius: 4, border: '1px solid #ccc' }}
            required
          />

          <label><b>Seleccioná la ubicación en el mapa</b></label>
          <MapContainer
            center={[-34.61, -58.38]}
            zoom={5}
            style={{ height: 200, width: '100%', marginBottom: 10, borderRadius: 8 }}
            zoomControl={false}
            attributionControl={false}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <LocationSelector location={location} setLocation={setLocation} />
          </MapContainer>

          <p className="asd">
            Buscá un punto de referencia para reportar la mascota. Por ejemplo, la ubicación donde lo viste por última vez.
          </p>

          <div
            style={{
              width: '100%',
              height: 150,
              backgroundColor: '#e0e0e0',
              borderRadius: 8,
              marginBottom: 10,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: '#888',
              cursor: 'pointer',
              position: 'relative',
            }}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
              id="file-input"
              required
            />
            <label
              htmlFor="file-input"
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
                position: 'absolute',
                top: 0,
                left: 0,
              }}
            >
              <span>📷 Agregar foto</span>
            </label>
            {foto && (
              <img
                src={foto}
                alt="Vista previa"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: 8,
                  position: 'relative',
                  zIndex: 1,
                }}
              />
            )}
          </div>

          <BotonVerde
            type="submit"
          >
            Reportar mascota
          </BotonVerde>

          <BotonAzul
            type="button"
            onClick={() => {
              setNombre('');
              setUbicacion('');
              setLocation(null);
              setFoto(null);
              setSelectedFile(null);
            }}
          >
            Cancelar
          </BotonAzul>
        </form>
      </div>
    </>
  );
};

export default ReportarMascotaPage;
