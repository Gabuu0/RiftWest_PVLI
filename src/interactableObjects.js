export default class InteractableObjects {

    static mapaPuertas = {
        "13,9": [{ x: 14, y: 10 }, { x: 15, y: 10 }],
        "16,18": [{ x: 14, y: 19 }, { x: 15, y: 19 }],
        "18,15": [{ x: 20, y: 15 }, { x: 20, y: 14 }],
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

        scene.time.delayedCall(5000, () => {
            puertas.forEach(pos => {
                this.cerrarPuerta(scene.Puertas, pos.x, pos.y);
            });
            this.placasActivadas.delete(position);
        });
    }
}
