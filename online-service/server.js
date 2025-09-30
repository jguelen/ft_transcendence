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
root: path.join(__dirname, ''),
prefix: '/',
});

const onlineUsers = new Map();

function broadcastFriendUpdate() {
  for (const conn of onlineUsers.values()) {
    conn.send(JSON.stringify({ type: "friendUpdate" }));
  }
}

fastify.register(async function (fastify){
	fastify.get('/online', { websocket: true }, (connection, req) => {
		console.log("new connection");
		let userId = null;
		connection.on('message', async (message) => {
			try {
				const data = JSON.parse(message.toString());
				// console.log("online message :", data.type);
				// console.log("data :", data);
				if (data.type == "connection" && data.id){
					userId = data.id;
					onlineUsers.set(data.id, connection);
					// console.log(`User connected: (${data.id})`);
					broadcastFriendUpdate();
				} else if (data.type == "getOnlineUser" && data.id){
					// console.log("received");
					const isOnline = onlineUsers.has(data.id);
					connection.send(
						JSON.stringify({
							type: "onlineStatus",
							id: data.id,
							online: isOnline
						})
					);
				}else if (data.type === "friendUpdate") {
					broadcastFriendUpdate();
				}
			} catch (e) {
				console.log("Invalid message", message);
			}
		});
		connection.on('close', async () => {
			if (userId){
				onlineUsers.delete(userId);
				console.log(`User disconnected: (${userId})`);
				broadcastFriendUpdate();
			}
		});
	});
});

fastify.listen({ port: 3004, host: '0.0.0.0' }, err => {
	if (err) throw err;
	console.log('Server running on http://localhost:3004');
});