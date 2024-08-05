type KeyDown = {
    w: boolean,
    a: boolean,
    s: boolean,
    d: boolean,
    space: boolean,
    p: boolean,
    q: boolean,
    e: boolean,
    shift: boolean,
    tab: boolean,
    // f: boolean,
    arrowup: boolean,
    arrowleft: boolean,
    arrowdown: boolean,
    arrowright: boolean,
    mouse: [boolean, boolean, boolean]
}

type Players = {
    blue: PlayerDeclare,
    red: PlayerDeclare,
}

type PlayerDeclare = {
    size: number,
    selector: HTMLDivElement,
    hp: [number, number],
    spec: Ability,
    specItem: Ability,
    specINIT: Ability,
    marker: Marker,
    status: { invisible: boolean },
    gold: number,
    items: Item[],
}

type Marker = {
    ezreal?: boolean,
    vayne?: number
}

type AbsolutePosition = {
    blue: {x: number, y: number},
    red: {x: number, y: number}
}

type ItemData = {
    cooldown: number,
    name: [string, string],
    price: number,
    ability: Ability,
    lower?: string[],
    extra?: number[],
    enable: boolean,
    des?: string,
    grade?: "시작" | "장화" | "기본" | "서사" | "전설",
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
    ignoreArmor?: number,
    vamp?: number,
    criticP?: number,
    criticD?: number,
    mana?: number,
    manaR?: number,
    magicRegist?: number,
    skillHaste?: number,
}

type SkillAbility = {
    cooldown: number,
    des?: string,
    duration?: number,
    damage?: number,
    type?: "melee" | "magic" | "true",
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
    manaR?: number,
    magicRegist?: number,
    skillHaste?: number,
}