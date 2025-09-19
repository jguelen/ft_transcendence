import Fastify from 'fastify';
import path from 'path';
import fs from 'fs/promises';
import websocketPlugin from '@fastify/websocket';
import fastifyStatic from '@fastify/static';
// import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';

const fastify = Fastify();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// const db = new Database('/app/data/avatar_db.db');
// db.prepare(`
//   CREATE TABLE IF NOT EXISTS avatars (
//     id INTEGER PRIMARY KEY,
//     image BLOB NOT NULL
//   )
// `).run();

function isValidPNG(buffer) {
    const pngSignature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
    
    if (buffer.length < 8) return false;

    return buffer.subarray(0, 8).equals(pngSignature);
}

await fastify.register(websocketPlugin);
await fastify.register(fastifyStatic, {
  root: path.join(__dirname, 'upload_image'),
  prefix: '/',
});

fastify.get('/', { websocket: true }, (connection, req) => {
	let avatarId = -1;
	let bufferChunks = [];
	console.log("new connection");
	connection.on('message', async (message) => {
		console.log("message");
		try {
			const data = JSON.parse(message.toString());
			if (data.type === "new avatar") {
				avatarId = data.id;
				connection.send(JSON.stringify({ status: 'id_received' }));
				return;
			}
		} catch (err) {
			console.log("error in message");
			if (avatarId !== -1) {
				bufferChunks.push(message);
			} else {
				connection.send(JSON.stringify({ error: 'Invalid JSON for id' }));
			}
		}
	});

  	connection.on('close', async () => {
		if (avatarId !== -1 && bufferChunks.length > 0) {
			const buffer = Buffer.concat(bufferChunks.map(chunk => Buffer.from(chunk)));
			// console.log(buffer);
			// db.prepare(`
			// 	INSERT INTO avatars (id, image) VALUES (?, ?)
			// 	ON CONFLICT(id) DO UPDATE SET image=excluded.image
			// `).run(avatarId, buffer);

			if (!isValidPNG(buffer)) {
                console.error(`Avatar ${avatarId} : Unvalid PNG file`);
                connection.send?.(JSON.stringify({ error: 'Invalid PNG file' }));
                return;
            }
            
            if (buffer.length > 5 * 1024 * 1024) {
                console.error(`Avatar ${avatarId} : file too heavy (${buffer.length} bytes)`);
				return ;
			}
                
			const sharedPath = `/app/avatars/avatar${avatarId}.png`;
			try {
				await fs.mkdir('/app/avatars', { recursive: true });
				await fs.writeFile(sharedPath, buffer);
				console.log(`Avatar ${avatarId} saved in shared volume: ${sharedPath}`);
				
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