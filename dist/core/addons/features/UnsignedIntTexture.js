import { BaseTexture } from "./BaseTexture.js";
export class UnsignedIntTexture extends BaseTexture {
    constructor(uniformName, bufferSize, textureWidth, textureHeight) {
        super(uniformName, bufferSize, textureWidth, textureHeight, Uint8Array, 5121);
    }
}
