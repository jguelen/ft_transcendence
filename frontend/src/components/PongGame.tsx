import React, { useRef, useState, useEffect } from 'react';
import Button from '../components/Button';
import Card from '../components/Card';
import ArrowInput from '../components/ArrowInput';
import {PongGameService} from '../game/display_pong';

export default function PongGame({config}: {config : any}) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const serviceRef = useRef<PongGameService>();
	const [pongConfig, setPongConfig] = useState({ ...config });
	const [msg, setMsg] = useState<string>("");
	const [playerKeysup, setPlayerKeysup] = useState<{ p1: string; p2?: string }>({
		p1: "w",
		p2: pongConfig.local && !pongConfig.IA ? "ArrowUp" : "",
	});
	const [playerKeysdown, setPlayerKeysdown] = useState<{ p1: string; p2?: string }>({
		p1: "s",
		p2: pongConfig.local && !pongConfig.IA ? "ArrowDown" : "",
	});

	const keys = {
		keysup: playerKeysup,
		keysdown: playerKeysdown
	};

	useEffect(() => {
		if (canvasRef.current) {
			console.log("test connexion");
			serviceRef.current = new PongGameService(canvasRef.current);
			serviceRef.current.enableKeyboardListeners();
			console.log(serviceRef);
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
				if (data.type === 'matchtitle') {
					setMsg((msg : string) => (data.msg));
				}
				if (data.type === 'end') {
					setPongConfig((cfg : any) => ({ ...cfg, start: false }));
					setMsg((msg : string) => (data.msg));
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

				const trySend = () => {
					if (serviceRef.current.myId) {
						serviceRef.current.ws.send(
							JSON.stringify({ type: "gamesearch", gameparam: pongConfig, keys: keys })
						);
					} else {
						setTimeout(trySend, 50);
					}
				};
				trySend();
			}
		}
	}

	function handleCustom() {
		if (!pongConfig.custom_mode)
			setPongConfig((cfg : any) => ({ ...cfg, custom_mode: true }));
		else
			setPongConfig((cfg : any) => ({ ...cfg, custom_mode: false }));
	}
	
	function handleSpeedingMode() {
		if (!pongConfig.speeding_mode)
			setPongConfig((cfg : any) => ({ ...cfg, speeding_mode: true }));
		else
			setPongConfig((cfg : any) => ({ ...cfg, speeding_mode: false }));
	}

	return (
		<div>
			{!pongConfig.start && (
				<>
					<Card maxWidth="1200px" maxHeight="400px" className="flex align-center justify-center gap-1">
						<Button gradientBorder={true} hoverColor="rgba(39, 95, 153, 0.4)" id="customModeBtn" onClick={handleCustom}>
							Custom mode : {pongConfig.custom_mode ? "ON" : "OFF"}
						</Button>
						<Button gradientBorder={true} hoverColor="rgba(39, 95, 153, 0.4)" id="speedingModeBtn"onClick={handleSpeedingMode}>
							Speeding mode : {pongConfig.speeding_mode ? "ON" : "OFF"}
						</Button>
						{pongConfig.IA && (
							<>
								<input style={{ width: "8em", textAlign: "center" }} >Player 1</input>
								<input style={{ width: "8em", textAlign: "center" }} >Player 2</input>
								<input style={{ width: "8em", textAlign: "center" }} >Player 3</input>
								<input style={{ width: "8em", textAlign: "center" }} >Player 4</input>
								<input style={{ width: "8em", textAlign: "center" }} >Player 5</input>
								<input style={{ width: "8em", textAlign: "center" }} >Player 6</input>
								<input style={{ width: "8em", textAlign: "center" }} >Player 7</input>
								<input style={{ width: "8em", textAlign: "center" }} >Player 8</input>
							</>
						)}
						{pongConfig.IA && (
							<>
								<label htmlFor="iaDiff">Difficulté IA :</label>
								<select id="iaDiff" value={pongConfig.IA_diff}
									onChange={e => setPongConfig((cfg : any) => ({
										...cfg, IA_diff: parseInt(e.target.value)}))}>
									<option value="0">Impossible</option>
									<option value="1">Hard</option>
									<option value="2">Medium</option>
									<option value="3">Easy</option>
									<option value="4">Joke</option>
								</select>
							</>
						)}
					</Card>
					<h1>{msg}</h1>
					<div style={{ display: "flex", gap: "1em" }}>
						<ArrowInput
							value={playerKeysup.p1}
							onChange={val => setPlayerKeysup(keys => ({ ...keys, p1: val }))}
							placeholder="Up Key player 1"
						/>
						<ArrowInput
							value={playerKeysdown.p1}
							onChange={val => setPlayerKeysdown(keys => ({ ...keys, p1: val }))}
							placeholder="Down Key player 1"
						/>
						{pongConfig.local && !pongConfig.IA && (
							<ArrowInput
								value={String(playerKeysup.p2)}
								onChange={val => setPlayerKeysup(keys => ({ ...keys, p2: val }))}
								placeholder="Up Key player 2"
							/>
						)}
						{pongConfig.local && !pongConfig.IA && (
							<ArrowInput
								value={String(playerKeysdown.p2)}
								onChange={val => setPlayerKeysdown(keys => ({ ...keys, p2: val }))}
								placeholder="Down Key player 1"
							/>
						)}
					</div>
					<Card maxWidth="1200px" maxHeight="400px" className="flex align-center justify-center gap-1">
						<Button gradientBorder={true} hoverColor="rgba(39, 95, 153, 0.4)" id="startBtn" onClick={handleStart}>
							START : {pongConfig.start ? "ON" : "OFF"}
						</Button>
					</Card>
				</>
			)}
			<h1 style={{ display: pongConfig.start ? "block" : "none" }}>{msg}</h1>
			<canvas ref={canvasRef} id="pong" width={800} height={600} style={{ display: pongConfig.start ? "block" : "none" }}></canvas>
		</div>
	);
}
