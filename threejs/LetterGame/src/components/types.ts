export interface GlobalStateEventListener {
    globalStateEvent: GlobalStateEvent
}

export interface GlobalStateEvent {
    showWireframe?: Function,
    mousePos?: Function,
    mouseClick?: Function,
    currentSelectedObj?: Function,
    mousePosOnFloor?: Function
}

export interface SceneEvents {
    onAdd: Function;
    onRemove: Function;
    onMouseEnter: Function;
    onMouseLeave: Function;
    onMouseDown: Function;
    onMouseUp: Function;
}
