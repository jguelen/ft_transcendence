import React, { useRef, useState, useEffect } from "react";
import useAuth from '../context/AuthContext';

type ImageState = {
    current: string;
    previous: string;
    hasCustomAvatar: boolean;
};

export default function ImageLoader() {
	const default_image = "/futuristic-avatar.svg";
    const { user } = useAuth();
    const id = (user) ? user.id : -1;
    const inputRef = useRef<HTMLInputElement>(null);
	const [imageState, setImageState] = useState<ImageState>({
        current: default_image,
        previous: default_image,
        hasCustomAvatar: false
    });
    const [isUploading, setIsUploading] = useState(false);
	const [retryCount, setRetryCount] = useState(0);

    useEffect(() => {
        checkAvatarExists();
    }, []);

    async function checkAvatarExists() {
        const avatarUrl = `https://${window.location.hostname}:8443/avatars/avatar${id}.png`;
        
        try {
            const response = await fetch(avatarUrl, { method: 'HEAD' });
            if (response.ok) {
                const newUrl = `${avatarUrl}?cache=${Date.now()}`;

                const testLoad = await new Promise((resolve) => {
                    const testImg = new Image();
                    testImg.onload = () => resolve(true);
                    testImg.onerror = () => resolve(false);
                    testImg.src = newUrl;
                    
                    setTimeout(() => resolve(false), 3000);
                });
                
                if (testLoad) {
                    setImageState({
                        current: newUrl,
                        previous: default_image,
                        hasCustomAvatar: true
                    });
                } else {
                    await cleanupCorruptedAvatar();
                    setImageState({
                        current: default_image,
                        previous: default_image,
                        hasCustomAvatar: false
                    });
                }
            } else {
                setImageState({
                    current: default_image,
                    previous: default_image,
                    hasCustomAvatar: false
                });
            }
        } catch (error) {
            setImageState({
                current: default_image,
                previous: default_image,
                hasCustomAvatar: false
            });
        }
    }

    async function cleanupCorruptedAvatar() {
        try {
            const response = await fetch(`https://${window.location.hostname}:8443/avatar/cleanup/${id}`);
            const result = await response.json();
            console.log("Cleaning corrupted image:", result);
        } catch (error) {
            console.error("Error in cleaning corrupted image:", error);
        }
    }

	const revertToPrevious = () => {
        setImageState(prev => ({
            ...prev,
            current: prev.previous
        }));
    };

    function handleClick() {
        if (inputRef.current && !isUploading) {
            inputRef.current.click();
        }
    }

    async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

		const currentState = imageState;
        setIsUploading(true);

        const ws = new WebSocket(`wss://${window.location.hostname}:8443/avatar`);
        ws.binaryType = "arraybuffer";

        ws.onopen = () => {
			console.log("open WebSocket")
            setTimeout(() => {
                ws.send(JSON.stringify({ type: "new avatar", id }));
                
                const reader = new FileReader();
                reader.onload = function (ev) {
                    const arrayBuffer = ev.target?.result;
                    if (arrayBuffer) {
                        ws.send(arrayBuffer);
                        ws.close();
                    }
                };
                reader.readAsArrayBuffer(file);
            }, 100);
        };

        ws.onmessage = (msg) => {};

        ws.onclose = () => {
            setTimeout(async () => {
                const avatarUrl = `https://${window.location.hostname}:8443/avatars/avatar${id}.png`;
                
                try {
                    const response = await fetch(avatarUrl, { method: 'HEAD' });
                    if (response.ok) {
                        const newUrl = `${avatarUrl}?cache=${Date.now()}`;
                        setImageState({
                            current: newUrl,
                            previous: currentState.current,
                            hasCustomAvatar: true
                        });
                    } else {
                        setImageState(currentState);
                    }
                } catch (error) {
                    setImageState(currentState);
                }
                
                setIsUploading(false);
            }, 1500);
        };

        ws.onerror = (error) => {
            console.error("Error WebSocket:", error);
            setImageState(currentState);
            setIsUploading(false);
        };
    }

    return (
        <div
                className={`shadow-card max-w-[200px] max-h-[200px] h-full aspect-square rounded-full overflow-hidden flex items-center justify-center cursor-${isUploading ? "wait" : "pointer"} opacity-${isUploading ? "70" : "100"} relative`}
            onClick={handleClick}
        >
            {isUploading && (
                <div className="absolute bg-black/50 text-white px-2 py-1 rounded text-xs z-10">
                    Upload...
                </div>
            )}
            <img
                src={imageState.current}
                alt="Avatar"
                style={{
                    objectFit: "cover",
                    pointerEvents: "none",
                }}
                onError={async () => {
					console.log("Image Failed:", imageState.current);      
                    if (retryCount < 1 && imageState.hasCustomAvatar) {
                        setRetryCount(prev => prev + 1);
                        await cleanupCorruptedAvatar();
                        
                        setTimeout(() => {
                            setImageState({
                                current: default_image,
                                previous: default_image,
                                hasCustomAvatar: false
                            });
                        }, 500);
                    } else if (imageState.current !== imageState.previous) {
                        revertToPrevious();
                    }
                }}
                className="w-full h-full"
                onLoad={() => {
                    console.log("Image Success:", imageState.current);
                    setRetryCount(0);
                }}
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
