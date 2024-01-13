let regulador_velocidad_teclas = 0
let regulador_de_caida = 0

setInterval(() => {
    if (millis() - regulador_de_caida < 200 ) {
        return
    }
    regulador_de_caida = millis()
    tetrimino.moverAbajo()
}, 500)