var listDiv = document.querySelector('#list');
var shopBtn = document.querySelector('#gold-div');
var exitBtn = document.querySelector('#shop-exit-btn');
var shopWin = document.querySelector('#shop');
var itemInfo = undefined;
var isOpen = false;
var items;
function shopOpen() {
    if (!isOpen) {
        listDiv.innerHTML = '';
        itemData.forEach(function (e, i) {
            listDiv.innerHTML += "\n            <div id=\"item-selling-".concat(i, "\" class=\"item\" style=\"background-image: url(./assets/items/").concat(e.name[1], ".png);\">\n                <p class=\"price\">G").concat(e.price, "</p>\n            </div>");
        });
        items = document.querySelectorAll('#list>.item');
        shopWin.style.display = '';
        isOpen = true;
        items.forEach(function (e, i) {
            e.addEventListener('click', function () {
                refreshShop(e, i);
            });
        });
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
    var _a;
    itemInfo = index;
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
    var resultItem = document.querySelector('#result');
    var underItem = document.querySelector('#need-items');
    var des = document.querySelector('#item-des');
    resultItem.style.backgroundImage = "url(./assets/items/".concat(itemData[index].name[1], ".png)");
    resultItem.innerHTML = "<p class=\"price\">G".concat(itemData[index].price, "</p>");
    underItem.innerHTML = '';
    des.innerHTML = '';
    if (itemData[itemInfo].ability.ad)
        des.innerHTML += "<p>\uACF5\uACA9\uB825: ".concat(itemData[itemInfo].ability.ad, "</p>");
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
    if (itemData[itemInfo].ability.armor)
        des.innerHTML += "<p>\uBC29\uC5B4\uB825: ".concat(itemData[itemInfo].ability.armor, "</p>");
    if (itemData[itemInfo].ability.healthBoost)
        des.innerHTML += "<p>\uCCB4\uB825 \uD68C\uBCF5 \uC18D\uB3C4 \uC99D\uAC00: ".concat(itemData[itemInfo].ability.healthBoost, "%</p>");
    (_a = itemData[index].lower) === null || _a === void 0 ? void 0 : _a.forEach(function (e, i) {
        underItem.innerHTML += "<div id=\"need-item-".concat(i, "\" class=\"item need itid-").concat(findItem(e).index, "\" style=\"background-image: url(./assets/items/").concat(e, ".png)\">\n            <p class=\"price\">G").concat(findItem(e).body.price, "</p>\n        </div>");
    });
    resultItem.addEventListener('click', function () {
        if (players.ally.gold >= itemData[itemInfo].price && players.ally.items.filter(function (e) { return e !== undefined; }).length < 6) {
            players.ally.gold -= itemData[itemInfo].price;
            if (itemData[itemInfo].ability.ad)
                players.ally.specItem.ad += itemData[itemInfo].ability.ad;
            if (itemData[itemInfo].ability.atkspd)
                players.ally.specItem.atkspd += itemData[itemInfo].ability.atkspd;
            if (itemData[itemInfo].ability.moveSpd)
                players.ally.specItem.moveSpd += itemData[itemInfo].ability.moveSpd;
            if (itemData[itemInfo].ability.armor)
                players.ally.specItem.armor += itemData[itemInfo].ability.armor;
            for (var i = 0; i < 6; i++) {
                if (players.ally.items[i] == undefined) {
                    players.ally.items[i] = itemData[itemInfo];
                    break;
                }
            }
        }
    });
    var lowerItemsSelector = document.querySelectorAll('.need');
    lowerItemsSelector === null || lowerItemsSelector === void 0 ? void 0 : lowerItemsSelector.forEach(function (e) {
        e.addEventListener('click', function () {
            refreshShop(element, parseInt(e.classList[2].split("-")[1]));
        });
    });
}
