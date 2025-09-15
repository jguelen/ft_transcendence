//Web constant
const ws = new WebSocket('ws://localhost:3000/ws');
const canvas = document.getElementById('pong') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
const HEIGHT = canvas.height / 10;
const WIDTH = canvas.width / 10;
const SCALE_X = canvas.width / WIDTH;
const SCALE_Y = canvas.height / HEIGHT;
import { ImageSrc, hexToRgbArray} from "./image_loader.js";
const imgsrc = new ImageSrc;
let ball_trail : Array<any> = [];
let shadow_color : string = '#00F9EC';
let ball_color : string = '#00f9ec';
let ball_middle_color : string = '#66FF99';
let choose_color : boolean = true;

let lastTime = performance.now();
let frames = 0;
let lastframe = 0;
setInterval(() => {
	lastframe = frames;
	frames = 0;
}, 1000);

//Inteface to simulate front
interface PongConfig {
	IA: boolean;
	local: boolean;
	tournament: boolean;
	player_nbr: number;
	custom_mode: boolean;
	speeding_mode: boolean;
	IA_diff: number;
	player1: string;
	player2: string;
	player3: string;
	player4: string;
	start: boolean;
}

let pongConfig: PongConfig = {
	IA: false,
	local: true,
	tournament: false,
	player_nbr: 2,
	custom_mode: true,
	speeding_mode: false,
	IA_diff: 1,
	player1: "",
	player2: "",
	player3: "",
	player4: "",
	start: false
};

function updateButtons() {
	(document.getElementById('iaBtn') as HTMLButtonElement).textContent = "IA : " + (pongConfig.IA ? "ON" : "OFF");
	(document.getElementById('localBtn') as HTMLButtonElement).textContent = "Local : " + (pongConfig.local ? "ON" : "OFF");
	(document.getElementById('tournamentBtn') as HTMLButtonElement).textContent = "Tournoi : " + (pongConfig.tournament ? "ON" : "OFF");
	(document.getElementById('customModeBtn') as HTMLButtonElement).textContent = "Custom Mode : " + (pongConfig.custom_mode ? "ON" : "OFF");
	(document.getElementById('speedingModeBtn') as HTMLButtonElement).textContent = "Speeding Mode : " + (pongConfig.speeding_mode ? "ON" : "OFF");
	(document.getElementById('playerNbrBtn') as HTMLButtonElement).textContent = (pongConfig.player_nbr === 4 ? "4 joueurs : ON" : "4 joueurs : OFF");
	(document.getElementById('startBtn') as HTMLButtonElement).textContent = "START : " + (pongConfig.start ? "ON" : "OFF");
	(document.getElementById('player2') as HTMLInputElement).style.display = (pongConfig.local && !pongConfig.IA) ? "" : "none";
}

// Boutons
(document.getElementById('iaBtn') as HTMLButtonElement).onclick = function() {
	pongConfig.IA = !pongConfig.IA;
	updateButtons();
};
(document.getElementById('localBtn') as HTMLButtonElement).onclick = function() {
	pongConfig.local = !pongConfig.local;
	updateButtons();
};
(document.getElementById('tournamentBtn') as HTMLButtonElement).onclick = function() {
	pongConfig.tournament = !pongConfig.tournament;
	updateButtons();
};
(document.getElementById('customModeBtn') as HTMLButtonElement).onclick = function() {
	pongConfig.custom_mode = !pongConfig.custom_mode;
	updateButtons();
};
(document.getElementById('speedingModeBtn') as HTMLButtonElement).onclick = function() {
	pongConfig.speeding_mode = !pongConfig.speeding_mode;
	updateButtons();
};
(document.getElementById('playerNbrBtn') as HTMLButtonElement).onclick = function() {
	pongConfig.player_nbr = pongConfig.player_nbr === 4 ? 2 : 4;
	updateButtons();
};
(document.getElementById('startBtn') as HTMLButtonElement).onclick = function() {
	if (pongConfig.start == false){
		pongConfig.start = true;
		updateButtons();
		draw_start(pongConfig.custom_mode);
		ball_trail = [];
		shadow_color = '#00F9EC';
		ws.send(JSON.stringify({ type: 'gamesearch', gameparam : pongConfig}));
	}
};
(document.getElementById('iaDiff') as HTMLSelectElement).onchange = function(e) {
	pongConfig.IA_diff = parseInt((e.target as HTMLSelectElement).value);
};
(document.getElementById('player1') as HTMLInputElement).oninput = function(e) {
	pongConfig.player1 = (e.target as HTMLInputElement).value;
};
(document.getElementById('player2') as HTMLInputElement).oninput = function(e) {
	pongConfig.player2 = (e.target as HTMLInputElement).value;
};


