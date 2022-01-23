import './style.css'
import * as dat from 'lil-gui';

import Scene from "./components/scene";
import Sphere from "./components/sphere";
import Font, { createFont } from './components/font';
import Box from "./components/box";
import Container from "./components/container";
import state, { globalStateParams } from './components/state';

(async () => {

    // Debug
    const gui = new dat.GUI()
    gui.add({
        createSphere: () => {
            const sphere1 = new Sphere({
                radius: Math.random() * 0.5 + 0.5,
                x: Math.random() * 10 - 5,
                y: Math.random() * 20,
                z: Math.random() * 10 - 5,
                color: 0xffff00
            });

            scene.add(sphere1);

        }
    }, 'createSphere');
    gui.add({
        createBox: () => {
            const box1 = new Box({
                width: Math.random() * 0.5 + 0.5,
                height: Math.random() * 0.5 + 0.5,
                depth: Math.random() * 0.5 + 0.5,
                x: Math.random() * 10 - 5,
                y: Math.random() * 20,
                z: Math.random() * 10 - 5,
                color: 0xff0000
            })

            scene.add(box1);
        }
    }, 'createBox');


    let count = 100;
    const timer = setInterval(() => {
        count--;
        if (count === 0) clearInterval(timer);

        const sphere1 = new Sphere({
            radius: Math.random() * 0.5 + 0.5,
            x: Math.random() * 10 - 5,
            y: Math.random() * 20,
            z: Math.random() * 10 - 5,
            color: 0xffff00
        });

        scene.add(sphere1);

        const box1 = new Box({
            width: Math.random() * 0.5 + 0.5,
            height: Math.random() * 0.5 + 0.5,
            depth: Math.random() * 0.5 + 0.5,
            x: Math.random() * 10 - 5,
            y: Math.random() * 20,
            z: Math.random() * 10 - 5,
            color: 0xff0000
        })

        scene.add(box1);

    }, 100)
    const scene: Scene = new Scene('canvas.webgl');
    scene.run();

    const font1 = await createFont({
        text: "Test",
        x: 0,
        y: 0,
        z: 0,
        color: 0xffff00
    })

    //scene.add(font1);

    const floorBox = new Container({
        width: 20,
        height: 3,
        depth: 20,
        x: 1,
        y: -4,
        z: 1,
        color: 0x0000ff,
        mass: 0
    })

    scene.add(floorBox);
    gui.add(floorBox.physicsBody.quaternion, "x").min(Math.PI * -0.1).max(Math.PI * 0.1).step(0.01);
    gui.add(floorBox.physicsBody.quaternion, "y").min(Math.PI * -0.1).max(Math.PI * 0.1).step(0.01);
    gui.add(floorBox.physicsBody.quaternion, "z").min(Math.PI * -0.1).max(Math.PI * 0.1).step(0.01);

    window.onclick = () => {
        //state.updateParam(globalStateParams.showWireframe, !state.showWireframe);
    }

})();