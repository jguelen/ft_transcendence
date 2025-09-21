import React from 'react';
import { useState, useEffect } from 'react';

// On définit le type pour un seul élément de la liste
export interface ListItem {
  id: number | string;
  title: string;
  description: string;
}

// On définit les props que notre composant va accepter
interface ScrollableListProps {
  items: ListItem[];
}

const ScrollableList: React.FC<ScrollableListProps> = ({ items }) => {
  return (
    // Le conteneur principal du menu
    // h-96 -> Définit une HAUTEUR FIXE. C'est la clé !
    // overflow-y-auto -> Ajoute une barre de défilement VERTICALE UNIQUEMENT si le contenu dépasse la hauteur de h-96.
    <div className="w-80 h-96 bg-white border border-gray-200 rounded-lg p-4 shadow-md overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Éléments</h2>
      
      {/* Conteneur pour les éléments de la liste */}
      <div className="flex flex-col gap-3">
        {/* On utilise .map() pour créer un élément pour chaque item dans le tableau */}
        {items.map((item) => (
          <div key={item.id} className="bg-gray-50 p-3 rounded-md border border-gray-200 hover:bg-indigo-50 hover:border-indigo-300">
            <h3 className="font-semibold text-gray-800">{item.title}</h3>
            <p className="text-sm text-gray-600">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScrollableList;


// App.tsx

// On simule une API qui retourne plus d'éléments que le conteneur ne peut en afficher
const fetchItemsFromAPI = async (): Promise<ListItem[]> => {
  // En situation réelle, vous utiliseriez fetch() ou axios ici
  // Exemple: const response = await fetch('https://api.yourservice.com/items');
  // const data = await response.json();
  console.log("Appel API simulé...");
  
  // On retourne une longue liste de données pour forcer le défilement
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(
        Array.from({ length: 20 }, (_, i) => ({
          id: i + 1,
          title: `Élément N°${i + 1}`,
          description: `Description de l'élément récupéré via API.`,
        }))
      );
    }, 1000); // Simule une latence réseau de 1 seconde
  });
};


function App() {
  const [items, setItems] = useState<ListItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // useEffect avec un tableau de dépendances vide [] ne s'exécute qu'une seule fois au montage du composant
  useEffect(() => {
    fetchItemsFromAPI()
      .then(data => {
        setItems(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Erreur lors de la récupération des données:", error);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-8">
      {isLoading ? (
        <div className="text-xl font-semibold">Chargement des données...</div>
      ) : (
        <ScrollableList items={items} />
      )}
    </div>
  );
}

export {App};
