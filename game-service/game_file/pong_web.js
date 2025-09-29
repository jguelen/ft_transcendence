//Import
// import * as global from './pong_class.js';
import {FPS, HEIGHT, WIDTH, BASE_PLAYER_SPEED,
	BASE_BALL_SPEED, MAX_BOUNCE_ANGLE, TOP_MARGIN,
	KILL_MARGIN, BASE_MAX_SCORE, BASE_COLOR,
	BASE_SECONDARY_COLOR} from './pong_constant.js';
import * as custom from './pong_custom.js';
import {Team, Player, Ball, Obstacle} from './pong_class.js';
import * as utils from './pong_web_utils.js';

export class Game {
	constructor(operator, IA, players, custom_mode, IA_diff, speeding_mode){
		this.timestart = Date.now();
		this.timeend = 0;
		this.operator = operator;
		this.IA = IA;
		this.players = players;
		this.custom_mode = custom_mode;
		this.PLAYER_SPEED = BASE_PLAYER_SPEED;
		this.BALL_SPEED = BASE_BALL_SPEED;
		this.start = false;
		this.over = false;
		this.point_value = 1;
		this.MAX_SCORE = BASE_MAX_SCORE;
		this.speeding_mode = speeding_mode;
		this.ball = new Ball(WIDTH / 2, Math.floor(HEIGHT / 2),
					Math.random() < 0.5 ? -1 : 1, 
					Math.random() < 0.5 ? -1 : 1);
		let angle = (Math.random() - 0.5) * MAX_BOUNCE_ANGLE;
		let dir = Math.random() < 0.5 ? 1 : -1;
		this.ball.dx = dir * this.BALL_SPEED * Math.cos(angle);
		this.ball.dy = this.BALL_SPEED * Math.sin(angle);

		this.exchange_nbr = 0;
		this.bounce_nbr = 0;
		this.velocity_use = 0;
		this.player_size = 5;
		this.ball_size = 1;
		this.ball_array = new Set();
		this.error_margin = 65;
		this.target_IA = {x : WIDTH / 2, y : Math.floor(HEIGHT / 2)};
		this.pause = false;
		this.vision = false;
		this.futur_vision = 60;
		this.ball_futur = {...this.ball};
		this.ball_array_futur = new Set();
		this.ball_array_past = [];
		this.ball_real_array_futur = new Set();
		this.effect = 0.15;
		this.in_effect = false;
		this.box_array = [];
		this.true_speeding_ball = false;
		this.multiple_ball = false;
		this.multiple_ball_array = [];
		this.obstacle_array = [];
		this.negative = false;
		this.snake_mode = false;
		this.snake_array = [];
		this.invisible_player = false;
		this.meteorites = false;
		this.meteorites_array = [];
		this.gold_game = false;
		this.epic_moment = false;
		this.portal = false;
		this.invisible_ball_active = false;
		this.invisible_ball = false;
		this.starfall = false;
		this.blackhole = false;
		this.hallucination = false;
		this.IA_diff = IA_diff ;
		switch (IA_diff){
			case 0 :
				this.error_margin = 0; this.futur_vision = 200; break;
			case 1 :
				this.error_margin = 65; this.futur_vision = 60; break;
			case 2 :
				this.error_margin = 55; this.futur_vision = 31; break;
			case 3 :
				this.error_margin = 41; this.futur_vision = 15; break;
			case 4 :
				this.error_margin = 31; this.futur_vision = 12; break;
		}

		this.team1 = null;
		this.team2 = null;
		if (this.players.length >= 3){
			this.team1 = new Team(1, this.players[0], this.players[2]);
		} else {
			this.team1 = new Team(1, this.players[0], null);
		}
		if (this.players.length >= 4){
			this.team2 = new Team(2, this.players[1], this.players[3]);
		} else {
			this.team2 = new Team(2, this.players[1], null);
		}
		this.teams = [this.team1, this.team2];

		this._gameOverResolver = null;
		this.game_color = BASE_COLOR;
		this.game_sec_color = BASE_SECONDARY_COLOR;
	}

