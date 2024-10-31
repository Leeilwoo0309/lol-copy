type GameResult = {
    dmg: {blue: number, red: number},
    onhitCount: {blue: number, red: number},
    char: {blue: string, red: string},
    kda: {blue: [number, number], red: [number, number]},
    team: 'red' | 'blue', result: 'win' | 'lose',
    items: string
}

const params = new URLSearchParams(window.location.search);
const result = params.get('result');
console.log(params.get('game'));
let gameResult: GameResult = JSON.parse(atob(unescape(encodeURIComponent(params.get('game')))));
const resultPar: HTMLParagraphElement = document.querySelector('.header');
const resultPrint: HTMLDivElement = document.querySelector('.result');
const toTitleBtn: HTMLDivElement = document.querySelector('#back');
const charKr = {
    sniper: "케이틀린",
    ezreal: "이즈리얼",
    samira: "사미라",
    vayne: "베인",
    exponent: "엑스포넨트",
    graves: "그레이브즈",
    vampire: "블라디미르",
    aphelios: "아펠리오스",
    ashe: "애쉬",
    kaisa: "카이사"
}

if (result == 'win') {
    console.log('win');
    //  "win", "lose", "items", "dmgs", "projectileHit"
    fetch(`http://kimchi-game.kro.kr:1973/addPlay?data=${ params.get('game') }`).then(r => r.json());
}

if (result == 'win') { resultPar.innerHTML = '결과 - <span style="color: rgb(0, 150, 255)">승리</span>'; };
if (result == 'lose') { resultPar.innerHTML = '결과 - <span style="color: rgb(210, 0, 0)">패배</span>'; };

function addResult(team: 'red' | 'blue') {
    resultPrint.innerHTML += `
    <div class="res">
        <h2><span style="color: ${ team }">[${ team == 'blue' ? "블루" : "레드" }팀] </span>${ charKr[gameResult.char[team]] } ${ gameResult.team == team ? "(승)" : ""}</h2>
        <p><b>킬</b>: ${ gameResult.kda[team][0] } / <b>데스</b>: ${ gameResult.kda[team][1] }</p>
        <p><b>가한 피해량</b>: ${ Math.floor(gameResult.dmg[team == 'red' ? 'blue' : 'red']) }</p>
        <p><b>적중한 투사체</b>: ${ Math.floor(gameResult.onhitCount[team]) }</p>
    </div>
    `;
};

toTitleBtn.addEventListener('click', () => {
    window.location.href = '../public/title.html'
});

document.body.addEventListener('keydown', (e) => {
    e.preventDefault()
})

addResult('blue');
addResult('red');

export {};