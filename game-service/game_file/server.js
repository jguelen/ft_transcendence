//Import
import {WIDTH, IA_DIFF_NAME} from './pong_constant.js';
import {Player, Client, GameProject} from './pong_class.js';
import {Tournament} from './pong_tournament.js';
import {Game} from './pong_web.js';
import * as utils from './pong_web_utils.js';

import Fastify from 'fastify';
import websocketPlugin from '@fastify/websocket';
import fastifyStatic from '@fastify/static';
import path from 'path';
import { fileURLToPath } from 'url';

import Database from 'better-sqlite3';

//Database
const database = new Database('./pong_database.db');
database.exec(`
CREATE TABLE IF NOT EXISTS matches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    mode TEXT,
    player1 TEXT,
    player2 TEXT,
	player3 TEXT,
    player4 TEXT,
    team1_score INTEGER,
    team2_score INTEGER,
    winner TEXT,
	winner_player1 TEXT,
	winner_player2 TEXT,
	looser TEXT,
	looser_player1 TEXT,
	looser_player2 TEXT,
    details TEXT -- JSON
)`);

let operator = true;

//Websocket
let clients = [];
let id = 0;
let projectsArray = [];
let gameInstance_array = [];
let tournamentInstance_array = [];
const pos = [6, WIDTH - 6, 16, WIDTH - 16];

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fastify = Fastify();

await fastify.register(websocketPlugin);
await fastify.register(fastifyStatic, {
  root: path.join(__dirname, 'game'),
  prefix: '/',
});

fastify.register(async function (fastify){
	fastify.get('/ws', {websocket : true }, (connection, req) => {
		let new_client = new Client(connection, id); id++;
		clients.push(new_client);
		console.log("New Client", new_client.id);
		connection.send(JSON.stringify({type: 'welcome', id: new_client.id}));
		connection.on('message', (message) => {
			let actual_client = clients.find(client => client.connection === connection);
			try {
			    const data = JSON.parse(message);
				if ((data.type === 'keydown' || data.type === 'keyup')) {
					for (let tournamentInstance of tournamentInstance_array){
						if (!tournamentInstance.gameInstance.players.some(player => player.connection === connection))
							continue;
						if (data.type === 'keydown')
							tournamentInstance.gameInstance.inputpressed(data.key, data.id);
						else
							tournamentInstance.gameInstance.inputrelease(data.key, data.id);
					}
					for (let gameInstance of gameInstance_array){
						if (!gameInstance.players.some(player => player.connection === connection))
							continue;
						if (data.type === 'keydown'){
							gameInstance.inputpressed(data.key, data.id);
						}
						else{
							gameInstance.inputrelease(data.key, data.id);
						}
					}
				}
				if (data.type === 'gamesearch'){
					// console.log(data);
					// console.log("new Project search");
					for (let projects of projectsArray){
						if (projects.IA === data.gameparam.IA &&
							projects.local === data.gameparam.local &&
							projects.tournament === data.gameparam.tournament &&
							projects.player_nbr === data.gameparam.player_nbr &&
							projects.IA_diff === data.gameparam.IA_diff &&
							projects.custom_mode === data.gameparam.custom_mode &&
							projects.speeding_mode === data.gameparam.speeding_mode &&
							projects.player_array.length < projects.player_nbr
						)
						projects.player_array.push(actual_client);
						projects.player_name_array.push(data.gameparam.player1);
						
						projects.player_case_array.push({keyup: data.keys.keysup.p1, keydown: data.keys.keysdown.p1});
						// console.log("project", projects);
						return ;
					}
					// console.log("new Project");
					let newProject = new GameProject(
						data.gameparam.IA,
						data.gameparam.local,
						data.gameparam.tournament,
						data.gameparam.player_nbr,
						data.gameparam.IA_diff,
						data.gameparam.custom_mode,
						data.gameparam.speeding_mode
					);
					newProject.player_array.push(actual_client);
					newProject.player_name_array.push(data.gameparam.player1); 
					newProject.player_case_array.push({keyup: data.keys.keysup.p1, keydown: data.keys.keysdown.p1});
					if (newProject.local)
						newProject.player_case_array.push({keyup: data.keys.keysup.p2, keydown: data.keys.keysdown.p2});
					if (newProject.local && !newProject.IA)
						newProject.player_name_array.push(data.gameparam.player2);
					else if (newProject.local && newProject.IA)
						newProject.player_name_array.push(String('IA') + IA_DIFF_NAME[data.gameparam.IA_diff]);
					projectsArray.push(newProject);
					// console.log("new project", newProject);
				}
			} catch (e) {}
		});
		connection.on('close', () => {
			const index = clients.indexOf(connection.socket);
			console.log("Client Leaving", clients[index]);
			if (index !== -1) clients.splice(index, 1);
		});
	});
})

fastify.listen({ port: 3000, host: '0.0.0.0' }, err => {
  if (err) throw err;
  console.log('Server listening at http://localhost:3000');
});

process.on('uncaughtException', console.error);
process.on('unhandledRejection', console.error);


/*Game
let tournament = false;
let local = true;
let IA = true;
let custom = true;
let IA_diff = 1;
let player_nbr = 4;
*/
setInterval(() => {
	const index = projectsArray.findIndex(project => project.checkGameProjectCondition() == true);
	if (index != -1){
		let project = projectsArray[index];
		create_game(project.local, project.tournament, project.IA,
			project.IA_diff, project.player_nbr, project.custom_mode,
			project.speeding_mode, project.player_array, project.player_name_array,
			project.player_case_array
		)
		projectsArray.splice(index, 1);
	}
}, 1000);

