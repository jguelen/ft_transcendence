//Import
import {Player} from './pong_class.js';
import {Game} from './pong_web.js';
import {WIDTH} from './pong_constant.js';

const pos = [6, WIDTH - 6];

export class Tournament{
	constructor(clients, operator, players, custom, IA_diff, speeding_mode){
		this.clients = clients;
		this.operator = operator;
		this.players = players;
		this.groups = this.make_group();
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
		console.log(this.players[idx1].name , "VS", this.players[idx2].name)
		const players_data = [new Player(this.clients[0].id, pos[0], 'w', 's', this.clients[0].connection),
						new Player(this.clients[0].id, pos[1], 'ArrowUp', 'ArrowDown', this.clients[0].connection)];
		this.gameInstance = new Game(this.operator, false, players_data, this.custom, this.IA_diff, this.speeding_mode);
		let data = await this.gameInstance.startGame();
		if (data.winner == "team1"){
			this.players[idx2].rank = this.rank;
			this.rank--;
			console.log("Winner of the match is :", this.players[idx1].name)
			return idx1;
		}
		else if (data.winner == "team2"){
			this.players[idx1].rank = this.rank;
			this.rank--;
			console.log("Winner of the match is :", this.players[idx2].name)
			return idx2;
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