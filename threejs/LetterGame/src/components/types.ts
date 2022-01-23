export interface GlobalStateEventListener {
    globalStateEvent: GlobalStateEvent
}

export interface GlobalStateEvent {
    showWireframe?: Function
}

export interface SceneEvents {
    onAdd: Function;
    onRemove: Function;
}
