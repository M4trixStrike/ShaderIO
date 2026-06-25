import { Shader } from "./core/Shader.js";
import { File } from "./core/File.js";
const SHADER_VERT_SRC = "shaders/shader.vert";
const SHADER_FRAG_SRC = "shaders/shader.frag";
const vertices = new Float32Array([
    -1, -1,
    1, -1,
    -1, 1,
    -1, 1,
    1, -1,
    1, 1
]);
export class ShaderManager {
    gl;
    GLSLProgram;
    fragmentCache;
    vertexCache;
    constructor(canvas) {
        this.gl = canvas.getContext("webgl");
    }
    async loadShaderData() {
        if (this.vertexCache == undefined) {
            const vertFileHandler = new File(SHADER_VERT_SRC);
            this.vertexCache = await vertFileHandler.open();
        }
        const fragFileHandler = new File(SHADER_FRAG_SRC);
        this.fragmentCache = await fragFileHandler.open();
    }
    async compileShaders() {
        await this.loadShaderData();
        if (!this.gl)
            throw new Error("WebGl is not supported in your browser!");
        if (this.vertexCache == undefined || this.fragmentCache == undefined)
            throw new Error("Load shader data before compiling the shaders!");
        const vertexShader = new Shader(this.gl.VERTEX_SHADER, this.vertexCache, this.gl);
        const fragShader = new Shader(this.gl.FRAGMENT_SHADER, this.fragmentCache, this.gl);
        this.GLSLProgram = this.gl.createProgram();
        this.gl.attachShader(this.GLSLProgram, vertexShader.getCompiledShader());
        this.gl.attachShader(this.GLSLProgram, fragShader.getCompiledShader());
        this.gl.linkProgram(this.GLSLProgram);
        const buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW);
        const aPosition = this.gl.getAttribLocation(this.GLSLProgram, "aPosition");
        this.gl.enableVertexAttribArray(aPosition);
        this.gl.vertexAttribPointer(aPosition, 2, this.gl.FLOAT, false, 0, 0);
        this.gl.useProgram(this.GLSLProgram);
    }
    renderShaders() {
        this.gl.viewport(0, 0, 500, 500);
        const iResolutionLoc = this.gl.getUniformLocation(this.GLSLProgram, "iResolution");
        this.gl.uniform2f(iResolutionLoc, 500, 500);
        this.gl.drawArrays(this.gl.TRIANGLES, 0, vertices.length);
    }
}
