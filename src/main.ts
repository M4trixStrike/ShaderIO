import { OESFPTextures } from "./core/addons/extensions/OESFPTextures.js";
import { FloatingPointTexture } from "./core/addons/features/FloatingPointTexture.js";
import { ShaderProgram } from "./ShaderProgram.js";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;

const sm = new ShaderProgram(canvas, 500, 500);

await sm.compileShader();

function renderLoop(){
    sm.renderShader();
    window.requestAnimationFrame(renderLoop);
}

renderLoop();