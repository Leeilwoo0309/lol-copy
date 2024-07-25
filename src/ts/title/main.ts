const charsBtn: NodeListOf<HTMLDivElement> = document.querySelectorAll('.char-btn');
const selectedP: HTMLParagraphElement = document.querySelector('.selected-display');
const des: HTMLParagraphElement = document.querySelector('.description');
const socket = new WebSocket("ws://localhost:8001");

let selected: {ally: number, enemy: number} = {ally: undefined, enemy: undefined};
let chars: CharData;
let charName: string[] = ['teacher', 'sniper'];

async function getCharInfo(name: string) {
    chars = await fetch(`http://localhost:1973/getChar?char=${ name }`)
        .then(r => r.json())
        .then(result => result.body)
        .catch(err => console.log(err));
    
    updateSelected();
};

charsBtn.forEach((e, i) => {
    e.addEventListener('click', () => {
        selected.ally = i;

        document.querySelector('.selected')?.classList.remove('selected');
        e.classList.add('selected');

        getCharInfo(charName[selected.ally]);
        

        socket.send(JSON.stringify({body: {selection: i}}));
    });
});

socket.onopen = () => {
    socket.send('{}')
    socket.onmessage = (event) => {
        const blob = event.data;

        const reader = new FileReader();
        reader.onload = function() {
            //@ts-ignore
            const sentJson: {body: {selection: number}} = JSON.parse(reader.result);

            if (sentJson.body) {
                if (sentJson.body.selection !== undefined) {
                    selected.enemy = sentJson.body.selection;
                    updateSelected();
                }


            }
        };

        reader.readAsText(blob);
    };
}

function updateSelected() {
    des.innerHTML = `
            <h2>${ chars.name }</h2>
            <hr />
            <p>체력: ${ chars.defaultSpec.health }</p>
            <p>체력 재생: ${ chars.defaultSpec.healthBoost }</p>
            <p>공격력: ${ chars.defaultSpec.ad }</p>
            <p>공격 속도: ${ chars.defaultSpec.atkspd }</p>
            <p>방어력: ${ chars.defaultSpec.armor }</p>
            <p>사거리: ${ chars.defaultSpec.range }</p>
            <p>이동 속도: ${ chars.defaultSpec.moveSpd }</p>
            <p><b>스킬 Q</b> - ${ chars.des.Q } </p>
            <p><b>스킬 E</b> - ${ chars.des.E } </p>
            <p><b>스킬 C</b> - ${ chars.des.LShift } </p>
            <p><b>스킬 X (궁극기)</b> - ${ chars.des.Wheel } </p>
    `
    selectedP.innerHTML = `<b>${ selected.ally ?? "정하지 않음" } (나)</b> vs <span>${ selected.enemy ??  "정하지 않음" } (상대)</span>`
}

export {};