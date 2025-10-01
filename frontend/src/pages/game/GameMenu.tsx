
import { useState, useEffect } from 'react';
import Button from '../../components/Button';
import Card from '../../components/Card';
import ArrowInput from '../../components/ArrowInput';
import useAuth from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';

type User = {
    id: number;
    name: string;
};

async function fetchgetallUser(): Promise<User[]> {
    const res = await fetch('/api/user/all', {
        credentials: 'include'
    });
    if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
    }
    return res.json();
}

function isNameInUsers(users: User[], name: string): boolean {
    return users.some(user => user.name === name);
}

function isDuplicate(name: string, idx: number, arr: string[]): boolean {
    return arr.some((item, index) => item === name && index !== idx);
}

function getTournamentPlayerIds(names: string[], userList: User[], t: TFunction): { ids: number[], errors: string[] } {
    const errors: string[] = [];
    const ids: number[] = [];
    const uniqueNames = new Set<string>();

    names.forEach((name, idx) => {
        if (name.length > 30) {
            errors.push(t('gameMenu.errors.nameTooLong', { name }));
        }
        if (uniqueNames.has(name) && name !== `Player${idx + 1}` && name !== "") {
            errors.push(t('gameMenu.errors.duplicateName', { name }));
        }
        uniqueNames.add(name);

        const foundUser = userList.find(u => u.name === name);
        ids[idx] = foundUser ? foundUser.id : -1;
    });

    return { ids, errors };
}

