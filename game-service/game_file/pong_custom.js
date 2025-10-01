//Import
import {HEIGHT, WIDTH, BASE_PLAYER_SPEED,
	BASE_BALL_SPEED, MAX_BOUNCE_ANGLE, TOP_MARGIN,
	SPAWN_MARGIN, BASE_COLOR, BASE_SECONDARY_COLOR} from './pong_constant.js';
import {Box, Obstacle} from './pong_class.js';
import * as utils from './pong_web_utils.js';

let max_box = 10;
let prob_box = 0.3;
/*
	The box has a chance of 1 to 10 to spawn every 3 sec
	it give the following changes to the games if the ball touchs it :
	Fake news {0} : Changes the direction of the ball randomly
	Always faster {1} : The game start to speed up really fast (forever)
	You are not big enought {2} : The players paddels are bigger now
	Smaller ! {3} : The players paddels are smaller now
	More ! More ! {4} : The ball multiplies each time it hits a paddel but don't influence the score (until the next point)
	You are hallucinating {5} : The control are reverse (until the next point)
	It's just a break {6} : The game slow up before reaccelerating at a random moment
	It's the silver ball {7} : The next point worth X2 (combo is possible) (until the next point)
	Obstacles you say ? {8} : Obstacles appears on the field (until the next point)
	{9} Starfall : 
	{10} :
	It's everywhere ! {11} : The .ball teleports everywhere for a few random seconds before going to the middle
	{12} : 
	Negative mode {13} : The color are negative for 5sec
	Snake mode {14} : The ball leave a trail and can bounce on it (until the next point)
	Wait what ? {15} : The paddels teleports on the y axis randomly
	Where am I ? {16} : You cant see yourself for 3 sec
	Meteor shower ! {17} : Meteorites fell from the top influencing the balls direction (until the next point)
	Gold Game ! {18} : The game is reset and the next ball make the player win
	I see the futur ! {19} : Everyone can see the trajectory of the ball for a few seconds
	Epic moment ! {20} : The game just got epic, it's start by the effect 11, then the effect 1 (forever) 4 7 (until the next point) are applied on a cool music (until the next point)
	Portals ! {21} : When the ball hits the top or bottom it goes to the other (until the next point)
	Where is it ! Tell me ! {22} : The ball is invisible for 2 sec every 4 sec (until the next point)
*/

async function effect0(game){
	// console.log("Fake news {0}");
	sendmessage(game, "Change of Direction");
	let angle = (Math.random() - 0.5) * MAX_BOUNCE_ANGLE;
	let dir = Math.random() < 0.5 ? 1 : -1;
	game.ball.dx = dir * game.BALL_SPEED * Math.cos(angle);
	game.ball.dy = game.BALL_SPEED * Math.sin(angle);
	game.ball.last_touch = null;
}

async function effect1(game){
	// console.log("Always faster {1}");
	sendmessage(game, "Speeding");
	if (game.true_speeding_ball == false){
		game.true_speeding_ball = true;
		setInterval(() => {
			if (game.true_speeding_ball == false){
				game.BALL_SPEED = BASE_BALL_SPEED;
				game.PLAYER_SPEED = BASE_PLAYER_SPEED;
				return ;
			}
			if (game.BALL_SPEED > 3)
				return ;
			game.BALL_SPEED += 0.05;
			game.PLAYER_SPEED += 0.05;
		}, 1000);
	}
}

async function effect2(game){
	// console.log("You are not big enought {2}");
	sendmessage(game, "Bigger Paddle");
	if (game.player_size < 15) game.player_size += 1;
}

async function effect3(game){
	// console.log("Smaller ! {3}");
	sendmessage(game, "Smaller Paddle");
	if (game.player_size > 1 + (game.players.length > 2) ? 1 : 0) game.player_size -= 1;
}

async function effect4(game){ 
	// console.log("More ! More ! {4}");
	sendmessage(game, "Multiplication");
	game.multiple_ball = true;
}

async function effect5(game){
	game.hallucination = true;
	// console.log("You are hallucinating {5}");
	sendmessage(game, "Hallucination");
	game.teams.forEach(team =>{
		team.backplayer.up_player = team.backplayer.base_down;
		team.backplayer.down_player = team.backplayer.base_up;
		if (team.frontplayer){
			team.frontplayer.up_player = team.frontplayer.base_down;
			team.frontplayer.down_player = team.frontplayer.base_up;
		}
	})
}

