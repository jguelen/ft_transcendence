import { useState } from 'react';
import GameMenu from '../GameMenu';
import GameCanvas from '../GameCanvas';

const initialConfig = {
    start: false,
    IA: true,
    local: true,
    tournament: false,
    custom_mode: false,
    speeding_mode: false,
    IA_diff: 2
};

export default function Ai1v1() {
    const [gameStarted, setGameStarted] = useState(false);
    const [gameConfig, setGameConfig] = useState(initialConfig);
    const [endGameMessage, setEndGameMessage] = useState("");

    const handleStartGame = (finalConfig: any) => {
        setGameConfig(finalConfig);
        setGameStarted(true);
        setEndGameMessage("");
    };

    const handleGameEnd = (message: string) => {
        setGameStarted(false);
        setEndGameMessage(message);
    };

    return (
        <div className="h-full w-full flex flex-col justify-center items-center">
            {endGameMessage && <h1 className="text-white font-orbitron text-[30px]">{endGameMessage}</h1>}

            {!gameStarted ? (
                <GameMenu 
                    initialConfig={gameConfig} 
                    onStartGame={handleStartGame} 
                />
            ) : (
                <GameCanvas 
                    gameConfig={gameConfig} 
                    onGameEnd={handleGameEnd} 
                />
            )}
        </div>
    );
}
