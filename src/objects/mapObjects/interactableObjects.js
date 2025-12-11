
export default class InteractableObjects {

    static mapaPuertas = {
        "39,51": [{ x: 15, y: 51 }, { x: 15, y: 52 }],
        "17,51": [{ x: 42, y: 51 }, { x: 42, y: 52 }],
        "41,42": [{ x: 42, y: 51 }, { x: 42, y: 52 }],
        "14,42": [{ x: 46, y: 56 }, { x: 47, y: 56 }],
        "44,57": [{ x: 15, y: 45 }, { x: 15, y: 46 }],
        "11,47": [{ x: 42, y: 45 }, { x: 42, y: 46 }, { x: 47, y: 56 }],
        "41,48": [{ x: 15, y: 45 }, { x: 15, y: 46 }, { x: 13, y: 43}],
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
        //console.log("Percival está sobre una placa", tile);

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