	async startGame(){
		return new Promise((resolve, reject) => {
			this._gameOverResolver = resolve;
			this.gameLoop();

			//Check if the player is moving to give Velocity to the Ball
			setInterval(() => {
				this.teams.forEach(team =>{
					team.backplayer.update_velocity();
					if (team.frontplayer)
						team.frontplayer.update_velocity();
					})
			}, 100);

			//Update the IA every 1 sec
			if (this.IA == true){
				setInterval(() => {
					this.error_margin +=  Math.random() < 0.7 - (this.IA_diff * 0.1) ? -1 : 1;
					this.futur_vision +=  Math.random() < 0.3 + (this.IA_diff * 0.1) ? -1 : 1;
					let rage = (this.teams[0].score <= this.teams[1].score) ? 0 : Math.round(Math.pow((this.teams[0].score - this.teams[1].score ), 2) / 4);
					switch (this.IA_diff){
						case 0 :
							if (this.error_margin < 0) this.error_margin = 0;
							if (this.error_margin > 10) this.error_margin = 10;
							if (this.futur_vision < 90 + (rage * 2)) this.futur_vision = 90 + (rage * 2);
							if (this.futur_vision > 110 + (rage * 2)) this.futur_vision = 110 + (rage * 2);
							break;
						case 1 :
							if (this.error_margin < 55 - rage) this.error_margin = 55 - rage;
							if (this.error_margin > 75 - rage) this.error_margin = 75 - rage;
							if (this.futur_vision < 50 + (rage * 2)) this.futur_vision = 50 + (rage * 2);
							if (this.futur_vision > 70 + (rage * 2)) this.futur_vision = 70 + (rage * 2);
							break;
						case 2 :
							if (this.error_margin < 50 - rage) this.error_margin = 50 - rage;
							if (this.error_margin > 65 - rage) this.error_margin = 70 - rage;
							if (this.futur_vision < 21 + (rage * 2)) this.futur_vision = 21 + (rage * 2);
							if (this.futur_vision > 41 + (rage * 2)) this.futur_vision = 41 + (rage * 2);
							break;
						case 3 :
							if (this.error_margin < 31 - rage) this.error_margin = 31 - rage;
							if (this.error_margin > 51 - rage) this.error_margin = 51 - rage;
							if (this.futur_vision < 9 + (rage * 2)) this.futur_vision = 9 + (rage * 2);
							if (this.futur_vision > 21 + (rage * 2)) this.futur_vision = 21 + (rage * 2);
							break;
						case 4 :
							if (this.error_margin < 25 - rage) this.error_margin = 25 - rage;
							if (this.error_margin > 41 - rage) this.error_margin = 41 - rage;
							if (this.futur_vision < 6 + (rage * 2)) this.futur_vision = 6 + (rage * 2);
							if (this.futur_vision > 18 + (rage * 2)) this.futur_vision = 18 + (rage * 2);
							break;
					}
					this.searchIA(this.teams[1].backplayer);
				}, 1000);
			}

			if (this.speeding_mode == true){
				setInterval(() => {
						this.BALL_SPEED += 0.1;
						this.PLAYER_SPEED += 0.1;
				}, 5000);
			}
		});
	}

	//The iteration of the Game
	async gameLoop() {
		let now = Date.now();
		for (let team of this.teams){
			if (team.score >= this.MAX_SCORE){
				this.timeend = Date.now();
				let duration = utils.getDuration(this.timestart, this.timeend);
				this.over = true;
				this.sendInfoToFront();
				let player1 = {id : this.teams[0].backplayer.global_id, name : this.teams[0].backplayer.name};
				let player2 = {id : this.teams[1].backplayer.global_id, name : this.teams[1].backplayer.name};
				let player3 = (this.teams[0].frontplayer) ? {id : this.teams[0].frontplayer.global_id, name : this.teams[0].frontplayer.name} : null;
				let player4 = (this.teams[1].frontplayer) ? {id : this.teams[1].frontplayer.global_id, name : this.teams[1].frontplayer.name} : null;
				if (this._gameOverResolver) {
					this._gameOverResolver({
						player1 : player1,
						player2 : player2,
						player3 : player3,
						player4 : player4,
						winner_team : (team === this.teams[0]) ? "team1" : "team2",
						winner1 : (team === this.teams[0]) ? player1 : player2,
						winner2 : (team === this.teams[0]) ? player3 : player4,
						looser_team: (team === this.teams[0]) ? "team2" : "team1",
						looser1: (team === this.teams[0]) ? player2 : player1,
						looser2: (team === this.teams[0]) ? player4 : player3,
						duration : duration,
						team1_score : this.teams[0].score,
						team2_score : this.teams[1].score,
						custom : this.custom_mode,
					});
					this._gameOverResolver = null;
           		}
				return ;
			}
		}
		if (this.start == true)
			this.movePlayers();
		if (this.start == true && this.pause == false){
			this.moveBall();
		}
		this.ball_array_futur = new Set();
		this.ball_real_array_futur = new Set();
		if (this.vision == true || this.IA == true)
			this.futur();
		if (this.start == true && this.pause == false && this.custom_mode == true){
			this.moveMultipleBall();
		}
		if (this.start == true && this.IA == true)
			this.moveIA();
		if (this.start == true && this.pause == false)
			this.update_past();
		this.draw_web();
		if (!this.over) setTimeout(this.gameLoop.bind(this), Math.max(0, (1000 / FPS) - (Date.now() - now)));
	}

