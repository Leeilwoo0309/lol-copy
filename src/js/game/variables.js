var body = document.body;
var game = document.querySelector('main');
var statusDiv = document.querySelector('.status');
var itemsDiv = document.querySelector('.items');
var specDiv = document.querySelector('.spec');
var skillBtns = document.querySelectorAll('.skill-btn');
var damageAlertDiv = document.querySelectorAll('.damagep');
var hpProgressBars;
var deathCoolDown = { blue: 0, red: 0 };
var kda = { blue: [0, 0], red: [0, 0] };
var damageAmount = { blue: 0, red: 0 };
var onhitCount = { blue: 0, red: 0 };
var canMove = true;
var players = {
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
var aaA = {
    ad: 0
};
var socket = new WebSocket("ws://kimchi-game.kro.kr:8001");
var params = new URLSearchParams(window.location.search);
var char = { blue: undefined, red: undefined };
var charClass = undefined;
var readyStatus = { blue: false, red: false };
var playerDistance = 0;
var skillHit = {
    vampire: false,
};
//@ts-ignore
var team = params.get('team');
//@ts-ignore
char[team] = params.get('char');
var skillInfo = {
    passive: { cooldown: 0 },
    q: { cooldown: 0 },
    e: { cooldown: 0 },
    shift: { cooldown: 0 },
    wheel: { cooldown: 0 }
};
var enemySkillInfo = {
    passive: { cooldown: 0 },
    q: { cooldown: 0 },
    e: { cooldown: 0 },
    shift: { cooldown: 0 },
    wheel: { cooldown: 0 }
};
var cooldownItem = {
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
var keyDown = {
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
};
var absolutePosition = {
    // blue: {x: 4100, y: -430},
    blue: { x: 200, y: -430 },
    // red : {x: 4170, y: -430}
    red: { x: 800, y: -430 }
};
var absolutePointerPosition = { x: 0, y: 0 };
var cameraPosition = { x: 0, y: 0 };
// let cameraSpd = 12;
var atkWait = 0;
var nexusHp = { blue: [3000, 3000], red: [3000, 3000] };
var isNexusAlive = { blue: true, red: true };
var gameObjects = [
    // 맵 [0~3]
    new GameObjectBuilder().setPosition(0, 700).setSize(4400, 3000).build(),
    new GameObjectBuilder().setPosition(0, -2800).setSize(1000, 3000).build(),
    new GameObjectBuilder().setPosition(1400, -300).setSize(1600, 500).build(),
    new GameObjectBuilder().setPosition(3400, -2800).setSize(1000, 3000).build(),
    // 맵 - 용 둥지쪽 [4]
    new GameObjectBuilder().setPosition(0, -900).setSize(4400, 200).build(),
    // 맵 - 상점 [5~6]
    new GameObjectBuilder().setPosition(0, 300).setSize(100, 300).setColor('rgb(105, 58, 0)').build().onClick(function () { if (team == 'blue')
        shopOpen(); }),
    new GameObjectBuilder().setPosition(4300, 300).setSize(100, 300).setColor('rgb(105, 58, 0)').build().onClick(function () { if (team == 'red')
        shopOpen(); }),
    // 맵 - 넥서스 [7~10], 넥서스: [8, 10]
    new GameObjectBuilder().setPosition(900, 100).setSize(600, 600).setCollideSetting(false).setColor('rgb(0, 0, 255, 0.08)').build(),
    new GameObjectBuilder().setPosition(1175, 375).setSize(50, 50).setCollideSetting(false).setColor('rgb(0, 0, 175)').setRole('nexus').setTeam('blue').build(),
    new GameObjectBuilder().setPosition(2900, 100).setSize(600, 600).setCollideSetting(false).setColor('rgb(255, 0, 0, 0.08)').build(),
    new GameObjectBuilder().setPosition(3175, 375).setSize(50, 50).setCollideSetting(false).setColor('rgb(175, 0, 0)').setRole('nexus').setTeam('red').build(),
];
var itemData = [];
var projectiles = { blue: [], red: [] };
var nonProjectiles = { blue: [], red: [] };
var getEnemyTeam = function () { return team == "blue" ? "red" : "blue"; };
hpProgressBars = document.querySelectorAll('.hp-progress');
