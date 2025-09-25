// import React, { useEffect, useState } from "react";
// import { useAuth } from '../context/AuthContext';

// type ImageState = {
//     current: string;
//     previous: string;
//     hasCustomAvatar: boolean;
// };

// export default function ImageAvatar() {
//     const default_image = "/futuristic-avatar.svg";
//     const { user } = useAuth();
//     const id = (user) ? user.id : -1;
//     const [imageState, setImageState] = useState<ImageState>({
//         current: default_image,
//         previous: default_image,
//         hasCustomAvatar: false,
//     });
//     const [retryCount, setRetryCount] = useState(0);

//     useEffect(() => {
//         checkAvatarExists();
//         // eslint-disable-next-line
//     }, [id]);

//     async function checkAvatarExists() {
//         const avatarUrl = `https://${window.location.hostname}:8443/avatars/avatar${id}.png`;
//         try {
//             const response = await fetch(avatarUrl, { method: "HEAD" });
//             if (response.ok) {
//                 const newUrl = `${avatarUrl}?cache=${Date.now()}`;
//                 // Test si l'image est vraiment chargeable
//                 const loaded = await new Promise<boolean>((resolve) => {
//                     const img = new window.Image();
//                     img.onload = () => resolve(true);
//                     img.onerror = () => resolve(false);
//                     img.src = newUrl;
//                     setTimeout(() => resolve(false), 3000);
//                 });
//                 if (loaded) {
//                     setImageState({
//                         current: newUrl,
//                         previous: default_image,
//                         hasCustomAvatar: true,
//                     });
//                 } else {
//                     setImageState({
//                         current: default_image,
//                         previous: default_image,
//                         hasCustomAvatar: false,
//                     });
//                 }
//             } else {
//                 setImageState({
//                     current: default_image,
//                     previous: default_image,
//                     hasCustomAvatar: false,
//                 });
//             }
//         } catch {
//             setImageState({
//                 current: default_image,
//                 previous: default_image,
//                 hasCustomAvatar: false,
//             });
//         }
//     }

//     const revertToPrevious = () => {
//         setImageState((prev) => ({
//             ...prev,
//             current: prev.previous,
//         }));
//     };

//     return (
//         <div className="w-[50px] h-[50px] shrink-0 rounded-full overflow-hidden flex items-center justify-center">
//             <img
//                 src={imageState.current}
//                 alt="User icon"
//                 className="w-full h-full object-cover pointer-events-none"
//                 onError={() => {
//                     if (retryCount < 1 && imageState.hasCustomAvatar) {
//                         setRetryCount((prev) => prev + 1);
//                         setTimeout(() => {
//                             setImageState({
//                                 current: default_image,
//                                 previous: default_image,
//                                 hasCustomAvatar: false,
//                             });
//                         }, 500);
//                     } else if (imageState.current !== imageState.previous) {
//                         revertToPrevious();
//                     }
//                 }}
//                 onLoad={() => {
//                     setRetryCount(0);
//                 }}
//             />
//         </div>
//     );
// }

import React, { useEffect, useState } from "react";
import { useAuth } from '../context/AuthContext';

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
        <div className="w-[50px] h-[50px] shrink-0 rounded-full overflow-hidden flex items-center justify-center">
            <img
                src={avatarUrl}
                alt="User icon"
                className="w-full h-full object-cover pointer-events-none"
                onError={e => { e.currentTarget.src = default_image; }}
            />
        </div>
    );
}