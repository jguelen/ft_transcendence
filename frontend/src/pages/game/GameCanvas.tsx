import { useRef, useState, useEffect } from 'react';
import { PongGameService } from '../../game/display_pong';
import useAuth from '../../context/AuthContext';

export default function GameCanvas({ gameConfig, onGameEnd }: { gameConfig: any, onGameEnd: (message: string) => void }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const serviceRef = useRef<PongGameService>();
    const { user } = useAuth();
    const [msg, setMsg] = useState<string>("");
    const [custommsg, setCustomMsg] = useState<string>("");

    useEffect(() => {
        if (canvasRef.current && user) {
            serviceRef.current = new PongGameService(canvasRef.current, user.id);
            serviceRef.current.enableKeyboardListeners();

            // Logique de connexion et de démarrage du jeu
            const trySend = () => {
                if (serviceRef.current?.ws.readyState === WebSocket.OPEN) {
                    serviceRef.current.draw_start(  gameConfig.custom_mode);
                    serviceRef.current.ws.send(JSON.stringify({
                        type: "gamesearch",
                        gameparam: gameConfig,
                        keys: gameConfig.keys,
                        tournament_players: gameConfig.tournamentPlayers,
                        ids: gameConfig.playerIds,
                        name: user?.name ?? "Unknown",
                        id: user?.id ?? -1
                    }));
                } else {
                    setTimeout(trySend, 100); // On attend que la connexion WebSocket soit prête
                }
            };
            trySend();
        }

        return () => {
            serviceRef.current?.disableKeyboardListeners();
            serviceRef.current?.cleanup();
        };
    }, [user, gameConfig]); // On relance si la config change

    useEffect(() => {
        const ws = serviceRef.current?.ws;
        if (!ws) return;

        const onMessage = (event: MessageEvent) => {
            const data = JSON.parse(event.data);
            if (data.type === 'matchtitle') {
                setMsg(data.msg);
            }
            if (data.type === 'powerupmsg') {
                setCustomMsg(data.msg);
            }
            if (data.type === 'end' || data.type === 'multipleconnexion') {
                onGameEnd(data.msg);
                setCustomMsg(data.msg);
                if (data.type === 'multipleconnexion') {
                    window.location.href = '/';
                }
            }
        };

        ws.addEventListener("message", onMessage);
        return () => ws.removeEventListener("message", onMessage);
    }, [serviceRef.current?.ws, onGameEnd]);

    return (
        <div className="flex flex-col justify-center items-center">
            <h1 className="text-white font-orbitron text-[30px]">{msg}</h1>
            <canvas ref={canvasRef} id="pong" width={800} height={600}></canvas>
            <h1 className="text-white font-orbitron text-[25px]">{custommsg}</h1>
        </div>
    );
}
