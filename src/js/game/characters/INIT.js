function calculateSkillHaste() {
    var haste = (50 / (players[team].spec.skillHaste + 50));
    return {
        // q: 500,
        // e: 800,
        // shift: 2000,
        // wheel: 5000
        q: skillInfo.q.cooldown * haste,
        e: skillInfo.e.cooldown * haste,
        shift: skillInfo.shift.cooldown * haste,
        wheel: skillInfo.wheel.cooldown * haste
    };
}
var Char = /** @class */ (function () {
    function Char() {
        this.cooldown = {
            q: 0,
            e: 0,
            shift: 0,
            wheel: 0
        };
        this.isActive = {
            q: false,
            e: false,
            shift: false,
            wheel: false
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
    Char.prototype.skillWheel = function () {
    };
    Char.prototype.update = function () {
    };
    return Char;
}());
