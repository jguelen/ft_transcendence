import {HEIGHT, TOP_MARGIN} from './pong_constant.js';

export class Team{
	constructor(nbr, backplayer, frontplayer){
		this.nbr = nbr;
		this.backplayer = backplayer;
		this.frontplayer = frontplayer;
		this.score = 0;
	}
}

export class Player{
	constructor(id, global_id = -1, name = "", posx, base_up, base_down, connection){
		this.id = id;
		this.global_id = global_id;
		this.name = name;
		this.connection = connection;
		this.hitbox = 2;
		this.posx = posx;
		this.posy = HEIGHT / 2;
		this.base_up = base_up;
		this.base_down = base_down;
		this.up_player = this.base_up;
		this.down_player = this.base_down;
		this.velocity = 0;
		this.last_velocity = this.posy;
		this.player_vel = 0;
		this.keyUp = false;
		this.keyDown = false;
		
	}
	move(local_player_size, reduce_speed){
		if (this.keyUp == true && this.posy + (this.player_vel * reduce_speed) > local_player_size + TOP_MARGIN) this.posy += (this.player_vel * reduce_speed);
		if (this.keyDown == true && this.posy +(this.player_vel * reduce_speed) < HEIGHT - (local_player_size + TOP_MARGIN)) this.posy += (this.player_vel * reduce_speed);
		if (this.posy >= HEIGHT - (local_player_size + TOP_MARGIN)) this.posy--;
		if (this.posy <= local_player_size + TOP_MARGIN) this.posy++;
	}
	input(game, local_player_size, key, id){
		if (key == this.up_player && this.posy < HEIGHT - (local_player_size + TOP_MARGIN) && id == this.id){
			this.player_vel = -1 * game.PLAYER_SPEED;
			this.keyDown = false; this.keyUp = true;
		}
		if (key == this.down_player && this.posy < HEIGHT - (local_player_size + TOP_MARGIN) && id == this.id){
			this.player_vel = 1 * game.PLAYER_SPEED;
			this.keyUp = false; this.keyDown = true;
		}
		if (key == "." && id == this.id && game.operator){
			const arr = Array.from(game.ball_array_futur);
			let target = arr.slice().reverse().find(obj =>
				obj.touch === false &&
				obj.x < this.posx + (this.hitbox + 6) &&
				obj.x > this.posx - (this.hitbox + 6)
			);
			if (target){
				this.posy = target.y;
				// console.log("did");
			}
			else{
				this.posy = game.ball.y;
			}
		}
	}
	release(game, key, id){
		if (key == this.up_player && id == this.id){
			this.keyUp = false;
			if (this.keyDown == false) this.player_vel = 0;
		}
		if (key == this.down_player && id == this.id){
			this.keyDown = false;
			if (this.keyUp == false) this.player_vel = 0;
		}
	}
	update_velocity(){
		this.velocity = this.posy - this.last_velocity;
		this.last_velocity = this.posy;
	}
}

export class Box {
	constructor(x, y, effect){
		this.x = x;
		this.y = y;
		this.effect = effect;
	}
}
export class Obstacle {
	constructor(x, y){
		this.x = x;
		this.y = y;
	}
}
export class Ball {
	constructor(x, y, dx ,dy){
		this.x = x;
		this.y = y;
		this.dx = dx;
		this.dy = dy;
		this.last_touch = null;
	}
}

export class Client {
	constructor(connection, id, global_id){
		this.connection = connection;
		this.id = id;
		this.global_id = global_id;
		this.gameInstance = null;
		this.tournamentInstance = null;
	}
}

export class GameProject{
	constructor(IA, local, tournament, player_nbr, IA_diff, 
		custom_mode, speeding_mode)
	{
		this.IA = IA;
		this.local = local;
		this.tournament = tournament;
		this.player_nbr = player_nbr;
		this.IA_diff = IA_diff;
		this.custom_mode = custom_mode;
		this.speeding_mode = speeding_mode;
		this.player_array = [];
		this.player_name_array = [];
		this.player_id_array = [];
		this.player_case_array = [];
		this.start = false;
	}
	checkGameProjectCondition(){
		if (this.local && this.player_array.length >= 1)
			return (this.player_array[0] != null);
		else if (!this.local && this.player_nbr == 4 && this.player_array.length >= 4)
			return (this.player_array[0] != null && this.player_array[1] != null &&
					this.player_array[2] != null && this.player_array[3] != null);
		else if (!this.local && this.player_nbr == 2 && this.player_array.length >= 2)
			return (this.player_array[0] != null && this.player_array[1] != null);
		return false
	}
}