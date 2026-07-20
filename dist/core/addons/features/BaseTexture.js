export class BaseTexture {
    _texture;
    _gl;
    _dataBuffer;
    textureWidth;
    textureHeight;
    bufferSize;
    static textureSlot = 0;
    chosenTextureSlot;
    name;
    arrayConstructor;
    bufferDataType;
    constructor(uniformName, bufferSize, textureWidth, textureHeight, arrayConstructor, bufferDataType) {
        this.name = uniformName;
        this.bufferSize = bufferSize;
        this.textureWidth = textureWidth;
        this.textureHeight = textureHeight;
        this.arrayConstructor = arrayConstructor;
        this.bufferDataType = bufferDataType;
        this._dataBuffer = new this.arrayConstructor(bufferSize);
        this.chosenTextureSlot = BaseTexture.textureSlot++;
        if (this.chosenTextureSlot > 30)
            throw new Error(`Texture unit slot out of range: [${this.chosenTextureSlot}/30]`);
    }
    get dataBuffer() {
        if (this._dataBuffer == undefined)
            throw new Error("Texture data buffer is undefined!");
        if (this._dataBuffer.length == 0)
            throw new Error("Texture data buffer is empty!");
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
    inject(gl2, program) {
        this._gl = gl2;
        this._texture = this.gl.createTexture();
        const texture = this.gl.getUniformLocation(program, this.name);
        this.gl.uniform1i(texture, this.chosenTextureSlot);
        console.info(`[${this.name}] sampler2D 4 channel uniform on texture slot [${this.chosenTextureSlot}] has been added!`);
    }
    updateTexture() {
        this.gl.activeTexture(this.gl.TEXTURE0 + this.chosenTextureSlot);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.textureWidth, this.textureHeight, 0, this.gl.RGBA, this.bufferDataType, this.dataBuffer);
    }
    setPixel(x, y, rgba = [0., 0., 0., 0.]) {
        this.dataBuffer[(x + y * this.textureWidth) * 4] = rgba[0];
        this.dataBuffer[(x + y * this.textureWidth) * 4 + 1] = rgba[1];
        this.dataBuffer[(x + y * this.textureWidth) * 4 + 2] = rgba[2];
        this.dataBuffer[(x + y * this.textureWidth) * 4 + 3] = rgba[3];
    }
    clearBuffer() {
        this._dataBuffer = new this.arrayConstructor(this.bufferSize);
    }
}
