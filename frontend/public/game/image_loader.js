export class ImageSrc {
    playerImg;
    // Ball images
    // ballImg: HTMLImageElement;
    // futur_ballImg: HTMLImageElement;
    // bounce_ballImg: HTMLImageElement;
    // kill_ballImg: HTMLImageElement;
    // IA image
    ai_target;
    // Custom images
    powerupImg;
    obstacleImg;
    meteorImg;
    // snakeImg: HTMLImageElement;
    // portaltop_img: HTMLImageElement;
    // portalbottom_img: HTMLImageElement;
    // goldbackground_img: HTMLImageElement;
    // Game images
    top_img;
    // bottom_img: HTMLImageElement;
    // center_img: HTMLImageElement;
    // background_img: HTMLImageElement;
    start_img;
    startcustom_img;
    //font
    font0;
    font1;
    font2;
    font3;
    font4;
    font5;
    font6;
    font7;
    font8;
    font9;
    nbrfont;
    constructor() {
        //Player image
        this.playerImg = new Image();
        this.playerImg.src = "game/image/player.png";
        // //Ball image
        // this.ballImg = new Image();
        // this.ballImg.src = "game/image/newball.png";
        // this.futur_ballImg = new Image();
        // this.futur_ballImg.src = "game/image/futur_ball.png";
        // this.bounce_ballImg = new Image();
        // this.bounce_ballImg.src = "game/image/bounce_ball.png";
        // this.kill_ballImg = new Image();
        // this.kill_ballImg.src = "game/image/kill_ball.png";
        //IA image
        this.ai_target = new Image();
        this.ai_target.src = "game/image/IA_target.png";
        //Custom
        this.powerupImg = new Image();
        this.powerupImg.src = "game/image/neonpowerup.png";
        this.obstacleImg = new Image();
        this.obstacleImg.src = "game/image/neonobstacle.png";
        this.meteorImg = new Image();
        this.meteorImg.src = "game/image/meteorneon.png";
        // this.snakeImg = new Image();
        // this.snakeImg.src = "game/image/neonobstacle.png";
        // this.portaltop_img = new Image();
        // this.portaltop_img.src = "game/image/portaltop.png";
        // this.portalbottom_img = new Image();
        // this.portalbottom_img.src = "game/image/portalbottom.png";
        // this.goldbackground_img = new Image();
        // this.goldbackground_img.src = "game/image/goldbackground.png";
        //Game
        this.top_img = new Image();
        this.top_img.src = "game/image/neonside.png";
        // this.bottom_img = new Image();
        // this.bottom_img.src = "game/image/neonside.png";
        // this.center_img = new Image();
        // this.center_img.src = "game/image/game_center.png";
        // this.background_img = new Image();
        // this.background_img.src = "game/image/background.png";
        this.start_img = new Image();
        this.start_img.src = "game/image/start.png";
        this.startcustom_img = new Image();
        this.startcustom_img.src = "game/image/startcustom.png";
        //Font
        this.font0 = new Image();
        this.font0.src = "game/image/font/0.png";
        this.font1 = new Image();
        this.font1.src = "game/image/font/1.png";
        this.font2 = new Image();
        this.font2.src = "game/image/font/2.png";
        this.font3 = new Image();
        this.font3.src = "game/image/font/3.png";
        this.font4 = new Image();
        this.font4.src = "game/image/font/4.png";
        this.font5 = new Image();
        this.font5.src = "game/image/font/5.png";
        this.font6 = new Image();
        this.font6.src = "game/image/font/6.png";
        this.font7 = new Image();
        this.font7.src = "game/image/font/7.png";
        this.font8 = new Image();
        this.font8.src = "game/image/font/8.png";
        this.font9 = new Image();
        this.font9.src = "game/image/font/9.png";
        this.nbrfont = [this.font0, this.font1, this.font2, this.font3, this.font4, this.font5, this.font6, this.font7, this.font8, this.font9];
    }
    reloadColorImage(main_color) {
        this.playerImg = returnColorImage(this.playerImg, main_color);
        this.ai_target = returnColorImage(this.ai_target, main_color);
        this.powerupImg = returnColorImage(this.powerupImg, main_color);
        this.obstacleImg = returnColorImage(this.obstacleImg, main_color);
        this.meteorImg = returnColorImage(this.meteorImg, main_color);
        this.top_img = returnColorImage(this.top_img, main_color);
        this.start_img = returnColorImage(this.start_img, main_color);
        this.startcustom_img = returnColorImage(this.startcustom_img, main_color);
    }
}
export function hexToRgbArray(hex) {
    hex = hex.replace(/^#/, "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return [r, g, b];
}
function returnColorImage(img, color, scaleX = 1, scaleY = 1) {
    const deccolor = hexToRgbArray(color);
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = img.width * scaleX;
    tempCanvas.height = img.height * scaleY;
    const tempCtx = tempCanvas.getContext('2d');
    ;
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
}
//# sourceMappingURL=image_loader.js.map