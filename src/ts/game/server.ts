socket.onopen = () => {
    socket.send('{}')
    socket.onmessage = (event) => {
        const blob = event.data;

        const reader = new FileReader();
        reader.onload = function() {
            //@ts-ignore
            const sentJson: {body: {pos: Position, projectiles: Projectile[], hp: [number, number]}} = JSON.parse(reader.result);

            if (sentJson.body) {
                absolutePosition.enemy = sentJson.body.pos;
                projectiles.e = sentJson.body.projectiles;

                sentJson.body.projectiles.forEach((e) => {
                    if (e.isArrive && !e.isSent) new ProjectileBuilder()
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
}