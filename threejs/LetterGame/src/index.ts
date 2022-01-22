import './style.css'


import Scene from "./components/scene";
import Sphere from "./components/sphere";

const scene: Scene = new Scene('canvas.webgl');
scene.run();

const sphere1 = new Sphere({
    radius: 4,
    x: 1,
    y: 1,
    z: 1,
    color: 0xffff00
});


scene.add(sphere1);

const sphere2 = new Sphere({
    radius: 4,
    x: 4,
    y: 4,
    z: 4,
    color: 0xffff00
});


scene.add(sphere2);