	update_past(){
		this.ball_array_past.push({x : this.ball.x, y : this.ball.y});
		if (this.ball_array_past.length > Math.ceil(5 * (BASE_BALL_SPEED * 2)))
			this.ball_array_past.shift();
	}

	//Store the futur of the this.ball at an instance
	count_array_futur(touch){
		for (let x = this.ball_futur.x - this.ball_size + 1; x < this.ball_futur.x + this.ball_size; x++){
			for (let y = this.ball_futur.y - this.ball_size + 1; y < this.ball_futur.y + this.ball_size; y++)
				this.ball_real_array_futur.add({x,y,touch});
		}
		for (let x = Math.round(this.ball_futur.x) - this.ball_size + 1; x < Math.round(this.ball_futur.x) + this.ball_size; x++){
			for (let y = Math.round(this.ball_futur.y) - this.ball_size + 1; y < Math.round(this.ball_futur.y) + this.ball_size; y++)
				this.ball_array_futur.add({x,y,touch});
		}
	}

	//Use to change the dir of a this.ball of the custom mode "More ! More ! {4}"
	new_direction_aproximation(obj_ball){
		const angle = Math.atan2(obj_ball.dy, obj_ball.dx);
		const speed = Math.sqrt(obj_ball.dx * obj_ball.dx + obj_ball.dy * obj_ball.dy);
		const delta = (Math.random() - 0.5) * 4;
		const newAngle = angle + delta;
		const newDx = Math.cos(newAngle) * speed;
		const newDy = Math.sin(newAngle) * speed;
		return ({newDx, newDy});
	}

	bounce_on_obstacle(obj_ball, obs_array, hitbox){
		let remove = [];
		obs_array.forEach(obs => {
			if (obj_ball.x - obs.x <= hitbox && obj_ball.x - obs.x >= -hitbox){
				if (obj_ball.y - obs.y <= hitbox && obj_ball.y - obs.y >= -hitbox){
					if (Math.abs(obj_ball.dx) > Math.abs(obj_ball.dy))
						obj_ball.dx *= -1;
					else if (Math.abs(obj_ball.dx) < Math.abs(obj_ball.dy))
						obj_ball.dy *= -1;
					else
						obj_ball.dx *= -1; obj_ball.dy *= -1;
					obj_ball.last_touch = null;
					if (obj_ball == this.ball)
						remove.push(obs_array.indexOf(obs));
				}
			}
		});
		for (let i = remove.length - 1; i >= 0; i--)
			obs_array.splice(remove[i], 1);
	}

	isBallOnPaddle(obj_ball, player, post) {
		// if ((this.holes == false && post == "b") || post == "f"){
			return (
				obj_ball.x >= player.posx - player.hitbox &&
				obj_ball.x <= player.posx + player.hitbox &&
				obj_ball.y >= player.posy - (this.player_size + 0.5) &&
				obj_ball.y <= player.posy + (this.player_size + 0.5)
			);
		// } else {
		// 	const roundedOffset = Math.round(obj_ball.y - player.posy);
		// 	const isInHole = this.holes_array.includes(roundedOffset);

		// 	if (isInHole) return false;
		// 	return (
		// 		obj_ball.x >= player.posx - player.hitbox &&
		// 		obj_ball.x <= player.posx + player.hitbox &&
		// 		obj_ball.y >= player.posy - (this.player_size + 0.5) &&
		// 		obj_ball.y <= player.posy + (this.player_size + 0.5)
		// 	);
		// }
			
	}

