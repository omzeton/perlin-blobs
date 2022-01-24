import * as THREE from "three";
import * as dat from "dat.gui";

import fragmentShader from "./GLSL/fragment.glsl?raw";
import vertexShader from "./GLSL/vertex.glsl?raw";
import "./style.css";

class Scene {
    time: number;
    group: THREE.Group;
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    blobMaterial?: THREE.ShaderMaterial;
    options?: any;

    constructor(selector: string) {
        this.blobMaterial = undefined;
        this.time = Date.now();
        this.group = new THREE.Group();

        this.renderer = new THREE.WebGLRenderer({
            antialias: false,
            alpha: false,
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setClearColor(new THREE.Color("#5D576B"));
        this.renderer.shadowMap.enabled = true;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000);
        this.camera.position.z = 100;

        document.getElementById(selector)!.appendChild(this.renderer.domElement);
        this.init();
    }

    constructBlobMesh() {
        const shaderSettings = {
            side: THREE.DoubleSide,
            uniforms: {
                time: {
                    type: "f",
                    value: 0.1,
                },
                pointscale: {
                    type: "f",
                    value: 0.2,
                },
                decay: {
                    type: "f",
                    value: 0.3,
                },
                size: {
                    type: "f",
                    value: 0.3,
                },
                displace: {
                    type: "f",
                    value: 0.3,
                },
                complex: {
                    type: "f",
                    value: 0.0,
                },
                waves: {
                    type: "f",
                    value: 0.1,
                },
                eqcolor: {
                    type: "f",
                    value: 0.0,
                },
                rcolor: {
                    type: "f",
                    value: 0.0,
                },
                gcolor: {
                    type: "f",
                    value: 0.0,
                },
                bcolor: {
                    type: "f",
                    value: 0.0,
                },
                fragment: {
                    type: "i",
                    value: true,
                },
                redhell: {
                    type: "i",
                    value: true,
                },
            },
            vertexShader,
            fragmentShader,
        };
        this.blobMaterial = new THREE.ShaderMaterial(shaderSettings);
        const blobGeometry = new THREE.IcosahedronGeometry(2, 6);
        const mesh = new THREE.Mesh(blobGeometry, this.blobMaterial);
        this.scene.add(mesh);
    }

    addSettings() {
        const gui = new dat.GUI();
        this.options = {
            speed: 0.38,
            size: 0.16,
            perlins: 1.0,
            decay: 1.2,
            displace: 0.54,
            complex: 0.2,
            waves: 3.95,
            eqcolor: 6.0,
            rcolor: 0.996,
            gcolor: 0.576,
            bcolor: 0.549,
            fragment: true,
            redhell: true,
        };
        const perlinGUI = gui.addFolder("Na razie kopiuję");
        perlinGUI.add(this.options, "speed", 0.1, 1.0).listen();
        perlinGUI.add(this.options, "size", 0.0, 3.0).listen();
        perlinGUI.add(this.options, "waves", 0.0, 20.0).listen();
        perlinGUI.add(this.options, "complex", 0.1, 1.0).listen();
        perlinGUI.add(this.options, "displace", 0.1, 1.0).listen();
    }

    render() {
        this.renderer.render(this.scene, this.camera);
        this.camera.updateProjectionMatrix();

        if (this.blobMaterial) {
            this.blobMaterial.uniforms["time"].value = (this.options.speed / 1000) * (Date.now() - this.time);
            this.blobMaterial.uniforms["pointscale"].value = this.options.perlins;
            this.blobMaterial.uniforms["redhell"].value = this.options.redhell;
            this.blobMaterial.uniforms["decay"].value = this.options.decay;
            this.blobMaterial.uniforms["size"].value = this.options.size;
            this.blobMaterial.uniforms["displace"].value = this.options.displace;
            this.blobMaterial.uniforms["complex"].value = this.options.complex;
            this.blobMaterial.uniforms["waves"].value = this.options.waves;
            this.blobMaterial.uniforms["fragment"].value = this.options.fragment;
            this.blobMaterial.uniforms["eqcolor"].value = this.options.eqcolor;
            this.blobMaterial.uniforms["rcolor"].value = this.options.rcolor;
            this.blobMaterial.uniforms["gcolor"].value = this.options.gcolor;
            this.blobMaterial.uniforms["bcolor"].value = this.options.bcolor;
        }

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
        window.addEventListener("resize", this.windowResize.bind(this), false);
    }
}

new Scene("app");
