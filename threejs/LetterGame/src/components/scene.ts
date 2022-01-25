import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Mesh from "./mesh";
import { GlobalStateEvent } from "./types";
import state, { globalStateParams } from './state';
import CANNON from 'cannon'
import { Object3D } from 'three';
import Color from 'color';
import gui from '../lib/debugger';
import * as Constants from '../lib/constants';

export default class Scene {

    canvas: HTMLElement;
    scene: THREE.Scene;
    controlls: OrbitControls;
    mainCamera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    objects: Array<Mesh>;
    globalStateEvent: GlobalStateEvent;
    world: any;
    physicsDefaultContactMaterial: CANNON.ContactMaterial;
    physicsDefaultMaterial: CANNON.Material;
    light1: THREE.Light;
    currentOnMouseObj: Mesh;

    constructor(canvasQuery: string) {

        /**
         * Base
         */
        gui.show(true);

        // Canvas
        this.canvas = document.querySelector(canvasQuery)

        // Scene
        this.scene = new THREE.Scene()
        this.scene.background = new THREE.Color(0xcccccc);
        this.scene.fog = new THREE.Fog(0xcccccc, -1, 100)

        const light1 = new THREE.AmbientLight(0xffffff, 0.2);
        this.scene.add(light1);

        const light2 = new THREE.DirectionalLight(0xffffff, 0.5);
        light2.position.set(100, 100, 0);
        light2.target.position.set(0, 0, 0);
        light2.shadow.camera.near = 1;
        light2.shadow.camera.far = 1000;
        light2.castShadow = true;
        light2.shadow.camera.left = -50;
        light2.shadow.camera.right = 50;
        light2.shadow.camera.top = 50;
        light2.shadow.camera.bottom = -50;
        light2.shadow.mapSize.width = 256;
        light2.shadow.mapSize.height = 256;
        this.scene.add(light2);

        const light3 = new THREE.DirectionalLight(0xffffff, 0.5);
        light3.position.set(0, 100, 0);
        light3.target.position.set(0, 0, 0);
        this.scene.add(light3);

        const light4 = new THREE.DirectionalLight(0xffffff, 1);
        light4.position.set(0, 0, 100);
        light4.target.position.set(0, 0, 0);
        this.scene.add(light4);

        /*
        gui.add(light2.position, "x").min(-100).max(100).step(1);
        gui.add(light2.position, "y").min(-100).max(100).step(1);
        gui.add(light2.position, "z").min(-100).max(100).step(1);
        gui.add(light2.rotation, "x").min(Math.PI * -1.0).max(Math.PI * 1.0).step(0.01);
        gui.add(light2.rotation, "y").min(Math.PI * -1.0).max(Math.PI * 1.0).step(0.01);
        gui.add(light2.rotation, "z").min(Math.PI * -1.0).max(Math.PI * 1.0).step(0.01);
        gui.add(light2.shadow.camera, "near").min(-50).max(50).step(1);
        gui.add(light2.shadow.camera, "far").min(-50).max(50).step(1);
        */

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
        this.mainCamera = new THREE.PerspectiveCamera(50, sizes.width / sizes.height, 0.1, 200)
        this.mainCamera.position.x = 15;
        this.mainCamera.position.y = 20;
        this.mainCamera.position.z = 30;
        this.mainCamera.lookAt(0, 0, 0);
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
        this.renderer.shadowMap.enabled = true;

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
                friction: 1,
                restitution: 0
            }
        )
        this.world.addContactMaterial(this.physicsDefaultContactMaterial)

        /* events */
        state.subscribe(this);
        this.globalStateEvent = {
            mousePos: (position: THREE.Vector2) => {

                // find object
                const raycaster = new THREE.Raycaster()
                raycaster.setFromCamera(position, this.mainCamera);

                const objectsToTest: Array<Object3D> = this.objects.map(obj => obj.mesh);
                const intersects = raycaster.intersectObjects(objectsToTest.filter(obj => obj))
                if (!intersects) return;

                if (intersects[0]) {

                    const intersectObj: Mesh = this.objects.find(obj => obj.mesh === intersects[0].object);
                    if (!intersectObj) {
                        if (this.currentOnMouseObj) {
                            this.currentOnMouseObj.sceneEvents.onMouseLeave();
                            this.currentOnMouseObj = null;
                        }
                        return;
                    }
                    if (intersectObj) {
                        intersectObj.selectable ? this.controlls.enabled = false : this.controlls.enabled = true;
                        intersectObj.sceneEvents.onMouseEnter();
                    }
                    if (this.currentOnMouseObj !== intersectObj
                        && this.currentOnMouseObj) this.currentOnMouseObj.sceneEvents.onMouseLeave();

                    this.currentOnMouseObj = intersectObj;

                    // get floor position
                    intersects.forEach(intersect => {
                        const mesh: Mesh = this.objects.find(obj => obj.mesh === intersect.object);
                        if (mesh.identifier === Constants.floorIdentifier) {
                            state.updateParam(globalStateParams.mousePosOnFloor, intersect.point);
                        }
                    });

                } else {
                    if (!this.controlls.enabled) this.controlls.enabled = true;
                }


            },
            mouseClick: (clickState: boolean) => {

                // find object
                const raycaster = new THREE.Raycaster()
                raycaster.setFromCamera(state.mousePos, this.mainCamera);

                const objectsToTest: Array<Object3D> = this.objects.map(obj => obj.mesh);
                const intersects = raycaster.intersectObjects(objectsToTest.filter(obj => obj))

                if (intersects && intersects[0]) {
                    const intersectObj: Mesh = this.objects.find(obj => obj.mesh === intersects[0].object);
                    if (intersectObj) {
                        clickState ? intersectObj.sceneEvents.onMouseDown() : intersectObj.sceneEvents.onMouseUp();
                    }
                }
            }
        }
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