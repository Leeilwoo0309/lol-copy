var Char = /** @class */ (function () {
    function Char() {
        this.info = {
            name: ''
        };
    }
    Char.prototype.passive = function () {
    };
    Char.prototype.skillQ = function () {
    };
    Char.prototype.skillE = function () {
    };
    Char.prototype.skillLShift = function () {
    };
    Char.prototype.skillC = function () {
    };
    Char.prototype.update = function () {
    };
    Char.prototype.getOriginalSpec = function () {
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
    };
    return Char;
}());