	bounce_on_player(obj_ball){
		let player = null;
		let side = 0;
		for (let t = 0; t < this.teams.length; t++) {
			let candidates = [this.teams[t].backplayer];
			if (this.teams[t].frontplayer) candidates.push(this.teams[t].frontplayer);
			for (let p of candidates) {
				if (this.isBallOnPaddle(obj_ball, p, (p == this.teams[t].backplayer)? "b" : "f")) {
					player = p;
					side = t + 1;
					break;
				}
			}
			if (player) break;
		}
		if (!player) return;
		if (obj_ball.last_touch == player) return ;
		obj_ball.last_touch = player;
		let hit_pos = (obj_ball.y - player.posy) / ((this.player_size * 2 + 1) / 2);
		hit_pos = Math.max(-1, Math.min(1, hit_pos));
		let bounce_angle = hit_pos * MAX_BOUNCE_ANGLE;
		let over_left = Math.abs(obj_ball.x - (player.posx - player.hitbox)) < Math.abs(obj_ball.dx);
		let over_right = Math.abs(obj_ball.x - (player.posx + player.hitbox)) < Math.abs(obj_ball.dx);
		let over_top = Math.abs(obj_ball.y - (player.posy - this.player_size)) < Math.abs(obj_ball.dy);
		let over_bot = Math.abs(obj_ball.y - (player.posy + this.player_size)) < Math.abs(obj_ball.dy);

		if ((over_left && obj_ball.dx > 0) || (over_right && obj_ball.dx < 0)) {
			let sign = (obj_ball.x < player.posx) ? -1 : 1;
			obj_ball.dx = sign * this.BALL_SPEED * Math.cos(bounce_angle);
			obj_ball.dy = this.BALL_SPEED * Math.sin(bounce_angle);
		} else if ((over_top && obj_ball.dy > 0) || (over_bot && obj_ball.dy < 0)) {
			obj_ball.dy *= -1;
			obj_ball.dx *= -1;
		}

		//Player's velocity
		if (player.velocity != 0){
			obj_ball.dy += player.velocity * this.effect;
			if (obj_ball == this.ball)
				this.velocity_use++;
		}

		if (obj_ball === this.ball){
			this.exchange_nbr++;
			if (this.multiple_ball == true){
				for (let i = 0; i < 5; i++){
					let temp_dir = this.new_direction_aproximation(obj_ball);
					this.multiple_ball_array.push(new Ball(this.ball.x, this.ball.y, temp_dir.newDx, temp_dir.newDy));
				}
			}
		}
	}

	//Compute the new position of a this.ball
	move_obj_ball(obj_ball){
		obj_ball.x += obj_ball.dx;
		obj_ball.y += obj_ball.dy;
		
		if (this.custom_mode){
			this.bounce_on_obstacle(obj_ball, this.obstacle_array, 1);
			this.bounce_on_obstacle(obj_ball, this.meteorites_array, 2);
			this.bounce_on_obstacle(obj_ball, this.snake_array, 1);
		}
		
		if (obj_ball.y <= this.ball_size + TOP_MARGIN || obj_ball.y >= HEIGHT - (this.ball_size + TOP_MARGIN)){
			if (this.portal == false){
				if (obj_ball === this.ball)
					this.bounce_nbr++;
				obj_ball.dy *= -1;
			}
			else {
				if (obj_ball.y < HEIGHT / 2)
					obj_ball.y = HEIGHT - (this.ball_size + TOP_MARGIN) - 2;
				else
					obj_ball.y  =this.ball_size + TOP_MARGIN + 2;
			}
		}
		// for (let player of players){
		this.bounce_on_player(obj_ball);
		// }
	}

