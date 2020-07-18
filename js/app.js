const coolPalette = ['#5D576B', '#6CD4FF', '#FE938C'];

class MagicBlob {
  constructor(selector) {
    this.blob = null;
    this.time = Date.now();

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setClearColor(coolPalette[0]);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      40,
      window.innerWidth / window.innerHeight,
      1,
      10000,
    );
    this.camera.position.z = 100;
    new THREE.OrbitControls(this.camera, this.renderer.domElement);

    document.getElementById(selector).appendChild(this.renderer.domElement);
    this.init();
  }

  addSettings() {
    const gui = new dat.GUI();
  }

  constructBlobMesh() {
    const shaderSettings = {
      uniforms: {
        time: {
          type: 'f',
          value: 0.0,
        },
      },
      vertexShader,
      fragmentShader,
    };
    this.blobMaterial = new THREE.ShaderMaterial(shaderSettings);
    this.blobGeometry = new THREE.IcosahedronGeometry(20, 4);
    this.blob = new THREE.Mesh(this.blobGeometry, this.blobMaterial);
    this.scene.add(this.blob);
  }

  render() {
    this.renderer.render(this.scene, this.camera);
    this.camera.updateProjectionMatrix();
    this.blobMaterial.uniforms['time'].value =
      0.00025 * (Date.now() - this.time);
    requestAnimationFrame(this.render.bind(this));
  }

  init() {
    this.constructBlobMesh();
    this.render();
    this.addSettings();
  }
}

new MagicBlob('container');
