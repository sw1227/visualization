import * as THREE from "three";
import * as Stats from "stats-js";


// Create a performance monitor in the given element
export function createStats(statsId, mode=0) {
    const stats = new Stats();

    stats.setMode(mode); // mode - 0:fps, 1:ms
    document.getElementById(statsId).appendChild(stats.domElement);

    return stats;
}


// Luminary Point Texture for THREE.PointsMaterial
export function luminaryTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 16;
    canvas.height = 16;
    const context = canvas.getContext("2d");
    const gradient = context.createRadialGradient(
        canvas.width/2, canvas.height/2, 0,
        canvas.width/2, canvas.height/2, canvas.width/2
    );
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.2, "rgba(0,255,255,1)");
    gradient.addColorStop(0.4, "rgba(0,0,64,1)");
    gradient.addColorStop(1, "rgba(0,0,0,1)");
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);
    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    return texture;
}
