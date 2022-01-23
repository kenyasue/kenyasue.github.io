export enum globalStateParams {
    showWireframe,
}

import { GlobalStateEvent, GlobalStateEventListener } from './types';

class state {

    showWireframe: boolean;
    listeners: Array<GlobalStateEventListener>;

    constructor() {
        this.showWireframe = true;
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

    }

}

export default new state();