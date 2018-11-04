import * as d3 from "d3";
import * as math from "mathjs";


// Calculate proximity to lattice
export function latticeProximity(x, y, alpha=0.01) {
    // alpha: prevent divergence of log - the smaller the sharper
    const dx = - Math.log(alpha + Math.abs(x - Math.round(x)));
    const dy = - Math.log(alpha + Math.abs(y - Math.round(y)));
    // Normalize
    const minVal = - 2 * Math.log(alpha + 0.5);
    const maxVal = - 2 * Math.log(alpha);
    return (dx + dy - minVal) / (maxVal - minVal); // range [0, 1]
}

// (x, y) => 0 or 1
export function checkerBoard(x, y) {
    return Math.abs(Math.abs(Math.floor(x) % 2) - Math.abs(Math.floor(y) % 2));
}

// (x, y) => Argument(angle) [-Pi, +PI] => [0, 2*PI] => [0, 1]
export function normalizedArg(x, y) {
    return (math.atan2(y, x) + 2*Math.PI) % (2*Math.PI) / (2*Math.PI);
}


export const colorScales = [
    {"name": "Purple-Blue", "scale": d3.interpolatePuBu},
    {"name": "Blue-Green", "scale": d3.interpolateBuGn},
    {"name": "Viridis", "scale": d3.interpolateViridis},
    {"name": "Inferno", "scale": d3.interpolateInferno},
    {"name": "Warm", "scale": d3.interpolateWarm},
    {"name": "Cool", "scale": d3.interpolateCool},
    {"name": "Rainbow", "scale": d3.interpolateSinebow},
];

export const colorMethods = [
    {"name": "Lattice", "function": latticeProximity},
    {"name": "CheckerBoard", "function": checkerBoard},
    {"name": "Argument", "function": normalizedArg},
];
