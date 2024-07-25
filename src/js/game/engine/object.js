var GameObject = /** @class */ (function () {
    function GameObject() {
        this.position = { x: 0, y: 0 };
        this.style = { color: 'rgb(80, 80, 80)' };
        this.INIT = { position: { x: 0, y: 0 }, size: { height: 0, width: 0 } };
        this.event = { onclick: undefined };
    }
    GameObject.prototype.isCollide = function (subjectDiv) {
        var rect1 = subjectDiv.getBoundingClientRect();
        var rect2 = this.objSelector.getBoundingClientRect();
        return !(rect1.right < rect2.left ||
            rect1.left > rect2.right ||
            rect1.bottom < rect2.top ||
            rect1.top > rect2.bottom);
    };
    GameObject.prototype.onClick = function (callback) {
        this.event.onclick = callback;
        this.objSelector.addEventListener('click', function () { callback(); });
        this.objSelector.addEventListener('mouseenter', function () { game.style.cursor = 'pointer'; });
        this.objSelector.addEventListener('mouseleave', function () { game.style.cursor = ''; });
        return this;
    };
    GameObject.prototype.start = function () {
        var _this = this;
        this.INIT = { position: this.position, size: this.size };
        setInterval(function () {
            _this.update();
        }, 16);
        if (this.event.onclick)
            this.onClick(this.event.onclick);
    };
    GameObject.prototype.update = function () {
        this.objSelector.style.left = "".concat(this.position.x, "px");
        this.objSelector.style.top = "".concat(this.position.y, "px");
    };
    return GameObject;
}());
var GameObjectBuilder = /** @class */ (function () {
    function GameObjectBuilder() {
        this.obj = new GameObject();
    }
    GameObjectBuilder.prototype.setPosition = function (x, y) {
        this.obj.position = { x: x, y: y };
        this.obj.INIT.position = { x: x, y: y };
        return this;
    };
    GameObjectBuilder.prototype.setSize = function (width, height) {
        this.obj.size = { width: width, height: height };
        this.obj.INIT.size = { width: width, height: height };
        return this;
    };
    GameObjectBuilder.prototype.setColor = function (color) {
        this.obj.style.color = color;
        return this;
    };
    GameObjectBuilder.prototype.build = function () {
        var game = document.querySelector('main');
        var object = document.createElement('div');
        object.style.width = "".concat(this.obj.size.width, "px");
        object.style.height = "".concat(this.obj.size.height, "px");
        object.style.left = "".concat(this.obj.position.x, "px");
        object.style.top = "".concat(this.obj.position.y, "px");
        object.style.backgroundColor = this.obj.style.color;
        object.style.position = 'absolute';
        this.obj.objSelector = object;
        game.appendChild(object);
        this.obj.start();
        return this.obj;
    };
    return GameObjectBuilder;
}());
