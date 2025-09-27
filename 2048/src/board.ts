import { Application, Assets, Renderer, Sprite, Texture, triangulateWithHoles } from "pixi.js";
import { createCube, createBackdrop } from "./sprites";

var size = [3,3];
var board: Board;
var animating_sprites: AnimatingTile[] = [];
var app: (Application| null) = null;
var animating: boolean = false;
var animating_counter: number = 0;
const animating_time = 10;
type Tile = {
    value: number,
    sprite: Sprite
}
type AnimatingTile = {
    tile: Tile,
    newPos: number[],
    newValue: (number | null),
}
class Board {
    private data: (Tile | null)[][];
    constructor(sizeX: number, sizeY: number) {
        this.data = Array.from({ length: sizeX}, () =>
        Array.from({ length: sizeY}, () => null)
        );
    }
    public convertXY(x: number, y:number, direction: string) {
        // console.log(direction);
        switch(direction) {
            case "up":
                return [x,y];
            break;
            case "down":
                return [x,size[1]-y-1];
            break;
            case "right":
                return [size[0]-y-1,x];
            break;
            case "left":
                return [y,x];
            break;
        }
        console.log(`unknown_direction ${direction}`)
        return [x,y];
    }
    public get(o_x: number, o_y: number, direction: string = "up") {
        const [x,y] = this.convertXY(o_x,o_y,direction);
        // console.log(x);
        // console.log(y);
        return this.data[x][y];
    }
    public set(o_x: number, o_y: number, newValue: (Tile | null), direction : string = "up") {
        const [x,y] = this.convertXY(o_x,o_y,direction);
        this.data[x][y] = newValue;
    }
}
export function set_app(newApp: Application) {
    app = newApp;
    app.ticker.add(() => {
        if (animating) {
            if (animating_counter < animating_time) {
                for(let i = 0; i < animating_sprites.length; i++) {
                    const percent = 1/(animating_time-animating_counter);
                    animating_sprites[i].tile.sprite.x = (1-percent)*animating_sprites[i].tile.sprite.x + percent*animating_sprites[i].newPos[0];
                    animating_sprites[i].tile.sprite.y = (1-percent)*animating_sprites[i].tile.sprite.y + percent*animating_sprites[i].newPos[1];
                }
                animating_counter += 1;
            }
            else {
                for(let i = 0; i < animating_sprites.length; i++) {
                    if (animating_sprites[i].newValue == 0) {
                        app.stage.removeChild(animating_sprites[i].tile.sprite);
                    }
                    else if (animating_sprites[i].newValue) {
                        animating_sprites[i].tile.sprite.texture = get_tile_texture(animating_sprites[i].newValue);
                    }
                }
                animating_counter = 0;
                animating = false;
                animating_sprites = [];
            }
        }
    })
}

function render_board() {
    if (app) {
        const container = createBackdrop(size[0],size[1]);
        const texture = app.renderer.generateTexture(container);
        const backdrop = new Sprite(texture);
        backdrop.anchor.set(0.5,0.5);
        backdrop.position.set(app.screen.width / 2, app.screen.height / 2);
        app.stage.addChild(backdrop);
    }
}

function compute_tile_pos(posX_o: number, posY_o: number, direction: string = "up") {
    if (app != null) {
        const [posX, posY] = board.convertXY(posX_o, posY_o, direction);
        const tileX = (posX-Math.floor(size[0]/2))*110 + (app.screen.width/2) + 55*((size[0]+1) % 2);
        const tileY = (posY-Math.floor(size[1]/2))*110 + (app.screen.height/2) + 55*((size[1]+1) % 2);
        return [tileX, tileY];
    }
    return [0,0];
}

const tile_colors = new Map([
    [0,     "#cdc1b4"], // empty tile
    [2,     "#eee4da"],
    [4,     "#ede0c8"],
    [8,     "#f2b179"],
    [16,    "#f59563"],
    [32,    "#f67c5f"],
    [64,    "#f65e3b"],
    [128,   "#edcf72"],
    [256,   "#edcc61"],
    [512,   "#edc850"],
    [1024,  "#edc53f"],
    [2048,  "#edc22e"],
    // Optional: Beyond 2048
    [4096,  "#3c3a32"],
    [8192,  "#3c3a32"],
  ]);

function get_tile_texture(value: number) {
    const color = tile_colors.get(value) || "#3c3a32";
    const tile = createCube(value, color);
    const text = app.renderer.generateTexture(tile);
    return text;
}

function add_tile(posX: number, posY: number, value: number) {
    if (app != null) {
        const newSprite = new Sprite(get_tile_texture(value));
        newSprite.anchor.set(0.5,0.5);
        const [tileX, tileY] = compute_tile_pos(posX, posY);
        newSprite.position.set(tileX, tileY);
        app.stage.addChild(newSprite);
        var newTile: Tile = {
            value: value,
            sprite: newSprite
        }
        board.set(posX,posY,newTile);
    }
}

function random_pos() {
    var rand = Math.floor(Math.random()*(size[0]*size[1]));
    return [Math.floor(rand / size[0]),rand % size[1]];
}

function add_random_tile(value: number = 2) {
    var [x,y] = random_pos()
    while(board.get(x,y) != null) [x,y] = random_pos();
    add_tile(x,y,value);
}

export function init_board(sizeX: number, sizeY: number) {
    size = [sizeX, sizeY];
    render_board();
    board = new Board(sizeX, sizeY);
    add_random_tile();
    add_random_tile();
    // add_random_tile();
    // add_tile(0,0,2);
    // add_tile(1,4,2);
    // add_tile(1,3,2);
}
export function move(direction: string) {
    console.log('hi');
    if (board) {
        for(let x = 0; x < size[0]; x++) {
            let lastEmpty;
            let lastEmptyDelta = 0;
            if(board.get(x,0,direction) == null) {
                lastEmpty = 0;
            }
            else {
                lastEmpty = 1;
            }
            // while (board.get(x,lastEmpty,direction) != null) lastEmpty += 1;
            for(let y = 1; y < size[1]; y++) {
                if (board.get(x,y,direction)) {
                    if(lastEmpty != 0 && board.get(x,lastEmpty-1,direction)?.value == board.get(x,y,direction)?.value) {
                        const newPos = compute_tile_pos(x,lastEmpty-1,direction);
                        const mTile = board.get(x,y,direction);
                        const cTile = board.get(x,lastEmpty-1,direction);
                        cTile.value += mTile.value
                        board.set(x,y,null,direction);
                        animating_sprites.push({
                            tile: mTile,
                            newPos: newPos,
                            newValue: 0
                        });
                        animating_sprites.push({
                            tile: cTile,
                            newPos: newPos,
                            newValue: cTile.value
                        });
                    }
                    else {
                        const newPos = compute_tile_pos(x,lastEmpty,direction);
                        const cTile = board.get(x,y,direction);
                        board.set(x,y,null,direction);
                        board.set(x,lastEmpty,cTile,direction);
                        lastEmpty += 1;
                        animating_sprites.push({
                            tile: cTile,
                            newPos: newPos,
                            newValue: null
                        });
                    }
                }
            }
        }
        animating = true;
        add_random_tile();
    }
}