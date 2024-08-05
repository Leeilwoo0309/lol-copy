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
var charsBtn = document.querySelectorAll('.char-btn');
var selectedP = document.querySelector('.selected-display');
var des = document.querySelector('.description');
var readyBtn = document.querySelector('#ready-btn');
var _socket = new WebSocket("ws://kimchi-game.kro.kr:8001");
var selected = { ally: undefined, enemy: undefined };
var chars = undefined;
var charName = ['teacher', 'sniper', 'ezreal', 'samira', 'vayne', 'vampire'];
var charNameKr = ['Prof. CB', '스나이퍼', '이즈리얼', '사미라', '베인', '블라디미르'];
var readyStatus = [false, false];
function getCharInfo(name) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch("http://kimchi-game.kro.kr:1973/getChar?char=".concat(name), { method: 'GET' })
                        .then(function (r) { return r.json(); })
                        .then(function (result) { return result.body; })
                        .catch(function (err) { return console.log(err); })];
                case 1:
                    chars = _a.sent();
                    updateSelected();
                    console.log(chars);
                    return [2 /*return*/];
            }
        });
    });
}
;
charsBtn.forEach(function (e, i) {
    e.addEventListener('click', function () {
        var _a;
        selected.ally = i;
        (_a = document.querySelector('.selected')) === null || _a === void 0 ? void 0 : _a.classList.remove('selected');
        e.classList.add('selected');
        getCharInfo(charName[selected.ally]);
        _socket.send(JSON.stringify({ body: { selection: i } }));
    });
});
readyBtn.addEventListener('click', function () {
    if (selected.ally === undefined) {
        alert("챔피언을 선택해주세요.");
        return;
    }
    if (selected.ally === 0 || selected.ally === 5) {
        alert("그챔 아직 안만듦~~");
        return;
    }
    readyStatus[0] = !readyStatus[0];
    _socket.send(JSON.stringify({
        body: {
            msg: "changeReadyStatus"
        }
    }));
});
_socket.onopen = function () {
    _socket.send('{"body": {"msg": "connected"}}');
    _socket.onmessage = function (event) {
        var blob = event.data;
        var reader = new FileReader();
        reader.onload = function () {
            //@ts-ignore
            var sentJson = JSON.parse(reader.result);
            console.log(sentJson);
            if (sentJson.body) {
                if (sentJson.body.selection !== undefined) {
                    selected.enemy = sentJson.body.selection;
                    updateSelected();
                }
                else if (sentJson.body.msg == "connected") {
                    readyStatus[1] = false;
                    readyStatus[0] = false;
                    selected.enemy = undefined;
                    _socket.send(JSON.stringify({
                        body: {
                            selection: selected.ally
                        }
                    }));
                }
                else if (sentJson.body.msg == "changeReadyStatus") {
                    readyStatus[1] = !readyStatus[1];
                    if (readyStatus[0] && readyStatus[1]) {
                        _socket.send(JSON.stringify({
                            body: {
                                msg: "start"
                            }
                        }));
                        window.location.href = "../public/game.html?team=blue&char=".concat(chars.cn);
                    }
                }
                else if (sentJson.body.msg == "start") {
                    window.location.href = "../public/game.html?team=red&char=".concat(chars.cn);
                }
            }
            // console.log(sentJson);
        };
        reader.readAsText(blob);
    };
};
function updateSelected() {
    var _a, _b;
    function generateDes(des, chars) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21, _22, _23, _24, _25, _26, _27, _28, _29, _30, _31, _32, _33, _34, _35, _36, _37, _38, _39, _40, _41, _42, _43, _44, _45, _46, _47, _48, _49, _50, _51, _52, _53, _54, _55, _56, _57, _58, _59, _60, _61, _62, _63, _64, _65, _66;
        return (_66 = (_65 = (_64 = (_63 = (_62 = (_59 = (_56 = (_53 = (_50 = (_47 = (_44 = (_41 = (_38 = (_35 = (_32 = (_29 = (_26 = (_23 = (_20 = (_17 = (_14 = (_11 = (_8 = (_5 = (_2 = (_z = (_w = (_t = (_q = (_m = (_j = (_f = (_c = des === null || des === void 0 ? void 0 : des.replace(/\$pd/g, (_b = ((_a = chars.skills.passive) === null || _a === void 0 ? void 0 : _a.damage)) === null || _b === void 0 ? void 0 : _b.toString())) === null || _c === void 0 ? void 0 : _c.replace(/\$psh/g, (_e = (((_d = chars.skills.passive) === null || _d === void 0 ? void 0 : _d.skillHaste) / 100)) === null || _e === void 0 ? void 0 : _e.toString())) === null || _f === void 0 ? void 0 : _f.replace(/\$pdu/g, (_h = (((_g = chars.skills.passive) === null || _g === void 0 ? void 0 : _g.duration) / 100)) === null || _h === void 0 ? void 0 : _h.toString())) === null || _j === void 0 ? void 0 : _j.replace(/\$pmv/g, (_l = ((_k = chars.skills.passive) === null || _k === void 0 ? void 0 : _k.moveSpd)) === null || _l === void 0 ? void 0 : _l.toString())) === null || _m === void 0 ? void 0 : _m.replace(/\$pas/g, (_p = (((_o = chars.skills.passive) === null || _o === void 0 ? void 0 : _o.atkspd) * 100)) === null || _p === void 0 ? void 0 : _p.toString())) === null || _q === void 0 ? void 0 : _q.replace(/\$qdu/g, (_s = (((_r = chars.skills.E) === null || _r === void 0 ? void 0 : _r.duration) / 100)) === null || _s === void 0 ? void 0 : _s.toString())) === null || _t === void 0 ? void 0 : _t.replace(/\$qd/g, (_v = (_u = chars.skills.Q) === null || _u === void 0 ? void 0 : _u.damage) === null || _v === void 0 ? void 0 : _v.toString())) === null || _w === void 0 ? void 0 : _w.replace(/\$qad/g, (_y = (_x = chars.skills.Q) === null || _x === void 0 ? void 0 : _x.ad) === null || _y === void 0 ? void 0 : _y.toString())) === null || _z === void 0 ? void 0 : _z.replace(/\$qap/g, (_1 = (_0 = chars.skills.Q) === null || _0 === void 0 ? void 0 : _0.ap) === null || _1 === void 0 ? void 0 : _1.toString())) === null || _2 === void 0 ? void 0 : _2.replace(/\$qcd/g, (_4 = (((_3 = chars.skills.Q) === null || _3 === void 0 ? void 0 : _3.cooldown) / 100)) === null || _4 === void 0 ? void 0 : _4.toString())) === null || _5 === void 0 ? void 0 : _5.replace(/\$qas/g, (_7 = (((_6 = chars.skills.Q) === null || _6 === void 0 ? void 0 : _6.atkspd) * 100)) === null || _7 === void 0 ? void 0 : _7.toString())) === null || _8 === void 0 ? void 0 : _8.replace(/\$edu/g, (_10 = (((_9 = chars.skills.E) === null || _9 === void 0 ? void 0 : _9.duration) / 100)) === null || _10 === void 0 ? void 0 : _10.toString())) === null || _11 === void 0 ? void 0 : _11.replace(/\$ed/g, (_13 = (_12 = chars.skills.E) === null || _12 === void 0 ? void 0 : _12.damage) === null || _13 === void 0 ? void 0 : _13.toString())) === null || _14 === void 0 ? void 0 : _14.replace(/\$ead/g, (_16 = (_15 = chars.skills.E) === null || _15 === void 0 ? void 0 : _15.ad) === null || _16 === void 0 ? void 0 : _16.toString())) === null || _17 === void 0 ? void 0 : _17.replace(/\$eap/g, (_19 = (_18 = chars.skills.E) === null || _18 === void 0 ? void 0 : _18.ap) === null || _19 === void 0 ? void 0 : _19.toString())) === null || _20 === void 0 ? void 0 : _20.replace(/\$ecd/g, (_22 = (((_21 = chars.skills.E) === null || _21 === void 0 ? void 0 : _21.cooldown) / 100)) === null || _22 === void 0 ? void 0 : _22.toString())) === null || _23 === void 0 ? void 0 : _23.replace(/\$eas/g, (_25 = (((_24 = chars.skills.E) === null || _24 === void 0 ? void 0 : _24.atkspd) * 100)) === null || _25 === void 0 ? void 0 : _25.toString())) === null || _26 === void 0 ? void 0 : _26.replace(/\$sdu/g, (_28 = (((_27 = chars.skills.Shift) === null || _27 === void 0 ? void 0 : _27.duration) / 100)) === null || _28 === void 0 ? void 0 : _28.toString())) === null || _29 === void 0 ? void 0 : _29.replace(/\$sd/g, (_31 = (_30 = chars.skills.Shift) === null || _30 === void 0 ? void 0 : _30.damage) === null || _31 === void 0 ? void 0 : _31.toString())) === null || _32 === void 0 ? void 0 : _32.replace(/\$sad/g, (_34 = (_33 = chars.skills.Shift) === null || _33 === void 0 ? void 0 : _33.ad) === null || _34 === void 0 ? void 0 : _34.toString())) === null || _35 === void 0 ? void 0 : _35.replace(/\$sap/g, (_37 = (_36 = chars.skills.Shift) === null || _36 === void 0 ? void 0 : _36.ap) === null || _37 === void 0 ? void 0 : _37.toString())) === null || _38 === void 0 ? void 0 : _38.replace(/\$scd/g, (_40 = (((_39 = chars.skills.Shift) === null || _39 === void 0 ? void 0 : _39.cooldown) / 100)) === null || _40 === void 0 ? void 0 : _40.toString())) === null || _41 === void 0 ? void 0 : _41.replace(/\$sas/g, (_43 = (((_42 = chars.skills.Shift) === null || _42 === void 0 ? void 0 : _42.atkspd) * 100)) === null || _43 === void 0 ? void 0 : _43.toString())) === null || _44 === void 0 ? void 0 : _44.replace(/\$wdu/g, (_46 = (((_45 = chars.skills.Wheel) === null || _45 === void 0 ? void 0 : _45.duration) / 100)) === null || _46 === void 0 ? void 0 : _46.toString())) === null || _47 === void 0 ? void 0 : _47.replace(/\$wd/g, (_49 = (_48 = chars.skills.Wheel) === null || _48 === void 0 ? void 0 : _48.damage) === null || _49 === void 0 ? void 0 : _49.toString())) === null || _50 === void 0 ? void 0 : _50.replace(/\$wad/g, (_52 = (_51 = chars.skills.Wheel) === null || _51 === void 0 ? void 0 : _51.ad) === null || _52 === void 0 ? void 0 : _52.toString())) === null || _53 === void 0 ? void 0 : _53.replace(/\$wap/g, (_55 = (_54 = chars.skills.Wheel) === null || _54 === void 0 ? void 0 : _54.ap) === null || _55 === void 0 ? void 0 : _55.toString())) === null || _56 === void 0 ? void 0 : _56.replace(/\$wcd/g, (_58 = (((_57 = chars.skills.Wheel) === null || _57 === void 0 ? void 0 : _57.cooldown) / 100)) === null || _58 === void 0 ? void 0 : _58.toString())) === null || _59 === void 0 ? void 0 : _59.replace(/\$was/g, (_61 = (((_60 = chars.skills.Wheel) === null || _60 === void 0 ? void 0 : _60.atkspd) * 100)) === null || _61 === void 0 ? void 0 : _61.toString())) === null || _62 === void 0 ? void 0 : _62.replace("물리 피해", "<span style=\"color: rgb(243, 117, 0)\">\uBB3C\uB9AC \uD53C\uD574</span>")) === null || _63 === void 0 ? void 0 : _63.replace("공격력", "<span style=\"color: rgb(243, 117, 0)\">\uACF5\uACA9\uB825</span>")) === null || _64 === void 0 ? void 0 : _64.replace("마법 피해", "<span style=\"color: rgb(0, 162, 255)\">\uB9C8\uBC95 \uD53C\uD574</span>")) === null || _65 === void 0 ? void 0 : _65.replace("주문력", "<span style=\"color: rgb(0, 162, 255)\">\uC8FC\uBB38\uB825</span>")) === null || _66 === void 0 ? void 0 : _66.replace("이동 속도", "<span style=\"color: gray\">\uC774\uB3D9 \uC18D\uB3C4</span>");
    }
    if (chars) {
        des.innerHTML = "\n                <h2>".concat(chars.name, "</h2>\n                <hr />\n                <p>\uCCB4\uB825: ").concat(chars.defaultSpec.health, "</p>\n                <p>\uCCB4\uB825 \uC7AC\uC0DD: ").concat(chars.defaultSpec.healthBoost, "</p>\n                <p>\uACF5\uACA9\uB825: ").concat(chars.defaultSpec.ad, "</p>\n                <p>\uACF5\uACA9 \uC18D\uB3C4: ").concat(chars.defaultSpec.atkspd, "</p>\n                <p>\uBC29\uC5B4\uB825: ").concat(chars.defaultSpec.armor, "</p>\n                <p>\uC0AC\uAC70\uB9AC: ").concat(chars.defaultSpec.range, "</p>\n                <p>\uC774\uB3D9 \uC18D\uB3C4: ").concat(chars.defaultSpec.moveSpd, "</p>\n                <p><b>\uAE30\uBCF8 \uC9C0\uC18D \uD6A8\uACFC</b><span> - ").concat(generateDes(chars.des.passive, chars), "</span></p>\n                <p><b>\uC2A4\uD0AC Q</b><span> - ").concat(generateDes(chars.des.Q, chars), " </span></p>\n                <p><b>\uC2A4\uD0AC E</b><span> - ").concat(generateDes(chars.des.E, chars), " </span></p>\n                <p><b>\uC2A4\uD0AC Shift</b><span> - ").concat(generateDes(chars.des.Shift, chars), " </span></p>\n                <p><b>\uC2A4\uD0AC Wheel (\uAD81\uADF9\uAE30)</b><span> - ").concat(generateDes(chars.des.Wheel, chars), " </span></p>\n        ");
    }
    selectedP.innerHTML = "<b>".concat((_a = charNameKr[selected.ally]) !== null && _a !== void 0 ? _a : "정하지 않음", " (\uB098)</b> vs <span>").concat((_b = charNameKr[selected.enemy]) !== null && _b !== void 0 ? _b : "정하지 않음", " (\uC0C1\uB300)</span>");
}
setInterval(function () {
    updateSelected();
    if (readyStatus[1]) {
        readyBtn.innerHTML = "\uC900\uBE44\uD558\uAE30 (\uC0C1\uB300\uBC29 \uC900\uBE44\uC644\uB8CC)";
        readyBtn.style.fontSize = '15px';
        readyBtn.style.top = "675px";
        readyBtn.style.background = 'linear-gradient(60deg, rgb(165, 0, 0), rgb(63, 0, 6))';
        readyBtn.style.boxShadow = '0px 0px 5px rgb(128, 15, 0)';
    }
    else if (readyStatus[0]) {
        readyBtn.innerHTML = "\uC900\uBE44\uC644\uB8CC";
        readyBtn.style.fontSize = '30px';
        readyBtn.style.top = "660px";
        readyBtn.style.background = 'linear-gradient(60deg, rgb(0, 0, 65), rgb(6, 0, 20))';
        readyBtn.style.boxShadow = '0px 0px 5px rgb(0, 15, 64)';
    }
    else {
        readyBtn.innerHTML = "\uC900\uBE44\uD558\uAE30";
        readyBtn.style.fontSize = '30px';
        readyBtn.style.top = "660px";
        readyBtn.style.background = 'linear-gradient(60deg, rgb(0, 71, 165), rgb(6, 31, 63))';
        readyBtn.style.boxShadow = '0px 0px 5px rgb(0, 15, 128)';
    }
}, 16);
export {};
