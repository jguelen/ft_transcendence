import { ImageSrc, hexToRgbArray} from "./image_loader";

export class PongGameService
{
	canvas : HTMLCanvasElement; 
	imgsrc : ImageSrc;
	ball_trail : Array<any>;
	shadow_color : string;
	ball_color : string;
	ball_middle_color : string;
	choose_color : boolean;
	degree : number;

	lastTime : any;
	frames : number;
	fps: number;
	HEIGHT : number;
	WIDTH : number;
	SCALE_X : number;
	SCALE_Y : number;
	ctx : CanvasRenderingContext2D;
	myId : any;
	ws : WebSocket;
	_keydownHandler : (event: KeyboardEvent) => void;
	_keyupHandler : (event: KeyboardEvent) => void;
	fpsIntervalId : any;

	constructor(canvas: HTMLCanvasElement, global_id : number){
		this.canvas = canvas;
		this.imgsrc = new ImageSrc;
		this.ball_trail = [];
		this.shadow_color = '#00F9EC';
		this.ball_color = '#00f9ec';
		this.ball_middle_color = '#66FF99';
		this.choose_color = true;
		this.degree = 0;
		this.lastTime = performance.now();
		this.frames = 0;
		this.fps = 0;
		this.HEIGHT = canvas.height / 10;
		this.WIDTH = canvas.width / 10;
		this.SCALE_X = canvas.width / this.WIDTH;
		this.SCALE_Y = canvas.height / this.HEIGHT;
		this.ctx = canvas.getContext("2d")!;
		const wsUrl = `wss://${window.location.hostname}:8443/ws?global_id=${global_id}`;
		// console.log(`user global id :${global_id}`);
		// console.log(wsUrl);
		this.ws = new WebSocket(wsUrl);
		this.myId = null;
		this.ws.onmessage = (event : any) => {
			const data = JSON.parse(event.data);
			if (data.type === 'state') {
				const state = data.state;
				this.draw_game(state);
			}
			if (data.type === 'colorreset'){
				this.shadow_color = '#00F9EC';
				this.ball_color = '#00f9ec';
				this.ball_middle_color = '#66FF99';
				this.imgsrc.reloadColorPlayer(this.shadow_color);
			}
			if (data.type === 'welcome') {
				this.myId = data.id;
			}
		};
		this.ws.onopen = () => console.log('WebSocket open!');
		this.ws.onerror = e => console.error('WebSocket error', e);
		this.ws.onclose = () => console.log('WebSocket closed!');

		this._keydownHandler = (event: KeyboardEvent) => {
			if (this.ws && this.myId)
				this.ws.send(JSON.stringify({ type: "keydown", key: event.key, id: this.myId }));
		};
		this._keyupHandler = (event: KeyboardEvent) => {
			if (this.ws && this.myId)
				this.ws.send(JSON.stringify({ type: "keyup", key: event.key, id: this.myId }));
		};
		this.fpsIntervalId = window.setInterval(() => {
			const now = performance.now();
			if (now - this.lastTime > 1000) {
				this.fps = this.frames;
				this.frames = 0;
				this.lastTime = now;
			}
		}, 1000);
	}
	
	cleanup() {
		clearInterval(this.fpsIntervalId);
	}

	enableKeyboardListeners() {
    this._keydownHandler = (event: KeyboardEvent) => {
		if (this.ws && this.myId)
			this.ws.send(JSON.stringify({ type: "keydown", key: event.key, id: this.myId }));
		};
		this._keyupHandler = (event: KeyboardEvent) => {
		if (this.ws && this.myId)
			this.ws.send(JSON.stringify({ type: "keyup", key: event.key, id: this.myId }));
		};
		document.addEventListener("keydown", this._keydownHandler);
		document.addEventListener("keyup", this._keyupHandler);
	}

	disableKeyboardListeners() {
		document.removeEventListener("keydown", this._keydownHandler);
		document.removeEventListener("keyup", this._keyupHandler);
	}

