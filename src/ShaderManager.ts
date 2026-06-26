import {Shader} from "./core/Shader.js";
import {File} from "./core/File.js";
import { MouseManager } from "./core/MouseManager.js";
import { Timer } from "./core/Timer.js";

const SHADER_VERT_SRC = "shaders/shader.vert";
const SHADER_FRAG_SRC = "shaders/shader.frag";

const vertices = new Float32Array([
    -1, -1,
    1, -1,
    -1,  1,
    -1,  1,
    1, -1,
    1,  1
]);

export class ShaderManager{

    private readonly gl: WebGLRenderingContext;
    private GLSLProgram: WebGLProgram | undefined;

    private fragmentCache: string | undefined;
    private vertexCache: string | undefined;

    private readonly resX: number;
    private readonly resY: number;

    private readonly mouseManager: MouseManager;
    private readonly timer: Timer;

    constructor(canvas: HTMLCanvasElement, resX: number, resY: number){

        this.gl = canvas.getContext("webgl") as WebGLRenderingContext;
        this.resX = resX;
        this.resY = resY;

        canvas.width = resX;
        canvas.height = resY

        this.mouseManager = new MouseManager(canvas);
        this.timer = new Timer();
    }

    private async loadShaderData(): Promise<void>{

        if(this.vertexCache == undefined){

            const vertFileHandler = new File(SHADER_VERT_SRC);
            this.vertexCache = await vertFileHandler.open();

        }

        const fragFileHandler = new File(SHADER_FRAG_SRC);
        this.fragmentCache = await fragFileHandler.open();

    }

    public async compileShaders(): Promise<void>{

        await this.loadShaderData();

        if(!this.gl)
            throw new Error("WebGl is not supported in your browser!");

        if(this.vertexCache == undefined || this.fragmentCache == undefined)
            throw new Error("Load shader data before compiling the shaders!")
        
        const vertexShader: Shader = new Shader(this.gl.VERTEX_SHADER,this.vertexCache,this.gl);
        const fragShader: Shader = new Shader(this.gl.FRAGMENT_SHADER,this.fragmentCache,this.gl);

        this.GLSLProgram = this.gl.createProgram();

        this.gl.attachShader(this.GLSLProgram,vertexShader.getCompiledShader());
        this.gl.attachShader(this.GLSLProgram,fragShader.getCompiledShader());

        this.gl.linkProgram(this.GLSLProgram);

        const buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW);

        const aPosition = this.gl.getAttribLocation(this.GLSLProgram!, "aPosition");
        this.gl.enableVertexAttribArray(aPosition);
        this.gl.vertexAttribPointer(aPosition, 2, this.gl.FLOAT, false, 0, 0);

        this.gl.useProgram(this.GLSLProgram);
    }

    public renderShaders(): void{

        this.gl.viewport(0, 0, this.resX, this.resY);

        const uResolution = this.gl.getUniformLocation(this.GLSLProgram!, "uResolution");
        this.gl.uniform2f(
            uResolution,
            this.resX,
            this.resY
        );

        const uMouse = this.gl.getUniformLocation(this.GLSLProgram!, "uMouse");
        this.gl.uniform2f(
            uMouse,
            this.mouseManager.getMouseX(),
            this.mouseManager.getMouseY()
        );
        const uTime = this.gl.getUniformLocation(this.GLSLProgram!, "uTime");
        const time = this.timer.getTime();
        this.gl.uniform1f(
            uTime,
            time
        );

        this.gl.drawArrays(this.gl.TRIANGLES, 0, vertices.length);
    }
}  