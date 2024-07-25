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
    selector: HTMLDivElement,
    hp: [number, number],
    spec: Ability,
    specItem: Ability,
    specINIT: Ability,
    gold: number,
    items: Item[],
}

type AbsolutePosition = {
    ally: {x: number, y: number},
    enemy: {x: number, y: number}
}

type ItemData = {
    name: [string, string],
    price: number,
    lower: string[],
    higher: string[],
    ability: Ability,
};

type Ability = {
    range?: number,
    moveSpd?: number,
    ad?: number,
    ap?: number,
    atkspd?: number,
    projectileSpd?: number,
    health?: number,
    healthBoost?: number,
    armor?: number,
    vamp?: number,
    criticP?: number,
    criticD?: number,
    mana?: number,
    manaR?: number
}