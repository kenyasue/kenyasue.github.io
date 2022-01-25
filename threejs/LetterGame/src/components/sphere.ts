import * as THREE from 'three';
import Mesh from './mesh';
import CANNON from 'cannon'

interface initialParams {
    radius: number,
    x: number,
    y: number,
    z: number,
    color: number | string,
    mass?: number,
    identifier?: string
}

export default class Sphere extends Mesh {

    segments: number = 16;
    radius: number;
    mass: number = 1;

    constructor({
        radius,
        x,
        y,
        z,
        color,
        mass = 1,
        identifier
    }: initialParams) {

        super({ identifier });

        const geometry = new THREE.SphereGeometry(radius, this.segments, this.segments);
        this.material = this.defaultMaterial({ color });
        this.mesh = new THREE.Mesh(geometry, this.material);
        this.color = new THREE.Color(color);
        this.radius = radius;

        this.mesh.position.x = x;
        this.mesh.position.y = y;
        this.mesh.position.z = z;

        const sphereShape = new CANNON.Sphere(radius);

        this.physicsBody = new CANNON.Body({
            mass: 1,
            position: new CANNON.Vec3(x, y, z),
            shape: sphereShape
        });



    }

}