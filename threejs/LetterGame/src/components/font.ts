import * as THREE from 'three';
import Mesh from './mesh';
import { FontLoader, Font as THREEFont } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import { loadFont } from "../lib/utils";

interface initialParams {
    text: string,
    x: number,
    y: number,
    z: number,
    color: number
}

export default class Font extends Mesh {

    constructor() {
        super();
    }

    async create({
        text,
        x,
        y,
        z,
        color
    }: initialParams) {

        const font: THREEFont = await loadFont("/fonts/Roboto_Black_Regular");

        const geometry = new TextGeometry(
            text,
            {
                font: font,
                size: 0.5,
                height: 0.2,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 5
            }
        )
        this.material = this.defaultMaterial({ color });
        this.mesh = new THREE.Mesh(geometry, this.material);

        this.mesh.position.x = x;
        this.mesh.position.y = y;
        this.mesh.position.z = z;

    }

}

export async function createFont(params: initialParams) {
    const font: Font = new Font();
    await font.create(params);
    return font;
}