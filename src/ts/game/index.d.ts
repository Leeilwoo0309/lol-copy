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
    name: [string, ItemNamesEnglish],
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
    projectileSize?: [number, number],
    damageType?: 'magic' | 'melee',
    defaultAAType?: "short" | "long"
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

type ItemNamesEnglish =
    "0_doran_shield" |
    "0_doran_blade" |
    "0_cull" |
    "b_1" |
    "b_2spd" |
    "b_2skill_haste" |
    "b_2atkspd" |
    "1_glowing_mote" |
    "1_short_sword" |
    "1_bead" |
    "1_cloth_armor" |
    "1_long_sword" |
    "1_tome" |
    "1_ruby_c" |
    "1_mantle" |
    "1_pickaxe" |
    "1_blasting_wang" |
    "1_cloak" |
    "1_bf_sword" |
    "2_recurve_bow" |
    "2_chain_vest" |
    "2_bracer" |
    "2_aether" |
    "2_sheen" |
    "2_vampiric_scepter" |
    "2_codex" |
    "2_negatron_cloak" |
    "2_dirk" |
    "2_hextech" |
    "2_zeal" |
    "2_phage" |
    "2_onpildo" |
    "2_noonquiver" |
    "3_navori" |
    "3_phantom_dance" |
    "3_wits_end" |
    "3_guinsu" |
    "3_nashor" |
    "3_rapid_firecannon" |
    "3_shieldbow" |
    "3_lich_bane" |
    "3_jaksho" |
    "3_molwang" |
    "3_collector" |
    "3_kraken" |
    "3_bloodthir" |
    "3_tfo" |
    "3_infinity_edge";

type ChampionNames = 
    "ezreal" |
    "sniper" |
    "samira" |
    "vayne" |
    "exponent" |
    "assassin" |
    "vampire" |
    "teacher" |
    "graves"
    ;