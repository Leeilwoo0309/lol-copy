var params = new URLSearchParams(window.location.search);
var result = params.get('result');
console.log(params.get('game'));
var gameResult = JSON.parse(atob(unescape(encodeURIComponent(params.get('game')))));
var resultPar = document.querySelector('.header');
var resultPrint = document.querySelector('.result');
var toTitleBtn = document.querySelector('#back');
var charKr = {
    sniper: "스나이퍼",
    ezreal: "이즈리얼",
    samira: "사미라",
    vayne: "베인",
    exponent: "엑스포넨트",
    graves: "그레이브즈",
    vampire: "블라디미르",
    aphelios: "아펠리오스"
};
if (result == 'win') {
    console.log('win');
    //  "win", "lose", "items", "dmgs", "projectileHit"
    fetch("http://kimchi-game.kro.kr:1973/addPlay?data=".concat(params.get('game'))).then(function (r) { return r.json(); });
}
if (result == 'win') {
    resultPar.innerHTML = '결과 - <span style="color: rgb(0, 150, 255)">승리</span>';
}
;
if (result == 'lose') {
    resultPar.innerHTML = '결과 - <span style="color: rgb(210, 0, 0)">패배</span>';
}
;
function addResult(team) {
    resultPrint.innerHTML += "\n    <div class=\"res\">\n        <h2><span style=\"color: ".concat(team, "\">[").concat(team == 'blue' ? "블루" : "레드", "\uD300] </span>").concat(charKr[gameResult.char[team]], " ").concat(gameResult.team == team ? "(승)" : "", "</h2>\n        <p><b>\uD0AC</b>: ").concat(gameResult.kda[team][0], " / <b>\uB370\uC2A4</b>: ").concat(gameResult.kda[team][1], "</p>\n        <p><b>\uAC00\uD55C \uD53C\uD574\uB7C9</b>: ").concat(Math.floor(gameResult.dmg[team == 'red' ? 'blue' : 'red']), "</p>\n        <p><b>\uC801\uC911\uD55C \uD22C\uC0AC\uCCB4</b>: ").concat(Math.floor(gameResult.onhitCount[team]), "</p>\n    </div>\n    ");
}
;
toTitleBtn.addEventListener('click', function () {
    window.location.href = '../public/title.html';
});
document.body.addEventListener('keydown', function (e) {
    e.preventDefault();
});
addResult('blue');
addResult('red');
export {};
