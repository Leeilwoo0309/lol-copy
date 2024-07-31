var body = document.body;
var game = document.querySelector('main');
var statusDiv = document.querySelector('.status');
var itemsDiv = document.querySelector('.items');
var specDiv = document.querySelector('.spec');
var skillBtns = document.querySelectorAll('.skill-btn');
var hpProgressBars;
var deathCoolDown = { blue: 0, red: 0 };
var kda = { blue: [0, 0], red: [0, 0] };
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
//@ts-ignore
var team = params.get('team');
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
var itemData = [
// new ItemBuilder().setName("도란의 검", "0_doran_blade").setPrice(450).setAbility({ ad: 10, health: 100, vamp: 35}).build(),
// new ItemBuilder().setName("수확의 낫", "0_cull").setPrice(450).setAbility({ ad: 7 }).setGrade("시작").build(),
// new ItemBuilder().setName("단검", "1_short_sword").setPrice(300).setAbility({ atkspd: 10 }).build(),
// new ItemBuilder().setName("원기 회복의 구슬", "1_bead").setPrice(300).setAbility({ healthBoost: 100 }).build(),
// new ItemBuilder().setName("천 갑옷", "1_cloth_armor").setPrice(300).setAbility({ armor: 15 }).build(),
// new ItemBuilder().setName("롱소드", "1_long_sword").setPrice(350).setAbility({ ad: 10 }).build(),
// new ItemBuilder().setName("루비 수정", "1_ruby_c").setPrice(400).setAbility({ health: 50 }).build(),
// new ItemBuilder().setName("곡괭이", "1_pickaxe").setPrice(875).setAbility({ ad: 25 }).build(),
// new ItemBuilder().setName("민첩함의 망토", "1_cloak").setPrice(600).setAbility({ criticP: 15 }).build(),
// new ItemBuilder().setName("B.F. 대검", "1_bf_sword").setPrice(1300).setAbility({ ad: 40 }).setGrade("기본").build(),
// new ItemBuilder().setName("곡궁", "2_recurve_bow").setPrice(700).setAbility({ atkspd: 30 }).setLower(["1_short_sword", "1_short_sword"]).build(),
// new ItemBuilder().setName("쇠사슬 조끼", "2_chain_vest").setPrice(800).setAbility({ armor: 40 }).setLower(["1_cloth_armor"]).build(),
// new ItemBuilder().setName("수정팔 보호구", "2_bracer").setPrice(800).setAbility({ health: 100, healthBoost: 100 }).setLower(["1_ruby_c", "1_bead"]).build(),
// new ItemBuilder().setName("흡혈의 낫", "2_vampiric_scepter").setPrice(900).setAbility({ ad: 15, vamp: 7 }).setLower(["1_long_sword"]).setGrade("서사").build(),
// // new ItemBuilder().setName("(대충 깔롱한 공속템)", "bf_sword").setPrice(500).setAbility({ atkspd: 30 }).build(),
// new ItemBuilder()
//     .setName("몰락한 왕의 검", "3_molwang").setPrice(3200)
//     .setAbility({ ad: 55, atkspd: 30, vamp: 10 })
//     .setLower(["2_vampiric_scepter", "2_recurve_bow", "1_long_sword"])
//     .build(),
// new ItemBuilder()
//     .setName("해신 작쇼", "3_jaksho").setPrice(3200)
//     .setAbility({ health: 200, armor: 50, healthBoost: 200 })
//     .setLower(["2_chain_vest", "2_recurve_bow", "1_ruby_c"])
//     .setCooldown(3)
//     .build(),
// new ItemBuilder()
//     .setName("무한의 대검", "3_infinity_edge").setPrice(3400)
//     .setAbility({ ad: 80, criticP: 25, criticD: 40 })
//     .setLower(["1_bf_sword", "1_pickaxe", "1_cloak"])
//     .setGrade("전설").build(),
// // new ItemBuilder()
// //     .setName("사기템", 'sagitem').setPrice(100)
// //     .setAbility({ ad: 100, armor: 100, atkspd: 100, criticD: 25, criticP: 100, health: 500, healthBoost: 1000, moveSpd: 50, vamp: 24})
// //     .build()
];
var projectiles = { blue: [], red: [] };
var getEnemyTeam = function () { return team == "blue" ? "red" : "blue"; };
hpProgressBars = document.querySelectorAll('.hp-progress');
