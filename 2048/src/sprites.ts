import * as PIXI from "pixi.js";
import { Text } from 'pixi.js';

export interface CubeSpec {
    id: string;
    size: number;
    color: string;
    label: string;
}

export const CUBE_DEFS: CubeSpec[] = {
    id: "2",
    size: 120,
    color: "#4a90e2",
    label: "1"
}

export function createCube(value: number, color: string): PIXI.Container {
    const container = new PIXI.Container();
    const square = new PIXI.Graphics().rect(0,0,100,100).fill('yellow');
    container.addChild(square);
    const txt = new Text({
        text: String(value),
        style: {
            fill: color,
            fontSize: 25,
            fontFamily: 'Arial'
        },
        anchor: 0.5
    });
    txt.anchor.set(0.5,0.5);
    txt.x = 50;
    txt.y = 50;
    container.addChild(txt);
    return container;
}
export function createBackdrop(x: number, y: number): PIXI.Container {
    const container = new PIXI.Container();
    const backSquare = new PIXI.Graphics().rect(0,0,140*x,140*y).fill('lightgrey');
    container.addChild(backSquare);
    for(let xi = 20; xi < x*120; xi += 140) {
        for(let yi = 20; yi < y*120; yi += 140) {
            const greySquare = new PIXI.Graphics().rect(xi,yi,100,100).fill('grey');
            container.addChild(greySquare);
        }
    }
    return container;
}