	//Compute and Store the info on the this.ball's futur in 'this.vision' distance
	futur(){
		this.ball_futur = {...this.ball};
		let touch = false;
		for (let t = 0; t < this.futur_vision * (1 + (this.BALL_SPEED - BASE_BALL_SPEED)); t++){
			let temp_obj_dx = this.ball_futur.dx;
			this.move_obj_ball(this.ball_futur);
			if (temp_obj_dx != this.ball_futur.dx) touch = true;
			if (this.ball_futur.x < 0) return ;
			else if (this.ball_futur.x > WIDTH) return ;
			if (this.ball_futur.y < this.ball_size + TOP_MARGIN) this.ball_futur.y = this.ball_size + TOP_MARGIN;
			else if (this.ball_futur.y > HEIGHT - (this.ball_size + TOP_MARGIN)) this.ball_futur.y = HEIGHT - (this.ball_size + TOP_MARGIN);
			this.count_array_futur(touch);
		}
	}

	//Get the next position of the this.IA
	searchIA(player){
		const arr = Array.from(this.ball_array_futur);
		let target = arr.slice().reverse().find(obj =>
			obj.touch === false &&
			obj.x >= this.error_margin &&
			obj.x < player.posx + player.hitbox
		);

		this.target_IA = {x : player.posx + player.hitbox, y : Math.floor(HEIGHT / 2)};
		if (target) this.target_IA = { x: target.x, y: target.y };
	}

	//It's in the name, it moves the this.IA
	moveIA(){
		let ia_array = new Set(); // [];
		let ia_player_size = (this.player_size <= 1) ? (this.player_size) : (this.player_size - 1);
		for (let i = 0 - ia_player_size; i <= ia_player_size; i++)
			ia_array.add(Math.round(this.teams[1].backplayer.posy) + i);
		if (ia_array.has(this.target_IA.y)) {
			this.teams[1].backplayer.keyDown = false;
			this.teams[1].backplayer.keyUp = false;
			this.teams[1].backplayer.player_vel = 0;
			return ;
		}
		if (this.target_IA.y > this.teams[1].backplayer.posy){
			this.teams[1].backplayer.keyUp = true;
			this.teams[1].backplayer.player_vel = 1 * this.PLAYER_SPEED;
		}
		if (this.target_IA.y < this.teams[1].backplayer.posy){
			this.teams[1].backplayer.keyDown = true;
			this.teams[1].backplayer.player_vel = -1 * this.PLAYER_SPEED;
		}
	}

	//Get the hitbox of the players and this.ball
	count_array_web(){
		for (let x = Math.round(this.ball.x) - this.ball_size + 1; x < Math.round(this.ball.x) + this.ball_size; x++){
			for (let y = Math.round(this.ball.y) - this.ball_size + 1; y < Math.round(this.ball.y) + this.ball_size; y++)
				this.ball_array.add({x,y});
		}
	}

	serializePlayer(player) {
		if (!player) return null;
		return {
			id: player.id,
			posx: player.posx,
			posy: player.posy,
		};
	}

	//Store the data to send to the front
	game_data_creation(){
		let display_players = [];
		let idx = 1;
		for (let team of this.teams){
			let display_player_back = {
				posx: team.backplayer.posx - idx,
				posy: team.backplayer.posy,
				size : this.player_size,
				type : "b"
			}
			display_players.push(display_player_back);
			if (team.frontplayer){
				let display_player_front = {
					posx: team.frontplayer.posx - idx,
					posy: team.frontplayer.posy,
					size : this.player_size - 1,
					type : "f"
				}
				display_players.push(display_player_front);
			}
		}
		let display_ball = {
			x: this.ball.x,
			y: this.ball.y,
			dx: this.ball.dx,
			dy: this.ball.dy
		}
		let display_mutliple_array = [];
		for (let obj_ball of this.multiple_ball_array){
			let display_ball = {
				x: obj_ball.x,
				y: obj_ball.y,
				dx: obj_ball.dx,
				dy: obj_ball.dy
			}
			display_mutliple_array.push(display_ball);
		}
		let game_data = {
			team1_score: this.teams[0].score,
			team2_score: this.teams[1].score,
			players: display_players,
			ball: display_ball,
			ball_size: this.ball_size,
			ball_real_array_futur: this.ball_real_array_futur,
			ball_array_past: this.ball_array_past,
			vision: this.vision,
			IA: this.IA,
			target_IA: this.target_IA,
			MAX_SCORE: this.MAX_SCORE,
			error_margin: this.error_margin,
			player_size: this.player_size,
			KILL_MARGIN: KILL_MARGIN,
			gamestart: this.start,
			gameover: this.over,
			exchange_nbr: this.exchange_nbr, 
			bounce_nbr: this.bounce_nbr,
			velocity_use: this.velocity_use,
			obstacle_array: this.obstacle_array, 
			blackhole : this.blackhole,
			hallucination : this.hallucination,
			negative: this.negative,
			snake_array: this.snake_array,
			invisible_player: this.invisible_player,
			gold_game: this.gold_game,
			meteorites_array: this.meteorites_array,
			invisible_ball: this.invisible_ball,
			multiple_ball_array: display_mutliple_array,
			portal: this.portal, 
			custom_mode: this.custom_mode, 
			box_array: this.box_array,
			in_effect: this.in_effect,
			point_value : this.point_value,
			game_color : this.game_color,
			game_sec_color : this.game_sec_color
		}
		return game_data;
	}

