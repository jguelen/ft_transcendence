import { useState, useEffect } from 'react';
import useAuth from '../context/AuthContext';

export default function ImageAvatar() {
    const default_image = "/futuristic-avatar.svg";
    const { user } = useAuth();
    const id = user ? user.id : null;

    // 1. Chaque ImageAvatar a son propre "cache buster".
    const [cacheBuster, setCacheBuster] = useState(Date.now());

    // 2. Ce useEffect s'abonne à notre événement personnalisé.
    useEffect(() => {
        const handleAvatarUpdate = () => {
            console.log("ImageAvatar a entendu l'annonce ! Mise à jour...");
            setCacheBuster(Date.now());
        };

        // On écoute l'événement
        window.addEventListener('avatarUpdated', handleAvatarUpdate);

        // Très important : on nettoie l'écouteur quand le composant est démonté
        return () => {
            window.removeEventListener('avatarUpdated', handleAvatarUpdate);
        };
    }, []); // Le tableau vide signifie que cet effet ne s'exécute qu'une fois.

    // 3. On construit l'URL avec notre cache buster local
    const avatarUrl = user
        ? `https://${window.location.hostname}:8443/avatars/avatar${id}.png?v=${cacheBuster}`
        : default_image;

    return (
        <img
            key={avatarUrl}
            src={avatarUrl}
            alt="User icon"
            className="w-[48px] h-[48px] object-cover pointer-events-none rounded-full"
            onError={e => { e.currentTarget.src = default_image; }}
        />
    );
}
