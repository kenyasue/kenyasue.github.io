import * as THREE from 'three';
import Mesh from './mesh';

interface initialParams {
    radius: number,
    x: number,
    y: number,
    z: number,
    color: number
}

export default class Sphere extends Mesh {

    segments: number = 32;
    radius: number;

    constructor({
        radius,
        x,
        y,
        z,
        color
    }: initialParams) {

        super();

        const geometry = new THREE.SphereGeometry(radius, this.segments, this.segments);
        this.material = new THREE.MeshBasicMaterial({ color: color, wireframe: true });
        this.mesh = new THREE.Mesh(geometry, this.material);
        this.color = color;
        this.radius = radius;

        this.mesh.position.x = x;
        this.mesh.position.y = y;
        this.mesh.position.z = z;


    }

}