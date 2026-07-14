import { ShaderProgram } from "./ShaderProgram.js";
const canvas = document.getElementById("canvas");
const sm = new ShaderProgram(canvas, 500, 500);
await sm.compileShader();
function renderLoop() {
    sm.renderShader();
    window.requestAnimationFrame(renderLoop);
}
renderLoop();
