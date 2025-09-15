import React, { useRef, useEffect } from 'react';
import './pong.css';

export default function PongGame() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const imageLoaderScript = document.createElement('script');
    imageLoaderScript.src = './game/image_loader.js';
    imageLoaderScript.type = 'module';

    const displayPongScript = document.createElement('script');
    displayPongScript.src = './game/display_pong.js';
    displayPongScript.type = 'module';

    document.body.appendChild(imageLoaderScript);
    document.body.appendChild(displayPongScript);

    return () => {
      document.body.removeChild(imageLoaderScript);
      document.body.removeChild(displayPongScript);
    };
  }, []);

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
        <button id="startBtn">START : OFF</button>
      </div>
      <canvas ref={canvasRef} id="pong" width={800} height={600}></canvas>
    </div>
  );
}