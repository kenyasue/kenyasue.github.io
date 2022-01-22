import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui';
import Mesh from "./mesh";
import { GlobalState } from "./types";

export default class Scene {

    gui: any;
    canvas: HTMLElement;
    scene: THREE.Scene;
    controlls: OrbitControls;
    mainCamera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    objects: Array<Mesh>;
    globalState: GlobalState;

    constructor(canvasQuery: string) {

        /**
         * Base
         */

        // Debug
        this.gui = new dat.GUI()

        // Canvas
        this.canvas = document.querySelector(canvasQuery)

        // Scene
        this.scene = new THREE.Scene()

        /**
         * Textures
         */
        const textureLoader = new THREE.TextureLoader()

        /**
         * Object
         */
        const cube = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshBasicMaterial()
        )

        //this.scene.add(cube)

        /**
         * Sizes
         */
        const sizes = {
            width: window.innerWidth,
            height: window.innerHeight
        }

        window.addEventListener('resize', () => {
            // Update sizes
            sizes.width = window.innerWidth
            sizes.height = window.innerHeight

            // Update camera
            this.mainCamera.aspect = sizes.width / sizes.height
            this.mainCamera.updateProjectionMatrix()

            // Update renderer
            this.renderer.setSize(sizes.width, sizes.height)
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        })

        /**
         * Camera
         */
        // Base camera
        this.mainCamera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
        this.mainCamera.position.x = 15;
        this.mainCamera.position.y = 15;
        this.mainCamera.position.z = 15;
        this.scene.add(this.mainCamera)

        // Controls
        this.controlls = new OrbitControls(this.mainCamera, this.canvas as HTMLElement)
        this.controlls.enableDamping = true

        /**
         * Renderer
         */
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas
        })
        this.renderer.setSize(sizes.width, sizes.height)
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

        this.objects = [];

        // default state
        this.globalState = {
            showWireframe: false
        }

    }

    add(obj: Mesh) {
        this.objects.push(obj);

        console.log(obj.mesh)
        this.scene.add(obj.mesh);
    }

    run() {

        /**
         * Animate
        */
        const clock = new THREE.Clock();

        const tick = () => {
            const elapsedTime = clock.getElapsedTime();

            // Update controls
            this.controlls.update();

            // Render
            this.renderer.render(this.scene, this.mainCamera);

            // Call tick again on the next frame
            window.requestAnimationFrame(tick);

            this.objects.forEach(mesh => {
                mesh.update(this.globalState);
            });

        }

        tick()

    }

}