import React, { useRef, useState, useEffect } from 'react';
import Button from '../components/Button';
import Card from '../components/Card';
import ArrowInput from '../components/ArrowInput';
import {PongGameService} from '../game/display_pong';
import useAuth from '../context/AuthContext';

async function fetchgetallUser(): Promise<Array<{id: number, name: string}>> {
	const res = await fetch('/api/user/all', {
		credentials: 'include'
	});
	const text = await res.text();
	console.log("API /api/user/all RAW response:", text);
	let data;
	try {
		data = JSON.parse(text);
	} catch (e) {
		throw new Error("API /api/user/all did not return JSON. Raw response: " + text);
	}
	return data;
}

function isNameInUsers(users : Array<{id: number, name: string}>, name : string) {
	return users.some(user => user.name === name);
}

function isDuplicate(name :string , idx : number, arr : any[]) {
	return arr.filter((n, i) => n === name && i !== idx).length > 0;
}

function getTournamentPlayerIds(names: string[], userList: Array<{id: number, name: string}>) {
  let errors : any[] = [];
  let ids: number[] = [];
  let uniqueNames = new Set<string>();

  names.forEach((name, idx) => {
    if (name.length > 15) {
      errors.push(`Le nom "${name}" dépasse 15 caractères.`);
    }
    if (uniqueNames.has(name)) {
      errors.push(`Le nom "${name}" est utilisé plusieurs fois.`);
    }
    uniqueNames.add(name);

    const found = userList.find(u => u.name === name);
    ids[idx] = found ? found.id : -1;
  });

  return { ids, errors };
}

export default function PongGame({config}: {config : any}) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const serviceRef = useRef<PongGameService>();
	const { user } = useAuth();
	console.log(user);
	const [users, setUsersList] = useState<Array<{id: number, name: string}>>([]);
	
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
	const [tournamentPlayers, setTournamentPlayers] = useState(
		Array.from({ length: 8 }, (_, idx) => `Player${idx + 1}`)
	);

	const keys = {
		keysup: playerKeysup,
		keysdown: playerKeysdown
	};

	// useEffect(() => {
	// 	const handleUnload = () => {
	// 		if (serviceRef.current && serviceRef.current.ws && user) {
	// 			serviceRef.current.ws.send(JSON.stringify({
	// 				type: "disconnect",
	// 				id: user.id,
	// 				name: user.name
	// 			}));
	// 		}
	// 	};
	// 	window.addEventListener("beforeunload", handleUnload);
	// 	return () => {
	// 		window.removeEventListener("beforeunload", handleUnload);
	// 		handleUnload();
	// 	};
	// }, [user]);

	useEffect(() => {
		fetchgetallUser()
			.then(data => {
				setUsersList(data);
			})
			.catch(error => {
				console.error("Error during data fetch", error);
			});
		if (canvasRef.current && user) {
			console.log("test connexion");
			serviceRef.current = new PongGameService(canvasRef.current, user.id);
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
				if (data.type === 'end' || data.type === 'multipleconnexion') {
					setPongConfig((cfg : any) => ({ ...cfg, start: false }));
					setMsg((msg : string) => (data.msg));
					if (data.type === 'multipleconnexion') {
						window.location.href = '/';
					}
				}
			};
			serviceRef.current.ws.addEventListener("message", onMessage);
			return () => {
				serviceRef.current?.ws.removeEventListener("message", onMessage);
			};
		}
	}, [serviceRef.current?.ws]);

	function handleStart() {
		if (!pongConfig.start && user) {
			const { ids, errors } = getTournamentPlayerIds(tournamentPlayers, users);

			if (errors.length > 0) {
			setMsg(errors.join("\n"));
			return;
			}

			setPongConfig((cfg : any) => ({ ...cfg, start: true }));

			if (serviceRef.current) {
				serviceRef.current.ball_trail = [];
				serviceRef.current.shadow_color = "#00F9EC";

				serviceRef.current.draw_start(pongConfig.custom_mode);

				const trySend = () => {
					if (serviceRef.current?.myId) {
						serviceRef.current.ws.send(
							JSON.stringify({ type: "gamesearch",
								gameparam: pongConfig, keys: keys,
								tournament_players: tournamentPlayers,
								ids: ids, name : user?.name ?? "Unknown", id : user?.id ?? -1})
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
					<Card maxWidth="1200px" maxHeight="400px" className="flex align-center justify-center gap-1">
						{pongConfig.tournament && (
							<div style={{ display: "flex", gap: "1em", flexWrap: "wrap" }}>
								{tournamentPlayers.map((name, idx) => {
									const isInMoke = isNameInUsers(users, name);
									const isDup = isDuplicate(name, idx, tournamentPlayers);

									let bgColor = "bg-white";
									if (isDup) bgColor = "bg-red-200";
									else if (isInMoke) bgColor = "bg-green-200";

									return (
										<input
											key={idx}
											className={`w-32 text-center border rounded ${bgColor} border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400`}
											placeholder={`Player ${idx + 1}`}
											value={name}
											maxLength={15}
											onChange={e => {
												const updated = [...tournamentPlayers];
												updated[idx] = e.target.value;
												setTournamentPlayers(updated);
											}}
										/>
									);
								})}
							</div>
						)}
					</Card>
					<Card maxWidth="1200px" maxHeight="400px" className="flex align-center justify-center gap-1">
						<h1>{msg}</h1></Card>
					<Card maxWidth="1200px" maxHeight="400px" className="flex align-center justify-center gap-1">
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
					</Card>
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
