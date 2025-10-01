import Fastify from 'fastify';
import path from 'path';
import fs from 'fs/promises';
import websocketPlugin from '@fastify/websocket';
import fastifyStatic from '@fastify/static';
import fastifyJwt from '@fastify/jwt';
import fastifyCookie from '@fastify/cookie';
import { fileURLToPath } from 'url';

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable must be set');
}

const fastify = Fastify();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function isValidPNG(buffer) {
  const pngSignature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);

  if (buffer.length < 8) return false;

  return buffer.subarray(0, 8).equals(pngSignature);
}

await fastify.register(fastifyJwt, {
  secret: process.env.JWT_SECRET,
  cookie: {
    cookieName: 'ft_transcendence_jwt'
  }
});
await fastify.register(fastifyCookie);
await fastify.register(websocketPlugin);
await fastify.register(fastifyStatic, {
  root: path.join(__dirname, 'upload_image'),
  prefix: '/',
});

fastify.get('/', { websocket: true }, async (connection, req) => {
  try {
    await req.jwtVerify();
  } catch (err) {
    console.error(`WebSocket connection error: ${err.message}`);
    connection.socket.close(4001, 'Invalid JWT');
    return;
  }

  const userId = req.user?.userId;
  if (!userId) {
    console.error(`WebSocket connection error: Missing userId in JWT`);
    connection.socket.close(4001, 'Missing userId in JWT');
    return;
  }
  console.log(`WebSocket connection authenticated for user ${userId}`);

  let bufferChunks = [];
  let totalBufferSize = 0;
  const MAX_AVATAR_SIZE = 5 * 1024 * 1024;
  const MAX_CHUNKS_SIZE = 6 * 1024 * 1024;
  connection.on('message', (message) => {
    const chunkSize = Buffer.byteLength(message);
    totalBufferSize += chunkSize;
    if (totalBufferSize > MAX_CHUNKS_SIZE) {
      console.error(`Avatar upload exceeded chunk limit for user ${userId}`);
      connection.send?.(JSON.stringify({ error: 'Avatar upload too large' }));
      connection.socket.close(4000, 'Avatar upload too large');
      return;
    }
    bufferChunks.push(message);
  });

  connection.on('close', async () => {
    if (bufferChunks.length > 0) {
      const buffer = Buffer.concat(bufferChunks.map(chunk => Buffer.from(chunk)));

      if (!isValidPNG(buffer)) {
        console.error(`Avatar ${userId} : Unvalid PNG file`);
        connection.send?.(JSON.stringify({ error: 'Invalid PNG file' }));
        return;
      }

      if (buffer.length > MAX_AVATAR_SIZE) {
        console.error(`Avatar ${userId} : file too heavy (${buffer.length} bytes)`);
        return;
      }

      const sharedPath = `/app/avatars/avatar${userId}.png`;
      try {
        await fs.mkdir('/app/avatars', { recursive: true });
        await fs.writeFile(sharedPath, buffer);
        console.log(`Avatar ${userId} saved in shared volume: ${sharedPath}`);

        const stats = await fs.stat(sharedPath);
        console.log(`Folder created with size: ${stats.size} bytes`);

      } catch (err) {
        console.error(`Error shared volume:`, err);
      }
    }
  });
});

fastify.get('/cleanup/:id', async (request, reply) => {
  const { id } = request.params;
  const avatarPath = `/app/avatars/avatar${id}.png`;

  try {
    const buffer = await fs.readFile(avatarPath);
    if (!isValidPNG(buffer)) {
      await fs.unlink(avatarPath);
      return { success: true, message: 'Corrupted avatar removed' };
    }
    return { success: true, message: 'Avatar is valid' };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

fastify.listen({ port: 3003, host: '0.0.0.0' }, err => {
  if (err) throw err;
  console.log('Server running on http://localhost:3003');
});
