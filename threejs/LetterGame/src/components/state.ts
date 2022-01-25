import * as THREE from 'three'
import Mesh from './mesh';

export enum globalStateParams {
    showWireframe,
    mousePos,
    mouseClick,
    currentSelectedObj,
    mousePosOnFloor
}

import { GlobalStateEvent, GlobalStateEventListener } from './types';

class state {

    showWireframe: boolean;
    mousePos: THREE.Vector2;
    mouseClick: THREE.Vector2;
    mousePosOnFloor: THREE.Vector2;
    currentSelectedObj: Mesh;

    listeners: Array<GlobalStateEventListener>;

    constructor() {
        this.showWireframe = false;
        this.listeners = [];

    }

    subscribe(listener: GlobalStateEventListener): void {
        this.listeners.push(listener);
    }

    unSubscribe(listener: GlobalStateEventListener): void {

        const index = this.listeners.indexOf(listener);
        if (index !== -1) {
            this.listeners.splice(index, 1);
        }

    }

    updateParam(key: globalStateParams, val: any) {

        if (key === globalStateParams.showWireframe) {
            this.showWireframe = val;
            this.listeners.forEach(listener => {
                listener.globalStateEvent.showWireframe ?
                    listener.globalStateEvent.showWireframe(val) : null;
            })
        }

        if (key === globalStateParams.mousePos) {
            this.mousePos = val;
            this.listeners.forEach(listener => {
                listener.globalStateEvent.mousePos ?
                    listener.globalStateEvent.mousePos(val) : null;
            })
        }

        if (key === globalStateParams.mouseClick) {

            if (val)
                this.mouseClick = new THREE.Vector2(this.mousePos.x, this.mousePos.y);
            else
                this.mouseClick = null;

            this.listeners.forEach(listener => {
                listener.globalStateEvent.mouseClick ?
                    listener.globalStateEvent.mouseClick(val) : null;
            })
        }


        if (key === globalStateParams.currentSelectedObj) {
            this.currentSelectedObj = val;
            this.listeners.forEach(listener => {
                listener.globalStateEvent.currentSelectedObj ?
                    listener.globalStateEvent.currentSelectedObj(val) : null;
            })
        }

        if (key === globalStateParams.mousePosOnFloor) {
            this.mousePosOnFloor = val;
            this.listeners.forEach(listener => {
                listener.globalStateEvent.mousePosOnFloor ?
                    listener.globalStateEvent.mousePosOnFloor(val) : null;
            })
        }


    }

}

export default new state();