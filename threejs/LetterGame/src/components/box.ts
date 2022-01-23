import * as THREE from 'three';
import Mesh from './mesh';
import CANNON from 'cannon'

interface initialParams {
    width: number,
    height: number,
    depth: number,
    x: number,
    y: number,
    z: number,
    color: number,
    mass?: number
}

export default class Box extends Mesh {

    segments: number = 8;
    radius: number;

    constructor({
        width,
        height,
        depth,
        x,
        y,
        z,
        color,
        mass = 1
    }: initialParams) {

        super();

        const geometry = new THREE.BoxGeometry(width, height, depth, 8, 8, 8)
        this.material = this.defaultMaterial({ color });
        this.mesh = new THREE.Mesh(geometry, this.material);
        this.color = color;

        this.mesh.position.x = x;
        this.mesh.position.y = y;
        this.mesh.position.z = z;

        const boxShape = new CANNON.Box(new CANNON.Vec3(width * 0.5, height * 0.5, depth * 0.5));

        this.physicsBody = new CANNON.Body({
            mass: mass,
            position: new CANNON.Vec3(x, y, z),
            shape: boxShape
        });

    }

}