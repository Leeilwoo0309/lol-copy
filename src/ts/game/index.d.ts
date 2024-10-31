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
    f: boolean,
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
    barrier: [number?, number?][]
    spec: Ability,
    specItem: Ability,
    specINIT: Ability,
    marker: Marker,
    status: { invisible: boolean, cc: { stun: number, cantMove: number } },
    gold: number,
    items: Item[],
}

type Marker = {
    sniper: boolean,
    ezreal?: boolean,
    vayne?: number,
    aphelios?: {
        Calibrum: boolean,
        CalibrumWheel: boolean,
        Gravitum: boolean
    },
    ashe: number,
    zhonya: boolean,
    kaisa: number,
    talon: {
        stack: number,
        cooldown: number
    }
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
    active: string;
    activeInfo: number[]
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
    ignoreArmorPercent?: number,
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

type ApheliosQSkillInfo = {
    Calibrum: SkillAbility,
    Severum: SkillAbility,
    Gravitum: SkillAbility,
    Infernum: SkillAbility,
    Crescendum: SkillAbility
}

type ItemNamesEnglish =
    "0_doran_ring" |
    "0_doran_shield" |
    "0_doran_blade" |
    "0_cull" |
    "b_1" |
    "b_2spd" |
    "b_2skill_haste" |
    "b_2atkspd" |
    "b_2armor" | 
    "b_2magic_regis" |
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
    "1_large_rod" |
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
    "2_guise" |
    "2_onpildo" |
    "2_noonquiver" |
    "2_firestone" |
    "2_colpild" |
    "2_wildize" |
    "3_navori" |
    "3_phantom_dance" |
    "3_wits_end" |
    "3_guinsu" |
    "3_nashor" |
    "3_rapid_firecannon" |
    "3_shieldbow" |
    "3_riftmaker" |
    "3_lich_bane" |
    "3_jaksho" |
    "3_molwang" |
    "3_collector" |
    "3_kraken" |
    "3_shadowflame" |
    "3_bloodthir" |
    "3_tfo" |
    "3_infinity_edge" |
    "3_decap" |
    "3_draksar" |
    "3_shojin" |
    "3_stormrazor" |
    "3_badheart" |
    "3_liandry" |
    "3_axiom" |
    "a3_galeforce" |
    "a3_rocketbelt" | 
    "a3_solari" | 
    "a3_zhonya" |
    "a3_hg" |
    "a3_youmu";

type ChampionNames = 
    "ezreal" |
    "sniper" |
    "samira" |
    "vayne" |
    "exponent" |
    "assassin" |
    "vampire" |
    "teacher" |
    "graves" |
    "vampire" |
    "aphelios" |
    "ashe" |
    "kaisa" |
    "ahri" |
    "talon" |
    "yasuo"
    ;

type Rune = 
    "chisok" |
    "bokjaJung" |
    "gibal" |
    "gamjun"
;