async function effect6(game){
	if (game.in_effect == true)
		return ;
	game.in_effect = true;
	// console.log("It's just a break {6}");
	sendmessage(game, "Breakpoint");
	game.ball.last_touch = null;
	let ball_before = game.BALL_SPEED;
	let balldx = game.ball.dx;
	let balldy = game.ball.dy;
	let player_before = game.PLAYER_SPEED;
	game.BALL_SPEED = 0.1;
	game.ball.dx *= 0.5;
	game.ball.dy *= 0.5;
	game.PLAYER_SPEED = 0.3;
	await utils.sleep(1000 * Math.round((Math.random() * 10) / 3));
	game.ball.last_touch = null;
	game.BALL_SPEED = ball_before;
	game.ball.dx = balldx;
	game.ball.dy = balldy;
	game.PLAYER_SPEED = player_before;
	game.in_effect = false;
}

async function effect7(game){
	// console.log("Silver Bullet {7}", game.point_value * 2);
	sendmessage(game, String("Silver Bullet value : " + game.point_value * 2));
	game.point_value *= 2;
}

async function effect8(game){
	if (game.obstacle_array.length > 0)
		return ;
	// console.log("Obstacles {8}");
	sendmessage(game, "Obstacles");
	for (let i = 0; i < 15; i++){
		let new_obstacle = new Obstacle(
			SPAWN_MARGIN + Math.round((WIDTH - SPAWN_MARGIN) * Math.random()),
			TOP_MARGIN + Math.round((HEIGHT - TOP_MARGIN) * Math.random()));
		game.obstacle_array.push(new_obstacle);
	}
	await utils.sleep(20000);
	game.obstacle_array = [];
}

async function effect9(game){
	if (game.starfall == true)
		return ;
	game.starfall = true;
	// console.log("Starfall {9}");
	sendmessage(game, "Starfall");
	max_box = 30;
	prob_box = 1;
	do{
		game.box_array.forEach(star =>{
			star.y += 3;
			if (star.y > HEIGHT - TOP_MARGIN){
				const index = game.box_array.indexOf(star);
				game.box_array.splice(index, 1);
			}
		});
		if (Math.random() < prob_box  && game.box_array.length < max_box){
			let new_star = new Box(Math.round(SPAWN_MARGIN) + Math.round((WIDTH - SPAWN_MARGIN) * Math.random()),
				0, randomCustomWeighted());
			game.box_array.push(new_star);
			game.game_color = utils.nextColorHex(game.game_color, game.box_array.length);
			game.game_sec_color = utils.nextColorHex(game.game_sec_color, game.box_array.length);
		}
		await utils.sleep(500);
	} while (game.box_array.length > 0 && game.starfall == true)
	game.starfall = false;
}

async function effect10(game){
	if (game.blackhole)
		return ;
	// console.log("Nothing {10}");
	sendmessage(game, "Black Hole");
	let prev_color = game.game_color;
	let prev_color2 = game.game_sec_color;
	game.game_color = '#FFFFFF';
	game.game_sec_color = '#000000'
	game.blackhole = true;
	await utils.sleep(200 * Math.floor(Math.random() * 30));
	game.game_color = prev_color;
	game.game_sec_color = prev_color2;
	game.blackhole = false;
}

async function effect11(game){ 
	if (game.in_effect == true)
		return ;
	game.in_effect = true;
	// console.log("It's everywhere ! {11}");
	sendmessage(game, "Fireworks");
	game.ball.last_touch = null;
	for (let i = 0; i < Math.floor(Math.random() * 30); i++){
		game.ball.x = SPAWN_MARGIN + Math.round((WIDTH - SPAWN_MARGIN * 1.5) * Math.random());
		game.ball.y = TOP_MARGIN + Math.round((HEIGHT - TOP_MARGIN) * Math.random());
		await utils.sleep(150);
	}
	game.ball.x = Math.floor(WIDTH / 2);
	game.ball.y = Math.floor(HEIGHT / 2);
	game.in_effect = false;
}

async function effect12(game){
	// console.log("Nothing {12}");
	sendmessage(game, "Nothing");
}

async function effect13(game){ 
	if (game.negative == true)
		return ;
	// console.log("Negative mode {13}");
	sendmessage(game, "Negative");
	game.negative = true;
	await utils.sleep(5000);
	game.negative = false;
}

