import Fastify from 'fastify';

const server = Fastify({
  logger: true
});

// Route de test
server.get('/', async () => {
  return { 
    status: 'OK', 
    service: 'PROFILE-SERVICE (TEMPORAIRE)', 
    message: 'Ce serveur est uniquement destiné à tester l\'infrastructure DevOps',
    timestamp: new Date().toISOString()
  };
});

// Route de santé
server.get('/health', async () => {
  return { status: 'OK' };
});

// Démarrage du serveur
const start = async () => {
  try {
    const port = process.env.PORT ? parseInt(process.env.PORT) : 3003;
    await server.listen({ port: port, host: '0.0.0.0' });
    console.log(`[TEMPORAIRE] Service de profil démarré sur le port ${port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
