import React, { useEffect, useState } from 'react';
import { getPets } from '../services/api';

const PetList = () => {
  const [pets, setPets] = useState([]);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await getPets();
        setPets(response.data);
      } catch (error) {
        console.error('Error fetching pets:', error);
      }
    };

    fetchPets();
  }, []);

  return (
    <div>
      <h2>Lista de Mascotas</h2>
      <ul>
        {pets.map((pet) => (
          <li key={pet.id}>{pet.name} - {pet.status}</li>
        ))}
      </ul>
    </div>
  );
};

export default PetList;
