//Import
import {Player} from './pong_class.js';
import {Game} from './pong_web.js';
import {WIDTH} from './pong_constant.js';
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

function saveMatch(mode, data) {
	let details = { custom : data.custom, duration: data.duration};
	const stmt = database.prepare(`
		INSERT INTO matches (mode,
			player1, player2, player3, player4,
			team1_score, team2_score, 
			winner_team, winner1, winner2,
			looser_team, looser1, looser2, details)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
	`);
	stmt.run(mode,
		data.player1, data.player2, data.player3, data.player4,
		data.team1_score, data.team2_score, 
		data.winner_team, data.winner1, data.winner2,
		data.looser_team, data.looser1, data.looser2,
		details);	
}

const pos = [6, WIDTH - 6];

export class Tournament{
	constructor(clients, players, players_keys, operator, custom, IA_diff, speeding_mode){
		this.clients = clients;
		this.players = players;
		this.players_keys = players_keys;
		this.groups = this.make_group();
		this.operator = operator;
		this.custom = custom;
		this.IA_diff = IA_diff;
		this.speeding_mode = speeding_mode;
		this.rank = players.length;
		this.gameInstance = null;
	}
	do_groups(player_list){ 
		let temp_array = [];
		let subgroup = [];
		for (let i = 0; i < player_list.length; i++)
			temp_array.push(player_list[i]);
		if (temp_array.length == 2)
			return temp_array;
		let half = Math.floor(temp_array.length/2);
		subgroup.push(this.do_groups(temp_array.splice(0, half)));
		subgroup.push(this.do_groups(temp_array.splice(0, temp_array.length)));
		return subgroup;
	}
	make_group(){
		if (this.players == null)
			return ;
		let temp_array = [];
		let id = 0;
		this.players.forEach(player => {
			temp_array.push(id);
			id++;
		});
		if (temp_array.length == 2)
			return temp_array;
		let half = Math.floor(temp_array.length/2);
		let groups_temp = [];
		groups_temp.push(this.do_groups(temp_array.splice(0, half)));
		groups_temp.push(this.do_groups(temp_array.splice(0, temp_array.length)));
		return (groups_temp);
	}
	async match(idx1, idx2){
		this.clients[0].connection.send(JSON.stringify({ type: 'matchtitle', msg: String(this.players[idx1].name + " VS "+ this.players[idx2].name) }));
		console.log(this.players[idx1].name , "VS", this.players[idx2].name)
		console.log(this);
		const players_data = [new Player(this.clients[0].id, this.players[idx1].id, this.players[idx1].name, pos[0], this.players_keys[0].keyup, this.players_keys[0].keydown, this.clients[0].connection),
			new Player(this.clients[0].id, this.players[idx2].id, this.players[idx2].name, pos[1], this.players_keys[1].keyup, this.players_keys[1].keydown, this.clients[0].connection)];
		console.log(players);
		this.gameInstance = new Game(this.operator, false, players_data, this.custom, this.IA_diff, this.speeding_mode);
		let data = await this.gameInstance.startGame();
		if (data.winner_team == "team1"){
			this.players[idx2].rank = this.rank;
			this.rank--;
			console.log("Winner of the match is :", this.players[idx1].name)
			return idx1;
		}
		else if (data.winner_team == "team2"){
			this.players[idx1].rank = this.rank;
			this.rank--;
			console.log("Winner of the match is :", this.players[idx2].name)
			return idx2;
		}
		if (this.players[idx1].id != -1 || this.players[idx2].id != -1){
			saveMatch("Tournament Match", data);
		}
		return 0;
	}
	async choose_game(node){
		if (Array.isArray(node) && node.length === 2 && typeof node[0] === typeof 1 && typeof node[1] === typeof 1) {
			console.log("match");
			let winneridx = await this.match(node[0], node[1]);
			return winneridx;
		}
		if (Array.isArray(node)) {
			console.log("submatch");
			node[0] = await this.choose_game(node[0]);
			node[1] = await this.choose_game(node[1]);
		}
		return node;
	}
	async tournament(){
		if (this.groups == null) return ;

		let winneridx = null;
		while (typeof winneridx != typeof 1)
			winneridx = await this.choose_game(this.groups);

		this.players[winneridx].rank = this.rank;
		console.log("The Great Winner of the Tournament is :", this.players[winneridx].name);
		console.log("Ranking :");
		let winner = this.players[winneridx].name;
		this.players.sort((a, b) => a.rank - b.rank);
		this.players.forEach(p => console.log(p.rank + " : " + p.name));
		return winner;
	}
}