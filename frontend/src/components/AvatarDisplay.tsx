import React from "react";
import { useAuth } from '../context/AuthContext';

export default function ImageAvatar() {
    const { imageUrl } = useAuth();

    return (
        <div className="w-[45px] h-[45px] shrink-0 rounded-full overflow-hidden flex items-center justify-center">
            <img
                src={imageUrl}
                alt="User icon"
                className="w-full h-full object-cover pointer-events-none"
            />
        </div>
    );
}