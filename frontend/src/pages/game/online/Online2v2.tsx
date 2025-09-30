import { useState } from 'react';
import GameMenu from '../GameMenu';
import GameCanvas from '../GameCanvas';

const initialConfig = {
    IA: false,
    local: false,
    tournament: false,
    player_nbr: 4,
    custom_mode: false,
    speeding_mode: false,
    IA_diff: 1,
    start: false
};

export default function Online2v2() {
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
        setGameConfig(initialConfig);
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
