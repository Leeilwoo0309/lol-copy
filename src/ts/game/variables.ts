const body: HTMLElement = document.body;
const game: HTMLElement = document.querySelector('main');
const statusDiv: HTMLDivElement = document.querySelector('.status');
const itemsDiv: HTMLDivElement = document.querySelector('.items');
const specDiv: HTMLDivElement = document.querySelector('.spec');
const skillBtns: NodeListOf<HTMLDivElement> = document.querySelectorAll('.skill-btn');
let hpProgressBars: NodeListOf<HTMLDivElement>;
let deathCoolDown: {blue: number, red: number} = {blue: 0, red: 0};
let kda = {blue: [0, 0], red: [0, 0]};
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
let aaA: Ability = {
    ad: 0
};

const socket = new WebSocket("ws://kimchi-game.kro.kr:8001");
const params = new URLSearchParams(window.location.search);
let char: {blue: string, red: string} = {blue: undefined, red: undefined};
let charClass: Char = undefined;
let readyStatus = {blue: false, red: false};
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

let itemData: Item[] = [
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

let projectiles: {blue: Projectile[], red: Projectile[]} = {blue: [], red: []};
const getEnemyTeam = () => team == "blue" ? "red" : "blue";

hpProgressBars = document.querySelectorAll('.hp-progress');
