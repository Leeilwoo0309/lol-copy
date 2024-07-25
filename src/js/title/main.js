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
var socket = new WebSocket("ws://localhost:8001");
var selected = { ally: undefined, enemy: undefined };
var chars;
var charName = ['teacher', 'sniper'];
function getCharInfo(name) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch("http://localhost:1973/getChar?char=".concat(name))
                        .then(function (r) { return r.json(); })
                        .then(function (result) { return result.body; })
                        .catch(function (err) { return console.log(err); })];
                case 1:
                    chars = _a.sent();
                    updateSelected();
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
        socket.send(JSON.stringify({ body: { selection: i } }));
    });
});
socket.onopen = function () {
    socket.send('{}');
    socket.onmessage = function (event) {
        var blob = event.data;
        var reader = new FileReader();
        reader.onload = function () {
            //@ts-ignore
            var sentJson = JSON.parse(reader.result);
            if (sentJson.body) {
                if (sentJson.body.selection !== undefined) {
                    selected.enemy = sentJson.body.selection;
                    updateSelected();
                }
            }
        };
        reader.readAsText(blob);
    };
};
function updateSelected() {
    var _a, _b;
    des.innerHTML = "\n            <h2>".concat(chars.name, "</h2>\n            <hr />\n            <p>\uCCB4\uB825: ").concat(chars.defaultSpec.health, "</p>\n            <p>\uCCB4\uB825 \uC7AC\uC0DD: ").concat(chars.defaultSpec.healthBoost, "</p>\n            <p>\uACF5\uACA9\uB825: ").concat(chars.defaultSpec.ad, "</p>\n            <p>\uACF5\uACA9 \uC18D\uB3C4: ").concat(chars.defaultSpec.atkspd, "</p>\n            <p>\uBC29\uC5B4\uB825: ").concat(chars.defaultSpec.armor, "</p>\n            <p>\uC0AC\uAC70\uB9AC: ").concat(chars.defaultSpec.range, "</p>\n            <p>\uC774\uB3D9 \uC18D\uB3C4: ").concat(chars.defaultSpec.moveSpd, "</p>\n            <p><b>\uC2A4\uD0AC Q</b> - ").concat(chars.des.Q, " </p>\n            <p><b>\uC2A4\uD0AC E</b> - ").concat(chars.des.E, " </p>\n            <p><b>\uC2A4\uD0AC C</b> - ").concat(chars.des.LShift, " </p>\n            <p><b>\uC2A4\uD0AC X (\uAD81\uADF9\uAE30)</b> - ").concat(chars.des.Wheel, " </p>\n    ");
    selectedP.innerHTML = "<b>".concat((_a = selected.ally) !== null && _a !== void 0 ? _a : "정하지 않음", " (\uB098)</b> vs <span>").concat((_b = selected.enemy) !== null && _b !== void 0 ? _b : "정하지 않음", " (\uC0C1\uB300)</span>");
}
export {};
