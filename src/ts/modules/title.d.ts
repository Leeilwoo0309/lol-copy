type CharData = {
    cn: string,
    name: string,
    defaultSpec: {
        ad: number,
        atkspd: number,
        armor: number,
        range: number,
        moveSpd: number,
        criticD: number,
        criticP: number,
        health: number,
        healthBoost: number,
        vamp: number
    },
    skills: {
        Q: Ability
        E: Ability
        LShift: Ability
        Wheel: Ability
    },
    des: {
        Q: string,
        E: string,
        LShift: string,
        Wheel: string
    }
}