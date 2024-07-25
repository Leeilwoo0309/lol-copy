class GameObject {
    public position: ObjPosition = {x: 0, y: 0};
    public size: ObjSize;
    public style: {color: string} = {color: 'rgb(80, 80, 80)'};
    public objSelector: HTMLDivElement;
    public INIT: {position: ObjPosition, size: ObjSize} = {position: {x: 0, y: 0}, size: {height: 0, width: 0}};
    public event = {onclick: undefined};

    public isCollide(subjectDiv: HTMLDivElement): boolean {
        const rect1 = subjectDiv.getBoundingClientRect();
        const rect2 = this.objSelector.getBoundingClientRect();

        return !(
            rect1.right < rect2.left ||
            rect1.left > rect2.right ||
            rect1.bottom < rect2.top ||
            rect1.top > rect2.bottom
        );
    }

    public onClick(callback: () => void) {
        this.event.onclick = callback;

        this.objSelector.addEventListener('click', () => { callback() });
        this.objSelector.addEventListener('mouseenter', () => { game.style.cursor = 'pointer'; });
        this.objSelector.addEventListener('mouseleave', () => { game.style.cursor = ''; });

        return this;
    }

    public start() {
        this.INIT = {position: this.position, size: this.size}

        setInterval(() => {
            this.update();
        }, 16);

        if (this.event.onclick) this.onClick(this.event.onclick);
    }

    private update() {
        this.objSelector.style.left = `${ this.position.x }px`;
        this.objSelector.style.top = `${ this.position.y }px`;
    }
}

class GameObjectBuilder {
    private obj: GameObject;

    constructor() {
        this.obj = new GameObject();
    }

    public setPosition(x: number, y: number): GameObjectBuilder {
        this.obj.position = {x: x, y: y};
        this.obj.INIT.position = {x: x, y: y};
        
        return this;
    }

    public setSize(width: number, height: number): GameObjectBuilder {
        this.obj.size = {width: width, height: height};
        this.obj.INIT.size = {width: width, height: height};

        return this;
    }

    public setColor(color: string): GameObjectBuilder {
        this.obj.style.color = color;
        
        return this;
    }

    public build(): GameObject {
        const game: HTMLElement = document.querySelector('main');
        const object: HTMLDivElement = document.createElement('div');
        
        object.style.width = `${ this.obj.size.width }px`;
        object.style.height = `${ this.obj.size.height }px`;
        object.style.left = `${ this.obj.position.x }px`;
        object.style.top = `${ this.obj.position.y }px`;
        
        object.style.backgroundColor = this.obj.style.color;
        object.style.position = 'absolute';

        this.obj.objSelector = object;

        game.appendChild(object);
        this.obj.start();

        return this.obj
    }
}