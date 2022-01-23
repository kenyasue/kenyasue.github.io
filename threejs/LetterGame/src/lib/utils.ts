import * as THREE from 'three';
import { FontLoader, Font } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'

export function loadFont(path: string): Promise<Font> {
    return new Promise((res, rej) => {
        const fontLoader: FontLoader = new FontLoader()
        fontLoader.load(
            '/fonts/Roboto_Black_Regular.json',
            (font) => {
                res(font);
            }
        )
    })
}