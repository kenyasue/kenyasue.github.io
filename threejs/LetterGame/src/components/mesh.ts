import * as THREE from 'three'
import { GlobalStateEvent, GlobalStateEventListener, SceneEvents } from './types';

import state from './state';
import { Vector3 } from 'three';

export default class Mesh implements GlobalStateEventListener {

    mesh: THREE.Mesh;
    group: THREE.Group;
    material: THREE.MeshBasicMaterial;
    color: number;
    sceneEvents: SceneEvents;
    globalStateEvent: GlobalStateEvent;
    physicsBody: CANNON.Body;

    constructor() {

        state.subscribe(this);

        this.sceneEvents = {
            onAdd: () => {

            },
            onRemove: () => {
                state.unSubscribe(this);
            }
        }

        this.globalStateEvent = {
            showWireframe: (val: boolean) => {
                this.material.wireframe = val;
            }
        }

    }

    defaultMaterial({ color }: { color: number }): THREE.MeshBasicMaterial {
        return new THREE.MeshBasicMaterial({ color: color, wireframe: state.showWireframe });
    }

    update() {

        if (this.physicsBody && this.mesh)
            this.mesh.position.copy(
                new Vector3(
                    this.physicsBody.position.x,
                    this.physicsBody.position.y,
                    this.physicsBody.position.z
                )
            );
        else if (this.physicsBody && this.group)
            this.group.position.copy(
                new Vector3(
                    this.physicsBody.position.x,
                    this.physicsBody.position.y,
                    this.physicsBody.position.z
                )
            );


        if (this.physicsBody && this.mesh) {
            this.mesh.quaternion.copy(this.physicsBody.quaternion as any)
        }
        else if (this.physicsBody && this.group)
            this.group.quaternion.copy(this.physicsBody.quaternion as any)

    }

}