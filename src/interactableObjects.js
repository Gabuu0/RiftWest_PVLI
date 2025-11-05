
export default class InteractableObjects {

    static mapaPuertas = {
        "9,24": [{ x: 24, y: 24 }, { x: 24, y: 25 }],
        "27,24": [{ x: 7, y: 24 }, { x: 7, y: 25 }],
    };

    static placasActivadas = new Set();

    static abrirPuerta(Puertas, x, y){
        const puerta = Puertas.getTileAt(x, y);
        if (puerta) {
            puerta.setCollision(false, false, false, false);
            puerta.alpha = 0;
        }
    }
    static cerrarPuerta(Puertas, x, y){
        const puerta = Puertas.getTileAt(x, y);
        if (puerta) {
            puerta.setCollision(true, true, true, true);
            puerta.alpha = 1;
        }
    }

    static activarPlaca(scene, jugador, tile) {
        const position = tile.x + ',' + tile.y;

        if (this.placasActivadas.has(position)) return;

        this.placasActivadas.add(position);

        const puertas = this.mapaPuertas[position];
        if (!puertas) return;

        puertas.forEach(pos => {
            this.abrirPuerta(scene.Puertas, pos.x, pos.y);
        });

        scene.time.delayedCall(200, () => {
            puertas.forEach(pos => {
                this.cerrarPuerta(scene.Puertas, pos.x, pos.y);
            });
            this.placasActivadas.delete(position);
        });
    }
}
