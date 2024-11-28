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
let hasActiveItem: boolean = false;
let activeItemCooldown: number = 0;
let skillUsed = {
    q: false,
    e: false,
    shift: false,
    wheel: false
}
const players: Players = {
    blue: {
        selector: document.querySelector('.player.blue'),
        size: 30,
        hp: [100, 100],
        barrier: [],
        spec: {
            ad: 30,
            atkspd: 1.5,
            armor: 30,
            ignoreArmor: 0,
            ignoreArmorPercent: 0,
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
            ignoreArmorPercent: 0,
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
        marker: {
            sniper: false,
            aphelios: {
                Calibrum: false,
                CalibrumWheel: false,
                Gravitum: false
            },
            ashe: 0,
            zhonya: false,
            kaisa: 0,
            talon: {
                cooldown: 0,
                stack: 0
            },
            akali: false,
        },
        status: {
            cc: {
                stun: 0,
                cantMove: 0
            },
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
        barrier: [],
        spec: {
            ad: 30,
            atkspd: 1,
            armor: 30,
            ignoreArmor: 0,
            ignoreArmorPercent: 0,
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
            ignoreArmorPercent: 0,
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
        marker: {
            sniper: false,
            aphelios: {
                Calibrum: false,
                CalibrumWheel: false,
                Gravitum: false
            },
            ashe: 0,
            zhonya: false,
            kaisa: 0,
            talon: {
                cooldown: 0,
                stack: 0
            },
            akali: false
        },
        status: {
            invisible: false,
            cc: {
                stun: 0,
                cantMove: 0
            }
        },
        gold: 50000,
        items: [undefined, undefined, undefined, undefined, undefined, undefined]
    },

};
let aaA: Ability = {
    ad: 0
};
let runeNameEngToKr = {
    bokjaJung: '정복자',
    gibal: '기민한 발놀림',
    chisok: '치명적 속도',
    gamjun: '감전'
};
let runeInfo = {
    bokjaJung: { duration: 0, ad: 0, ap: 0, maxStack: 0, vamp: 0 },  // 정복자
    chisok: { duration: 0, atkspd: 0, maxStack: 0 }, // 치속
    gibal: { cooldown: 0, heal: { default: 0, ad: 0, ap: 0}, moveSpd: 0, duration: 0 }, // 기@발
    gamjun: { cooldown: 0, damage: 0, ad: 0, ap: 0 } // 기@발
};
let runeRealInfo = {
    bokjaJung: { stack: 0, duration: 0 },
    chisok: { stack: 0, duration: 0 },
    gibal: { cooldown: 0, isActive: false },
    gamjun: { cooldown: 0, duration: 0, stack: 0, }
}

const socket = new WebSocket("ws://kimchi-game.kro.kr:8001");
const params = new URLSearchParams(window.location.search);
let char: {blue: ChampionNames, red: ChampionNames} = {blue: undefined, red: undefined};
let charClass: Char = undefined;
let charApehlios: Aphelios = undefined;
let readyStatus = {blue: false, red: false};
let playerDistance: number = 0;
let skillHit = {
    vampire: false,
    ashe: false,
    talonE: false,
    akali: false,
}
let slowTime: number = 0;
let slowness: number = 0;
//@ts-ignore
const team: 'red' | 'blue' = params.get('team');
//@ts-ignore
const rune: Rune = params.get('rune')
let enemyRune: Rune = undefined;
//@ts-ignore
char[team] = params.get('char');

let skillInfo: {passive: SkillAbility, q: SkillAbility, e: SkillAbility, shift: SkillAbility, wheel: SkillAbility, growth: {health: number, armor: number, magicRegist: number}[]} = {
    passive: { cooldown: 0 },
    q: { cooldown: 0 },
    e: { cooldown: 0 },
    shift: { cooldown: 0 },
    wheel: { cooldown: 0 },
    growth: [{health: 0, armor: 0, magicRegist: 0}, {health: 0, armor: 0, magicRegist: 0}, {health: 0, armor: 0, magicRegist: 0}]
};
let apheliosSkillInfo: {passive: SkillAbility, q: ApheliosQSkillInfo, e: SkillAbility, shift: SkillAbility, wheel: SkillAbility, growth: {health: number, armor: number, magicRegist: number}[]} = {
    passive: { cooldown: 0 },
    q: { Calibrum: { cooldown: 0 }, Crescendum: { cooldown: 0 }, Gravitum: { cooldown: 0 }, Infernum: { cooldown: 0 }, Severum: { cooldown: 0 } },
    e: { cooldown: 0 },
    shift: { cooldown: 0 },
    wheel: { cooldown: 0 },
    growth: [{health: 0, armor: 0, magicRegist: 0}, {health: 0, armor: 0, magicRegist: 0}, {health: 0, armor: 0, magicRegist: 0}]
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
    },
    draksar: {
        damage: 0
    },
    stormrazor: {
        cooldown: 0,
        use: 0
    },
    liandry: { duration: 0 }
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
    f: false,
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
let nexusHp = {blue: [7000, 7000], red: [7000, 7000]};
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
    // 맵 - 오브젝트 [11, 12]
    new GameObjectBuilder().setPosition(2200 - 50, -500 - 50).setSize(100, 100).setCollideSetting(false).setColor('rgb(110, 110, 110)').setRole('obj').build(),
    new GameObjectBuilder().setPosition(2200 - 500, -500 - 500).setSize(1000, 1000).setCollideSetting(false).setColor('rgba(146, 146, 146, 0.31)').setRole('obj').build(),
];
let objHp: [number, number] = [1500, 1500];

let itemData: Item[] = [];

let projectiles: {blue: Projectile[], red: Projectile[]} = {blue: [], red: []};
let nonProjectiles: {blue: NonProjectile[], red: NonProjectile[]} = {blue: [], red: []};
const getEnemyTeam = () => team == "blue" ? "red" : "blue";

hpProgressBars = document.querySelectorAll('.hp-progress');