async function effect14(game){
	if (game.snake_mode == true)
		return ;
	// console.log("Snake mode {14}");
	sendmessage(game, "Snake Mode");
	game.snake_mode = true;
	let hitbox = 1;
	while (game.snake_mode == true){
		if (game.snake_array.length > 10)
			game.snake_array.shift();
		let obs = new Obstacle(game.ball.x,game.ball.y);
		await utils.sleep(100);
		const overlap = game.snake_array.some(o => o.x === obs.x && o.y === obs.y);
		if (!overlap) {
			game.snake_array.push(obs);
		}
	}
	game.snake_array = [];
}

async function effect15(game){
	// console.log("Teleport player {15}");
	sendmessage(game, "Teleportation");
	let tmp_margin = TOP_MARGIN + game.player_size;
	game.teams.forEach(team =>{
		team.backplayer.posy =  tmp_margin + Math.round((HEIGHT - tmp_margin) * Math.random());
		if (team.frontplayer){
			team.frontplayer.posy =  tmp_margin + Math.round((HEIGHT - tmp_margin) * Math.random());
		}
	})
}

async function effect16(game){
	if (game.invisible_player)
		return ;
	// console.log("Invisible player {16}");
	sendmessage(game, "Invisible Player");
	game.invisible_player = true;
	await utils.sleep(1500);
	game.invisible_player = false;
}

async function effect17(game){
	if (game.meteorites == true)
		return ;
	game.meteorites = true;
	// console.log("Meteor shower {17}");
	sendmessage(game, "Meteor shower");
	if (game.meteorites_array.length > 0)
		return ;
	do{
		game.meteorites_array.forEach(meteor =>{
			meteor.y++;
			if (meteor.y > HEIGHT - TOP_MARGIN){
				const index = game.meteorites_array.indexOf(meteor);
				game.meteorites_array.splice(index, 1);
			}
		});
		if (Math.random() < 0.3 || game.meteorites_array.length == 0){
			let new_meteor = new Obstacle(
				SPAWN_MARGIN + Math.round((WIDTH - SPAWN_MARGIN) * Math.random()),
				TOP_MARGIN);
			game.meteorites_array.push(new_meteor);
		}
		await utils.sleep(500);
	} while (game.meteorites_array.length > 0 && game.meteorites == true)
	game.meteorites = false;
}

async function effect18(game){
	if (game.gold_game == true)
		return ;
	game.box_array = [];
	// console.log("Golden Ball {18}");
	sendmessage(game, "Golden Ball");
	game.teams.forEach(team => team.score = 0);
	game.MAX_SCORE = 1;
	game.gold_game = true;
}

async function effect19(game){
	// console.log("Prediction {19}");
	sendmessage(game, "Prediction");
	game.vision = true;
	await utils.sleep(10000);
	game.vision = false;
}

async function effect20(game){
	if (game.epic_moment)
		return ;
	// console.log("Epic moment {20}");
	sendmessage(game, "Epic moment");
	game.epic_moment = true;
	game.box_array = [];
	await effect11(game);
	effect1(game);
	effect4(game);
	effect7(game);
}

async function effect21(game){
	// console.log("Portals {21}");
	sendmessage(game, "Portals");
	game.portal = true;
}

async function effect22(game){
	if (game.invisible_ball_active)
		return ;
	game.invisible_ball_active = true;
	// console.log("Invisiball {22}");
	sendmessage(game, "Invisiball");
	for (let i = 0; i < 5; i++){
		game.invisible_ball = true;
		await utils.sleep(500);
		if (game.invisible_ball_active == false){
			game.invisible_ball = false;
			break ;
		}
		game.invisible_ball = false;
		await utils.sleep(500);
		if (game.invisible_ball_active == false){
			game.invisible_ball = false;
			break ;
		}
	}
	game.invisible_ball_active = false;
}

function apply_effect(game, nbr){
	switch (nbr){
		case 0 : effect0(game); break;
		case 1 : effect1(game); break;
		case 2 : effect2(game); break;
		case 3 : effect3(game); break;
		case 4 : effect4(game); break;
		case 5 : effect5(game); break;
		case 6 : effect6(game); break;
		case 7 : effect7(game); break;
		case 8 : effect8(game); break;
		case 9 : effect9(game); break;
		case 10 : effect10(game); break;
		case 11 : effect11(game); break;
		case 12 : effect12(game); break;
		case 13 : effect13(game); break;
		case 14 : effect14(game); break;
		case 15 : effect15(game); break;
		case 16 : effect16(game); break;
		case 17 : effect17(game); break;
		case 18 : effect18(game); break;
		case 19 : effect19(game); break;
		case 20 : effect20(game); break;
		case 21 : effect21(game); break;
		case 22 : effect22(game); break;
	}
}

