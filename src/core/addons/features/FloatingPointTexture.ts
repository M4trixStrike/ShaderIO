import { BaseTexture } from "./BaseTexture.js";

export class FloatingPointTexture extends BaseTexture<Float32Array>{

    constructor(
        uniformName: string, 
        textureWidth: number, 
        textureHeight: number
    ){
        super(uniformName,textureWidth,textureHeight,Float32Array,5126);
    }

}