export default function GameMenu({ initialConfig, onStartGame }: { initialConfig: any, onStartGame: (finalConfig: any) => void }) {
    const { user } = useAuth();
    const { t } = useTranslation();
    const [users, setUsersList] = useState<Array<{ id: number, name: string }>>([]);
    const [pongConfig, setPongConfig] = useState(initialConfig);
    const [msg, setMsg] = useState<string>("");
    const [tournamentPlayers, setTournamentPlayers] = useState(
        Array.from({ length: 8 }, (_, idx) => `Player${idx + 1}`)
    );
    const [playerKeysup, setPlayerKeysup] = useState<{ p1: string; p2?: string }>({
        p1: "w",
        p2: pongConfig.local && !pongConfig.IA ? "ArrowUp" : "",
    });
    const [playerKeysdown, setPlayerKeysdown] = useState<{ p1: string; p2?: string }>({
        p1: "s",
        p2: pongConfig.local && !pongConfig.IA ? "ArrowDown" : "",
    });

    useEffect(() => {
        fetchgetallUser()
            .then(data => setUsersList(data))
            .catch(error => console.error("Error fetching users", error));
    }, []);

    function handleCustom() {
        setPongConfig((cfg: any) => ({ ...cfg, custom_mode: !cfg.custom_mode }));
    }
    
    function handleSpeedingMode() {
        setPongConfig((cfg: any) => ({ ...cfg, speeding_mode: !cfg.speeding_mode }));
    }

    function handleStart() {
        if (!user) return;

        const { ids, errors } = getTournamentPlayerIds(tournamentPlayers, users, t);
        if (errors.length > 0) {
            setMsg(errors.join("\n"));
            return;
        }

        const finalConfig = {
            ...pongConfig,
            keys: { keysup: playerKeysup, keysdown: playerKeysdown },
            tournamentPlayers: tournamentPlayers,
            playerIds: ids,
        };
        onStartGame(finalConfig);
    }

    return (
        <div className="flex flex-col justify-center gap-4 text-white font-inter h-full w-full">
            <Card className="p-3 w-full">
                <h2 className="text-xl font-bold mb-4 border-b border-gray-600 pb-2">{t('gameMenu.gameOptions.title')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                    <Button gradientBorder={true} hoverColor="rgba(39, 95, 153, 0.4)" maxWidth='' maxHeight='' onClick={handleCustom}>
                        {t('gameMenu.gameOptions.customMode')} {pongConfig.custom_mode ? t('gameMenu.gameOptions.on') : t('gameMenu.gameOptions.off')}
                    </Button>
                    <Button gradientBorder={true} hoverColor="rgba(39, 95, 153, 0.4)" maxWidth='' maxHeight='' onClick={handleSpeedingMode}>
                        {t('gameMenu.gameOptions.speedingMode')} {pongConfig.speeding_mode ? t('gameMenu.gameOptions.on') : t('gameMenu.gameOptions.off')}
                    </Button>

                    {pongConfig.IA && (
                        <div className="flex items-center gap-2 md:col-span-2">
                            <label htmlFor="iaDiff" className="font-semibold">{t('gameMenu.gameOptions.iaDifficulty')}</label>
                            <select 
                                id="iaDiff" 
                                value={pongConfig.IA_diff}
                                onChange={e => setPongConfig((cfg) => ({ ...cfg, IA_diff: parseInt(e.target.value) }))}
                                className="bg-gray-700 border border-gray-600 rounded-md px-3 py-1 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                            >
                                <option value="0">{t('gameMenu.gameOptions.iaLevels.impossible')}</option>
                                <option value="1">{t('gameMenu.gameOptions.iaLevels.hard')}</option>
                                <option value="2">{t('gameMenu.gameOptions.iaLevels.medium')}</option>
                                <option value="3">{t('gameMenu.gameOptions.iaLevels.easy')}</option>
                                <option value="4">{t('gameMenu.gameOptions.iaLevels.joke')}</option>
                            </select>
                        </div>
                    )}
                </div>
            </Card>

            {pongConfig.tournament && (
                <Card className="p-3 w-full">
                <h2 className="text-xl font-bold mb-4 border-b border-gray-600 pb-2">{t('gameMenu.tournament.title')}</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {tournamentPlayers.map((name, idx) => {
                        const isInDb = isNameInUsers(users, name);
                        const isDup = isDuplicate(name, idx, tournamentPlayers);

                        const bgColor = isDup ? 'bg-red-500/20 border-red-500' 
                                            : isInDb ? 'bg-green-500/20 border-green-500' 
                                            : 'bg-gray-700/50 border-gray-600';

                        return (
                            <input
                                key={idx}
                                className={`w-full text-center border rounded-md px-2 py-1 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-colors ${bgColor}`}
                                placeholder={t('gameMenu.tournament.playerPlaceholder', { number: idx + 1 })}
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
                </Card>
            )}
            <Card className="p-3 w-full">
                <h2 className="text-xl font-bold mb-4 border-b border-gray-600 pb-2">{t('gameMenu.controls.title')}</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <ArrowInput
                        value={playerKeysup.p1}
                        onChange={val => setPlayerKeysup(keys => ({ ...keys, p1: val }))}
                        placeholder={t('gameMenu.controls.p1Up')}
                    />
                    <ArrowInput
                        value={playerKeysdown.p1}
                        onChange={val => setPlayerKeysdown(keys => ({ ...keys, p1: val }))}
                        placeholder={t('gameMenu.controls.p1Down')}
                    />
                    {pongConfig.local && !pongConfig.IA && (
                        <>
                            <ArrowInput
                                value={String(playerKeysup.p2)}
                                onChange={val => setPlayerKeysup(keys => ({ ...keys, p2: val }))}
                                placeholder={t('gameMenu.controls.p2Up')}
                            />
                            <ArrowInput
                                value={String(playerKeysdown.p2)}
                                onChange={val => setPlayerKeysdown(keys => ({ ...keys, p2: val }))}
                                placeholder={t('gameMenu.controls.p2Down')}
                            />
                        </>
                    )}
                </div>
            </Card>

            <div className="text-center">
                <h1 className="text-white font-orbitron text-[30px]">{msg}</h1>

                <div className="flex items-center justify-center">
                    <Button 
                        gradientBorder={true} 
                        hoverColor="rgba(39, 95, 153, 0.4)" 
                        id="startBtn" 
                        onClick={handleStart}
                        className="px-10 py-3 text-lg"
                    >
                        {t('gameMenu.startButton')}
                    </Button>
                </div>
            </div>
        </div>
    );
}
