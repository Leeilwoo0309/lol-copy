function calculateSkillHaste() {
    var haste = (50 / (players[team].spec.skillHaste + 50));
    var hasBadheart = hasItem('3_badheart') ? 1 - findItem('3_badheart').body.extra[0] / 100 : 1;
    var hasAxiom = hasItem('3_axiom') ? findItem('3_axiom').body.extra[0] : 1;
    return {
        // q: 500,
        // e: 800,
        // shift: 2000,
        // wheel: 5000
        q: skillInfo.q.cooldown * haste,
        e: skillInfo.e.cooldown * haste,
        shift: skillInfo.shift.cooldown * haste,
        wheel: skillInfo.wheel.cooldown * haste * hasBadheart * hasAxiom
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
