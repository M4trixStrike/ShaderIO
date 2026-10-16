import { BaseTexture } from "./BaseTexture.js";

export class UnsignedIntTexture extends BaseTexture<Uint8Array>{

    constructor(
        uniformName: string, 
        textureWidth: number, 
        textureHeight: number
    ){
        super(uniformName,textureWidth,textureHeight,Uint8Array,5121);
    }

}