	//Send info to the front (Again it's in the name)
	sendInfoToFront(){
		let game_data = this.game_data_creation();
		game_data.ball_real_array_futur = Array.from(this.ball_real_array_futur);
		this.players
			.filter(client => client.connection && client.connection.readyState === client.connection.OPEN)
			.forEach(client => {
				try {
					client.connection.send(JSON.stringify({ type: 'state', state: game_data }));
				} catch (e){
					console.error('Erreur lors de l\'envoi du this.over au client :', e);
				}
			});
	}

	//Groups function that are used to draw the game
	draw_web(){
		this.count_array_web();
		this.sendInfoToFront();
	}

	//It's in the name, it moves the players
	movePlayers(){
		for (let team of this.teams){
			team.backplayer.move(this.player_size, 1);
			if (team.frontplayer)
				team.frontplayer.move(this.player_size - 1, 1);
		}
	}

	async winBall(){
		this.ball.x = Math.floor(WIDTH / 2);
		this.ball.y = Math.floor(HEIGHT / 2);
		let angle = (Math.random() - 0.5) * MAX_BOUNCE_ANGLE;
		let dir = Math.random() < 0.5 ? 1 : -1;
		this.ball.dx = dir * this.BALL_SPEED * Math.cos(angle);
		this.ball.dy = this.BALL_SPEED * Math.sin(angle);
		this.ball.last_touch = null;
		this.ball_array_past = [];
		if (this.speeding_mode){
			this.PLAYER_SPEED = BASE_PLAYER_SPEED;
			this.BALL_SPEED = BASE_BALL_SPEED;
		}
		if (this.custom_mode == true)
			custom.reset_effect(this);
		this.pause = true;
		await utils.sleep(1000);
		this.pause = false;
	}

	//It's in the name, it moves the this.Ball
	async moveBall(){
		this.move_obj_ball(this.ball);
		if (this.ball.x < 0){
			this.teams[1].score += this.point_value;
			this.winBall();
		}
		else if (this.ball.x > WIDTH){
			this.teams[0].score += this.point_value;
			this.winBall();
		}
		if (this.ball.y < this.ball_size + TOP_MARGIN) this.ball.y = this.ball_size + TOP_MARGIN;
		else if (this.ball.y > HEIGHT - (this.ball_size + TOP_MARGIN)) this.ball.y = HEIGHT - (this.ball_size + TOP_MARGIN) ;
		custom.touch_box(this);
	}

	//It moves the array of this.ball if the custom mode "More ! More ! {4}" is active
	async moveMultipleBall(){
		let remove = [];
		for (let i = 0; i < this.multiple_ball_array.length; i++){
			this.move_obj_ball(this.multiple_ball_array[i]);
			if (this.multiple_ball_array[i].x < 0 || this.multiple_ball_array[i].x > WIDTH){
				remove.push(i);
				continue ;
			}
			if (this.multiple_ball_array[i].y < this.ball_size + TOP_MARGIN) this.multiple_ball_array[i].y = this.ball_size + TOP_MARGIN;
			else if (this.multiple_ball_array[i].y > HEIGHT - (this.ball_size + TOP_MARGIN)) this.multiple_ball_array[i].y = HEIGHT - (this.ball_size + TOP_MARGIN) ;
		}
		for (let i = remove.length - 1; i >= 0; i--)
			this.multiple_ball_array.splice(remove[i], 1);
	}