updateButtons();
export function getPongConfig(): PongConfig {
	return { ...pongConfig };
}
const config = getPongConfig();

//End of Inteface to simulate front

let my_id :any = null;
ws.onmessage = (event) => {
	const data = JSON.parse(event.data);
	if (data.type === 'state') {
		const state = data.state;
		draw_game(state);
	}
	if (data.type === 'start') {
		const state = data.state;
		draw_start(state);
	}
	if (data.type === 'end') {
		pongConfig.start = false;
		updateButtons();
	}
	if (data.type === 'welcome') {
		my_id = data.id;
	}
};
ws.onopen = () => console.log('WebSocket open!');
ws.onerror = e => console.error('WebSocket error', e);
ws.onclose = () => console.log('WebSocket closed!');

async function draw_image(obj_ball : any, bsize : number, img : HTMLCanvasElement | HTMLImageElement) {
	const bx = obj_ball.x * SCALE_X - (bsize * SCALE_X / 2);
	const by = obj_ball.y * SCALE_Y - (bsize * SCALE_Y / 2);
	ctx.drawImage(img, bx, by, bsize * SCALE_X, bsize * SCALE_Y);
}

async function write_score(bsize : number, nbr : number, posx : number, posy = (canvas.height / 7)){
	const array = nbr.toString().split('').map(Number);
	for (let i = 0; i < array.length; i++){
		let n : number = Number(array[i]);
		let img = imgsrc.nbrfont[n];
		if (!img || !img.complete) continue;
		let bx = posx - (bsize * SCALE_X * array.length / 2) + (i * bsize * SCALE_X);
		let by = posy - (bsize * SCALE_Y / 2);
		drawColorImage(img, bx, by, bsize * SCALE_X, bsize * SCALE_Y, shadow_color);
	}
}

const drawBall = (ball : any, bsize: number) => {
	// Add trail point
	ball_trail.push({ x: ball.x, y: ball.y, alpha: 1, color : ball_color});
	if (ball_trail.length > 45) {
		ball_trail.shift();
	}
	// Draw trail
	ball_trail.forEach((point : any, index : number) => {
		const TRAIL_MAX = 45;
		let virtual_index = index + (TRAIL_MAX - ball_trail.length);

		const alpha = (virtual_index / TRAIL_MAX) * 0.6;
		const radius = bsize * (virtual_index / TRAIL_MAX);
		
		ctx.beginPath();
		ctx.arc(point.x * SCALE_X, point.y * SCALE_Y, radius, 0, Math.PI * 2);
		ctx.globalAlpha = alpha;
			ctx.fillStyle = point.color;
		ctx.globalAlpha = 1;
		ctx.fill();
	});

	// Main ball
	ctx.globalAlpha = 0.8;
	ctx.beginPath();
	ctx.arc(ball.x * SCALE_X, ball.y * SCALE_Y, bsize, 0, Math.PI * 2);
	ctx.fillStyle = ball_color;
	ctx.fill();

	// Bright center
	ctx.beginPath();
	ctx.arc(ball.x * SCALE_X, ball.y * SCALE_Y, bsize * 0.5, 0, Math.PI * 2);
	ctx.fillStyle = ball_middle_color;
	ctx.globalAlpha = 1;
	ctx.fill();
};

const drawFutur = (ball : any, bsize: number, color : string, colorcenter : string, blur : boolean) => {
	if (blur){
		ctx.shadowColor = color;
		ctx.shadowBlur = 2;
	}
	// Main ball
	ctx.globalAlpha = 0.8;
	ctx.beginPath();
	ctx.arc(ball.x * SCALE_X, ball.y * SCALE_Y, bsize, 0, Math.PI * 2);
	ctx.fillStyle = color;
	ctx.fill();

	// Bright center
	ctx.beginPath();
	ctx.arc(ball.x * SCALE_X, ball.y * SCALE_Y, bsize * 0.5, 0, Math.PI * 2);
	ctx.fillStyle = colorcenter;
	ctx.fill();
	if (blur){
		ctx.shadowBlur = 0;
	}
	ctx.globalAlpha = 1;
};

