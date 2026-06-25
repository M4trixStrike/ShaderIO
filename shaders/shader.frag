precision highp float;

uniform vec2 iResolution;

void main() {

    vec2 uv = gl_FragCoord.xy / iResolution.xy;

    vec3 col = vec3(uv,0);

    gl_FragColor = vec4(col,1.0);
}