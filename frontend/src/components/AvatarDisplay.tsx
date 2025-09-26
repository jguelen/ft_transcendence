import React, { useEffect, useState } from "react";
import useAuth from '../context/AuthContext';

export default function ImageAvatar() {
    const default_image = "/futuristic-avatar.svg";
    const { user } = useAuth();
    const id = user ? user.id : -1;

    const [cacheBust, setCacheBust] = useState(Date.now());

    useEffect(() => {
        const interval = setInterval(() => {
            setCacheBust(Date.now());
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const avatarUrl = `https://${window.location.hostname}:8443/avatars/avatar${id}.png?cache=${cacheBust}`;

    return (
        <div className="w-[45px] h-[45px] shrink-0 rounded-full overflow-hidden flex items-center justify-center">
            <img
                src={avatarUrl}
                alt="User icon"
                className="w-full h-full object-cover pointer-events-none"
                onError={e => { e.currentTarget.src = default_image; }}
            />
        </div>
    );
}
