# ShaderIO #
ShaderIO is a simple fragment shader engine built in TypeScript designed for rapid compilation, rendering, and modification of GLSL fragment shaders.

## The `ShaderManager` class 

`ShaderManager` class is the core of the engine, providing methods that allow for fast development of projects relying on fragment shaders.

## Methods provided by the engine:
- `compileShader()` \
Compiles the current shader provided in the `shaders/shader.frag` file and notifies about its compile status.

- `renderShader()` \
Renders the current shader onto the targeted HTML canvas element.

- `addUniform(uType, uName, uVector)` & `addUniformMatrix(uType, uName, uVector)` \
Allows for fast and easy uniform injection into the loaded shader.

## Engine provided uniforms
The engine comes with in-built uniforms that are automatically injected into the shader:

**Name** | **Type** | **Description**
| - | - | - |
| `uTime`  | `float` | The elapsed engine runtime in seconds
| `uResolution` | `vec2` | Current width and height of the targeted HTML canvas element
| `uMouse`    | `vec2` | Mouse position over the targeted HTML canvas element normalized to values between `0.0` and `1.0`

## How to run

The engine is based on JavaScript modules to link files. Because of this, the application has to be served over HTTP or HTTPS.

### Before you start:

1. Run the `npm install` command to download dependencies.
2. Start a local development server (for example `Live Server`, `http-server`, or any similar tool)
3. Open the project in your browser via the local server URL

The engine comes with a test fragment shader and a simple animation loop found in the `main.ts` file.