	inputpressed(key, id){
		for (let team of this.teams){
			if (this.IA && team == team[1])
				continue ;
			team.backplayer.input(this, this.player_size, key, id);
			if (team.frontplayer)
				team.frontplayer.input(this, this.player_size - 1, key, id);
		}
		
		if (this.operator == true){
			if (key === 'p' && this.pause == true) this.pause = false;
			else if (key === 'p' && this.pause == false) this.pause = true;
			if (key === 'v' && this.vision == true) this.vision = false;
			else if (key === 'v' && this.vision == false) this.vision = true;
			if (key === '8'){
				this.ball.y = HEIGHT - this.ball.y;
				this.ball.dy *= -1;
			}
			if (key === '7'){
				this.ball.x = WIDTH - this.ball.x;
				this.ball.dx *= -1;
			}
			if (key === '6'){
				this.ball.x = WIDTH / 2;
				this.ball.y = HEIGHT / 2;
			}
			if (key === '{'){
				this.ball.dx *= 2;
				this.ball.dy *= 2;
			}
			if (key === '}'){
				this.ball.dx *= 0.5;
				this.ball.dy *= 0.5;
			}
			if (key === '1' && this.ball_size < 15) this.ball_size += 1;
			if (key === '2' && this.ball_size > 1) this.ball_size -= 1;
			if (key === '3' && this.player_size < 15) this.player_size += 1;
			if (key === '4' && this.player_size > 1 + (this.players.length > 2) ? 1 : 0) this.player_size -= 1;
			if (key === '\\' && this.IA == true) this.IA = false;
			else if (key === '\\' && this.IA == false && local == true) this.IA = true;
			if (key === '+' || key === '-'){
				let angle = Math.atan2(this.ball.dy, this.ball.dx) * 180 / Math.PI;
				angle += (key === '+') ? 1.5 : -1.5;
				let speed = Math.sqrt(this.ball.dx * this.ball.dx + this.ball.dy * this.ball.dy) || this.BALL_SPEED;
				this.ball.dx = speed * Math.cos(angle * Math.PI / 180);
				this.ball.dy = speed * Math.sin(angle * Math.PI / 180);
				this.ball.touch = null;
			}
			if (key === '9' || key === '0'){
				let angle = Math.atan2(this.ball.dy, this.ball.dx) * 180 / Math.PI;
				angle += (key === '9') ? 4 : -4;
				let speed = Math.sqrt(this.ball.dx * this.ball.dx + this.ball.dy * this.ball.dy) || this.BALL_SPEED;
				this.ball.dx = speed * Math.cos(angle * Math.PI / 180);
				this.ball.dy = speed * Math.sin(angle * Math.PI / 180);
				this.ball.touch = null;
			}
			if (key === 'b'){
				this.game_color = BASE_COLOR;
				this.game_sec_color = BASE_SECONDARY_COLOR;
			}
			if (key === 'n'){
				this.game_color = utils.nextColorHex(this.game_color, -10);
				this.game_sec_color = utils.nextColorHex(this.game_sec_color, -10);
			}
			if (key === 'm'){
				this.game_color = utils.nextColorHex(this.game_color, 10);
				this.game_sec_color = utils.nextColorHex(this.game_sec_color, 10);
			}
			if (key === ','){
				for (let team of this.teams){
					if (team.backplayer.id == id || team.frontplayer.id == id)
						team.score = 10;
					break ;
				}
			}
		}
		if (this.start == false && key === ' '){
			this.start = true;
			custom.custom_mode_func(this);
		}
	};

	inputrelease(key, id){
		for (let team of this.teams){
			if (team == team[1] && IA == true && local == true)
				return ;
			team.backplayer.release(this, key, id);
			if (team.frontplayer)
				team.frontplayer.release(this, key, id);
		}
	};

	terminate(){
		this.over = true;
		this.start = false;

		if (this._gameOverResolver) {
			this._gameOverResolver(null);
			this._gameOverResolver = null;
		}
	}
}

