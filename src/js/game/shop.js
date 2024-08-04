var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var listDiv = document.querySelector('#list');
var shopBtn = document.querySelector('#gold-div');
var exitBtn = document.querySelector('#shop-exit-btn');
var shopWin = document.querySelector('#shop');
var resultItem = document.querySelector('#result');
var itemInfo = undefined;
var isOpen = false;
var items;
var isSellActive = false;
var hasBoots = false;
// 사는거
resultItem.addEventListener('click', function () {
    // 업그레이드하는 함수
    function upgradeLower() {
        var lower = __spreadArray([], itemData[itemInfo].lower, true);
        players[team].items.forEach(function (e, i) {
            if (e !== undefined) {
                if (lower.includes(e.name[1])) {
                    if (e.ability.ad)
                        players[team].specItem.ad -= e.ability.ad;
                    if (e.ability.ap)
                        players[team].specItem.ap -= e.ability.ap;
                    if (e.ability.atkspd)
                        players[team].specItem.atkspd -= e.ability.atkspd;
                    if (e.ability.armor)
                        players[team].specItem.armor -= e.ability.armor;
                    if (e.ability.magicRegist)
                        players[team].specItem.magicRegist -= e.ability.magicRegist;
                    if (e.ability.criticD)
                        players[team].specItem.criticD -= e.ability.criticD;
                    if (e.ability.criticP)
                        players[team].specItem.criticP -= e.ability.criticP;
                    if (e.ability.health) {
                        players[team].specItem.health -= e.ability.health;
                        players[team].hp[1] -= itemData[itemInfo].ability.health;
                    }
                    if (e.ability.healthBoost)
                        players[team].specItem.healthBoost -= e.ability.healthBoost;
                    if (e.ability.moveSpd)
                        players[team].specItem.moveSpd -= e.ability.moveSpd;
                    if (e.ability.skillHaste)
                        players[team].specItem.skillHaste -= e.ability.skillHaste;
                    if (e.ability.mana)
                        players[team].specItem.mana -= e.ability.mana;
                    if (e.ability.manaR)
                        players[team].specItem.manaR -= e.ability.manaR;
                    if (e.ability.vamp)
                        players[team].specItem.vamp -= e.ability.vamp;
                    lower = lower = lower.filter(function (element) { return element !== e.name[1]; });
                    players[team].items[i] = undefined;
                }
            }
        });
        return price;
    }
    var price = itemData[itemInfo].price;
    if (itemData[itemInfo].lower)
        price = getPrice(itemInfo);
    if (players[team].gold >= price && players[team].items.filter(function (e) { return e !== undefined; }).length < 6 + howManyLower(itemData[itemInfo].lower)) {
        if (itemData[itemInfo].name[1].includes('b_1') && hasBoots)
            return;
        if (itemData[itemInfo].name[1].includes('b_2') && hasItem("b_2atkspd") && hasBoots)
            return;
        players[team].gold -= price;
        if (itemData[itemInfo].ability.ad)
            players[team].specItem.ad += itemData[itemInfo].ability.ad;
        if (itemData[itemInfo].ability.ap)
            players[team].specItem.ap += itemData[itemInfo].ability.ap;
        if (itemData[itemInfo].ability.atkspd)
            players[team].specItem.atkspd += itemData[itemInfo].ability.atkspd;
        if (itemData[itemInfo].ability.moveSpd)
            players[team].specItem.moveSpd += itemData[itemInfo].ability.moveSpd;
        if (itemData[itemInfo].ability.skillHaste)
            players[team].specItem.skillHaste += itemData[itemInfo].ability.skillHaste;
        if (itemData[itemInfo].ability.armor)
            players[team].specItem.armor += itemData[itemInfo].ability.armor;
        if (itemData[itemInfo].ability.magicRegist)
            players[team].specItem.magicRegist += itemData[itemInfo].ability.magicRegist;
        if (itemData[itemInfo].ability.criticD)
            players[team].specItem.criticD += itemData[itemInfo].ability.criticD;
        if (itemData[itemInfo].ability.criticP)
            players[team].specItem.criticP += itemData[itemInfo].ability.criticP;
        if (itemData[itemInfo].ability.health) {
            players[team].specItem.health += itemData[itemInfo].ability.health;
            players[team].hp[0] += itemData[itemInfo].ability.health;
            players[team].hp[1] += itemData[itemInfo].ability.health;
        }
        ;
        if (itemData[itemInfo].ability.vamp)
            players[team].specItem.vamp += itemData[itemInfo].ability.vamp;
        if (itemData[itemInfo].ability.healthBoost)
            players[team].specItem.healthBoost += itemData[itemInfo].ability.healthBoost;
        if (itemData[itemInfo].ability.mana)
            players[team].specItem.mana += itemData[itemInfo].ability.mana;
        if (itemData[itemInfo].ability.manaR)
            players[team].specItem.manaR += itemData[itemInfo].ability.manaR;
        if (itemData[itemInfo].lower)
            upgradeLower();
        if (itemData[itemInfo].name[1].includes('b_1') || itemData[itemInfo].name[1].includes('b_2'))
            hasBoots = true;
        for (var i = 0; i < 6; i++) {
            if (players[team].items[i] == undefined) {
                players[team].items[i] = itemData[itemInfo];
                break;
            }
        }
        if (itemData[itemInfo].name[1].includes('3_'))
            players[team].hp[1] += 190;
        refreshPrice();
        sellItems();
    }
});
function sellItems() {
    if (!isSellActive) {
        isSellActive = true;
        var itemVault = document.querySelectorAll('.item-vault');
        itemVault.forEach(function (e, i) {
            e.addEventListener('mousedown', function (event) {
                if (event.button) {
                    var sellitem = findItem(players[team].items[i].name[1]);
                    if (sellitem.body.name[1].includes('b_1') || sellitem.body.name[1].includes('b_2'))
                        hasBoots = false;
                    players[team].gold += players[team].items[i].price * 0.5;
                    players[team].items[i] = undefined;
                    if (sellitem.body.ability.ad)
                        players[team].specItem.ad -= sellitem.body.ability.ad;
                    if (sellitem.body.ability.ap)
                        players[team].specItem.ap -= sellitem.body.ability.ap;
                    if (sellitem.body.ability.atkspd)
                        players[team].specItem.atkspd -= sellitem.body.ability.atkspd;
                    if (sellitem.body.ability.moveSpd)
                        players[team].specItem.moveSpd -= sellitem.body.ability.moveSpd;
                    if (sellitem.body.ability.skillHaste)
                        players[team].specItem.skillHaste -= sellitem.body.ability.skillHaste;
                    if (sellitem.body.ability.armor)
                        players[team].specItem.armor -= sellitem.body.ability.armor;
                    if (sellitem.body.ability.magicRegist)
                        players[team].specItem.magicRegist -= sellitem.body.ability.magicRegist;
                    if (sellitem.body.ability.criticD)
                        players[team].specItem.criticD -= sellitem.body.ability.criticD;
                    if (sellitem.body.ability.criticP)
                        players[team].specItem.criticP -= sellitem.body.ability.criticP;
                    if (sellitem.body.ability.healthBoost)
                        players[team].specItem.healthBoost -= sellitem.body.ability.healthBoost;
                    if (sellitem.body.ability.vamp)
                        players[team].specItem.vamp -= sellitem.body.ability.vamp;
                    if (sellitem.body.ability.health) {
                        players[team].specItem.health -= sellitem.body.ability.health;
                        // players[team].hp[1] -= sellitem.body.ability.health;
                    }
                    ;
                    if (itemData[itemInfo].ability.mana)
                        players[team].specItem.mana -= itemData[itemInfo].ability.mana;
                    if (itemData[itemInfo].ability.manaR)
                        players[team].specItem.manaR -= itemData[itemInfo].ability.manaR;
                }
            });
        });
    }
}
function refreshPrice() {
    listDiv.innerHTML = '';
    itemData.forEach(function (e, i) {
        if (e.grade !== "undefined") {
            listDiv.innerHTML += "\n            <div id=\"item-selling-".concat(i, "\" class=\"item ").concat(e.grade, "\" style=\"background-image: url(./assets/items/").concat(e.name[1], ".png);\">\n                <p class=\"price\">G").concat(e.lower ? getPrice(i) : e.price, "</p>\n            </div>");
        }
        else {
            listDiv.innerHTML += "\n            <div id=\"item-selling-".concat(i, "\" class=\"item\" style=\"background-image: url(./assets/items/").concat(e.name[1], ".png);\">\n                <p class=\"price\">G").concat(e.lower ? getPrice(i) : e.price, "</p>\n            </div>");
        }
    });
    items = document.querySelectorAll('#list>.item');
    items.forEach(function (e, i) {
        e.addEventListener('click', function () {
            refreshShop(e, i);
        });
    });
}
function shopOpen(boolean) {
    if (boolean === void 0) { boolean = isOpen; }
    isOpen = boolean;
    if (!isOpen) {
        listDiv.innerHTML = '';
        refreshPrice();
        shopWin.style.display = '';
        isOpen = true;
        // items.forEach((e, i) => {
        //     e.addEventListener('click', () => {
        //         refreshShop(e, i);
        //     });
        // });
    }
    else {
        shopWin.style.display = 'none';
        isOpen = false;
    }
}
shopBtn.addEventListener('click', function () {
    shopOpen();
});
exitBtn.addEventListener('click', function () {
    shopOpen();
});
shopBtn.addEventListener('mouseenter', function () { game.style.cursor = 'pointer'; });
shopBtn.addEventListener('mouseleave', function () { game.style.cursor = ''; });
function refreshShop(element, index) {
    var _a, _b, _c, _d, _e;
    var buyInfo = document.querySelector('#buy-info');
    buyInfo.style.display = '';
    itemInfo = index;
    var underItem = document.querySelector('#need-items');
    var des = document.querySelector('#item-des');
    resultItem.style.backgroundImage = "url(./assets/items/".concat(itemData[index].name[1], ".png)");
    resultItem.innerHTML = "<p class=\"price\">".concat((itemData[index].name[1].includes('b_1') || itemData[index].name[1].includes('b_2')) && hasBoots ?
        "소유중" :
        "G" + itemData[index].price, "</p>");
    underItem.innerHTML = '';
    des.innerHTML = '';
    if (itemData[itemInfo].lower) {
        resultItem.innerHTML = "<p class=\"price\">G".concat(getPrice(index), "</p>");
    }
    des.innerHTML = "<h2>".concat(itemData[itemInfo].name[0], "</h2>");
    if (itemData[itemInfo].ability.ad)
        des.innerHTML += "<p>\uACF5\uACA9\uB825: ".concat(itemData[itemInfo].ability.ad, "</p>");
    if (itemData[itemInfo].ability.ap)
        des.innerHTML += "<p>\uC8FC\uBB38\uB825: ".concat(itemData[itemInfo].ability.ap, "</p>");
    if (itemData[itemInfo].ability.mana)
        des.innerHTML += "<p>\uB9C8\uB098: ".concat(itemData[itemInfo].ability.mana, "</p>");
    if (itemData[itemInfo].ability.manaR)
        des.innerHTML += "<p>\uB9C8\uB098 \uC7AC\uC0DD: ".concat(itemData[itemInfo].ability.manaR, "</p>");
    if (itemData[itemInfo].ability.skillHaste)
        des.innerHTML += "<p>\uC2A4\uD0AC \uAC00\uC18D: ".concat(itemData[itemInfo].ability.skillHaste, "</p>");
    if (itemData[itemInfo].ability.armor)
        des.innerHTML += "<p>\uBC29\uC5B4\uB825: ".concat(itemData[itemInfo].ability.armor, "</p>");
    if (itemData[itemInfo].ability.magicRegist)
        des.innerHTML += "<p>\uB9C8\uBC95 \uC800\uD56D\uB825: ".concat(itemData[itemInfo].ability.magicRegist, "</p>");
    if (itemData[itemInfo].ability.health)
        des.innerHTML += "<p>\uCCB4\uB825: ".concat(itemData[itemInfo].ability.health, "</p>");
    if (itemData[itemInfo].ability.atkspd)
        des.innerHTML += "<p>\uACF5\uACA9 \uC18D\uB3C4: ".concat(itemData[itemInfo].ability.atkspd, "%</p>");
    if (itemData[itemInfo].ability.vamp)
        des.innerHTML += "<p>\uBAA8\uB4E0 \uD53C\uD574 \uD761\uD608: ".concat(itemData[itemInfo].ability.vamp, "%</p>");
    if (itemData[itemInfo].ability.criticP)
        des.innerHTML += "<p>\uCE58\uBA85\uD0C0 \uD655\uB960: ".concat(itemData[itemInfo].ability.criticP, "%</p>");
    if (itemData[itemInfo].ability.criticD)
        des.innerHTML += "<p>\uCD94\uAC00 \uCE58\uBA85\uD0C0 \uD53C\uD574: ".concat(itemData[itemInfo].ability.criticD, "%</p>");
    if (itemData[itemInfo].ability.moveSpd)
        des.innerHTML += "<p>\uC774\uB3D9 \uC18D\uB3C4: ".concat(itemData[itemInfo].ability.moveSpd, "</p>");
    if (itemData[itemInfo].ability.healthBoost)
        des.innerHTML += "<p>\uCCB4\uB825 \uD68C\uBCF5 \uC18D\uB3C4 \uC99D\uAC00: ".concat(itemData[itemInfo].ability.healthBoost, "%</p>");
    if (itemData[itemInfo].des)
        des.innerHTML += "<br/><b>\uAE30\uBCF8 \uC9C0\uC18D \uD6A8\uACFC</b> - ".concat((_d = (_c = (_b = (_a = itemData[itemInfo].des) === null || _a === void 0 ? void 0 : _a.replace(/\$e1/g, (itemData[itemInfo].extra[0]).toFixed())) === null || _b === void 0 ? void 0 : _b.replace(/\$e2/g, (itemData[itemInfo].extra[1] / 100).toFixed())) === null || _c === void 0 ? void 0 : _c.replace(/\$e3/g, (itemData[itemInfo].extra[2]).toFixed())) === null || _d === void 0 ? void 0 : _d.replace(/\$e4/g, (itemData[itemInfo].extra[3]).toFixed()));
    var aText = document.querySelector('#need-items-text');
    (_e = itemData[index].lower) === null || _e === void 0 ? void 0 : _e.forEach(function (e, i) {
        underItem.style.display = '';
        aText.style.display = '';
        underItem.innerHTML += "<div id=\"need-item-".concat(i, "\" class=\"item need itid-").concat(findItem(e).index, "\" style=\"background-image: url(./assets/items/").concat(e, ".png)\">\n        <p class=\"price\">G").concat(findItem(e).body.price, "</p>\n        </div>");
    });
    if (!itemData[index].lower) {
        underItem.style.display = 'none';
        aText.style.display = 'none';
    }
    var lowerItemsSelector = document.querySelectorAll('.need');
    lowerItemsSelector === null || lowerItemsSelector === void 0 ? void 0 : lowerItemsSelector.forEach(function (e) {
        e.addEventListener('click', function () {
            refreshShop(element, parseInt(e.classList[2].split("-")[1]));
        });
    });
}
function getPrice(index) {
    var price = itemData[index].price;
    var lower = __spreadArray([], itemData[index].lower, true);
    players[team].items.forEach(function (e) {
        if (e !== undefined) {
            if (lower.includes(e.name[1])) {
                lower = lower.filter(function (element) { return element !== e.name[1]; });
                price -= e.price;
            }
        }
    });
    return price;
}
function hasItem(name) {
    var ret = false;
    players[team].items.forEach(function (e) {
        if (e !== undefined) {
            if (e.name[1] == name)
                ret = true;
        }
    });
    return ret;
}
function findItem(engName) {
    var ret = { body: undefined, index: undefined };
    itemData.forEach(function (e, i) {
        if (e.name[1] === engName) {
            ret.index = i;
            ret.body = e;
        }
    });
    return ret;
}
function howManyLower(lower) {
    var ret = 0;
    if (!lower)
        return 0;
    var restLower = __spreadArray([], lower, true);
    players[team].items.forEach(function (e) {
        if (restLower.includes(e === null || e === void 0 ? void 0 : e.name[1])) {
            restLower = restLower.filter(function (element) { return element !== e.name[1]; });
            ret += 1;
        }
    });
    return ret;
}
