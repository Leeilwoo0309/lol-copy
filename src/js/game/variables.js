var body = document.body;
var game = document.querySelector('main');
var statusDiv = document.querySelector('.status');
var itemsDiv = document.querySelector('.items');
var specDiv = document.querySelector('.spec');
var hpProgressBars = document.querySelectorAll('.hp-progress');
var players = {
    ally: {
        selector: document.querySelector('.player.ally'),
        size: 30,
        hp: [100, 100],
        spec: {
            ad: 30,
            atkspd: 1.5,
            armor: 30,
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
            range: 500,
            moveSpd: 5.5,
            criticD: 0,
            criticP: 0,
            health: 100,
            healthBoost: 5,
            vamp: 0
        },
        specItem: {
            ad: 0,
            atkspd: 0,
            armor: 0,
            range: 0,
            moveSpd: 0,
            criticD: 0,
            criticP: 0,
            health: 0,
            healthBoost: 0,
            vamp: 0
        },
        gold: 5000,
        items: [undefined, undefined, undefined, undefined, undefined, undefined]
    },
    enemy: {
        selector: document.querySelector('.player.enemy'),
        size: 30,
        // [최대, 현재]
        hp: [100, 100],
        spec: {
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
            atkspd: 0,
            armor: 0,
            range: 0,
            moveSpd: 0,
            criticD: 0,
            criticP: 0,
            health: 0,
            healthBoost: 0,
            vamp: 0
        },
        gold: 5000,
        items: [undefined, undefined, undefined, undefined, undefined, undefined]
    },
};
var socket = new WebSocket("ws://localhost:8001");
var keyDown = {
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
};
var absolutePosition = {
    ally: { x: 200, y: -430 },
    enemy: { x: 4170, y: -430 }
};
var absolutePointerPosition = { x: 0, y: 0 };
var cameraPosition = { x: 0, y: 0 };
// let cameraSpd = 12;
var atkWait = 0;
var gameObjects = [
    // 맵
    new GameObjectBuilder().setPosition(0, 700).setSize(4400, 3000).build(),
    new GameObjectBuilder().setPosition(0, -2800).setSize(1000, 3000).build(),
    new GameObjectBuilder().setPosition(1400, -300).setSize(1600, 500).build(),
    new GameObjectBuilder().setPosition(3400, -2800).setSize(1000, 3000).build(),
    // 맵 - 용 둥지쪽
    new GameObjectBuilder().setPosition(0, -900).setSize(4400, 200).build(),
    // 맵 - 상점
    new GameObjectBuilder().setPosition(0, 300).setSize(100, 300).setColor('rgb(105, 58, 0)').build().onClick(function () { shopOpen(); }),
    new GameObjectBuilder().setPosition(4300, 300).setSize(100, 300).setColor('rgb(105, 58, 0)').build().onClick(function () { console.log('레드 팀 상점'); }),
];
var itemData = [
    new ItemBuilder().setName("도란의 검", "doran_blade").setPrice(450).setAbility({ ad: 10, health: 100, vamp: 35 }).build(),
    new ItemBuilder().setName("수확의 낫", "cull").setPrice(450).setAbility({ ad: 7 }).build(),
    new ItemBuilder().setName("B.F. 대검", "bf_sword").setPrice(1300).setAbility({ ad: 40 }).build(),
    new ItemBuilder().setName("(대충 깔롱한 공속템)", "bf_sword").setPrice(500).setAbility({ atkspd: 30 }).build(),
    new ItemBuilder().setName("곡괭이", "pickaxe").setPrice(875).setAbility({ ad: 25 }).build(),
    new ItemBuilder().setName("민첩함의 망토", "cloak").setPrice(600).setAbility({ criticP: 15 }).build(),
    new ItemBuilder()
        .setName("무한의 대검", "infinity_edge").setPrice(3400)
        .setAbility({ ad: 80, criticP: 25, criticD: 40 })
        .setLower(["bf_sword", "pickaxe", "cloak"]).build(),
    // new ItemBuilder()
    //     .setName("사기템", 'sagitem').setPrice(100)
    //     .setAbility({ ad: 100, armor: 100, atkspd: 100, criticD: 25, criticP: 100, health: 500, healthBoost: 1000, moveSpd: 50, vamp: 24})
    //     .build()
];
var projectiles = { a: [], e: [] };