function draw_background(blur : boolean){
	const time = Date.now() * 0.001;
	ctx.strokeStyle = shadow_color;
	ctx.lineWidth = 0.5;
	ctx.globalAlpha = 0.1;

	if (blur){
		for (let x = 0; x < canvas.width; x += 40) {
		const offset = Math.sin(time + x * 0.01) * 5;
		ctx.beginPath();
		ctx.moveTo(x + offset, 0);
		ctx.lineTo(x + offset, canvas.height);
		ctx.stroke();
		}

		for (let y = 0; y < canvas.height; y += 40) {
			const offset = Math.cos(time + y * 0.01) * 3;
			ctx.beginPath();
			ctx.moveTo(0, y + offset);
			ctx.lineTo(canvas.width, y + offset);
			ctx.stroke();
		}

		// Floating particles
		ctx.globalAlpha = 0.3;
		ctx.fillStyle = shadow_color;
		for (let i = 0; i < 12; i++) {
			const x = (i * 67 + time * 20) % canvas.width;
			const y = (i * 43 + Math.sin(time + i) * 50) % canvas.height;
			const size = 1 + Math.sin(time + i) * 0.5;
			
			ctx.shadowColor = shadow_color;
			ctx.shadowBlur = blur ? 8 : 0;
			ctx.beginPath();
			ctx.arc(x, y, size, 0, Math.PI * 2);
			ctx.fill();
		}
	
		ctx.globalAlpha = 0.2;
		const cornerGradient1 = ctx.createRadialGradient(0, 0, 0, 0, 0, 150);
		cornerGradient1.addColorStop(0, shadow_color);
		cornerGradient1.addColorStop(1, 'transparent');
		ctx.fillStyle = cornerGradient1;
		ctx.fillRect(0, 0, 150, 150);
	
		const cornerGradient2 = ctx.createRadialGradient(canvas.width, canvas.height, 0, canvas.width, canvas.height, 150);
		cornerGradient2.addColorStop(0, shadow_color);
		cornerGradient2.addColorStop(1, 'transparent');
		ctx.fillStyle = cornerGradient2;
		ctx.fillRect(canvas.width - 150, canvas.height - 150, 150, 150);
	}

	ctx.globalAlpha = 1;
	ctx.shadowBlur = 0;

	ctx.setLineDash([10, 10]);
	ctx.strokeStyle = shadow_color;
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.moveTo(canvas.width / 2, 0);
	ctx.lineTo(canvas.width / 2, canvas.height);
	ctx.stroke();
	ctx.setLineDash([]);
}

// function hexToRgbArray(hex : string) {
// 	hex = hex.replace(/^#/, "");
// 	const r = parseInt(hex.substring(0,2), 16);
// 	const g = parseInt(hex.substring(2,4), 16);
// 	const b = parseInt(hex.substring(4,6), 16);
// 	return [r, g, b];
// }

function drawColorImage(img : HTMLImageElement | HTMLCanvasElement, x : number, y : number, w : number, h : number, color : string, scaleX = 1, scaleY = 1) {
	if (choose_color == true){
		const deccolor = hexToRgbArray(color);
		const tempCanvas = document.createElement('canvas');
		tempCanvas.width = w * scaleX;
		tempCanvas.height = h * scaleY;
		const tempCtx = tempCanvas.getContext('2d') as CanvasRenderingContext2D;;
	
		tempCtx.drawImage(img, 0, 0, tempCanvas.width, tempCanvas.height);
	
		const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
		const data = imageData.data;
	
		for (let i = 0; i < data.length; i += 4) {
			data[i] = Number(deccolor[0]);
			data[i + 1] = Number(deccolor[1]);
			data[i + 2] = Number(deccolor[2]);
		}
	
		tempCtx.putImageData(imageData, 0, 0);
	
		ctx.drawImage(tempCanvas, x, y, w * scaleX, h * scaleY);
	} else {
		ctx.drawImage(img, x, y, w * scaleX, h * scaleY);
	}
}

