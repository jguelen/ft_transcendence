import { useRef, useEffect } from "react";
import { ReactNode } from 'react';

const DEBUG = true;
let debug_style = (DEBUG)? "bg-[FFFF00] " : "";
let base_style = debug_style;

let center_style = "flex items-center justify-center min-h-screen ";
let hcenter_style = "flex items-center justify-center ";


export default function PongGame() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas : ReactNode = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }, []);

    return (
        <div>
            {/* <div className = "relative"> */}
            {/* <h1 className="absolute top-1 left-1/2 -translate-x-1/2 text-4xl text-white font-bold pointer-events-none bg-[#FF0000]">
                Hello
            </h1> */}
            <div className ={center_style}>
                <h1 className ={hcenter_style + "absolute top-1 left-1/2 -translate-x-1/2 text-4xl text-white font-bold " + base_style}>
                    PONG
                </h1>
                <div className ={hcenter_style}>
                    <canvas ref={canvasRef} width={800} height={600}></canvas>
                </div>
            </div>
            {/* </div> */}
        </div>
    );
}