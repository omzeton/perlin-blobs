class Blob {
  constructor(selector) {
    this.blob = null;

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setClearColor(0xeeeeee);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      40,
      window.innerWidth / window.innerHeight,
      1,
      10000,
    );
    this.camera.position.z = 100;

    document.getElementById(selector).appendChild(this.renderer.domElement);
    this.init();
  }

  addSettings() {
    const gui = new dat.GUI();
  }

  constructBlobMesh() {
    const blobMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      wireframe: true,
    });
    const blobGeometry = new THREE.IcosahedronGeometry(20, 4);
    this.blob = new THREE.Mesh(blobGeometry, blobMaterial);
    this.scene.add(this.blob);
  }

  render() {
    this.renderer.render(this.scene, this.camera);
    this.camera.updateProjectionMatrix();
    requestAnimationFrame(this.render.bind(this));
  }

  init() {
    this.render();
    this.addSettings();
    this.constructBlobMesh();
  }
}

new Blob('container');
