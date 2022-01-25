import './style.css'
import * as THREE from 'three'

import Scene from "./components/scene";
import Sphere from "./components/sphere";
import Font, { createFont } from './components/font';
import Box from "./components/box";
import Container from "./components/container";
import state, { globalStateParams } from './components/state';
import ColorGenerator from 'colors-generator';
import { getRandomLetter } from './lib/utils';
import * as Constants from './lib/constants';
import gui from './lib/debugger';

(async () => {

    // Debug
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


    let count = 200;
    const colors: Array<string> = ColorGenerator.generate('#86bff2', 10).darker(0.1).get()

    const timer = setInterval(() => {

        (async () => {

            count--;
            if (count === 0) clearInterval(timer);
            const strColor = colors[Math.floor(Math.random() * 10000 % colors.length)];

            const font1 = await createFont({
                text: getRandomLetter(),
                x: Math.random() * 10 - 5,
                y: Math.random() * 20,
                z: Math.random() * 10 - 5,
                color: strColor,
                opacity: 1.0,
                selectable: true
            });
            font1.mesh.castShadow = true;

            scene.add(font1);

        })();

    }, 10)
    const scene: Scene = new Scene('canvas.webgl');
    scene.run();

    /*
    const floorBox = new Container({
        width: 15,
        height: 3,
        depth: 15,
        x: 1,
        y: -4,
        z: 1,
        color: 0xeeeeee,
        mass: 0,
        opacity: 0.5
    })
    
    scene.add(floorBox);

    gui.add(floorBox.physicsBody.quaternion, "x").min(Math.PI * -0.1).max(Math.PI * 0.1).step(0.01);
    gui.add(floorBox.physicsBody.quaternion, "y").min(Math.PI * -0.1).max(Math.PI * 0.1).step(0.01);
    gui.add(floorBox.physicsBody.quaternion, "z").min(Math.PI * -0.1).max(Math.PI * 0.1).step(0.01);
    */

    const floor = new Box({
        width: 200,
        height: 0.3,
        depth: 200,
        x: 0,
        y: 0,
        z: 0,
        color: 0xffffff,
        mass: 0,
        identifier: Constants.floorIdentifier
    })
    floor.mesh.receiveShadow = true;
    scene.add(floor);

    // window 
    const sizes = {
        width: window.innerWidth,
        height: window.innerHeight
    }

    window.onclick = () => {
        //state.updateParam(globalStateParams.showWireframe, !state.showWireframe);
    }

    const mouse = new THREE.Vector2()

    window.addEventListener('mousemove', (event) => {

        mouse.x = event.clientX / sizes.width * 2 - 1
        mouse.y = - (event.clientY / sizes.height) * 2 + 1

        state.updateParam(globalStateParams.mousePos, mouse);
    })

    window.addEventListener('mousedown', (event) => {
        state.updateParam(globalStateParams.mouseClick, true);
    })

    window.addEventListener('mouseup', (event) => {
        state.updateParam(globalStateParams.mouseClick, false);
    })

})();