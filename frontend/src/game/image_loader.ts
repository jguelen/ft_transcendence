export class ImageSrc {
	playerImg: HTMLImageElement | HTMLCanvasElement;

    // IA image
    ai_target: HTMLImageElement | HTMLCanvasElement;

    // Custom images
    powerupImg: HTMLImageElement | HTMLCanvasElement;
    obstacleImg: HTMLImageElement | HTMLCanvasElement;
    meteorImg: HTMLImageElement | HTMLCanvasElement;
	blackholeImg: HTMLImageElement | HTMLCanvasElement;

    // Game images
    top_img: HTMLImageElement | HTMLCanvasElement;
    start_img: HTMLImageElement | HTMLCanvasElement;
    startcustom_img: HTMLImageElement | HTMLCanvasElement;


	//font
	font0: HTMLImageElement;
	font1: HTMLImageElement;
	font2: HTMLImageElement;
	font3: HTMLImageElement;
	font4: HTMLImageElement;
	font5: HTMLImageElement;
	font6: HTMLImageElement;
	font7: HTMLImageElement;
	font8: HTMLImageElement;
	font9: HTMLImageElement;

	nbrfont: HTMLImageElement[];

	constructor(){
		//Player image
		this.playerImg = new Image();
		this.playerImg.src = "/game/image/player.png";

		//IA image
		this.ai_target = new Image();
		this.ai_target.src = "/game/image/IA_target.png";
		
		//Custom
		this.powerupImg = new Image();
		this.powerupImg.src = "/game/image/neonpowerup.png";
		this.obstacleImg = new Image();
		this.obstacleImg.src = "/game/image/neonobstacle.png";
		this.meteorImg = new Image();
		this.meteorImg.src = "/game/image/meteorneon.png";
		this.blackholeImg = new Image();
		this.blackholeImg.src = "/game/image/blackhole.png";

		//Game
		this.top_img = new Image();
		this.top_img.src = "/game/image/neonside.png";
		
		this.start_img = new Image();
		this.start_img.src = "/game/image/WaitingRoom.png";
		this.startcustom_img = new Image();
		this.startcustom_img.src = "/game/image/WaitingRoom.png";
		
		//Font
		this.font0 = new Image();
		this.font0.src = "/game/image/font/0.png";
		this.font1 = new Image();
		this.font1.src = "/game/image/font/1.png";
		this.font2 = new Image();
		this.font2.src = "/game/image/font/2.png";
		this.font3 = new Image();
		this.font3.src = "/game/image/font/3.png";
		this.font4 = new Image();
		this.font4.src = "/game/image/font/4.png";
		this.font5 = new Image();
		this.font5.src = "/game/image/font/5.png";
		this.font6 = new Image();
		this.font6.src = "/game/image/font/6.png";
		this.font7 = new Image();
		this.font7.src = "/game/image/font/7.png";
		this.font8 = new Image();
		this.font8.src = "/game/image/font/8.png";
		this.font9 = new Image();
		this.font9.src = "/game/image/font/9.png";
		this.nbrfont = [this.font0, this.font1, this.font2, this.font3, this.font4, this.font5, this.font6, this.font7, this.font8, this.font9];
	}
	reloadColorImage(main_color : string){
		let player = this.playerImg
		let ai_target = this.ai_target
		let power = this.powerupImg
		let obstacle = this.obstacleImg
		let meteor = this.meteorImg
		let black = this.blackholeImg
		let top = this.top_img
		try {
			this.playerImg = returnColorImage(this.playerImg, main_color);
			this.ai_target = returnColorImage(this.ai_target, main_color);
			this.powerupImg = returnColorImage(this.powerupImg, main_color);
			this.obstacleImg = returnColorImage(this.obstacleImg, main_color);
			this.meteorImg = returnColorImage(this.meteorImg, main_color);
			this.blackholeImg = returnColorImage(this.blackholeImg, '#000000');
			this.top_img = returnColorImage(this.top_img, main_color);
		} catch (e){
			this.playerImg = player;
			this.ai_target = ai_target
			this.powerupImg = power;
			this.obstacleImg = obstacle;
			this.meteorImg = meteor;
			this.blackholeImg = black;
			this.top_img = top;
		}
	}
	reloadColorPlayer(color : string){
		this.playerImg = returnColorImage(this.playerImg, color);
	}
	
}

export function hexToRgbArray(hex : string) {
	hex = hex.replace(/^#/, "");
	const r = parseInt(hex.substring(0,2), 16);
	const g = parseInt(hex.substring(2,4), 16);
	const b = parseInt(hex.substring(4,6), 16);
	return [r, g, b];
}

function returnColorImage(img : HTMLImageElement | HTMLCanvasElement, color : string, scaleX = 1, scaleY = 1) {
	try {
		const deccolor = hexToRgbArray(color);
		const tempCanvas = document.createElement('canvas');
		tempCanvas.width = img.width * scaleX;
		tempCanvas.height = img.height * scaleY;
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

		return tempCanvas;
	} catch (e){
		return img;
	}
}

// function returnColorImage(img : HTMLImageElement | HTMLCanvasElement, color : string, scaleX = 1, scaleY = 1) {
//     try {
// 		if (img instanceof HTMLImageElement) {
// 			if (!img.complete || img.naturalWidth === 0 || img.naturalHeight === 0) {
// 				console.warn("Image non chargée ou taille nulle :", img.src, img.width, img.height);
// 				return img;
// 			}
// 		}
// 		const deccolor = hexToRgbArray(color);
// 		const tempCanvas = document.createElement('canvas');
// 		tempCanvas.width = img.width * scaleX;
// 		tempCanvas.height = img.height * scaleY;
// 		const tempCtx = tempCanvas.getContext('2d') as CanvasRenderingContext2D;
// 		tempCtx.drawImage(img, 0, 0, tempCanvas.width, tempCanvas.height);
// 		const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
// 		const data = imageData.data;
// 		for (let i = 0; i < data.length; i += 4) {
// 			data[i] = Number(deccolor[0]);
// 			data[i + 1] = Number(deccolor[1]);
// 			data[i + 2] = Number(deccolor[2]);
// 		}
// 		tempCtx.putImageData(imageData, 0, 0);
// 		return tempCanvas;
// 	} catch (e) {
// 		return img;
// 	}
// }