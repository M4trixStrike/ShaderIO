export class FloatTexture {
    name = "uFloatTexture";
    _texture;
    _gl;
    _dataBuffer;
    textureWidth;
    constructor(bufferSize, textureWidth) {
        this._dataBuffer = new Float32Array(bufferSize);
        this.textureWidth = textureWidth;
    }
    get dataBuffer() {
        if (this._dataBuffer == undefined)
            throw new Error("Float-point texture data buffer is undefined!");
        if (this._dataBuffer?.length == 0)
            throw new Error("Float-point texture data buffer is empty!");
        return this._dataBuffer;
    }
    get gl() {
        if (!this._gl) {
            throw new Error("GL context is not initialized!");
        }
        return this._gl;
    }
    get texture() {
        if (this._texture == undefined) {
            throw new Error("Texture is not initialized!");
        }
        return this._texture;
    }
    inject(gl2) {
        this._gl = gl2;
        this._texture = this.gl.createTexture();
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
        console.info(`[${this.name}] sampler2D uniform has been added!`);
    }
    loadTexture() {
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.textureWidth, 1, 0, this.gl.RGBA, this.gl.FLOAT, this.dataBuffer);
    }
    setPixel(x, y, r, g, b, a) {
        this.dataBuffer[(x + y * this.textureWidth) * 4] = r;
        this.dataBuffer[(x + y * this.textureWidth) * 4 + 1] = g;
        this.dataBuffer[(x + y * this.textureWidth) * 4 + 2] = b;
        this.dataBuffer[(x + y * this.textureWidth) * 4 + 3] = a;
    }
}
