const body: HTMLElement = document.body;
const game: HTMLElement = document.querySelector('main');
const players: Players = {
    ally: {
        selector: document.querySelector('.player.ally'),
        moveSpd: 5,
        size: 30
    },
    enemy: {
        selector: document.querySelector('.player.enemy'),
        moveSpd: 5,
        size: 30
    },

}

let isMove: boolean = false;
let playersHopePosition: Position = {x: 0, y: 0};
let angle: number;

let keyDown: KeyDown = {
    w: false,
    a: false,
    s: false,
    d: false,
    space: false,
    // q: false,
    // w: false,
    // e: false,
    // r: false,
    // d: false,
    // f: false,
    arrowup: false,
    arrowleft: false,
    arrowdown: false,
    arrowright: false,
    mouse: [false, false, false]
}
let absolutePosition: AbsolutePosition = {
    ally: {x: 800, y: -400},
    enemy: {x: 0, y: -400}
}
let absolutePointerPosition: Position = {x: 0, y: 0};
let cameraPosition: Position = {
    x: 0, y: 0
}
let cameraSpd = 12;

let gameObjects: GameObject[] = [
    // 맵
    new GameObjectBuilder().setPosition(0, 700).setSize(4400, 3000).build(),
    new GameObjectBuilder().setPosition(0, -2800).setSize(1000, 3000).build(),
    new GameObjectBuilder().setPosition(1400, -300).setSize(1600, 500).build(),
    new GameObjectBuilder().setPosition(3400, -2800).setSize(1000, 3000).build(),
    //맵 - 용 둥지쪽
    new GameObjectBuilder().setPosition(0, -900).setSize(4400, 200).build(),
];