	async draw_image(
		obj_ball : any, bsize : number, img : HTMLCanvasElement | HTMLImageElement) {
		const bx = obj_ball.x * this.SCALE_X - (bsize * this.SCALE_X / 2);
		const by = obj_ball.y * this.SCALE_Y - (bsize * this.SCALE_Y / 2);
		this.ctx.drawImage(img, bx, by, bsize * this.SCALE_X, bsize * this.SCALE_Y);
	}

	async write_score(
		bsize : number, nbr : number, posx : number, posy = (this.canvas.height / 7)){
		const array = nbr.toString().split('').map(Number);
		for (let i = 0; i < array.length; i++){
			let n : number = Number(array[i]);
			let img = this.imgsrc.nbrfont[n];
			if (!img || !img.complete) continue;
			let bx = posx - (bsize * this.SCALE_X * array.length / 2) + (i * bsize * this.SCALE_X);
			let by = posy - (bsize * this.SCALE_Y / 2);
			this.drawColorImage(img, bx, by, bsize * this.SCALE_X, bsize * this.SCALE_Y, this.shadow_color);
		}
	}

	draw_start(state : any){
		this.shadow_color = '#00F9EC';
		this.ball_color = '#00f9ec';
		this.ball_middle_color = '#66FF99';
		this.imgsrc.reloadColorImage(this.shadow_color);
		if (state == false){
			this.ctx.drawImage(this.imgsrc.start_img, 0, 0, this.canvas.width, this.canvas.height);
		}else {
			this.ctx.drawImage(this.imgsrc.startcustom_img, 0, 0, this.canvas.width, this.canvas.height);
		}
	}

	drawBall = (
		ball : any, bsize: number) => {
		this.ball_trail.push({ x: ball.x, y: ball.y, alpha: 1, color : this.ball_color});
		if (this.ball_trail.length > 45) {
			this.ball_trail.shift();
		}
		this.ball_trail.forEach((point : any, index : number) => {
			const TRAIL_MAX = 45;
			let virtual_index = index + (TRAIL_MAX - this.ball_trail.length);

			const alpha = (virtual_index / TRAIL_MAX) * 0.6;
			const radius = bsize * (virtual_index / TRAIL_MAX);
			
			this.ctx.beginPath();
			this.ctx.arc(point.x * this.SCALE_X, point.y * this.SCALE_Y, radius, 0, Math.PI * 2);
			this.ctx.globalAlpha = alpha;
			this.ctx.fillStyle = point.color;
			this.ctx.globalAlpha = 1;
			this.ctx.fill();
		});

		this.ctx.globalAlpha = 0.8;
		this.ctx.beginPath();
		this.ctx.arc(ball.x * this.SCALE_X, ball.y * this.SCALE_Y, bsize, 0, Math.PI * 2);
		this.ctx.fillStyle = this.ball_color;
		this.ctx.fill();

		this.ctx.beginPath();
		this.ctx.arc(ball.x * this.SCALE_X, ball.y * this.SCALE_Y, bsize * 0.5, 0, Math.PI * 2);
		this.ctx.fillStyle = this.ball_middle_color;
		this.ctx.globalAlpha = 1;
		this.ctx.fill();
	};

	drawFutur = (
		ball : any, bsize: number, color : string, colorcenter : string, blur : boolean) => {
		if (blur){
			this.ctx.shadowColor = color;
			this.ctx.shadowBlur = 2;
		}

		this.ctx.globalAlpha = 0.8;
		this.ctx.beginPath();
		this.ctx.arc(ball.x * this.SCALE_X, ball.y * this.SCALE_Y, bsize, 0, Math.PI * 2);
		this.ctx.fillStyle = color;
		this.ctx.fill();

		this.ctx.beginPath();
		this.ctx.arc(ball.x * this.SCALE_X, ball.y * this.SCALE_Y, bsize * 0.5, 0, Math.PI * 2);
		this.ctx.fillStyle = colorcenter;
		this.ctx.fill();
		if (blur){
			this.ctx.shadowBlur = 0;
		}
		this.ctx.globalAlpha = 1;
	};

