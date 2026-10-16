import { BaseTexture } from "./BaseTexture.js";
export class UnsignedIntTexture extends BaseTexture {
    constructor(uniformName, textureWidth, textureHeight) {
        super(uniformName, textureWidth, textureHeight, Uint8Array, 5121);
    }
}
