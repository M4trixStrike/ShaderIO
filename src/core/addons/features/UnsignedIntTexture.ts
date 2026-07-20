import { BaseTexture } from "./BaseTexture.js";

export class UnsignedIntTexture extends BaseTexture<Uint8Array>{

    constructor(
        uniformName: string, 
        bufferSize: number, 
        textureWidth: number, 
        textureHeight: number
    ){
        super(uniformName,bufferSize,textureWidth,textureHeight,Uint8Array,5121);
    }

}