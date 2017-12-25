/*
  WebGLRenderer提供了一些默认的attribute和uniform变量。
  WebGLProgram会将这些变量加入到着色器程序中，所以不需要自己手动定义这些变量
  具体内置了哪些看WebGLProgram的文档吧
*/

var Shaders = {
  'earth' : {
    uniforms: {
      'texture': { type: 't', value: null } // 属性名要与着色器中使用的uniform变量名一致
    },
    vertexShader: [
      'varying vec3 vNormal;',
      'varying vec2 vUv;',
      'void main() {',
        'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );', // 得到裁剪坐标系下的坐标，转化为NDC再到屏幕坐标由gpu来完成
        'vNormal = normalize( normalMatrix * normal );', // normalMatrix是modelViewMatrix的逆转置矩阵，得到的是摄像机坐标下、归一化的法向量？？？
        'vUv = uv;',
      '}'
    ].join('\n'),
    fragmentShader: [
      'uniform sampler2D texture;',
      'varying vec3 vNormal;',
      'varying vec2 vUv;',
      'void main() {',
        'vec3 diffuse = texture2D( texture, vUv ).xyz;', // 获取贴图的像素
        'float intensity = 1.05 - dot( vNormal, vec3( 0.0, 0.0, 1.0 ) );', // dot：返回向量的点积
        /*
          vNormal是插值之后的摄像机坐标系下的坐标？？vec3( 0.0, 0.0, 1.0 )就是指向摄像机
          这样球体越边缘越亮就解释的通了

          intensity越大的地方越白。球体正对着摄像机的地方intensity最小，四周越来越大
          intensity立方是为了增大强弱对比
        */
        'vec3 atmosphere = vec3( 1.0, 1.0, 1.0 ) * pow( intensity, 3.0 );', // pow: 返回intensity的3次方
        'gl_FragColor = vec4( diffuse + atmosphere, 1.0 );',
        // 'gl_FragColor = vec4( diffuse, 1.0 );', // 对比一下就发现了，加上atmosphere之后地球边缘（地平线向里）泛白
      '}'
    ].join('\n')
  },
  'atmosphere' : {
    uniforms: {},
    vertexShader: [
      'varying vec3 vNormal;',
      'void main() {',
        'vNormal = normalize( normalMatrix * normal );',
        'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
      '}'
    ].join('\n'),
    fragmentShader: [
      'varying vec3 vNormal;',
      'void main() {',
        'float intensity = pow( 0.8 - dot( vNormal, vec3( 0, 0, 1.0 ) ), 12.0 );',
        'gl_FragColor = vec4( 1.0, 1.0, 1.0, 1.0 ) * intensity;',
      '}'
    ].join('\n')
  }
}
