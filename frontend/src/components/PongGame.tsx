import React, { useRef, useState, useEffect } from 'react';
import {PongGameService} from '../game/display_pong';
import './pong.css';

// const defaultConfig = {
//   IA: true,
//   local: true,
//   tournament: false,
//   player_nbr: 2,
//   custom_mode: true,
//   speeding_mode: false,
//   IA_diff: 1,
//   player1: "",
//   player2: "",
//   player3: "",
//   player4: "",
//   start: false
// };


export default function PongGame({config}: {config : any}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const serviceRef = useRef<PongGameService>();
  const [pongConfig, setPongConfig] = useState({ ...config });

  useEffect(() => {
    if (canvasRef.current) {
      serviceRef.current = new PongGameService(canvasRef.current);
      serviceRef.current.enableKeyboardListeners();
    }
    return () => {
      if (serviceRef.current?.ws) {
        serviceRef.current?.disableKeyboardListeners();
        serviceRef.current?.cleanup(); 
        serviceRef.current.ws.close();
      }
    };
  }, []);

  useEffect(() => {
    if (serviceRef.current?.ws) {
      const onMessage = (event: any) => {
        const data = JSON.parse(event.data);
        if (data.type === 'end') {
          setPongConfig((cfg : any) => ({ ...cfg, start: false }));
        }
      };
      serviceRef.current.ws.addEventListener("message", onMessage);
      return () => {
        serviceRef.current?.ws.removeEventListener("message", onMessage);
      };
    }
  }, [serviceRef.current?.ws]);

  function handleStart() {
    if (!pongConfig.start) {

      setPongConfig((cfg : any) => ({ ...cfg, start: true }));

      if (serviceRef.current) {
        serviceRef.current.ball_trail = [];
        serviceRef.current.shadow_color = "#00F9EC";

        serviceRef.current.draw_start(pongConfig.custom_mode);

        serviceRef.current.ws.send(
          JSON.stringify({ type: "gamesearch", gameparam: pongConfig })
        );
      }
    }
  }
  
  return (
    <div>
      <h1>Pong JS</h1>
      <div id="score"> Team 1 &mdash; Team 2 </div>
      <div id="pong-config">
        <button id="iaBtn">IA : OFF</button>
        <button id="localBtn">Local : ON</button>
        <button id="tournamentBtn">Tournoi : OFF</button>
        <button id="playerNbrBtn">4 joueurs : OFF</button>
        <button id="customModeBtn">Custom Mode : OFF</button>
        <button id="speedingModeBtn">Speeding Mode : OFF</button>
        <label htmlFor="iaDiff">Difficulté IA :</label>
		<select id="iaDiff">
          <option value="0">Impossible</option>
          <option value="1">Hard</option>
          <option value="2">Medium</option>
          <option value="3">Easy</option>
          <option value="4">Joke</option>
        </select>
        <div>
          <input type="text" id="player1" placeholder="Joueur 1"/>
          <input type="text" id="player2" placeholder="Joueur 2"/>
        </div>
        <button id="startBtn" onClick={handleStart}>
          START : {pongConfig.start ? "ON" : "OFF"}
        </button>
      </div>
      <canvas ref={canvasRef} id="pong" width={800} height={600}></canvas>
    </div>
  );
}

// import React, { useRef, useEffect } from 'react';
// import './pong.css';

// export default function PongGame() {
//   const canvasRef = useRef(null);

//   useEffect(() => {
//     const imageLoaderScript = document.createElement('script');
//     imageLoaderScript.src = '/game/image_loader.js';
//     imageLoaderScript.type = 'module';

//     const displayPongScript = document.createElement('script');
//     displayPongScript.src = '/game/display_pong.js';
//     displayPongScript.type = 'module';

//     document.body.appendChild(imageLoaderScript);
//     document.body.appendChild(displayPongScript);

//     return () => {
//       document.body.removeChild(imageLoaderScript);
//       document.body.removeChild(displayPongScript);
//     };
//   }, []);

//   return (
//     <div>
//       <h1>Pong JS</h1>
//       <div id="score"> Team 1 &mdash; Team 2 </div>
//       <div id="pong-config">
//         <button id="iaBtn">IA : OFF</button>
//         <button id="localBtn">Local : ON</button>
//         <button id="tournamentBtn">Tournoi : OFF</button>
//         <button id="playerNbrBtn">4 joueurs : OFF</button>
//         <button id="customModeBtn">Custom Mode : OFF</button>
//         <button id="speedingModeBtn">Speeding Mode : OFF</button>
//         <label htmlFor="iaDiff">Difficulté IA :</label>
// 		<select id="iaDiff">
//           <option value="0">Impossible</option>
//           <option value="1">Hard</option>
//           <option value="2">Medium</option>
//           <option value="3">Easy</option>
//           <option value="4">Joke</option>
//         </select>
//         <div>
//           <input type="text" id="player1" placeholder="Joueur 1"/>
//           <input type="text" id="player2" placeholder="Joueur 2"/>
//         </div>
//         <button id="startBtn">START : OFF</button>
//       </div>
//       <canvas ref={canvasRef} id="pong" width={800} height={600}></canvas>
//     </div>
//   );
// }