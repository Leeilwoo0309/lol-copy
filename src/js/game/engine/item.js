var Item = /** @class */ (function () {
    function Item() {
        this.grade = 'undefined';
        this.cooldown = 0;
    }
    Item.prototype.start = function () {
        if (this.passive)
            this.passive();
    };
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
    ItemBuilder.prototype.setGrade = function (grade) {
        this.item.grade = grade;
        return this;
    };
    ItemBuilder.prototype.setPassive = function (passive) {
        this.item.passive = passive;
        return this;
    };
    ItemBuilder.prototype.setCooldown = function (time) {
        this.item.cooldown = time;
        return this;
    };
    ItemBuilder.prototype.setExtra = function (ex) {
        this.item.extra = ex;
        return this;
    };
    ItemBuilder.prototype.setDescription = function (des) {
        this.item.des = des;
        return this;
    };
    ItemBuilder.prototype.build = function () {
        return this.item;
    };
    return ItemBuilder;
}());
