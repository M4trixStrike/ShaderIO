# ShaderIO #
ShaderIO is a simple fragment shader engine built in TypeScript designed for rapid compilation, rendering, and modification of GLSL fragment shaders.

## The `ShaderProgram` class 

`ShaderProgram` class is the core of the engine, providing methods that allow for fast development of projects relying on fragment shaders.

## Methods provided by the engine:
- `compileShader()` \
Compiles the current shader provided in the `shaders/shader.frag` file and notifies about its compile status.

- `renderShader()` \
Renders the current shader onto the targeted HTML canvas element.

- `setUniform(uType, uName, uVector)` & `setUniformMatrix(uType, uName, uVector, mTranspose)` \
Allows for fast and easy uniform injection into the loaded shader.

- `getRuntime()` \
Returns the shader's runtime in seconds.

- `addAddon(addon)` \
Attaches a custom addon to the engine. These addons are automatically injected during the shader compilation.


## Engine provided uniforms
The engine comes with in-built uniforms that are automatically injected into the shader:

**Name** | **Type** | **Description**
| - | - | - |
| `uTime`  | `float` | The elapsed engine runtime in seconds
| `uResolution` | `vec2` | Current width and height of the targeted HTML canvas element
| `uMouse`    | `vec2` | Mouse position over the targeted HTML canvas element normalized to values between `0.0` and `1.0`

## Addons

Addons must be registered using `addAddon()` before calling `compileShader()`, as they hook directly into the compilation.

1. `OESFPTextures()` \
A utility addon that enables the WebGL floating-point texture extension.

2. `FloatingPointTexture(uniformName, bufferSize, textureWidth, textureHeight)` & `UnsignedIntTexture(uniformName, bufferSize, textureWidth, textureHeight)` \
Those addons inject a custom 4 channel sampler2D uniform into the shader.
    - **Parameters:**
        - `uniformName` \
        The name given to the uniform within GLSL shader code.
        - `bufferSize` \
        Size of the internal texture data buffer in bytes.
        - `textureWidth` \
        Width of the texture in pixels.
        - `textureHeight` \
        Height of the texture in pixels.
    - **Available Methods:**
        - `clearBuffer()` \
        Clears the internal data buffer.
        - `setPixel(x, y, rgba)` \
        Sets the RGBA values of an individual pixel at the specified coordinate.
        - `updateTexture()` \
        Uploads the buffer data to the shader.


## How to run

The engine is based on JavaScript modules to link files. Because of this, the application has to be served over HTTP or HTTPS.

### Before you start:

1. Run the `npm install` command to download dependencies.
2. Start a local development server (for example `Live Server`, `http-server`, or any similar tool)
3. Open the project in your browser via the local server URL

The engine comes with a test fragment shader and a simple animation loop found in the `main.ts` file.