class Item {
    public name: [string, string];
    public price: number;
    public ability: Ability;
    public lower: string[]
}

class ItemBuilder {
    private item: Item;

    constructor() {
        this.item = new Item();
    }

    public setName(name: string, imgName: string): ItemBuilder {
        this.item.name = [name, imgName];
        return this;
    }

    public setPrice(price: number): ItemBuilder {
        this.item.price = price;
        return this;
    }

    public setAbility(ability: Ability): ItemBuilder {
        this.item.ability = ability;
        return this;
    }

    public setLower(lowGradeItems: string[]): ItemBuilder {
        this.item.lower = lowGradeItems;
        return this;
    }

    public build() {
        return this.item;
    }
}