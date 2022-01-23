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

export default class Contaier extends Mesh {

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
        const thickness = 0.5;

        // material
        this.material = this.defaultMaterial({ color });
        this.color = color;

        const geometryFloor = new THREE.BoxGeometry(width, thickness, depth, 8, 8, 8)
        const meshFloor = new THREE.Mesh(geometryFloor, this.material);
        meshFloor.position.set(x, y, z);

        const geobetrySide1 = new THREE.BoxGeometry(thickness, height, depth, 8, 8, 8)
        const meshSide1 = new THREE.Mesh(geobetrySide1, this.material);
        meshSide1.position.set(x + width / 2 - thickness / 2, y + height / 2 - thickness / 2, z);

        const geobetrySide2 = new THREE.BoxGeometry(thickness, height, depth, 8, 8, 8)
        const meshSide2 = new THREE.Mesh(geobetrySide2, this.material);
        meshSide2.position.set(x - width / 2 + thickness / 2, y + height / 2 - thickness / 2, z);

        const geobetrySide3 = new THREE.BoxGeometry(width, height, thickness, 8, 8, 8)
        const meshSide3 = new THREE.Mesh(geobetrySide3, this.material);
        meshSide3.position.set(x, y + height / 2 - thickness / 2, z + depth / 2);

        const geobetrySide4 = new THREE.BoxGeometry(width, height, thickness, 8, 8, 8)
        const meshSide4 = new THREE.Mesh(geobetrySide4, this.material);
        meshSide4.position.set(x, y + height / 2 - thickness / 2, z - depth / 2);


        const group = new THREE.Group();
        group.add(meshFloor);
        group.add(meshSide1);
        group.add(meshSide2);
        group.add(meshSide3);
        group.add(meshSide4);

        this.group = group;

        const physicsShapeFloor = new CANNON.Box(new CANNON.Vec3(width * 0.5, thickness * 0.5, depth * 0.5));
        const physicsShapeSide1 = new CANNON.Box(new CANNON.Vec3(thickness * 0.5, height * 0.5, depth * 0.5));
        const physicsShapeSide2 = new CANNON.Box(new CANNON.Vec3(thickness * 0.5, height * 0.5, depth * 0.5));
        const physicsShapeSide3 = new CANNON.Box(new CANNON.Vec3(width * 0.5, height * 0.5, thickness));
        const physicsShapeSide4 = new CANNON.Box(new CANNON.Vec3(width * 0.5, height * 0.5, thickness));

        this.physicsBody = new CANNON.Body({ mass: mass });
        this.physicsBody.addShape(physicsShapeFloor, new CANNON.Vec3(x, y, z));
        this.physicsBody.addShape(physicsShapeSide1, new CANNON.Vec3(x + width / 2 - thickness / 2, y + height / 2 - thickness / 2, z));
        this.physicsBody.addShape(physicsShapeSide2, new CANNON.Vec3(x - width / 2 + thickness / 2, y + height / 2 - thickness / 2, z));
        this.physicsBody.addShape(physicsShapeSide3, new CANNON.Vec3(x, y + height / 2 - thickness / 2, z + depth / 2));
        this.physicsBody.addShape(physicsShapeSide4, new CANNON.Vec3(x, y + height / 2 - thickness / 2, z - depth / 2));

    }

}