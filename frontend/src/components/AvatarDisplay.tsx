import { useState, useEffect } from 'react';
import useAuth from '../context/AuthContext';

export default function ImageAvatar() {
    const default_image = "/futuristic-avatar.svg";
    const { user } = useAuth();
    const id = user ? user.id : null;
    const [cacheBuster, setCacheBuster] = useState(Date.now());

    useEffect(() => {
        const handleAvatarUpdate = () => {
            setCacheBuster(Date.now());
        };

        window.addEventListener('avatarUpdated', handleAvatarUpdate);

        return () => {
            window.removeEventListener('avatarUpdated', handleAvatarUpdate);
        };
    }, []);
    
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
