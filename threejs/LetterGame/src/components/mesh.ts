import * as THREE from 'three'
import { GlobalState } from './types';

export default class Mesh {

    mesh: THREE.Mesh;
    material: THREE.MeshBasicMaterial;
    color: number;

    constructor() {

    }

    update(globalState: GlobalState) {
        this.material.wireframe = globalState.showWireframe;
    }
}