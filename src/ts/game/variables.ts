const body: HTMLElement = document.body;
const game: HTMLElement = document.querySelector('main');
const statusDiv: HTMLDivElement = document.querySelector('.status');
const itemsDiv: HTMLDivElement = document.querySelector('.items');
const specDiv: HTMLDivElement = document.querySelector('.spec');
const skillBtns: NodeListOf<HTMLDivElement> = document.querySelectorAll('.skill-btn');
const damageAlertDiv: NodeListOf<HTMLDivElement> = document.querySelectorAll('.damagep');
let hpProgressBars: NodeListOf<HTMLDivElement>;
let deathCoolDown: {blue: number, red: number} = {blue: 0, red: 0};
let kda = {blue: [0, 0], red: [0, 0]};
let damageAmount = {blue: 0, red: 0};
let onhitCount = {blue: 0, red: 0};
let canMove: boolean = true;
const players: Players = {
    blue: {
        selector: document.querySelector('.player.blue'),
        size: 30,
        hp: [100, 100],
        spec: {
            ad: 30,
            atkspd: 1.5,
            armor: 30,
            ignoreArmor: 0,
            range: 500,
            moveSpd: 5.5,
            criticD: 0,
            criticP: 0,
            health: 100,
            healthBoost: 5,
            vamp: 0
        },
        specINIT: {
            ad: 30,
            atkspd: 1.5,
            armor: 30,
            range: 0,
            moveSpd: 5.5,
            criticD: 0,
            criticP: 0,
            health: 100,
            healthBoost: 5,
            vamp: 0
        },
        specItem: {
            ad: 0,
            ap: 0,
            atkspd: 0,
            armor: 0,
            ignoreArmor: 0,
            range: 0,
            magicRegist: 0,
            skillHaste: 0,
            moveSpd: 0,
            criticD: 0,
            criticP: 0,
            health: 0,
            healthBoost: 0,
            vamp: 0,
            mana: 0,
            manaR: 0
        },
        marker: {},
        status: {
            invisible: false,
        },
        gold: 50000,
        items: [undefined, undefined, undefined, undefined, undefined, undefined]
    },
    red: {
        selector: document.querySelector('.player.red'),
        size: 30,
        // [최대, 현재]
        hp: [100, 100],
        spec: {
            ad: 30,
            atkspd: 1,
            armor: 30,
            ignoreArmor: 0,
            range: 500,
            moveSpd: 5,
            criticD: 0,
            criticP: 0,
            health: 100,
            healthBoost: 5,
            vamp: 0
        },
        specINIT: {
            ad: 30,
            atkspd: 1,
            armor: 30,
            range: 500,
            moveSpd: 5,
            criticD: 0,
            criticP: 0,
            health: 100,
            healthBoost: 5,
            vamp: 0
        },
        specItem: {
            ad: 0,
            ap: 0,
            atkspd: 0,
            armor: 0,
            ignoreArmor: 0,
            range: 0,
            magicRegist: 0,
            skillHaste: 0,
            moveSpd: 0,
            criticD: 0,
            criticP: 0,
            health: 0,
            healthBoost: 0,
            vamp: 0,
            mana: 0,
            manaR: 0
        },
        marker: {},
        status: {
            invisible: false,
        },
        gold: 50000,
        items: [undefined, undefined, undefined, undefined, undefined, undefined]
    },

};
let aaA: Ability = {
    ad: 0
};

const socket = new WebSocket("ws://kimchi-game.kro.kr:8001");
const params = new URLSearchParams(window.location.search);
let char: {blue: string, red: string} = {blue: undefined, red: undefined};
let charClass: Char = undefined;
let readyStatus = {blue: false, red: false};
let playerDistance: number = 0;
//@ts-ignore
const team: 'red' | 'blue' = params.get('team');
char[team] = params.get('char');

let skillInfo: {passive: SkillAbility, q: SkillAbility, e: SkillAbility, shift: SkillAbility, wheel: SkillAbility} = {
    passive: { cooldown: 0 },
    q: { cooldown: 0 },
    e: { cooldown: 0 },
    shift: { cooldown: 0 },
    wheel: { cooldown: 0 }
};
let enemySkillInfo: {passive: SkillAbility, q: SkillAbility, e: SkillAbility, shift: SkillAbility, wheel: SkillAbility} = {
    passive: { cooldown: 0 },
    q: { cooldown: 0 },
    e: { cooldown: 0 },
    shift: { cooldown: 0 },
    wheel: { cooldown: 0 }
};
let cooldownItem = {
    shieldbow: 0,
    guinsu: {
        count: 0,
        time: 0
    },
    kraken: {
        count: 0,
        damage: 0,
    },
    sheen: {
        isActive: false
    }
};
let keyDown: KeyDown = {
    w: false,
    a: false,
    s: false,
    d: false,
    space: false,
    p: false,
    q: false,
    e: false,
    shift: false,
    tab: false,
    arrowup: false,
    arrowleft: false,
    arrowdown: false,
    arrowright: false,
    mouse: [false, false, false]
}
let absolutePosition: AbsolutePosition = {
    // blue: {x: 4100, y: -430},
    blue: {x: 200, y: -430},
    // red : {x: 4170, y: -430}
    red : {x: 800, y: -430}
}
let absolutePointerPosition: Position = {x: 0, y: 0};
let cameraPosition: Position = { x: 0, y: 0 };
// let cameraSpd = 12;
let atkWait = 0;
let nexusHp = {blue: [3000, 3000], red: [3000, 3000]};
let isNexusAlive = {blue: true, red: true};

let gameObjects: GameObject[] = [
    // 맵 [0~3]
    new GameObjectBuilder().setPosition(0, 700).setSize(4400, 3000).build(),
    new GameObjectBuilder().setPosition(0, -2800).setSize(1000, 3000).build(),
    new GameObjectBuilder().setPosition(1400, -300).setSize(1600, 500).build(),
    new GameObjectBuilder().setPosition(3400, -2800).setSize(1000, 3000).build(),
    // 맵 - 용 둥지쪽 [4]
    new GameObjectBuilder().setPosition(0, -900).setSize(4400, 200).build(),
    // 맵 - 상점 [5~6]
    new GameObjectBuilder().setPosition(0, 300).setSize(100, 300).setColor('rgb(105, 58, 0)').build().onClick(() => { if (team == 'blue') shopOpen(); }),
    new GameObjectBuilder().setPosition(4300, 300).setSize(100, 300).setColor('rgb(105, 58, 0)').build().onClick(() => { if (team == 'red') shopOpen(); }),
    // 맵 - 넥서스 [7~10], 넥서스: [8, 10]
    new GameObjectBuilder().setPosition(900, 100). setSize(600, 600).setCollideSetting(false).setColor('rgb(0, 0, 255, 0.08)').build(),
    new GameObjectBuilder().setPosition(1175, 375).setSize(50, 50).setCollideSetting(false).setColor('rgb(0, 0, 175)').setRole('nexus').setTeam('blue').build(),
    new GameObjectBuilder().setPosition(2900, 100).setSize(600, 600).setCollideSetting(false).setColor('rgb(255, 0, 0, 0.08)').build(),
    new GameObjectBuilder().setPosition(3175, 375).setSize(50, 50).setCollideSetting(false).setColor('rgb(175, 0, 0)').setRole('nexus').setTeam('red').build(),
];

let itemData: Item[] = [];

let projectiles: {blue: Projectile[], red: Projectile[]} = {blue: [], red: []};
const getEnemyTeam = () => team == "blue" ? "red" : "blue";

hpProgressBars = document.querySelectorAll('.hp-progress');