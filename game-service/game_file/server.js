//Import
import {WIDTH, IA_DIFF_NAME} from './pong_constant.js';
import {Player, Client, GameProject} from './pong_class.js';
import {Tournament} from './pong_tournament.js';
import {Game} from './pong_web.js';
import * as utils from './pong_web_utils.js';

import Fastify from 'fastify';
import websocketPlugin from '@fastify/websocket';
import fastifyStatic from '@fastify/static';
import fastifyCors from '@fastify/cors';
import fastifyCookie from '@fastify/cookie';
import path from 'path';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';

import Database from 'better-sqlite3';

//Database
const database = new Database('/app/data/pong_database.db');
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
    winner_team TEXT,
	winner1 TEXT,
	winner2 TEXT,
	looser_team TEXT,
	looser1 TEXT,
	looser2 TEXT,
    details TEXT -- JSON
)`);

let operator = true;

//Websocket
let clients = [];
let id = 1;
let projectsArray = [];
let gameInstance_array = [];
let tournamentInstance_array = [];
const pos = [6, WIDTH - 6, 16, WIDTH - 16];

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fastify = Fastify();

await fastify.register(fastifyCors, { origin: true, credentials: true });
await fastify.register(websocketPlugin);
await fastify.register(fastifyStatic, {
  root: path.join(__dirname, 'game'),
  prefix: '/',
});

//JWT

const { JWT_SECRET } = process.env

fastify.register(fastifyCookie, {
  secret: JWT_SECRET,
});

function verifyJWT(request, reply, done) {
	const token = request.cookies['ft_transcendence_jwt'];
	if (!token) {
		reply.status(401).send({ error: 'JWT cookie missing' });
		return;
	}
	try {
		const decoded = jwt.verify(token, JWT_SECRET);
		request.user = decoded;
		done();
	} catch (err) {
		reply.status(401).send({ error: 'Invalid token' });
	}
}

//Put the alias of logged user instead of saved name
//{ preHandler: verifyJWT },
fastify.get('/api/game/matches/:id', { preHandler: verifyJWT }, async (request, reply) => {
	console.log('Cookies reçus:', request.cookies);
	const id = request.params.id;
	const id_rows = database.prepare(`
		SELECT * FROM matches
		WHERE player1 LIKE ?
			OR player2 LIKE ?
			OR player3 LIKE ?
			OR player4 LIKE ?
		ORDER BY date DESC
	`).all(`%"id":${id}%`, `%"id":${id}%`, `%"id":${id}%`, `%"id":${id}%`);
	if (!id_rows || id_rows.length === 0) {
		reply.status(404).send({ error: "Match not found" });
		return;
	}
	let iddata_array = [];
	let win_nbr = 0;
	let loose_nbr = 0;
	let len = 0;
	id_rows.forEach(row => {
		let player1 = row.player1 ? JSON.parse(row.player1) : null;
        let player2 = row.player2 ? JSON.parse(row.player2) : null;
        let player3 = row.player3 ? JSON.parse(row.player3) : null;
        let player4 = row.player4 ? JSON.parse(row.player4) : null;
        let winner1 = row.winner1 ? JSON.parse(row.winner1) : null;
        let winner2 = row.winner2 ? JSON.parse(row.winner2) : null;
        let looser1 = row.looser1 ? JSON.parse(row.looser1) : null;

		let win = false;
		let team = 0;
		if ((winner1 && winner1.id == id) || (winner2 && winner2.id == id)){
			win = true;
			win_nbr++;
		} else {
			loose_nbr++;
		}
		if (len < 20){
			if ((player1 && player1.id == id) || (player3 && player3.id == id))
				team = 1;
			else if ((player2 && player2.id == id) || (player4 && player4.id == id))
				team = 2;
			if (team == 0) {
				return;
			}
			const lastDate = new Date(row.date.replace(' ', 'T'));
			const now = Date.now();
			const diffMs = now - lastDate.getTime();
			const diffHours = diffMs / 1000 / 60 / 60;

			let time_since = "";
			if (diffHours < 1) {
				const diffMins = Math.floor(diffMs / 1000 / 60);
				time_since = diffMins + "min";
			} else {
				time_since = Math.floor(diffHours) + "h";
			}

			let oponent = {id : -1, name : "Unknown"};;
			if (win) {
				oponent = looser1 ? looser1 : {id : -1, name : "Unknown"};
			} else {
				oponent = winner1 ? winner1 : {id : -1, name : "Unknown"};
			}
			let iddata = {
				victory : win,
				oponent : oponent,  
				score : (team == 1) ? String(row.team1_score + " - " + row.team2_score) : String(row.team2_score + " - " + row.team1_score),
				time_since : time_since,
				team : (player3 != null && player4 != null) ? true : false
			}
			iddata_array.push(iddata);
		}
	})
	reply.send({iddata_array, win_nbr, loose_nbr});
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
					console.log(data);
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
						projects.player_name_array.push(data.name);
						projects.player_id_array.push(data.id);
						projects.player_case_array.push({keyup: data.keys.keysup.p1, keydown: data.keys.keysdown.p1});
						// console.log("project", projects);
						return ;
					}
					console.log("new Project");
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
					if (newProject.tournament){
						newProject.player_name_array = data.tournament_players;
						newProject.player_id_array = data.ids;
					} else {
						newProject.player_name_array.push(data.name);
						newProject.player_id_array.push(data.id);
					}
					newProject.player_case_array.push({keyup: data.keys.keysup.p1, keydown: data.keys.keysdown.p1});
					if (newProject.local){
						newProject.player_array.push(actual_client);
						newProject.player_case_array.push({keyup: data.keys.keysup.p2, keydown: data.keys.keysdown.p2});
					}
					if (newProject.local && newProject.IA)
						newProject.player_name_array.push(String('IA') + IA_DIFF_NAME[data.gameparam.IA_diff]);
					else if (newProject.local && !newProject.IA){
						newProject.player_name_array.push("Local player");
					}
					projectsArray.push(newProject);
					console.log(newProject);
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

setInterval(() => {
	const index = projectsArray.findIndex(project => project.checkGameProjectCondition() == true);
	if (index != -1){
		let project = projectsArray[index];
		create_game(project.local, project.tournament, project.IA,
			project.IA_diff, project.player_nbr, project.custom_mode,
			project.speeding_mode, project.player_array, project.player_name_array,
			project.player_id_array, project.player_case_array
		)
		projectsArray.splice(index, 1);
	}
}, 1000);

function saveMatch(mode, data) {
	const stmt = database.prepare(`
		INSERT INTO matches (
			mode, player1, player2, player3, player4,
			team1_score, team2_score, 
			winner_team, winner1, winner2,
			looser_team, looser1, looser2, details
		) VALUES (
			@mode, @player1, @player2, @player3, @player4,
			@team1_score, @team2_score, 
			@winner_team, @winner1, @winner2,
			@looser_team, @looser1, @looser2, @details
		)
	`);
	stmt.run({
		mode,
		player1: typeof data.player1 === 'object' ? JSON.stringify(data.player1) : data.player1,
		player2: typeof data.player2 === 'object' ? JSON.stringify(data.player2) : data.player2,
		player3: typeof data.player3 === 'object' ? JSON.stringify(data.player3) : data.player3,
		player4: typeof data.player4 === 'object' ? JSON.stringify(data.player4) : data.player4,
		team1_score: data.team1_score,
		team2_score: data.team2_score,
		winner_team: data.winner_team,
		winner1: typeof data.winner1 === 'object' ? JSON.stringify(data.winner1) : data.winner1,
		winner2: typeof data.winner2 === 'object' ? JSON.stringify(data.winner2) : data.winner2,
		looser_team: data.looser_team,
		looser1: typeof data.looser1 === 'object' ? JSON.stringify(data.looser1) : data.looser1,
		looser2: typeof data.looser2 === 'object' ? JSON.stringify(data.looser2) : data.looser2,
		details: JSON.stringify({ custom: data.custom, duration: data.duration })
	});
}

/* Here are what each parameer stan for :
local : Is the game local ?
tournament : Is it a tournament ?
IA : Is their a IA with IA_diff difficulty
player_nbr : The number of player 2, 4
custom : Is the custom mode active ?
speeding_mode : Is the speedind mode active ?
players_list : clients list
players_name : The list of the names of the players
players_id : The list of the names of the players
players_keys : The list of the keys of the playes
*/
async function create_game(local, tournament, IA, IA_diff,
							player_nbr, custom, speeding_mode, 
							players_list,
							players_name,
							players_id,
							players_keys){
	console.log("new Game");
	// console.log("keys", players_keys);
	if (local){
		if (tournament == true){
			let tournament_players = [
				{name : players_name[0], rank : 0, id : players_id[0]}, 
				{name : players_name[1], rank : 0, id : players_id[1]}, 
				{name : players_name[2], rank : 0, id : players_id[2]}, 
				{name : players_name[3], rank : 0, id : players_id[3]},  
				{name : players_name[4], rank : 0, id : players_id[4]}, 
				{name : players_name[5], rank : 0, id : players_id[5]}, 
				{name : players_name[6], rank : 0, id : players_id[6]}, 
				{name : players_name[7], rank : 0, id : players_id[7]}];
				// {name : "Ness", rank : 0}, 
				// {name : "Lucas", rank : 0},
				// {name : "Wolf", rank : 0},
				// {name : "Amphinobi", rank : 0}, 
				// {name : "Mewtwo", rank : 0},
				// {name : "Mario", rank : 0},
				// {name : "Kirby", rank : 0},
				// {name : "Shulk", rank : 0}];
				// {name : "Pikachu", rank : 0}, 
				// {name : "Link", rank : 0},
				// {name : "Zelda", rank : 0},
				// {name : "Mr.Game and Watch", rank : 0}, 
				// {name : "Ike", rank : 0},
				// {name : "Chrom", rank : 0},
				// {name : "Luigi", rank : 0},
				// {name : "Bowser", rank : 0}];
	
			if (tournament_players.length != 8){
				console.log("Tournament don't have enough player");
				return ;
			}
			console.log("keys", players_keys);
			let tournamentInstance = new Tournament(
					players_list, tournament_players, players_keys,
					operator, custom, IA_diff, speeding_mode);
			tournamentInstance_array.push(tournamentInstance);
			let winner = await tournamentInstance.tournament();
			if (winner != null)
				console.log("Winner is :", winner);
			else
				console.log("Tournament crash");
			for (let player of players_list){
				player.connection.send(JSON.stringify({ type: 'end', msg: String("Winner is :" + winner)}));
			}
			let idx = tournamentInstance_array.indexOf(tournamentInstance);
			tournamentInstance_array.splice(idx, 1);
		} else {
			players_list[0].connection.send(JSON.stringify({ type: 'matchtitle', msg: String(players_name[0] + " VS " + players_name[1]) }));
			const players = [
				new Player(players_list[0].id, players_id[0], players_name[0], pos[0], players_keys[0].keyup, players_keys[0].keydown, players_list[0].connection),
				new Player(players_list[0].id, players_id[1], players_name[1], pos[1], (IA) ? "" : players_keys[1].keyup, (IA) ? "" : players_keys[1].keydown, players_list[0].connection)
			];
	
			let gameInstance = new Game(operator, IA, players, custom, IA_diff, speeding_mode);
			gameInstance_array.push(gameInstance);
			let data = await gameInstance.startGame();
			console.log("Winner is :", data.winner1.name);
			saveMatch("1v1 Local", data);
			for (let player of players_list){
				player.connection.send(JSON.stringify({ type: 'end', msg : String("Winner is :" + data.winner1.name)}));
			}
			let idx = gameInstance_array.indexOf(gameInstance);
			gameInstance_array.splice(idx, 1);
		}
	
	} else {
		while (id < player_nbr){
			await utils.sleep(1000);
		}
		
		let message = "";
		if (player_nbr == 2){
			message = String(players_name[0] + " VS " + players_name[1]);
		} else if (player_nbr == 4){
			message = String(players_name[0] + " and " + players_name[2] + " VS " + players_name[1] + " and " + players_name[3]);
		}

		let players = [];
		for (let i = 0; i < players_list.length; i++){
			players.push(new Player(players_list[i].id, players_id[i], players_name[i], pos[i], players_keys[0].keyup, players_keys[0].keydown, players_list[i].connection))
			players_list[i].connection.send(JSON.stringify({ type: 'matchtitle', msg: message }));
		}
	
		
		let gameInstance = new Game(operator, IA, players, custom, IA_diff, speeding_mode);
		gameInstance_array.push(gameInstance);
		let data = await gameInstance.startGame();
		if (player_nbr == 2)
			message = "Winner is :" + data.winner1.name;
		else {
			message = "Winners are :" + data.winner1.name + "and" + data.winner2.name;
		}
		console.log(message);
		saveMatch((player_nbr == 4) ? "2v2 Online" : "1v1 Online" , data);
		for (let player of players_list){
			player.connection.send(JSON.stringify({ type: 'end', msg : message}));
		}
		let idx = gameInstance_array.indexOf(gameInstance);
		gameInstance_array.splice(idx, 1);
	}

}