	draw_background(blur : boolean){
		const time = Date.now() * 0.001;
		this.ctx.strokeStyle = this.shadow_color;
		this.ctx.lineWidth = 0.5;
		this.ctx.globalAlpha = 0.1;

		if (blur){
			for (let x = 0; x < this.canvas.width; x += 40) {
			const offset = Math.sin(time + x * 0.01) * 5;
			this.ctx.beginPath();
			this.ctx.moveTo(x + offset, 0);
			this.ctx.lineTo(x + offset, this.canvas.height);
			this.ctx.stroke();
			}

			for (let y = 0; y < this.canvas.height; y += 40) {
				const offset = Math.cos(time + y * 0.01) * 3;
				this.ctx.beginPath();
				this.ctx.moveTo(0, y + offset);
				this.ctx.lineTo(this.canvas.width, y + offset);
				this.ctx.stroke();
			}

			this.ctx.globalAlpha = 0.3;
			this.ctx.fillStyle = this.shadow_color;
			for (let i = 0; i < 12; i++) {
				const x = (i * 67 + time * 20) % this.canvas.width;
				const y = (i * 43 + Math.sin(time + i) * 50) % this.canvas.height;
				const size = 1 + Math.sin(time + i) * 0.5;
				
				this.ctx.shadowColor = this.shadow_color;
				this.ctx.shadowBlur = blur ? 8 : 0;
				this.ctx.beginPath();
				this.ctx.arc(x, y, size, 0, Math.PI * 2);
				this.ctx.fill();
			}
		
			this.ctx.globalAlpha = 0.2;
			const cornerGradient1 = this.ctx.createRadialGradient(0, 0, 0, 0, 0, 150);
			cornerGradient1.addColorStop(0, this.shadow_color);
			cornerGradient1.addColorStop(1, 'transparent');
			this.ctx.fillStyle = cornerGradient1;
			this.ctx.fillRect(0, 0, 150, 150);
		
			const cornerGradient2 = this.ctx.createRadialGradient(this.canvas.width, this.canvas.height, 0, this.canvas.width, this.canvas.height, 150);
			cornerGradient2.addColorStop(0, this.shadow_color);
			cornerGradient2.addColorStop(1, 'transparent');
			this.ctx.fillStyle = cornerGradient2;
			this.ctx.fillRect(this.canvas.width - 150, this.canvas.height - 150, 150, 150);
		}

		this.ctx.globalAlpha = 1;
		this.ctx.shadowBlur = 0;

		this.ctx.setLineDash([10, 10]);
		this.ctx.strokeStyle = this.shadow_color;
		this.ctx.lineWidth = 2;
		this.ctx.beginPath();
		this.ctx.moveTo(this.canvas.width / 2, 0);
		this.ctx.lineTo(this.canvas.width / 2, this.canvas.height);
		this.ctx.stroke();
		this.ctx.setLineDash([]);
	}

	drawRotatedImage(
		img: HTMLImageElement | HTMLCanvasElement,
		x: number,
		y: number,
		w: number,
		h: number,
	) {
		this.degree = (this.degree + 1) % 360;
		const ctx = this.ctx;
		ctx.save();
		ctx.translate(x + w/2, y + h/2);
		ctx.rotate(this.degree * Math.PI / 180);
		ctx.drawImage(img, -w/2, -h/2, w, h);
		ctx.restore();
	}

	drawColorImage(
		img : HTMLImageElement | HTMLCanvasElement,
		x : number, y : number, w : number,
		h : number, color : string,
		scaleX = 1, scaleY = 1) {
		if (this.choose_color == true){
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
		
			this.ctx.drawImage(tempCanvas, x, y, w * scaleX, h * scaleY);
		} else {
			this.ctx.drawImage(img, x, y, w * scaleX, h * scaleY);
		}
	}

