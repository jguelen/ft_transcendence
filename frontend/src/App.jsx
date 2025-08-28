import { useState, useEffect } from 'react';

function App() {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleString());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleString());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Frontend Temporaire - Test d'Infrastructure
        </h1>
        
        <div className="bg-white shadow overflow-hidden rounded-lg p-6 mb-8">
          <p className="text-gray-600 text-center mb-2">
            Ce frontend est uniquement destiné à tester l'infrastructure DevOps.
          </p>
          <p className="text-lg font-semibold text-center text-indigo-600">
            Date actuelle: {currentTime}
          </p>
        </div>
        
        <div className="bg-blue-50 shadow overflow-hidden rounded-lg p-6">
          <h2 className="text-xl font-medium text-gray-900 mb-4">
            Services disponibles:
          </h2>
          <ul className="space-y-3">
            <li className="hover:bg-blue-100 p-2 rounded-md">
              <a href="http://localhost:8080" target="_blank" className="flex text-blue-700 hover:text-blue-900">
                API Gateway
              </a>
            </li>
            <li className="hover:bg-blue-100 p-2 rounded-md">
              <a href="http://localhost:3001" target="_blank" className="flex text-blue-700 hover:text-blue-900">
                Auth Service
              </a>
            </li>
            <li className="hover:bg-blue-100 p-2 rounded-md">
              <a href="http://localhost:3002" target="_blank" className="flex text-blue-700 hover:text-blue-900">
                Game Service
              </a>
            </li>
            <li className="hover:bg-blue-100 p-2 rounded-md">
              <a href="http://localhost:3003" target="_blank" className="flex text-blue-700 hover:text-blue-900">
                Profile Service
              </a>
            </li>
            <li className="hover:bg-blue-100 p-2 rounded-md">
              <a href="http://localhost:3004" target="_blank" className="flex text-blue-700 hover:text-blue-900">
                Chat Service
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
