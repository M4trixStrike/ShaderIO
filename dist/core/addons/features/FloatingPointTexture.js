import { BaseTexture } from "./BaseTexture.js";
export class FloatingPointTexture extends BaseTexture {
    constructor(uniformName, textureWidth, textureHeight) {
        super(uniformName, textureWidth, textureHeight, Float32Array, 5126);
    }
}
