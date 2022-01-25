import * as THREE from 'three';
import Mesh from './mesh';
import { FontLoader, Font as THREEFont } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import { loadFont } from "../lib/utils";
import { Vector3 } from 'three';
import CANNON from 'cannon'

interface initialParams {
    text: string,
    x: number,
    y: number,
    z: number,
    color: number | string,
    opacity?: number,
    mass?: number,
    selectable?: boolean,
    identifier?: string
}

export default class Font extends Mesh {

    size: THREE.Vector3;
    boxMergin: number = 0.15;

    constructor(identifier: string) {
        super({ identifier });
    }

    async create({
        text,
        x,
        y,
        z,
        color,
        opacity = 1,
        mass = 50,
        selectable = false
    }: initialParams) {

        const font: THREEFont = await loadFont("/fonts/Roboto_Black_Regular");

        const geometry = new TextGeometry(
            text,
            {
                font: font,
                size: 1.3,
                height: 0.3,
                curveSegments: 36,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.1,
                bevelOffset: 0,
                bevelSegments: 12
            }
        );

        geometry.computeBoundingBox();
        geometry.computeBoundingSphere();

        this.material = this.defaultMaterial({ color, opacity });
        this.mesh = new THREE.Mesh(geometry, this.material);
        this.color = new THREE.Color(color);
        this.size = this.mesh.geometry.boundingBox.getSize(new THREE.Vector3());
        this.mesh.position.x = x;
        this.mesh.position.y = y;
        this.mesh.position.z = z;

        const boxShape = new CANNON.Box(new CANNON.Vec3(
            this.size.x * 0.5 + this.boxMergin,
            this.size.y * 0.5 + this.boxMergin,
            this.size.z * 0.5 + this.boxMergin));

        this.physicsBody = new CANNON.Body({
            mass: mass,
            position: new CANNON.Vec3(x, y, z),
            shape: boxShape
        });

        this.selectable = selectable;

    }

}

export async function createFont(params: initialParams) {
    const font: Font = new Font(params.identifier);
    await font.create(params);
    return font;
}