function saveMatch({ mode, player1, player2, player3, player4,
			team1_score, team2_score, 
			winner, winner_player1, winner_player2,
			looser, looser_player1, looser_player2,
			details }) {
    const stmt = database.prepare(`
        INSERT INTO matches (mode, player1, player2, player3, player4,
			team1_score, team2_score, 
			winner, winner_player1, winner_player2,
			looser, looser_player1, looser_player2, details)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(mode, player1, player2, player3, player4,
			team1_score, team2_score, 
			winner, winner_player1, winner_player2,
			looser, looser_player1, looser_player2,
			details ? JSON.stringify(details) : null);
}

async function create_game(local, tournament, IA, IA_diff,
							player_nbr, custom, speeding_mode, 
							game_players, players_name, players_keys){
	// console.log("new Game");
	if (local){
		if (tournament == true){
			let player_list = [
			{name : "Ness", rank : 0}, 
			{name : "Lucas", rank : 0},
			{name : "Wolf", rank : 0},
			{name : "Amphinobi", rank : 0}, 
			{name : "Mewtwo", rank : 0},
			{name : "Mario", rank : 0},
			{name : "Kirby", rank : 0},
			{name : "Shulk", rank : 0},
			{name : "Pikachu", rank : 0}, 
			{name : "Link", rank : 0},
			{name : "Zelda", rank : 0},
			{name : "Mr.Game and Watch", rank : 0}, 
			{name : "Ike", rank : 0},
			{name : "Chrom", rank : 0},
			{name : "Luigi", rank : 0},
			{name : "Bowser", rank : 0}];
	
			let n = player_list.length;
			if (n > 0 && (n & (n - 1)) === 0)
				console.log("Tournament don't have enough player");
			let tournamentInstance = new Tournament(game_players, operator, player_list, custom, IA_diff);
			tournamentInstance_array.push(tournamentInstance);
			let winner = await tournamentInstance.tournament();
			if (winner != null)
				console.log("Winner is :", winner);
			else
				console.log("Tournament crash");
			for (let player of game_players){
				player.connection.send(JSON.stringify({ type: 'end', msg: String("Winner is :" + winner)}));
			}
			let idx = tournamentInstance_array.indexOf(tournamentInstance);
			tournamentInstance_array.splice(idx, 1);
		} else {
			const players = [
				new Player(game_players[0].id, players_name[0], pos[0], players_keys[0].keyup, players_keys[0].keydown, game_players[0].connection),
				new Player(game_players[0].id, players_name[1], pos[1], (IA) ? "" : players_keys[1].keyup, (IA) ? "" : players_keys[1].keydown, game_players[0].connection)
			];
	
			let gameInstance = new Game(operator, IA, players, custom, IA_diff, speeding_mode);
			gameInstance_array.push(gameInstance);
			let data = await gameInstance.startGame();
			console.log("Winner is :", data.winner);
			saveMatch({
				mode: "1v1 Local",
				player1: data.player1,
				player2: data.player2,
				player3: null,
				player4: null,
				team1_score: data.team1_score,
				team2_score: data.team2_score,
				winner: data.winner,
				winner_player1: data.winner_player1,
				winner_player2: null,
				looser: data.looser,
				looser_player1: data.looser_player1,
				looser_player2: null,
				details: { customMode: true, duration: data.duration}
			});
			for (let player of game_players){
				player.connection.send(JSON.stringify({ type: 'end', msg : String("Winner is :" + data.winner)}));
			}
			let idx = gameInstance_array.indexOf(gameInstance);
			gameInstance_array.splice(idx, 1);
		}
	
	} else {
		while (id < player_nbr){
			await utils.sleep(1000);
		}
		
		let players = [];
		for (let i = 0; i < game_players.length; i++){
			players.push(new Player(game_players[i].id, players_name[i], pos[i], 'w', 's', game_players[i].connection))
		}
		// game_players.map(player => {
		// 	const tmp_pos = (client.id < 4) ? pos[client.id] : 0;
		// 	return new Player(client.id, tmp_pos, 'w', 's', client.connection);
		// });
	
		let gameInstance = new Game(operator, IA, players, custom, IA_diff, speeding_mode);
		gameInstance_array.push(gameInstance);
		let data = await gameInstance.startGame();
		console.log("Winner is :", data.winner);
		saveMatch({
			mode: (player_nbr == 4) ? "2v2 Online" : "1v1 Online",
			player1: data.player1,
			player2: data.player2,
			player3: data.player3,
			player4: data.player4,
			team1_score: data.team1_score,
			team2_score: data.team2_score,
			winner: data.winner,
			winner_player1: data.winner_player1,
			winner_player2: data.winner_player2,
			looser: data.looser,
			looser_player1: data.looser_player1,
			looser_player2: data.looser_player2,
			details: { customMode: true, duration: data.duration }
		});
		for (let player of game_players){
			player.connection.send(JSON.stringify({ type: 'end', msg : String("Winner is :" + data.winner)}));
		}
		let idx = gameInstance_array.indexOf(gameInstance);
		gameInstance_array.splice(idx, 1);
	}

}

