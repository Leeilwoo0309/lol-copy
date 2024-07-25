var Item = /** @class */ (function () {
    function Item() {
    }
    return Item;
}());
var ItemBuilder = /** @class */ (function () {
    function ItemBuilder() {
        this.item = new Item();
    }
    ItemBuilder.prototype.setName = function (name, imgName) {
        this.item.name = [name, imgName];
        return this;
    };
    ItemBuilder.prototype.setPrice = function (price) {
        this.item.price = price;
        return this;
    };
    ItemBuilder.prototype.setAbility = function (ability) {
        this.item.ability = ability;
        return this;
    };
    ItemBuilder.prototype.setLower = function (lowGradeItems) {
        this.item.lower = lowGradeItems;
        return this;
    };
    ItemBuilder.prototype.build = function () {
        return this.item;
    };
    return ItemBuilder;
}());
