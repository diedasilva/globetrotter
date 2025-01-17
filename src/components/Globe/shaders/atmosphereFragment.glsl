varying vec3 vectexNormal;

void main(){
    float intensity = pow(0.8 - dot(vectexNormal, vec3(0.0, 0.0, 1.0)),3.5);

    gl_FragColor = vec4(0.3,0.6,1.0,1.0) * intensity;
}