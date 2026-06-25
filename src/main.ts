import { ShaderManager } from "./ShaderManager.js";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;

canvas.height = 500;
canvas.width = 500;

const sm = new ShaderManager(canvas);

await sm.compileShaders();
sm.renderShaders();