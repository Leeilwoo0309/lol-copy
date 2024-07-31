type Cooldown = {
    q: number,
    e: number
    shift: number,
    wheel: number
}

type IsActive = {
    q: boolean,
    e: boolean,
    shift: boolean,
    wheel: boolean
}

function calculateSkillHaste() {
    let haste: number = (50 / (players[team].spec.skillHaste + 50));

    return {
        // q: 500,
        // e: 800,
        // shift: 2000,
        // wheel: 5000
        q: skillInfo.q.cooldown * haste,
        e: skillInfo.e.cooldown * haste,
        shift: skillInfo.shift.cooldown * haste,
        wheel: skillInfo.wheel.cooldown * haste
    }

}

class Char {
    public cooldown: Cooldown = {
        q: 0,
        e: 0,
        shift: 0,
        wheel: 0
    };
    public cooldownINIT: Cooldown;
    public isActive: IsActive = {
        q: false,
        e: false,
        shift: false,
        wheel: false
    }

    public passive() {

    }

    public skillQ() {

    }

    public skillE() {

    }

    public skillLShift() {

    }

    public skillWheel() {

    }

    public update() {

    }
}