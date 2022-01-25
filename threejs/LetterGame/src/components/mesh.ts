import * as THREE from 'three'
import { GlobalStateEvent, GlobalStateEventListener, SceneEvents } from './types';
import Color from 'color';
import state from './state';
import CANNON from 'cannon';
import { DataTexture, Vector2, Vector3 } from 'three';
import { randomString } from '../lib/utils';

export default class Mesh implements GlobalStateEventListener {

    identifier: string;
    mesh: THREE.Mesh;
    group: THREE.Group;
    material: THREE.MeshBasicMaterial;
    color: THREE.Color;
    sceneEvents: SceneEvents;
    globalStateEvent: GlobalStateEvent;
    physicsBody: CANNON.Body;
    selectable: boolean;
    originalPhysicyBodyPosition: CANNON.Vec3; // to save initial position when start dragging
    mouseState: boolean;
    dragInitialPos: CANNON.Vec3;
    dragInitialQuaternion: CANNON.Quaternion;

    constructor({ identifier = randomString(16) }: { identifier: string }) {

        this.identifier = identifier;
        state.subscribe(this);

        this.sceneEvents = {
            onAdd: () => {

            },
            onRemove: () => {
                state.unSubscribe(this);
            },
            onMouseEnter: () => {
                const colorHandler: Color =
                    Color.rgb(
                        255 * this.color.r,
                        255 * this.color.g,
                        255 * this.color.b);

                this.material.color = new THREE.Color(colorHandler.lighten(0.3).hex());
            },
            onMouseLeave: () => {
                if (!this.selectable) return;
                this.material.color = new THREE.Color(this.color);
            },
            onMouseDown: () => {
                if (!this.selectable) return;
                this.mouseState = true;
                this.dragInitialPos = new CANNON.Vec3(
                    this.physicsBody.position.x,
                    this.physicsBody.position.y,
                    this.physicsBody.position.z,
                );
                this.dragInitialQuaternion = new CANNON.Quaternion(
                    this.physicsBody.quaternion.x,
                    this.physicsBody.quaternion.y,
                    this.physicsBody.quaternion.z
                )
            },
            onMouseUp: () => {
                if (!this.selectable) return;
                this.mouseState = false;
            }
        }

        this.globalStateEvent = {
            showWireframe: (val: boolean) => {
                this.material.wireframe = val;
            },
            mouseClick: (val: boolean) => {
                if (!val) {
                    this.mouseState = false;
                    this.physicsBody.wakeUp();
                }
            },
            mousePosOnFloor: (val: THREE.Vector3) => {
                if (this.mouseState) {
                    this.physicsBody.position.x = val.x;
                    this.physicsBody.position.y = this.dragInitialPos.y;
                    this.physicsBody.position.z = val.z;
                    this.physicsBody.sleep();
                }
            }
        }

        this.selectable = false;

    }

    defaultMaterial({ color, opacity = 1.0 }: { color: number | string, opacity?: number }): THREE.MeshPhongMaterial {

        const baseColor = Color(color);

        return new THREE.MeshPhongMaterial({
            color: color,
            wireframe: state.showWireframe,
            //emissive: new THREE.Color(baseColor.darken(0.5).hex()),
            //specular: new THREE.Color(baseColor.lighten(0.1).hex()),
            transparent: true,
            opacity: opacity,
            flatShading: true,
        });
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