import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './editarMascota.css';
import BotonAzul from "../ui/botonAzul"
import BotonVerde from "../ui/botonVerde"
const LocationSelector = ({ lat, lng, setLat, setLng }) => {
  const markerRef = useRef(null);

  useMapEvents({
    click(e) {
      setLat(e.latlng.lat);
      setLng(e.latlng.lng);
    },
  });

  const eventHandlers = {
    dragend() {
      const marker = markerRef.current;
      if (marker != null) {
        const position = marker.getLatLng();
        setLat(position.lat);
        setLng(position.lng);
      }
    },
  };

  return lat && lng ? (
    <Marker
      position={[lat, lng]}
      draggable={true}
      eventHandlers={eventHandlers}
      ref={markerRef}
    />
  ) : null;
};

const EditarMascotaPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mascota, setMascota] = useState(null);
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchMascota = async () => {
      const res = await fetch(`http://localhost:3000/api/pets/${id}`);
      const data = await res.json();

      const location = JSON.parse(data.location);

      setMascota(data);
      setLat(location.lat || null);
      setLng(location.lng || null);
    };
    fetchMascota();
  }, [id]);

  const handleChange = (e) => {
    setMascota({ ...mascota, [e.target.name]: e.target.value });
  };

  const handleFileClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setMascota({ ...mascota, imageurl: imageUrl, file });
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  let uploadedImageUrl = mascota.imageurl;

  if (mascota.file) {
    const formData = new FormData();
    formData.append('file', mascota.file);

    const uploadRes = await fetch('http://localhost:3000/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (uploadRes.ok) {
      const uploadData = await uploadRes.json();
      uploadedImageUrl = uploadData.url;
    } else {
      console.error('Error al subir la imagen');
      return;
    }
  }

  const updateRes = await fetch(`http://localhost:3000/api/pets/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...mascota, imageurl: uploadedImageUrl, location: { lat, lng } }),
  });

  // Acá agregás el console.log para ver la respuesta del backend
  const data = await updateRes.json();
  console.log('Respuesta del backend:', data);

  if (updateRes.ok) {
    navigate('/mascotas-reportadas');
  } else {
    console.error('Error al actualizar la mascota');
  }
};


const reportarComoEncontrado = async () => {
  const confirmar = window.confirm('¿Estás seguro que querés reportar esta mascota como encontrada?');
  if (!confirmar) return;

  const updateRes = await fetch(`http://localhost:3000/api/pets/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'found' }),
  });

  if (updateRes.ok) {
    navigate('/mascotas-reportadas');
  } else {
    console.error('Error al reportar como encontrado');
  }
};

const eliminarMascota = async () => {
  const confirmar = window.confirm('¿Estás seguro que querés eliminar esta mascota?');
  if (!confirmar) return;

  const deleteRes = await fetch(`http://localhost:3000/api/pets/${id}`, {
    method: 'DELETE',
  });

  if (deleteRes.ok) {
    navigate('/mascotas-reportadas'); // Redirigir después de eliminar
  } else {
    console.error('Error al eliminar la mascota');
  }
};



  if (!mascota) return <p>Cargando...</p>;

  return (
    <div className="body-container-editar">
      <div className="editar-mascota-container">
        <h1>Editar reporte de mascota</h1>
        <form onSubmit={handleSubmit} className="form-editar">
          <label>Nombre</label>
          <input
            name="name"
            value={mascota.name}
            onChange={handleChange}
            required
          />

          <label>Foto</label>
          <img src={mascota.imageurl} className="mascota-image" alt="Mascota" />
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
            accept="image/*"
          />
          <BotonAzul type="button" onClick={handleFileClick}>
            Modificar foto
          </BotonAzul>

          <label>Ubicacion</label>
          <input
            name="descripcion"
            value={mascota.descripcion || ''}
            onChange={handleChange}
            required
          />

          {lat && lng && (
            <MapContainer
              center={[lat, lng]}
              zoom={13}
              style={{ height: '400px', width: '100%' }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <LocationSelector lat={lat} lng={lng} setLat={setLat} setLng={setLng} />
            </MapContainer>
          )}

          <BotonAzul type="submit">Guardar</BotonAzul>
          <BotonVerde type="button"  onClick={reportarComoEncontrado}>
            Reportar como encontrado
          </BotonVerde>
          <button type="button" className="botonRojo" onClick={eliminarMascota}>
  Eliminar reporte
</button>
        </form>
      </div>
    </div>
  );
};

export default EditarMascotaPage;
