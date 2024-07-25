class Char {
    public hp: number;
    public damage: number;
    public atkspd: number;
    public armor: number;
    public range: number;
    public moveSpd: number;
    public criticD: number;
    public criticP: number;
    public healthBoost: number;
    public vamp: number;
    public info: {name: string} = {
        name: ''
    };

    public passive() {

    }

    public skillQ() {

    }

    public skillE() {

    }

    public skillLShift() {

    }

    public skillC() {

    }

    public update() {

    }

    public getOriginalSpec() {
        return {
            ad: this.damage,
            atkspd: this.atkspd,
            armor: this.armor,
            range: this.range,
            moveSpd: this.moveSpd,
            criticD: this.criticD,
            criticP: this.criticP,
            health: this.hp,
            healthBoost: this.healthBoost,
            vamp: this.vamp
        };
    }
}