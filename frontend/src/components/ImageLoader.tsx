import React, { useRef, useState, useEffect } from "react";
import useAuth from '../context/AuthContext';

type ImageState = {
    current: string;
    previous: string;
    hasCustomAvatar: boolean;
};

export default function ImageLoader() {
    const default_image = "/futuristic-avatar.svg";
    // AMÉLIORATION : On récupère refreshAvatar et on utilise bien l'utilisateur du contexte
    const { user, refreshAvatar } = useAuth(); 
    const id = user ? user.id : null;

    const inputRef = useRef<HTMLInputElement>(null);
    const [imageState, setImageState] = useState<ImageState>({
        current: default_image,
        previous: default_image,
        hasCustomAvatar: false
    });
    const [isUploading, setIsUploading] = useState(false);

    // AMÉLIORATION : La dépendance [id] est cruciale pour que l'avatar se mette à jour
    // si l'utilisateur se déconnecte et qu'un autre se connecte.
    useEffect(() => {
        if (!id) {
            // Si pas d'utilisateur, on met l'image par défaut
            setImageState({ current: default_image, previous: default_image, hasCustomAvatar: false });
            return;
        }

        async function checkAvatarExists() {
            const avatarUrl = `https://${window.location.hostname}:8443/avatars/avatar${id}.png`;
            try {
                // On utilise 'no-cache' pour être sûr de vérifier la dernière version
                const response = await fetch(avatarUrl, { method: 'HEAD', cache: 'no-cache' });
                if (response.ok) {
                    const newUrl = `${avatarUrl}?v=${Date.now()}`; // On force le rafraîchissement
                    setImageState({ current: newUrl, previous: newUrl, hasCustomAvatar: true });
                }
            } catch (error) {
                console.error("L'avatar personnalisé n'existe pas ou le serveur est inaccessible.", error);
            }
        }
        checkAvatarExists();
    }, [id]);

    function handleClick() {
        if (inputRef.current && !isUploading) {
            inputRef.current.click();
        }
    }

    async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (!id) {
            alert("Vous devez être connecté pour changer votre avatar.");
            return;
        }
        const file = e.target.files?.[0];
        if (!file) return;

        const currentState = imageState;
        setIsUploading(true);

        const ws = new WebSocket(`wss://${window.location.hostname}:8443/avatar`);
        ws.binaryType = "arraybuffer";

        ws.onopen = () => {
            ws.send(JSON.stringify({ type: "new avatar", id }));

            const reader = new FileReader();
            reader.onerror = (error) => {
                console.error("ERREUR: Impossible de lire le fichier.", error);
                setIsUploading(false);
                ws.close();
            };
            reader.onload = function () {
                const arrayBuffer = this.result;
                if (arrayBuffer) {
                    ws.send(arrayBuffer);
                    ws.close(); // On ferme la connexion une fois l'envoi terminé

                    setTimeout(async () => {
                        const avatarUrl = `https://${window.location.hostname}:8443/avatars/avatar${id}.png`;
                        try {
                            const response = await fetch(avatarUrl, { method: 'HEAD', cache: 'no-cache' });
                            if (response.ok) {
                                const newUrl = `${avatarUrl}?v=${Date.now()}`;
                                setImageState({ current: newUrl, previous: currentState.current, hasCustomAvatar: true });
                                
                                refreshAvatar();

                            } else {
                                console.error("Échec de la vérification après upload.");
                                setImageState(currentState);
                            }
                        } catch (error) {
                            console.error("Erreur lors du fetch de vérification:", error);
                            setImageState(currentState);
                        }
                        setIsUploading(false);
                    }, 1500); // On garde le délai pour laisser le temps au serveur de traiter l'image.
                }
            };
            reader.readAsArrayBuffer(file);
        };

        ws.onerror = (error) => {
            console.error("Erreur WebSocket:", error);
            setIsUploading(false);
        };
    }

    // Le JSX a été légèrement simplifié pour plus de clarté
    return (
        <div
            className={`shadow-card max-w-[200px] max-h-[200px] h-full aspect-square rounded-full overflow-hidden flex items-center justify-center relative ${isUploading ? 'cursor-wait opacity-70' : 'cursor-pointer'}`}
            onClick={handleClick}
        >
            {isUploading && (
                <div className="absolute bg-black/50 text-white px-2 py-1 rounded text-xs z-10">
                    Upload...
                </div>
            )}
            <img
                key={imageState.current} // Ajout d'une clé pour forcer React à recharger l'élément img
                src={imageState.current}
                alt="Avatar"
                className="w-full h-full object-cover pointer-events-none"
                // En cas d'erreur de chargement, on remet l'image par défaut
                onError={() => setImageState(prev => ({ ...prev, current: default_image }))}
            />
            <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                ref={inputRef}
                onChange={handleFileChange}
                disabled={isUploading}
            />
        </div>
    );
}
