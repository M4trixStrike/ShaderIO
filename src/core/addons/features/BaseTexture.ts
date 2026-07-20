import type { IShaderAddon } from "../IShaderAddon";

// FLOAT 5126
// UBYTE 5121

type TypedArrayConstructor<T> = new (size: number) => T;

export class BaseTexture<T extends Float32Array | Uint8Array> implements IShaderAddon {

    private _texture: WebGLTexture | undefined;
    private _gl: WebGLRenderingContext | undefined;
    private _dataBuffer: T | undefined;

    private readonly textureWidth: number;
    private readonly textureHeight: number;
    private readonly bufferSize: number;

    private static textureSlot: number = 0;
    private readonly chosenTextureSlot: number;

    name: string;

    private readonly arrayConstructor: TypedArrayConstructor<T>;
    private readonly bufferDataType: number;

    constructor(uniformName: string, bufferSize: number, textureWidth: number, textureHeight: number, arrayConstructor: TypedArrayConstructor<T>, bufferDataType: number){

        this.name = uniformName;

        this.bufferSize = bufferSize;
        this.textureWidth = textureWidth;
        this.textureHeight = textureHeight;

        this.arrayConstructor = arrayConstructor;
        this.bufferDataType = bufferDataType;

        this._dataBuffer = new this.arrayConstructor(bufferSize);

        this.chosenTextureSlot = BaseTexture.textureSlot++;
        if(this.chosenTextureSlot > 30)    
            throw new Error(`Texture unit slot out of range: [${this.chosenTextureSlot}/30]`);
    }

    private get dataBuffer(){

        if(this._dataBuffer == undefined)
                throw new Error("Texture data buffer is undefined!");
            if(this._dataBuffer.length == 0)
                throw new Error("Texture data buffer is empty!");
            return this._dataBuffer;

    }

    private get gl(){

        if(!this._gl){
            throw new Error("GL context is not initialized!");
        }
        return this._gl;

    }

    private get texture(){

        if(this._texture == undefined){
            throw new Error("Texture is not initialized!");
        }
        return this._texture;

    }

    inject(gl2: WebGLRenderingContext, program: WebGLProgram): void {
        
        this._gl = gl2;
        this._texture = this.gl.createTexture();

        const texture = this.gl.getUniformLocation(program, this.name);
        this.gl.uniform1i(texture, this.chosenTextureSlot); 

        console.info(`[${this.name}] sampler2D 4 channel uniform on texture slot [${this.chosenTextureSlot}] has been added!`);

    }

    public updateTexture(): void{

        this.gl.activeTexture(this.gl.TEXTURE0 + this.chosenTextureSlot);
        
        this.gl.bindTexture(this.gl.TEXTURE_2D,this.texture);

        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);

        this.gl.texImage2D(
            this.gl.TEXTURE_2D,
            0,
            this.gl.RGBA,
            this.textureWidth,
            this.textureHeight,
            0,
            this.gl.RGBA,
            this.bufferDataType,
            this.dataBuffer
        );
        
    }

    public setPixel(x: number, y: number, rgba: number[] = [0.,0.,0.,0.]){

        this.dataBuffer[ ( x + y * this.textureWidth ) * 4] = rgba[0]!;
        this.dataBuffer[ ( x + y * this.textureWidth ) * 4 + 1] = rgba[1]!;
        this.dataBuffer[ ( x + y * this.textureWidth ) * 4 + 2] = rgba[2]!;
        this.dataBuffer[ ( x + y * this.textureWidth ) * 4 + 3] = rgba[3]!;

    }

    public clearBuffer(): void{

        this._dataBuffer = new this.arrayConstructor(this.bufferSize);

    }

}