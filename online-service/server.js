import Fastify from 'fastify';
import path from 'path';
import fs from 'fs/promises';
import websocketPlugin from '@fastify/websocket';
import fastifyStatic from '@fastify/static';
import { fileURLToPath } from 'url';

const fastify = Fastify();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);await fastify.register(websocketPlugin);
await fastify.register(fastifyStatic, {
root: path.join(__dirname, 'upload_image'),
prefix: '/',
});

const onlineUsers = new Map();

fastify.get('/online', { websocket: true }, (connection, req) => {
	console.log("new connection");
	let userId = null;
	connection.on('message', async (message) => {
		try {
			const data = JSON.parse(message.toString());
			console.log("online message :", data.type);
			if (data.type == "connection" && data.id){
				userId = data.id;
				onlineUsers.set(data.id, connection);
				console.log(`User connected: (${data.id})`);
			} else if (data.type == "getOnlineUser" && data.id){
				const isOnline = onlineUsers.has(data.id);
				connection.socket.send(
					JSON.stringify({
						type: "onlineStatus",
						id: data.id,
						online: isOnline
					})
				);
			}
		} catch (e) {
			console.log("Invalid message", message);
		}
	});
	connection.on('close', async () => {
		if (userId){
			onlineUsers.delete(userId);
			console.log(`User disconnected: (${userId})`);
		}
	});
});


fastify.listen({ port: 3004, host: '0.0.0.0' }, err => {
if (err) throw err;
console.log('Server running on http://localhost:3004');
});