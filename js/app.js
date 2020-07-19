const coolPalette = ['#5D576B', '#6CD4FF', '#FE938C'];

class MagicBlob {
  constructor(selector) {
    this.time = Date.now();
    this.group = new THREE.Group();

    this.renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setClearColor(new THREE.Color(coolPalette[2]));
    this.renderer.shadowMap.enabled = true;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      40,
      window.innerWidth / window.innerHeight,
      1,
      10000,
    );
    this.camera.position.z = 100;
    // new THREE.OrbitControls(this.camera, this.renderer.domElement);

    document.getElementById(selector).appendChild(this.renderer.domElement);
    this.init();
  }

  constructBlobMesh() {
    const shaderSettings = {
      side: THREE.DoubleSide,
      uniforms: {
        time: {
          type: 'f',
          value: 0.1,
        },
        pointscale: {
          type: 'f',
          value: 0.2,
        },
        decay: {
          type: 'f',
          value: 0.3,
        },
        size: {
          type: 'f',
          value: 0.3,
        },
        displace: {
          type: 'f',
          value: 0.3,
        },
        complex: {
          type: 'f',
          value: 0.0,
        },
        waves: {
          type: 'f',
          value: 0.1,
        },
        eqcolor: {
          type: 'f',
          value: 0.0,
        },
        rcolor: {
          type: 'f',
          value: 0.0,
        },
        gcolor: {
          type: 'f',
          value: 0.0,
        },
        bcolor: {
          type: 'f',
          value: 0.0,
        },
        fragment: {
          type: 'i',
          value: true,
        },
        redhell: {
          type: 'i',
          value: true,
        },
      },
      vertexShader,
      fragmentShader,
    };
    this.blobMaterial = new THREE.ShaderMaterial(shaderSettings);
    this.blobTestMaterial = new THREE.MeshBasicMaterial({
      color: coolPalette[0],
    });
    this.blobGeometry = new THREE.IcosahedronGeometry(2, 6);
    this.blob = new THREE.Mesh(this.blobGeometry, this.blobMaterial);
    this.scene.add(this.blob);
  }

  addSettings() {
    const gui = new dat.GUI();
    this.options = {
      perlin: {
        speed: 0.38,
        size: 0.16,
        perlins: 1.0,
        decay: 1.2,
        displace: 0.54,
        complex: 0.2,
        waves: 3.95,
        eqcolor: 3.0,
        rcolor: 0.364,
        gcolor: 0.341,
        bcolor: 0.419,
        fragment: true,
        redhell: false,
      },
    };
    const perlinGUI = gui.addFolder('Na razie kopiuję');
    perlinGUI.add(this.options.perlin, 'speed', 0.1, 1.0).listen();
    perlinGUI.add(this.options.perlin, 'size', 0.0, 3.0).listen();
    perlinGUI.add(this.options.perlin, 'waves', 0.0, 20.0).listen();
    perlinGUI.add(this.options.perlin, 'complex', 0.1, 1.0).listen();
    perlinGUI.add(this.options.perlin, 'displace', 0.1, 1.0).listen();
    // perlinGUI.open();
  }

  render() {
    this.renderer.render(this.scene, this.camera);
    this.camera.updateProjectionMatrix();

    this.blobMaterial.uniforms['time'].value =
      (this.options.perlin.speed / 1000) * (Date.now() - this.time);
    this.blobMaterial.uniforms[
      'pointscale'
    ].value = this.options.perlin.perlins;
    this.blobMaterial.uniforms['redhell'].value = this.options.perlin.redhell;
    this.blobMaterial.uniforms['decay'].value = this.options.perlin.decay;
    this.blobMaterial.uniforms['size'].value = this.options.perlin.size;
    this.blobMaterial.uniforms['displace'].value = this.options.perlin.displace;
    this.blobMaterial.uniforms['complex'].value = this.options.perlin.complex;
    this.blobMaterial.uniforms['waves'].value = this.options.perlin.waves;
    this.blobMaterial.uniforms['fragment'].value = this.options.perlin.fragment;
    this.blobMaterial.uniforms['eqcolor'].value = this.options.perlin.eqcolor;
    this.blobMaterial.uniforms['rcolor'].value = this.options.perlin.rcolor;
    this.blobMaterial.uniforms['gcolor'].value = this.options.perlin.gcolor;
    this.blobMaterial.uniforms['bcolor'].value = this.options.perlin.bcolor;

    requestAnimationFrame(this.render.bind(this));
  }

  windowResize() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  }

  init() {
    this.constructBlobMesh();
    this.addSettings();
    this.render();
    window.addEventListener('resize', this.windowResize.bind(this), false);
  }
}

new MagicBlob('container');