function sendmessage(game, message){
	game.players
		.filter(client => client.connection && client.connection.readyState === client.connection.OPEN)
		.forEach(client => {
			try {
				client.connection.send(JSON.stringify({ type: 'powerupmsg', msg : message}));
			} catch (e){
				console.error('Erreur lors de l\'envoi du this.over au client :', e);
			}
		});
}

export function reset_effect(game){
	if (game.hallucination){
		game.players
			.filter(client => client.connection && client.connection.readyState === client.connection.OPEN)
			.forEach(client => {
				try {
					client.connection.send(JSON.stringify({ type: 'colorreset'}));
				} catch (e){
					console.error('Erreur lors de l\'envoi du this.over au client :', e);
				}
			});
	}
	game.game_color = BASE_COLOR;
	game.game_sec_color = BASE_SECONDARY_COLOR;
	max_box = 10;
	prob_box = 0.3;
	game.true_speeding_ball = false;
	game.in_effect = false;
	game.multiple_ball = false;
	game.multiple_ball_array = [];
	game.teams.forEach(team =>{
		team.backplayer.up_player = team.backplayer.base_up;
		team.backplayer.down_player = team.backplayer.base_down;
		if (team.frontplayer){
			team.frontplayer.up_player = team.frontplayer.base_up;
			team.frontplayer.down_player = team.frontplayer.base_down;
		}
	})
	game.point_value = 1;
	game.obstacle_array = [];
	game.negative = false;
	game.snake_mode = false;
	game.snake_array = [];
	game.invisible_player = false;
	game.meteorites = false;
	game.meteorites_array = [];
	game.vision = false;
	game.epic_moment = false;
	game.portal = false;
	game.invisible_ball_active = false;
	game.invisible_ball = false;
	game.starfall = false;
	game.hallucination = false;
	game.blackhole = false;
	
}

export function touch_box(game){
	let hitbox = 2;
	game.box_array.forEach(box => {
		if (Math.round(game.ball.x) - box.x <= hitbox && Math.round(game.ball.x) - box.x >= -hitbox){
			if (Math.round(game.ball.y) - box.y <= hitbox && Math.round(game.ball.y) - box.y >= -hitbox){
				apply_effect(game, box.effect);
				game.box_array.splice(game.box_array.indexOf(box), 1);
			}
		}
	});
}

function logWeightProbabilities(weights) {
    const total = weights.reduce((a, b) => a + b, 0);
    weights.forEach((weight, i) => {
        const prob = weight / total;
        console.log(`Valeur ${i} : poids = ${weight}, proba = ${(prob * 100).toFixed(2)}%`);
    });
}

function randomCustomWeighted() {
	let common = 5;
	let uncommon = 4;
	let rare = 3;
	let epic = 2;
	let legendary = 0.5;

    const weights = [
        common, rare, common, common, //0, 1, 2, 3
		uncommon, epic, rare, rare, //4, 5, 6, 7
		uncommon, legendary, epic, uncommon, //8, 9, 10, 11
		uncommon, uncommon, rare, epic, //12, 13, 14, 15
		uncommon, rare, legendary, common, //16, 17, 18, 19
		rare, rare, uncommon //20, 21, 22
    ];

    const total = weights.reduce((a, b) => a + b, 0);
    let rand = Math.random() * total;

    for (let i = 0; i < weights.length; i++) {
        if (rand < weights[i]) {
            return i;
        }
        rand -= weights[i];
    }
	return weights.length - 1;
}

export async function custom_mode_func(game){
	if (game.custom_mode == true){
		function spawn_a_box(){
			let x = SPAWN_MARGIN + Math.round((WIDTH - SPAWN_MARGIN) * Math.random());;
			let y = TOP_MARGIN + Math.round((HEIGHT - TOP_MARGIN) * Math.random());
			let new_box = new Box(Math.round(WIDTH * Math.random()), Math.round(HEIGHT * Math.random()), randomCustomWeighted());
			// while (game.box_array.includes(new_box) == true)
			// 	new_box = new Box(Math.round(WIDTH * Math.random()), Math.round(HEIGHT * Math.random()), randomCustomWeighted());
			// let nbr = 10;
			// let new_box = new Box(Math.round(WIDTH * Math.random()), Math.round(HEIGHT * Math.random()), nbr);
			return (new_box);
		}
		setInterval(() => {
			if (game.box_array.length > max_box)
				game.box_array.shift();
			if (Math.random() < prob_box && game.gold_game == false && game.epic_moment == false && game.pause == false)
				game.box_array.push(spawn_a_box());
		}, 1000);
	}
}