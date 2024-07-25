// 충돌
// if ((keyDown.d) && (keyDown.w) ) {
//     players.ally.selector.style.left = `${ position.x - (players.ally.moveSpd / Math.SQRT2) - players.ally.moveSpd }px`;
//     players.ally.selector.style.top = `${ position.y + (players.ally.moveSpd / Math.SQRT2) + players.ally.moveSpd }px`;
//     absolutePosition.ally.x -= 2 * players.ally.moveSpd / Math.SQRT2;
//     absolutePosition.ally.y -= 2 * players.ally.moveSpd / Math.SQRT2;
//     return;
// } else if ((keyDown.d) && (keyDown.s)) {
//     players.ally.selector.style.left = `${ position.x - (players.ally.moveSpd / Math.SQRT2) - players.ally.moveSpd }px`;
//     players.ally.selector.style.top = `${ position.y - (players.ally.moveSpd / Math.SQRT2) - players.ally.moveSpd }px`;
//     absolutePosition.ally.x -= 2 * players.ally.moveSpd / Math.SQRT2;
//     absolutePosition.ally.y += 2 * players.ally.moveSpd / Math.SQRT2;
//         return;
// } else if ((keyDown.a) && (keyDown.w)) {
//     players.ally.selector.style.left = `${ position.x + (players.ally.moveSpd / Math.SQRT2) + players.ally.moveSpd }px`;
//     players.ally.selector.style.top = `${ position.y + (players.ally.moveSpd / Math.SQRT2) + players.ally.moveSpd }px`;
//     absolutePosition.ally.x += 2 * players.ally.moveSpd / Math.SQRT2;
//     absolutePosition.ally.y -= 2 * players.ally.moveSpd / Math.SQRT2;
//     return;
// } else if ((keyDown.a) && (keyDown.s)) {
//     players.ally.selector.style.left = `${ position.x + (players.ally.moveSpd / Math.SQRT2) + players.ally.moveSpd }px`;
//     players.ally.selector.style.top = `${ position.y - (players.ally.moveSpd / Math.SQRT2) - players.ally.moveSpd }px`;
//     absolutePosition.ally.x += 2 * players.ally.moveSpd / Math.SQRT2;
//     absolutePosition.ally.y += 2 * players.ally.moveSpd / Math.SQRT2;
//     return;
// }
// else if (keyDown.w) {
//     players.ally.selector.style.top = `${ e.position.y + e.size.height + players.ally.moveSpd}px`;
//     absolutePosition.ally.y -= players.ally.moveSpd;
//     return;
// } else if (keyDown.s) {
//     players.ally.selector.style.top = `${ e.position.y - players.ally.size - players.ally.moveSpd}px`;
//     absolutePosition.ally.y += players.ally.moveSpd;
//     return;
// } else if (keyDown.a) {
//     players.ally.selector.style.left = `${ e.position.x + e.size.width + players.ally.moveSpd}px`;
//     absolutePosition.ally.x += players.ally.moveSpd;
//     return;
// } else if (keyDown.d) {
//     players.ally.selector.style.left = `${ e.position.x - players.ally.size - players.ally.moveSpd }px`;
//     absolutePosition.ally.x -= players.ally.moveSpd;
//     return;
// }
// }
