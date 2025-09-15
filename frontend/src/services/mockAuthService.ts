// src/services/mockAuthService.ts

// Simule la vérification du nom d'utilisateur
export const checkUsernameAvailability = (username: string): Promise<{ isAvailable: boolean }> => {
  console.log(`(MOCK API) Vérification du pseudo : ${username}`);
  
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // On simule une règle simple : si le pseudo est "admin" ou "test", il est pris.
      if (username.toLowerCase() === 'admin' || username.toLowerCase() === 'test') {
        console.log(`(MOCK API) Le pseudo ${username} est déjà pris.`);
        resolve({ isAvailable: false });
      } else {
        console.log(`(MOCK API) Le pseudo ${username} est disponible.`);
        resolve({ isAvailable: true });
      }
      // Pour tester un échec réseau, tu pourrais décommenter la ligne suivante :
      // reject(new Error("Erreur réseau lors de la vérification du pseudo."));
    }, 1000); // Simule 1 seconde de latence
  });
};

// NOUVELLE FONCTION : Simule la connexion d'un utilisateur
export const loginUser = (credentials: {email: string, password: string}): Promise<{ success: boolean; user: { email: string; token: string } }> => {
  console.log(`(MOCK API) Tentative de connexion pour :`, credentials.email);

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // On simule une règle simple : si le mot de passe est "wrongpassword", la connexion échoue.
      if (credentials.password === 'wrongpassword') {
        console.log(`(MOCK API) Échec de la connexion : mot de passe incorrect.`);
        reject(new Error("L'adresse e-mail ou le mot de passe est incorrect."));
      } else {
        console.log(`(MOCK API) Connexion réussie !`);
        // Une vraie API retournerait des infos sur l'utilisateur et un token. On simule ça.
        resolve({ 
          success: true, 
          user: { email: credentials.email, token: 'fake-jwt-token-12345' } 
        });
      }
    }, 1500); // Simule 1.5 secondes de latence
  });
};

// Simule l'inscription d'un utilisateur
export const registerUser = (data: {email: string, username: string, password: string}): Promise<{ success: boolean; message: string }> => {
  console.log(`(MOCK API) Tentative d'inscription pour :`, data);

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simule une règle simple : si l'email contient "fail", l'inscription échoue.
      if (data.email.includes('fail')) {
        console.log(`(MOCK API) Échec de l'inscription.`);
        reject(new Error("Cette adresse email est invalide ou déjà utilisée."));
      } else {
        console.log(`(MOCK API) Inscription réussie !`);
        resolve({ success: true, message: "Inscription réussie !" });
      }
    }, 2000); // Simule 2 secondes de latence
  });
};