async function draw_game(screen : any){
	frames++;
	choose_color = true;//!screen.custom_mode;
	let previous_game_color = shadow_color;
	let game_color = (choose_color) ? screen.game_color : '#00f9ec';
	let game_sec_color = (choose_color) ? screen.game_sec_color : '#66FF99';
	ball_color = game_color;
	ball_middle_color = game_sec_color;
	let blur_size = 10;
	shadow_color = (screen.gold_game) ? '#ffae00ff' : game_color;
	if (screen.point_value > 1){
		ball_color = '#9f9f9f';
		ball_middle_color = '#b6b6b6';
	}
	if (screen.gold_game){
		ball_color = '#ffae00';
		ball_middle_color = '#d6c060';
	}
	if (screen.negative){
		let shadowrgb : number[] = hexToRgbArray(shadow_color);
		let ballrgb : number[] = hexToRgbArray(ball_color);
		let ball_middlergb : number[] = hexToRgbArray(ball_middle_color);
		shadow_color = String( "#" +
			Number(255 - Number(shadowrgb[0])).toString(16).padStart(2, "0") +
			Number(255 - Number(shadowrgb[1])).toString(16).padStart(2, "0") +
			Number(255 - Number(shadowrgb[2])).toString(16).padStart(2, "0"));
		ball_color = String( "#" +
			Number(255 - Number(ballrgb[0])).toString(16).padStart(2, "0") +
			Number(255 - Number(ballrgb[1])).toString(16).padStart(2, "0") +
			Number(255 - Number(ballrgb[2])).toString(16).padStart(2, "0"));
		ball_middle_color = String( "#" +
			Number(255 - Number(ball_middlergb[0])).toString(16).padStart(2, "0") +
			Number(255 - Number(ball_middlergb[1])).toString(16).padStart(2, "0") +
			Number(255 - Number(ball_middlergb[2])).toString(16).padStart(2, "0"));
	}
	
	if (choose_color && shadow_color != previous_game_color){
		imgsrc.reloadColorImage(game_color);
	}

	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = '#050a12';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	draw_background((blur_size > 0));
	if (screen.vision == true && screen.IA == true){
		ctx.fillStyle = "#00111150";
		for (let i = screen.error_margin; i < WIDTH - (screen.kill_margin_size ); i++){
			for (let j = 0; j < HEIGHT; j += 1) {
				ctx.fillRect(i * SCALE_X, j * SCALE_Y, SCALE_X, SCALE_Y);
			}
		}
		draw_image(screen.target_IA, screen.ball_size * 6, imgsrc.ai_target); 
	}
	ctx.shadowColor = shadow_color;
	ctx.shadowBlur = blur_size;
	write_score(4, screen.team1_score, ((WIDTH/4) * SCALE_X) * 1);
	write_score(4, screen.team2_score, ((WIDTH/4) * SCALE_X) * 3);
	ctx.shadowBlur = 0;
	if (screen.portal == false){
		ctx.drawImage(imgsrc.top_img, 0, 0, canvas.width, SCALE_Y);
		ctx.drawImage(imgsrc.top_img, 0, (HEIGHT-1) * SCALE_Y, canvas.width, SCALE_Y);
	} else {
		ctx.shadowColor = '#ff9900ff';
		ctx.shadowBlur = blur_size * 2;
		drawColorImage(imgsrc.top_img, 0, 0, canvas.width, SCALE_Y, '#ff9900');
		ctx.shadowColor = '#0026ffff';
		drawColorImage(imgsrc.top_img, 0, (HEIGHT-1) * SCALE_Y, canvas.width, SCALE_Y, '#0026ff');
		ctx.shadowBlur = 0;
	}
	//Obstacle
	for (let obs of screen.obstacle_array)
		ctx.drawImage(imgsrc.obstacleImg, obs.x * SCALE_X - SCALE_X , obs.y * SCALE_Y - SCALE_Y , SCALE_X * 2, SCALE_Y * 2);
	//Snake
	for (let obs of screen.snake_array)
		ctx.drawImage(imgsrc.obstacleImg, obs.x * SCALE_X - SCALE_X , obs.y * SCALE_Y - SCALE_Y , SCALE_X * 2, SCALE_Y * 2);
	//Meteor
	const mw = imgsrc.meteorImg.width / 5;
	const mh = imgsrc.meteorImg.height / 5;
	for (let obs of screen.meteorites_array){
		const cx = obs.x * SCALE_X;
		const cy = obs.y * SCALE_Y;
		ctx.drawImage(imgsrc.meteorImg, cx - mw/2, cy - mh/2, mw, mh);
	}

	//Star
	for (let obs of screen.box_array){
		draw_image(obs, 3, imgsrc.powerupImg);
	}
	ctx.shadowBlur = 0;
	if (screen.vision == true){
		for (let obj of screen.ball_real_array_futur){
			if (obj.touch == true) drawFutur(obj, screen.ball_size * 7, "#0033ff", "#0033ff", !screen.negative); //draw_image(obj, screen.ball_size * 2, imgsrc.bounce_ballImg);
			else if ((obj.x <= screen.ball_size + 8 || obj.x >= WIDTH - (screen.ball_size + 8))) drawFutur(obj, screen.ball_size * 7, "#ff0000", "#f71d1dcd", !screen.negative); //draw_image(obj, screen.ball_size * 2, imgsrc.kill_ballImg);
			else  drawFutur(obj, screen.ball_size * 7, "#e5ff00", "#ecef8f", !screen.negative); //draw_image(obj, screen.ball_size * 2, imgsrc.futur_ballImg);
		}
	}
	if (screen.invisible_player == false){
		for (let player of screen.players){
			ctx.shadowColor = shadow_color;
			ctx.shadowBlur = blur_size;
			ctx.drawImage(imgsrc.playerImg, player.posx  * SCALE_X, (player.posy - player.size) * SCALE_Y, SCALE_X * 2, SCALE_Y * player.size * 2);
			ctx.shadowBlur = 0;
			if (player.type == "b"){
				for (let hole of screen.holes_array){
					ctx.fillStyle = "rgba(23, 37, 42, 1)";
					ctx.fillRect(player.posx * SCALE_X, (player.posy + hole) * SCALE_Y, SCALE_X * 2, SCALE_Y);
				}
			}
		}
	}

	ctx.shadowColor = shadow_color;
	ctx.shadowBlur = blur_size;
	for (let obj of screen.multiple_ball_array){
		drawFutur(obj, screen.ball_size * 8, ball_color, ball_middle_color, !screen.negative);
	}
	ctx.shadowBlur = 0;
	if (screen.invisible_ball == false){
		ctx.shadowColor = ball_color;
		ctx.shadowBlur = blur_size;
		drawBall(screen.ball, screen.ball_size * 8);
		ctx.shadowBlur = 0;
	}
	else {
		ball_trail = [];
	}
	if (screen.gameover == true){
		if (screen.team1_score >= screen.MAX_SCORE)
			afficherMessage(screen, "Team 1" + " Wins !!!", 'r');
		if (screen.team2_score >= screen.MAX_SCORE)
			afficherMessage(screen, "Team 2" + " Wins !!!", 'l');
	}
	write_score(2, lastframe, (WIDTH - 4) * SCALE_X, (HEIGHT - 4) * SCALE_Y);
}

