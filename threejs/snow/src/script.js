import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min'
import { Vector3 } from 'three'
import * as dat from 'lil-gui'

/**
 * Base
 */

// C
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x202030);


/**
 * Debug
 */
const gui = new dat.GUI()
console.log(gui)
/**
 * Models
 */
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('./draco/')

const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

let mixer = null
let swing = null;
const pivot = new THREE.Group();
pivot.position.set(-1.5, 6.7, 10.5);
scene.add(pivot);

const spotlightTarget = new THREE.Group();
spotlightTarget.position.set(-1.5, -1, 10.5);
scene.add(spotlightTarget);

pivot.rotation.x = -0.1;


gltfLoader.load(
    './models/snow2.gltf',
    (gltf) => {
        scene.add(gltf.scene)
        gltf.scene.traverse(function (node) { if (node instanceof THREE.Mesh) { node.castShadow = true; } });
        gltf.scene.traverse(function (node) { if (node instanceof THREE.Mesh) { node.receiveShadow = true; } });

    }
)

gltfLoader.load(
    './models/swing.gltf',
    (gltf) => {
        swing = gltf.scene;
        swing.castShadow = true;
        pivot.add(swing);
        swing.position.set(0, 0, 0)
        swing.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
        swing.traverse(function (node) { if (node instanceof THREE.Mesh) { node.castShadow = true; } });


    }
)



/**
 * Lights
 */


const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xf9ffcc, 0.5)
directionalLight.position.set(14, 14, 12)
directionalLight.lookAt(new THREE.Vector3(0, 0, 0));
directionalLight.castShadow = true;
scene.add(directionalLight)


const spotLight = new THREE.SpotLight(0xffff22, 2, 20, Math.PI * 0.2, 0.1, 1)
spotLight.position.set(-2.0, 6.7, 10.5)
spotLight.target = spotlightTarget;
spotLight.castShadow = true;
scene.add(spotLight);

const pointLight = new THREE.PointLight(0xffff22, 2)
pointLight.position.set(0.7, 4.2, -0.1)
pointLight.castShadow = true;
scene.add(pointLight);



/**
 * Camera
 */

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0


const tween1 = new TWEEN.Tween(pivot.rotation)
    .delay(0)
    .to({
        x: 0.1,
        y: pivot.rotation.y,
        z: pivot.rotation.z
    }, 2000)
    .onComplete(function () {

    })
    .start();
tween1.easing(TWEEN.Easing.Quintic.InOut)


const tween2 = new TWEEN.Tween(pivot.rotation)
    .delay(0)
    .to({
        x: -0.2,
        y: pivot.rotation.y,
        z: pivot.rotation.z
    }, 2000)
    .onComplete(function () {

    })
    .start();
tween2.easing(TWEEN.Easing.Quintic.InOut)

tween1.chain(tween2);
tween2.chain(tween1);

class smokeObj {

    constructor() {
        this.geometry = new THREE.SphereGeometry(0.3, 8, 8);
        this.smokeMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, opacity: 0.5, transparent: true });
        this.sphere = new THREE.Mesh(this.geometry, this.smokeMaterial);
        this.sphere.position.set(-1.6, 8.0, 0);
        scene.add(this.sphere);

        this.speed = 1.0;
        this.fadeSpeed = 0.1;
        this.scaleSpeed = 1;
    }

    update(delta) {
        this.sphere.position.y += delta * this.speed;
        this.smokeMaterial.opacity -= delta * this.fadeSpeed;
        this.sphere.scale.x += delta * this.scaleSpeed;
        this.sphere.scale.y += delta * this.scaleSpeed;
        this.sphere.scale.z += delta * this.scaleSpeed;

        if (this.smokeMaterial.opacity < 0) {
            scene.remove(this.sphere);
            smokes = smokes.filter(smoke => smoke !== this);
        }

    }
}

let smokes = [];

class Snow {

    constructor() {

        this.snowSpeedBase = 0.5;
        this.snowSpread = 100;

        const textureLoader = new THREE.TextureLoader()
        const particleTexture = textureLoader.load('./particles/snowparticle.png')

        // Geometry
        this.particlesGeometry = new THREE.BufferGeometry()
        this.count = 5000;

        const positions = new Float32Array(this.count * 3)
        this.speedPerPerticle = [];

        for (let i = 0; i < this.count * 3; i++) {
            positions[i] = (Math.random() - 0.5) * this.snowSpread
            //colors[i] = Math.random()
            this.speedPerPerticle.push(this.snowSpeedBase + Math.random() * 0.5);
        }

        this.particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

        // Material
        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.3,
            sizeAttenuation: true
        });
        particlesMaterial.transparent = true
        particlesMaterial.alphaMap = particleTexture
        particlesMaterial.map = particleTexture;
        particlesMaterial.alphaTest = 0.001;
        particlesMaterial.depthWrite = false
        particlesMaterial.blending = THREE.AdditiveBlending

        // Points
        const particles = new THREE.Points(this.particlesGeometry, particlesMaterial)
        scene.add(particles)

    }

    update(delta) {

        for (let i = 0; i < this.count; i++) {
            const i3 = i * 3
            this.particlesGeometry.attributes.position.array[i3 + 1] -= this.speedPerPerticle[i] * delta;
            if (this.particlesGeometry.attributes.position.array[i3 + 1] < -1 * this.snowSpread / 2)
                this.particlesGeometry.attributes.position.array[i3 + 1] = this.snowSpread / 2;
        }
        this.particlesGeometry.attributes.position.needsUpdate = true


    }
}

const snow = new Snow();





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
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})


// Base camera
//const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)

//const camera = new THREE.OrthographicCamera(sizes.width / -40, sizes.width / 40, sizes.height / 40, sizes.height / -40, -100, 100);
//const camera = new THREE.OrthographicCamera(sizes.width / -40, sizes.width / 40, sizes.height / 40, sizes.height / -40, -100, 100);
const camera = new THREE.PerspectiveCamera(sizes.width * -0.035 + 139, sizes.width / sizes.height, 1, 100)
camera.position.set(9, 4, 13)
scene.add(camera)

gui.add(camera.position, 'x', -100, 100, 1);
gui.add(camera.position, 'y', -100, 100, 1);
gui.add(camera.position, 'z', -100, 100, 1);
gui.add(camera, 'fov', 0, 100, 0.1);
console.log(sizes)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 1, 0)
controls.enableZoom = false;
controls.enablePan = false;
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true
renderer.gammaOutput = true;


const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    if (mixer) {
        mixer.update(deltaTime)
    }

    //if (pivot)
    //    pivot.rotation = tween.get

    TWEEN.update()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)

    smokes.map(smoke => smoke.update(deltaTime));
    snow.update(deltaTime);
}

setInterval(() => {
    smokes.push(new smokeObj());
}, 3000);

tick()

