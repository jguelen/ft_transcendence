import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  // const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Logique d'authentification (étape 4)
  };

  return (
    <div className="h-full flex items-center justify-center bg-transparent">
      <div className="bg-transparent p-8 rounded-lg shadow-md w-full h-full">
        <h2 className="text-2xl font-bold mb-6 text-center">Connexion</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 mb-2">
              Nom d'utilisateur
            </label>
            <input
              id="username"
              placeholder='Email/Username'
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 mb-2">
              Mot de passe
            </label>
            <input
              id="password"
              placeholder='Password'
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Se connecter
          </button>
        </form>
        
        <div className="mt-4 text-center">
          <p>
            Pas encore de compte?{' '}
            <a href="/register" className="text-blue-500 hover:underline">
              S'inscrire
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
