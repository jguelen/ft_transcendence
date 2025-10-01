//In ms
export async function sleep(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

export function getDuration(start, end){
    const elapsedMs = end - start;
    const elapsedSec = Math.floor(elapsedMs / 1000);
    const minutes = Math.floor(elapsedSec / 60);
    const seconds = elapsedSec % 60;
    let string = toString(minutes) + "min " + toString(seconds) + "sec";
    return string;
}

function hexToRgb(hex) {
    hex = hex.replace(/^#/, "");
    return [
        parseInt(hex.substring(0,2), 16),
        parseInt(hex.substring(2,4), 16),
        parseInt(hex.substring(4,6), 16)
    ];
}

function rgbToHex(r, g, b) {
    return "#" +
        r.toString(16).padStart(2, "0") +
        g.toString(16).padStart(2, "0") +
        b.toString(16).padStart(2, "0");
}

function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if(max == min) { h = s = 0; }
    else {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max) {
            case r: h = ((g - b) / d + (g < b ? 6 : 0)); break;
            case g: h = ((b - r) / d + 2); break;
            case b: h = ((r - g) / d + 4); break;
        }
        h /= 6;
    }
    return [h * 360, s, l];
}

function hslToRgb(h, s, l) {
    h = h / 360;
    let r, g, b;
    if(s == 0) { r = g = b = l; }
    else {
        function hue2rgb(p, q, t) {
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }
        let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        let p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }
    return [Math.round(r*255), Math.round(g*255), Math.round(b*255)];
}

export function nextColorHex(hex, step = 20) {
    let [r, g, b] = hexToRgb(hex);
    let [h, s, l] = rgbToHsl(r, g, b);
    h = (h + step) % 360;
    let [nr, ng, nb] = hslToRgb(h, s, l);
    return rgbToHex(nr, ng, nb);
}

export function adjustSaturation(hex, amount) {
    let [r, g, b] = hexToRgb(hex);
    let [h, s, l] = rgbToHsl(r, g, b);
    s = Math.max(0, Math.min(100, s * 100 + amount));
    let [nr, ng, nb] = hslToRgb(h, s / 100, l);
    return rgbToHex(nr, ng, nb);
}

export function adjustLightness(hex, amount) {
    let [r, g, b] = hexToRgb(hex);
    let [h, s, l] = rgbToHsl(r, g, b);
    l = Math.max(0, Math.min(100, l * 100 + amount));
    let [nr, ng, nb] = hslToRgb(h, s, l / 100);
    return rgbToHex(nr, ng, nb);
}