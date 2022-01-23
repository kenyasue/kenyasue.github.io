import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Mesh from "./mesh";
import { GlobalStateEvent } from "./types";
import CANNON from 'cannon'

export default class Scene {

    gui: any;
    canvas: HTMLElement;
    scene: THREE.Scene;
    controlls: OrbitControls;
    mainCamera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    objects: Array<Mesh>;
    globalState: GlobalStateEvent;
    world: any;
    physicsDefaultContactMaterial: CANNON.ContactMaterial;
    physicsDefaultMaterial: CANNON.Material;

    constructor(canvasQuery: string) {

        /**
         * Base
         */


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
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        this.objects = [];


        /**
         * Physics
         */
        this.world = new CANNON.World();
        this.world.gravity.set(0, - 9.82, 0);

        this.physicsDefaultMaterial = new CANNON.Material('default')
        this.physicsDefaultContactMaterial = new CANNON.ContactMaterial(
            this.physicsDefaultMaterial,
            this.physicsDefaultMaterial,
            {
                friction: 0.1,
                restitution: 0.1
            }
        )
        this.world.addContactMaterial(this.physicsDefaultContactMaterial)

    }

    add(obj: Mesh) {
        this.objects.push(obj);

        if (obj.mesh)
            this.scene.add(obj.mesh);
        else if (obj.group)
            this.scene.add(obj.group);

        obj.sceneEvents?.onAdd(this);

        if (obj.physicsBody) {
            obj.physicsBody.material = this.physicsDefaultMaterial;
            this.world.addBody(obj.physicsBody);
        }
    }

    remove(obj: Mesh) {
        const index = this.objects.indexOf(obj);
        if (index === -1) return;

        this.objects.splice(index, 1);

        if (obj.mesh)
            this.scene.remove(obj.mesh);
        else if (obj.group)
            this.scene.remove(obj.group);

        obj.sceneEvents?.onRemove(this);
        this.world.removeBody(obj.physicsBody);
    }


    run() {

        /**
         * Animate
        */
        const clock = new THREE.Clock()
        let oldElapsedTime = 0

        const tick = () => {
            const elapsedTime = clock.getElapsedTime()
            const deltaTime = elapsedTime - oldElapsedTime
            oldElapsedTime = elapsedTime

            // Update controls
            this.controlls.update();

            // Render
            this.renderer.render(this.scene, this.mainCamera);

            // Call tick again on the next frame
            window.requestAnimationFrame(tick);

            // Update physics
            this.world.step(1 / 60, deltaTime, 3)

            this.objects.forEach(obj => obj.update());

        }

        tick()

    }

}