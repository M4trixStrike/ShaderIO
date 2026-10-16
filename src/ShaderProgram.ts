import {Shader} from "./core/Shader.js";
import {File} from "./core/FileLoader.js";
import { MouseManager } from "./core/managers/MouseManager.js";
import { Timer } from "./core/Timer.js";
import { UniformManager, UniformType } from "./core/managers/UniformManager.js";
import type { IShaderAddon } from "./core/addons/IShaderAddon.js";

const VERTEX_SHADER = `
attribute vec2 aPosition;

void main() {
    gl_Position = vec4(aPosition, 0.0, 1.0);
}
`

const vertices = new Float32Array([
    -1, -1,
    1, -1,
    -1,  1,
    -1,  1,
    1, -1,
    1,  1
]);

enum ShaderSource{

    FilePath,
    RawString

}

export class ShaderProgram{

    private readonly _gl: WebGLRenderingContext | null;
    private _GLSLProgram: WebGLProgram | undefined;

    private fragmentCache: string = "";

    private readonly resX: number;
    private readonly resY: number;

    private readonly mouseManager: MouseManager;
    private readonly timer: Timer;
    private uniformManager: UniformManager | undefined;

    private shaderFileSrc: string = "shaders/shader.frag";

    private activeAddons: IShaderAddon[] = [];

    private shaderSource: ShaderSource = ShaderSource.FilePath;

    constructor(canvas: HTMLCanvasElement, resX: number, resY: number){

        this._gl = canvas.getContext("webgl");
        this.resX = resX;
        this.resY = resY;

        canvas.width = resX;
        canvas.height = resY

        this.mouseManager = new MouseManager(canvas);
        this.timer = new Timer();
    }

    private async loadShaderData(): Promise<void>{

        if(this.shaderSource == ShaderSource.RawString) 
            return;

        const fragFileHandler = new File(this.shaderFileSrc);
        this.fragmentCache = await fragFileHandler.open();

    }

    private get gl(): WebGLRenderingContext{

        if(!this._gl)
            throw new Error("WebGl is not supported in your browser!");
        return this._gl;
        
    }

    private get GLSLProgram(): WebGLProgram{

        if(!this._GLSLProgram)
            throw new Error("WebGl program has failed to compile!");
        return this._GLSLProgram;
        
    }

    public setShaderString(shaderSource: string): void{

        this.shaderSource = ShaderSource.RawString;
        this.fragmentCache = shaderSource;

    }

    public setShaderFileSource(source: string){

        this.shaderSource = ShaderSource.FilePath;
        this.shaderFileSrc = source;

    }

    public async compileShader(): Promise<void>{

        const t1 = Date.now();

        await this.loadShaderData();

        if(this.shaderSource == ShaderSource.RawString && this.fragmentCache.length <= 0)
            throw new Error("Fragment shader string cant be null or empty");

        if(this.fragmentCache == undefined)
            throw new Error("Shader data failed to load.");
        
        const vertexShader: Shader = new Shader(this.gl.VERTEX_SHADER,VERTEX_SHADER,this.gl);
        const fragShader: Shader = new Shader(this.gl.FRAGMENT_SHADER,this.fragmentCache,this.gl);

        this._GLSLProgram = this.gl.createProgram();

        if(this._GLSLProgram == null)
            throw new Error("Failed to create the GLSL program!");

        this.gl.attachShader(this.GLSLProgram,vertexShader.getCompiledShader());
        this.gl.attachShader(this.GLSLProgram,fragShader.getCompiledShader());

        this.gl.linkProgram(this.GLSLProgram);

        const buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW);

        const aPosition = this.gl.getAttribLocation(this.GLSLProgram, "aPosition");
        this.gl.enableVertexAttribArray(aPosition);
        this.gl.vertexAttribPointer(aPosition, 2, this.gl.FLOAT, false, 0, 0);

        this.gl.useProgram(this.GLSLProgram);

        console.info(`Shader compiled in ${Date.now()-t1}ms.`)

        this.uniformManager = new UniformManager(this.gl,this.GLSLProgram);

        this.activeAddons.forEach( activeAddon => activeAddon.inject(this.gl,this.GLSLProgram));
        
    }

    public renderShader(): void{

        this.gl.viewport(0, 0, this.resX, this.resY);
        
        this.uniformManager?.setUniform(
            UniformType.VECTOR_FLOAT_2,
            "uResolution",
            [
                this.resX,
                this.resY
            ]
        );
        
        if(this.mouseManager.mouseActive())
            this.uniformManager?.setUniform(
                UniformType.VECTOR_FLOAT_2,
                "uMouse",
                [
                    this.mouseManager.getMouseX(),
                    this.mouseManager.getMouseY()
                ]
            );

        const time = this.timer.getTime();
        this.uniformManager?.setUniform(
            UniformType.FLOAT,
            "uTime",
            [
                time
            ]
        );

        this.gl.drawArrays(this.gl.TRIANGLES, 0, vertices.length/2);

    }

    public addAddon(addon: IShaderAddon){
        
        this.activeAddons.push(addon);

    }

    public getRuntime(): number{

        return this.timer.getTime();

    }

    public resetRuntime(): void{

        this.timer.resetTimer();

    }

    public setUniform(uType: UniformType, uName: string, uVector: number[]): void{
        
        this.uniformManager?.setUniform(uType,uName,uVector);

    }

    public setUniformMatrix(uType: UniformType, uName: string, uVector: number[], mTranspose: boolean): void{
        
        this.uniformManager?.setUniformMatrix(uType,uName,uVector,mTranspose);

    }

}  