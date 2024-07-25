const listDiv: HTMLParagraphElement = document.querySelector('#list');
const shopBtn: HTMLDivElement = document.querySelector('#gold-div');
const exitBtn: HTMLDivElement = document.querySelector('#shop-exit-btn');
const shopWin: HTMLDivElement = document.querySelector('#shop');

let itemInfo: number = undefined;
let isOpen: boolean = false;
let items: NodeListOf<HTMLDivElement>;

function shopOpen() {
    if (!isOpen) {
        listDiv.innerHTML = '';

        itemData.forEach((e, i) => {
            listDiv.innerHTML += `
            <div id="item-selling-${ i }" class="item" style="background-image: url(./assets/items/${ e.name[1] }.png);">
                <p class="price">G${ e.price }</p>
            </div>`
        })

        items = document.querySelectorAll('#list>.item');

        shopWin.style.display = '';
        isOpen = true;

        items.forEach((e, i) => {
            e.addEventListener('click', () => {
                refreshShop(e, i);
            });
        });
    } else {
        shopWin.style.display = 'none';
        isOpen = false;
    }
}

shopBtn.addEventListener('click', () => {
    shopOpen();
});

exitBtn.addEventListener('click', () => {
    shopOpen();
});

shopBtn.addEventListener('mouseenter', () => { game.style.cursor = 'pointer'; });
shopBtn.addEventListener('mouseleave', () => { game.style.cursor = ''; });

function refreshShop(element, index) {
    itemInfo = index;
                
    function findItem(engName: string): {body: Item, index: number} {
        let ret: {body: Item, index: number} = {body: undefined, index: undefined};

        itemData.forEach((e, i) => {
            if (e.name[1] === engName) {
                ret.index = i;
                ret.body = e;
            }
        });

        return ret;
    }

    const resultItem: HTMLDivElement = document.querySelector('#result');
    const underItem: HTMLDivElement = document.querySelector('#need-items');
    const des: HTMLDivElement = document.querySelector('#item-des');
    
    resultItem.style.backgroundImage = `url(./assets/items/${ itemData[index].name[1] }.png)`;
    resultItem.innerHTML = `<p class="price">G${ itemData[index].price }</p>`;
    underItem.innerHTML = '';
    des.innerHTML = '';

    if (itemData[itemInfo].ability.ad) des.innerHTML += `<p>공격력: ${itemData[itemInfo].ability.ad}</p>`;
    if (itemData[itemInfo].ability.health) des.innerHTML += `<p>체력: ${itemData[itemInfo].ability.health}</p>`;
    if (itemData[itemInfo].ability.atkspd) des.innerHTML += `<p>공격 속도: ${itemData[itemInfo].ability.atkspd}%</p>`;
    if (itemData[itemInfo].ability.vamp) des.innerHTML += `<p>모든 피해 흡혈: ${itemData[itemInfo].ability.vamp}%</p>`;
    if (itemData[itemInfo].ability.criticP) des.innerHTML += `<p>치명타 확률: ${itemData[itemInfo].ability.criticP}%</p>`;
    if (itemData[itemInfo].ability.criticD) des.innerHTML += `<p>추가 치명타 피해: ${itemData[itemInfo].ability.criticD}%</p>`;
    if (itemData[itemInfo].ability.moveSpd) des.innerHTML += `<p>이동 속도: ${itemData[itemInfo].ability.moveSpd}</p>`;
    if (itemData[itemInfo].ability.armor) des.innerHTML += `<p>방어력: ${itemData[itemInfo].ability.armor}</p>`;
    if (itemData[itemInfo].ability.healthBoost) des.innerHTML += `<p>체력 회복 속도 증가: ${itemData[itemInfo].ability.healthBoost}%</p>`;
    
    itemData[index].lower?.forEach((e, i) => {
        underItem.innerHTML += `<div id="need-item-${i}" class="item need itid-${ findItem(e).index }" style="background-image: url(./assets/items/${ e }.png)">
            <p class="price">G${ findItem(e).body.price }</p>
        </div>`;
    });

    resultItem.addEventListener('click', () => {
        if (players.ally.gold >= itemData[itemInfo].price && players.ally.items.filter(e => e !== undefined).length < 6) {
            players.ally.gold -= itemData[itemInfo].price;

            if (itemData[itemInfo].ability.ad) players.ally.specItem.ad += itemData[itemInfo].ability.ad;
            if (itemData[itemInfo].ability.atkspd) players.ally.specItem.atkspd += itemData[itemInfo].ability.atkspd;
            if (itemData[itemInfo].ability.moveSpd) players.ally.specItem.moveSpd += itemData[itemInfo].ability.moveSpd;
            if (itemData[itemInfo].ability.armor) players.ally.specItem.armor += itemData[itemInfo].ability.armor;

            for (let i = 0; i < 6; i++) {
                if (players.ally.items[i] == undefined) {
                    players.ally.items[i] = itemData[itemInfo];
                    break;
                }
            }
        }
    });

    const lowerItemsSelector: NodeListOf<HTMLDivElement> = document.querySelectorAll('.need');

    lowerItemsSelector?.forEach(e => {
        e.addEventListener('click', () => {
            refreshShop(element, parseInt(e.classList[2].split("-")[1]));
        })
    })
}