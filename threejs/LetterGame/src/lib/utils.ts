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

export function getRandomLetter(): string {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZČĆĐŠŽ";
    const index = Math.random() * 10000 % letters.length;
    return letters.substring(index, index + 1);
}

export function randomString(length: number): string {
    var result = "";
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};
