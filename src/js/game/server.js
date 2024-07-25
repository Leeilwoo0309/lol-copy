socket.onopen = function () {
    socket.send('{}');
    socket.onmessage = function (event) {
        var blob = event.data;
        var reader = new FileReader();
        reader.onload = function () {
            //@ts-ignore
            var sentJson = JSON.parse(reader.result);
            if (sentJson.body) {
                absolutePosition.enemy = sentJson.body.pos;
                projectiles.e = sentJson.body.projectiles;
                sentJson.body.projectiles.forEach(function (e) {
                    if (e.isArrive && !e.isSent)
                        new ProjectileBuilder()
                            .setDegree(e.angle)
                            .setPos(e.absPos.x, e.absPos.y)
                            .setDamage(e.damage)
                            .setReach(e.reach)
                            .setSpeed(e.speed)
                            .build('enemy');
                });
                players.enemy.hp = sentJson.body.hp;
            }
        };
        reader.readAsText(blob);
    };
};
