var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
game.style.cursor = 'pointer';
document.oncontextmenu = function () { return false; };
gameObjects[8].objSelector.classList.add('ally');
gameObjects[10].objSelector.classList.add('enemy');
document.querySelector('.hp-bar.hp-progress').classList.add(team);
console.log(team == 'red' ? "빨갱이팀" : "자본주의자팀");
document.addEventListener('keydown', function (event) {
    if (event.ctrlKey && (event.key === '+' || event.key === '-' || event.key === '0')) {
        event.preventDefault();
    }
});
// 마우스 휠 확대/축소 방지
document.addEventListener('wheel', function (event) {
    if (event.ctrlKey) {
        event.preventDefault();
    }
}, { passive: false });
body.addEventListener('keydown', function (e) {
    if (e.key === 'Tab') {
        e.preventDefault();
    }
    if (keyDown[e.key.toLowerCase()] === false) {
        keyDown[e.key.toLowerCase()] = true;
    }
    else if (e.key == ' ')
        keyDown.space = true;
});
body.addEventListener('keyup', function (e) {
    if (keyDown[e.key.toLowerCase()] === true)
        keyDown[e.key.toLowerCase()] = false;
    else if (e.key == ' ')
        keyDown.space = false;
});
body.addEventListener('mousemove', function (e) {
    absolutePointerPosition.x = e.clientX + cameraPosition.x;
    absolutePointerPosition.y = -e.clientY - cameraPosition.y;
    // keyDown.arrowright = false;
    // keyDown.arrowdown = false;
    // keyDown.arrowleft = false;
    // keyDown.arrowup = false;
    // if (e.clientX < window.innerWidth * 0.1) keyDown.arrowleft = true;
    // if (e.clientX > window.innerWidth * 0.9) keyDown.arrowright = true;
    // if (e.clientY < window.innerHeight * 0.13) keyDown.arrowup = true;
    // if (e.clientY > window.innerHeight * 0.8) keyDown.arrowdown = true;
});
body.addEventListener('mousedown', function (e) {
    keyDown.mouse[e.button] = true;
});
body.addEventListener('mouseup', function (e) {
    keyDown.mouse[e.button] = false;
});
skillBtns.forEach(function (e, i) {
    //@ts-ignore
    var key = ['q', 'e', 'shift', 'wheel'][i];
    var damageDisplayer = document.querySelector('#skill-damage');
    e.addEventListener('mouseenter', function () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        var damage = 0;
        var damageInfo = '';
        if (skillInfo[key].damage) {
            damage += skillInfo[key].damage;
            damageInfo += "".concat(skillInfo[key].damage);
        }
        if (skillInfo[key].ad) {
            damage += skillInfo[key].ad * players[team].spec.ad;
            damageInfo += " + \uACF5\uACA9\uB825 (".concat(players[team].spec.ad, ") * ").concat(skillInfo[key].ad);
        }
        ;
        if (skillInfo[key].ap) {
            damage += skillInfo[key].ap * players[team].spec.ap;
            damageInfo += " + \uC8FC\uBB38\uB825 (".concat(players[team].spec.ap, ") * ").concat(skillInfo[key].ap);
        }
        ;
        if (skillInfo[key].damage > 0) {
            damageDisplayer.innerHTML = "".concat(key.toUpperCase(), " ").concat(skillInfo[key].des == "burf-heal" ? "회복량" : "스킬 피해량", ": ").concat(Math.floor(damage), " <span style=\"font-size: 15px\">(").concat((_d = (_c = (_b = (_a = damageInfo === null || damageInfo === void 0 ? void 0 : damageInfo.replace("물리 피해", "<span style=\"color: rgb(243, 117, 0)\">\uBB3C\uB9AC \uD53C\uD574</span>")) === null || _a === void 0 ? void 0 : _a.replace("공격력", "<span style=\"color: rgb(243, 117, 0)\">\uACF5\uACA9\uB825</span>")) === null || _b === void 0 ? void 0 : _b.replace("마법 피해", "<span style=\"color: rgb(0, 162, 255)\">\uB9C8\uBC95 \uD53C\uD574</span>")) === null || _c === void 0 ? void 0 : _c.replace("주문력", "<span style=\"color: rgb(0, 162, 255)\">\uC8FC\uBB38\uB825</span>")) === null || _d === void 0 ? void 0 : _d.replace("이동 속도", "<span style=\"color: gray\">\uC774\uB3D9 \uC18D\uB3C4</span>"), ")</span>");
            damageDisplayer.style.display = '';
        }
        else if (skillInfo[key].atkspd > 0) {
            damageInfo = '';
            damage = 0;
            if (skillInfo[key].atkspd) {
                damage += skillInfo[key].atkspd * 100;
                damageInfo += "".concat(skillInfo[key].atkspd * 100, "%");
            }
            if (skillInfo[key].ad) {
                damage += skillInfo[key].ad * players[team].spec.ad;
                damageInfo += " + \uACF5\uACA9\uB825 (".concat(players[team].spec.ad, ") * ").concat(skillInfo[key].ad);
            }
            ;
            if (skillInfo[key].ap) {
                damage += skillInfo[key].ap * players[team].spec.ap;
                damageInfo += " + \uC8FC\uBB38\uB825 (".concat(players[team].spec.ap, ") * ").concat(skillInfo[key].ap);
            }
            ;
            damageDisplayer.innerHTML = "".concat(key.toUpperCase(), " \uACF5\uACA9\uC18D\uB3C4 \uC99D\uAC00\uB7C9: ").concat(Math.floor(damage), "% <span style=\"font-size: 15px\">(").concat((_h = (_g = (_f = (_e = damageInfo === null || damageInfo === void 0 ? void 0 : damageInfo.replace("물리 피해", "<span style=\"color: rgb(243, 117, 0)\">\uBB3C\uB9AC \uD53C\uD574</span>")) === null || _e === void 0 ? void 0 : _e.replace("공격력", "<span style=\"color: rgb(243, 117, 0)\">\uACF5\uACA9\uB825</span>")) === null || _f === void 0 ? void 0 : _f.replace("마법 피해", "<span style=\"color: rgb(0, 162, 255)\">\uB9C8\uBC95 \uD53C\uD574</span>")) === null || _g === void 0 ? void 0 : _g.replace("주문력", "<span style=\"color: rgb(0, 162, 255)\">\uC8FC\uBB38\uB825</span>")) === null || _h === void 0 ? void 0 : _h.replace("이동 속도", "<span style=\"color: gray\">\uC774\uB3D9 \uC18D\uB3C4</span>"), ")</span>");
            damageDisplayer.style.display = '';
        }
        else if (skillInfo[key].duration > 0) {
            damageInfo = '';
            if (skillInfo[key].duration) {
                damage += skillInfo[key].duration;
                damageInfo += "".concat(skillInfo[key].duration / 100, "\uCD08");
            }
            if (skillInfo[key].ad) {
                damage += skillInfo[key].ad * players[team].spec.ad * 100;
                damageInfo += " + \uACF5\uACA9\uB825 (".concat(players[team].spec.ad, ") * ").concat(skillInfo[key].ad);
            }
            ;
            if (skillInfo[key].ap) {
                damage += skillInfo[key].ap * players[team].spec.ap * 100;
                damageInfo += " + \uC8FC\uBB38\uB825 (".concat(players[team].spec.ap, ") * ").concat(skillInfo[key].ap);
            }
            ;
            damageDisplayer.innerHTML = "".concat(key.toUpperCase(), " \uC9C0\uC18D \uC2DC\uAC04: ").concat(Math.floor(damage) / 100, "\uCD08 <span style=\"font-size: 15px\">(").concat((_m = (_l = (_k = (_j = damageInfo === null || damageInfo === void 0 ? void 0 : damageInfo.replace("물리 피해", "<span style=\"color: rgb(243, 117, 0)\">\uBB3C\uB9AC \uD53C\uD574</span>")) === null || _j === void 0 ? void 0 : _j.replace("공격력", "<span style=\"color: rgb(243, 117, 0)\">\uACF5\uACA9\uB825</span>")) === null || _k === void 0 ? void 0 : _k.replace("마법 피해", "<span style=\"color: rgb(0, 162, 255)\">\uB9C8\uBC95 \uD53C\uD574</span>")) === null || _l === void 0 ? void 0 : _l.replace("주문력", "<span style=\"color: rgb(0, 162, 255)\">\uC8FC\uBB38\uB825</span>")) === null || _m === void 0 ? void 0 : _m.replace("이동 속도", "<span style=\"color: gray\">\uC774\uB3D9 \uC18D\uB3C4</span>"), ")</span>");
            damageDisplayer.style.display = '';
        }
    });
    e.addEventListener('mouseleave', function () {
        damageDisplayer.style.display = 'none';
    });
});
function getCharInfo(char) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch("http://kimchi-game.kro.kr:1973/getChar?char=".concat(char))
                        .then(function (r) { return r.json(); })
                        .then(function (result) { return result.body; })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function getItemInfo() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch("http://kimchi-game.kro.kr:1973/getItem")
                        .then(function (r) { return r.json(); })
                        .then(function (result) { return result.body; })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function getRuneInfo() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch("http://kimchi-game.kro.kr:1973/getRune")
                        .then(function (r) { return r.json(); })
                        .then(function (result) { return result.body; })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function getData() {
    return __awaiter(this, void 0, void 0, function () {
        var fetched, fetched2, _a, fetchedItemData;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, getCharInfo(char[team])];
                case 1:
                    fetched = _b.sent();
                    players[team].specINIT = fetched.defaultSpec;
                    players[team].hp[0] = players[team].specINIT.health;
                    players[team].hp[1] = players[team].specINIT.health;
                    skillInfo.passive = fetched.skills.passive;
                    skillInfo.q = fetched.skills.Q;
                    skillInfo.e = fetched.skills.E;
                    skillInfo.shift = fetched.skills.Shift;
                    skillInfo.wheel = fetched.skills.Wheel;
                    skillInfo.growth = fetched.growth;
                    if (char[team] === 'aphelios') {
                        apheliosSkillInfo.q.Calibrum = fetched.skills.Q.Calibrum;
                        apheliosSkillInfo.q.Severum = fetched.skills.Q.Severum;
                        apheliosSkillInfo.q.Infernum = fetched.skills.Q.Infernum;
                        apheliosSkillInfo.q.Gravitum = fetched.skills.Q.Gravitum;
                        apheliosSkillInfo.q.Crescendum = fetched.skills.Q.Crescendum;
                        skillInfo.q = fetched.skills.Q.Calibrum;
                    }
                    return [4 /*yield*/, getCharInfo(char[getEnemyTeam()])];
                case 2:
                    fetched2 = _b.sent();
                    enemySkillInfo.wheel = fetched2.skills.Wheel;
                    enemySkillInfo.passive = fetched2.skills.passive;
                    enemySkillInfo.q = fetched2.skills.Q;
                    enemySkillInfo.e = fetched2.skills.E;
                    enemySkillInfo.shift = fetched2.skills.Shift;
                    _a = players[getEnemyTeam()];
                    return [4 /*yield*/, getCharInfo(char[getEnemyTeam()])];
                case 3:
                    _a.specINIT = _b.sent();
                    players[getEnemyTeam()].hp[0] = players[getEnemyTeam()].specINIT.health;
                    players[getEnemyTeam()].hp[1] = players[getEnemyTeam()].specINIT.health;
                    makeEzreal();
                    makeSniper();
                    makeSamira();
                    makeVayne();
                    makeExponent();
                    makeAssassin();
                    makeGraves();
                    makeVampire();
                    makeAphelios();
                    makeAshe();
                    makeKaisa();
                    makeAhri();
                    makeTalon();
                    if (char[team] == 'ezreal') {
                        charClass = ezreal;
                    }
                    else if (char[team] == 'sniper') {
                        charClass = sniper;
                    }
                    else if (char[team] == 'samira') {
                        charClass = samira;
                    }
                    else if (char[team] == 'vayne') {
                        charClass = vayne;
                    }
                    else if (char[team] == 'exponent') {
                        charClass = exponent;
                    }
                    else if (char[team] == 'assassin') {
                        charClass = assassin;
                    }
                    else if (char[team] == 'graves') {
                        charClass = graves;
                    }
                    else if (char[team] == 'vampire') {
                        charClass = vampire;
                    }
                    else if (char[team] == 'aphelios') {
                        charClass = aphelios;
                    }
                    else if (char[team] == 'ashe') {
                        charClass = ashe;
                    }
                    else if (char[team] == 'kaisa') {
                        charClass = kaisa;
                    }
                    else if (char[team] == 'ahri') {
                        charClass = ahri;
                    }
                    else if (char[team] == 'talon') {
                        charClass = talon;
                    }
                    return [4 /*yield*/, getItemInfo()];
                case 4:
                    fetchedItemData = _b.sent();
                    return [4 /*yield*/, getRuneInfo()];
                case 5:
                    runeInfo = _b.sent();
                    itemData = [];
                    fetchedItemData.forEach(function (e) {
                        if (e.enable) {
                            var item = new ItemBuilder()
                                .setName(e.name[0], e.name[1]).setPrice(e.price)
                                .setAbility(e.ability);
                            if (e.lower)
                                item.setLower(e.lower);
                            if (e.grade)
                                item.setGrade(e.grade);
                            if (e.extra)
                                item.setExtra(e.extra);
                            if (e.des)
                                item.setDescription(e.des);
                            if (e.active) {
                                item.setActive(e.active);
                                item.setActiveInfo(e.activeInfo);
                            }
                            itemData.push(item.build());
                        }
                    });
                    return [2 /*return*/];
            }
        });
    });
}
function reload() {
    getData();
    socket.send(JSON.stringify({
        body: { msg: "reload" }
    }));
}
