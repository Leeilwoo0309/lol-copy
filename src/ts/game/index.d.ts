type KeyDown = {
    w: boolean,
    a: boolean,
    s: boolean,
    d: boolean,
    space: boolean,
    // q: boolean,
    // w: boolean,
    // e: boolean,
    // r: boolean,
    // d: boolean,
    // f: boolean,
    arrowup: boolean,
    arrowleft: boolean,
    arrowdown: boolean,
    arrowright: boolean,
    mouse: [boolean, boolean, boolean]
}

type Players = {
    ally: PlayerDeclare,
    enemy: PlayerDeclare,
}

type PlayerDeclare = {
    size: number,
    moveSpd: number,
    selector: HTMLDivElement
}

type AbsolutePosition = {
    ally: {x: number, y: number},
    enemy: {x: number, y: number}
}