function afficherMessage(game_data : any, msg : string, side : string) {
	ctx.font = "40px Arial";
	ctx.fillStyle = "#FFFFFF";
	let stats : string[] = [
		"STATS :",
		"exchange_nbr : " + (game_data.exchange_nbr ?? "0"),
		"bounce nbr : " + (game_data.bounce_nbr ?? "0"),
		"velocity boost nbr : " + (game_data.velocity_use ?? "0")
	];
	let msgX : number = 0, statsX : number = 0;
	let lineHeight : number = 40;
	let maxStatsWidth = Math.max(...stats.map(text => ctx.measureText(text).width));
	if (side == 'l') {
		msgX = 10;
		statsX = canvas.width - 10 - maxStatsWidth;
	} else if (side == 'r') {
		msgX = canvas.width - 10 - ctx.measureText(msg).width;
		statsX = 10;
	}
	let blockTop = canvas.height / 2 - (stats.length * lineHeight) / 2;
	
	ctx.fillStyle = "#AAAAAA";
	ctx.fillText(msg, msgX, (canvas.height / 2) + (lineHeight / 2));

	for (let i = 0; i < stats.length; i++) {
		let text = (stats[i] ?? "0");
		let y = blockTop + i * lineHeight;
		ctx.fillStyle = "#AAAAAA";
		ctx.fillText(text, statsX, y);
	}
}

document.addEventListener('keydown', function (event) {
	ws.send(JSON.stringify({ type: 'keydown', key: event.key , id: my_id}));
});
document.addEventListener('keyup', function (event) {
	ws.send(JSON.stringify({ type: 'keyup', key: event.key , id: my_id}));
});

function draw_start(state : any){
	if (state == false){
		// ctx.drawImage(imgsrc.start_img, 0, 0, canvas.width, canvas.height);
	}else {
		// ctx.drawImage(imgsrc.startcustom_img, 0, 0, canvas.width, canvas.height);
	}
}

function draw_search(){
	console.log('hello');
	let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	let data : Uint8ClampedArray = imageData.data;
	for (let i = 0; i < data.length; i += 4) {
		data[i] = 255;
		data[i + 1] = 255;
		data[i + 2] = 255;
	}
	ctx.putImageData(imageData, 0, 0);
}