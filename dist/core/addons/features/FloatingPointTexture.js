import { BaseTexture } from "./BaseTexture.js";
export class FloatingPointTexture extends BaseTexture {
    constructor(uniformName, bufferSize, textureWidth, textureHeight) {
        super(uniformName, bufferSize, textureWidth, textureHeight, Float32Array, 5126);
    }
}