	async draw_game(screen : any){
		this.frames++;
		this.choose_color = true;
		
		let previous_game_color = this.shadow_color;
		let game_color = (this.choose_color) ? screen.game_color : '#00f9ec';
		let game_sec_color = (this.choose_color) ? screen.game_sec_color : '#66FF99';
		this.ball_color = game_color;
		this.ball_middle_color = game_sec_color;
		let blur_size = 10;
		this.shadow_color = (screen.gold_game) ? '#ffae00ff' : game_color;
		if (screen.point_value > 1){
			this.ball_color = '#9f9f9f';
			this.ball_middle_color = '#b6b6b6';
		}
		if (screen.gold_game){
			this.ball_color = '#ffae00';
			this.ball_middle_color = '#d6c060';
			game_color = '#ffae00';
		}
		if (screen.negative){
			let shadowrgb : number[] = hexToRgbArray(this.shadow_color);
			let ballrgb : number[] = hexToRgbArray(this.ball_color);
			let ball_middlergb : number[] = hexToRgbArray(this.ball_middle_color);
			let game_colorrgb : number[] = hexToRgbArray(game_color);
			this.shadow_color = String( "#" +
				Number(255 - Number(shadowrgb[0])).toString(16).padStart(2, "0") +
				Number(255 - Number(shadowrgb[1])).toString(16).padStart(2, "0") +
				Number(255 - Number(shadowrgb[2])).toString(16).padStart(2, "0"));
			this.ball_color = ( "#" +
				Number(255 - Number(ballrgb[0])).toString(16).padStart(2, "0") +
				Number(255 - Number(ballrgb[1])).toString(16).padStart(2, "0") +
				Number(255 - Number(ballrgb[2])).toString(16).padStart(2, "0"));
			this.ball_middle_color = String( "#" +
				Number(255 - Number(ball_middlergb[0])).toString(16).padStart(2, "0") +
				Number(255 - Number(ball_middlergb[1])).toString(16).padStart(2, "0") +
				Number(255 - Number(ball_middlergb[2])).toString(16).padStart(2, "0"));
			game_color = String( "#" +
				Number(255 - Number(game_colorrgb[0])).toString(16).padStart(2, "0") +
				Number(255 - Number(game_colorrgb[1])).toString(16).padStart(2, "0") +
				Number(255 - Number(game_colorrgb[2])).toString(16).padStart(2, "0"));
		}

		if (this.choose_color && this.shadow_color != previous_game_color){
			this.imgsrc.reloadColorImage(game_color);
		}

		let paddel_color = this.shadow_color;
		if (screen.hallucination){
			let paddelrgb : number[] = hexToRgbArray(paddel_color);
			paddel_color = String( "#" +
				Number(255 - Number(paddelrgb[0])).toString(16).padStart(2, "0") +
				Number(255 - Number(paddelrgb[1])).toString(16).padStart(2, "0") +
				Number(255 - Number(paddelrgb[2])).toString(16).padStart(2, "0"));
		}
		if (this.shadow_color != paddel_color && !screen.hallucination)
			this.imgsrc.reloadColorPlayer(paddel_color);
		else if (screen.hallucination)
			this.imgsrc.reloadColorPlayer(paddel_color);

		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.ctx.fillStyle = '#050a12';
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
		this.draw_background((blur_size > 0));
		if (screen.vision == true && screen.IA == true){
			this.ctx.fillStyle = "#00111150";
			for (let i = screen.error_margin; i < this.WIDTH - (screen.kill_margin_size ); i++){
				for (let j = 0; j < this.HEIGHT; j += 1) {
					this.ctx.fillRect(i * this.SCALE_X, j * this.SCALE_Y, this.SCALE_X, this.SCALE_Y);
				}
			}
			this.draw_image(screen.target_IA, screen.ball_size * 6, this.imgsrc.ai_target); 
		}
		this.ctx.shadowColor = this.shadow_color;
		this.ctx.shadowBlur = blur_size;
		this.write_score(4, screen.team1_score, ((this.WIDTH/4) * this.SCALE_X) * 1);
		this.write_score(4, screen.team2_score, ((this.WIDTH/4) * this.SCALE_X) * 3);
		this.ctx.shadowBlur = 0;
		if (screen.portal == false){
			this.ctx.drawImage(this.imgsrc.top_img, 0, 0, this.canvas.width, this.SCALE_Y);
			this.ctx.drawImage(this.imgsrc.top_img, 0, (this.HEIGHT-1) * this.SCALE_Y, this.canvas.width, this.SCALE_Y);
		} else {
			this.ctx.shadowColor = '#ff9900ff';
			this.ctx.shadowBlur = blur_size * 2;
			this.drawColorImage(this.imgsrc.top_img, 0, 0, this.canvas.width, this.SCALE_Y, '#ff9900');
			this.ctx.shadowColor = '#0026ffff';
			this.drawColorImage(this.imgsrc.top_img, 0, (this.HEIGHT-1) * this.SCALE_Y, this.canvas.width, this.SCALE_Y, '#0026ff');
			this.ctx.shadowBlur = 0;
		}
		//Obstacle
		for (let obs of screen.obstacle_array)
			this.ctx.drawImage(this.imgsrc.obstacleImg, obs.x * this.SCALE_X - this.SCALE_X , obs.y * this.SCALE_Y - this.SCALE_Y , this.SCALE_X * 2, this.SCALE_Y * 2);
		//Snake
		for (let obs of screen.snake_array)
			this.ctx.drawImage(this.imgsrc.obstacleImg, obs.x * this.SCALE_X - this.SCALE_X , obs.y * this.SCALE_Y - this.SCALE_Y , this.SCALE_X * 2, this.SCALE_Y * 2);
		//Meteor
		const mw = this.imgsrc.meteorImg.width / 5;
		const mh = this.imgsrc.meteorImg.height / 5;
		for (let obs of screen.meteorites_array){
			const cx = obs.x * this.SCALE_X;
			const cy = obs.y * this.SCALE_Y;
			this.ctx.drawImage(this.imgsrc.meteorImg, cx - mw/2, cy - mh/2, mw, mh);
		}

		//Star
		for (let obs of screen.box_array){
			this.draw_image(obs, 3, this.imgsrc.powerupImg);
		}
		this.ctx.shadowBlur = 0;
		if (screen.vision == true){
			for (let obj of screen.ball_real_array_futur){
				if (obj.touch == true) this.drawFutur(obj, screen.ball_size * 7, "#0033ff", "#0033ff", !screen.negative); //draw_image(obj, screen.ball_size * 2, imgsrc.bounce_ballImg);
				else if ((obj.x <= screen.ball_size + 8 || obj.x >= this.WIDTH - (screen.ball_size + 8))) this.drawFutur(obj, screen.ball_size * 7, "#ff0000", "#f71d1dcd", !screen.negative); //draw_image(obj, screen.ball_size * 2, imgsrc.kill_ballImg);
				else  this.drawFutur(obj, screen.ball_size * 7, "#e5ff00", "#ecef8f", !screen.negative); //draw_image(obj, screen.ball_size * 2, imgsrc.futur_ballImg);
			}
		}
		if (screen.invisible_player == false){
			for (let player of screen.players){
				this.ctx.shadowColor = paddel_color;
				this.ctx.shadowBlur = blur_size;
				this.ctx.drawImage(this.imgsrc.playerImg, player.posx * this.SCALE_X, (player.posy - player.size) * this.SCALE_Y, this.SCALE_X * 2, this.SCALE_Y * player.size * 2);
				this.ctx.shadowColor = this.shadow_color;
				this.ctx.shadowBlur = 0;
			}
		}

		this.ctx.shadowColor = this.shadow_color;
		this.ctx.shadowBlur = blur_size;
		for (let obj of screen.multiple_ball_array){
			this.drawFutur(obj, screen.ball_size * 8, this.ball_color, this.ball_middle_color, !screen.negative);
		}
		this.ctx.shadowBlur = 0;
		if (screen.invisible_ball == false){
			this.ctx.shadowColor = this.ball_color;
			this.ctx.shadowBlur = blur_size;
			this.drawBall(screen.ball, screen.ball_size * 8);
			this.ctx.shadowBlur = 0;
		}
		else {
			this.ball_trail = [];
		}

		const mwb = this.imgsrc.blackholeImg.width / 5;
		const mhb = this.imgsrc.blackholeImg.height / 5;
		if (screen.blackhole){
			const cx = (this.WIDTH / 2) * this.SCALE_X;
			const cy = (this.HEIGHT / 2) * this.SCALE_Y;
			this.drawRotatedImage(this.imgsrc.blackholeImg, cx - mwb/2, cy - mhb/2, mwb, mhb);
		}
	}
}





