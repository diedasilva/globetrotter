varying vec2 vertexUV;
varying vec3 vectexNormal;

void main(){
    vertexUV = uv;
    vectexNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
