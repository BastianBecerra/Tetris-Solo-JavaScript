const Margen_Tablero = 10

let lineas_hechas = 0

function setup() {

    createCanvas(900,600)

    tablero = new Tablero()

    crearMapeoBaseTetriminos()

    tetrimino = new Tetrimino()

    resizeCanvas(
        tablero.ancho + 2 * Margen_Tablero,
        tablero.alto + 2 * Margen_Tablero + tablero.lado_celda
    )
}

function draw() {
    clear()
    dibujarPuntaje()
    tablero.dibujar()
    tetrimino.dibujar()
    keyEventsTetris()
}

function dibujarPuntaje() {
    push()
    textSize(20)
    strokeWeight(3)
    stroke("black")
    fill("white")
    text("Lineas: " + lineas_hechas, tablero.posicion.x, tablero.posicion.y - tablero.lado_celda /2)
    pop()
}

let limite_regulador_velocidad_teclas = 100
function keyEventsTetris() {
    if (millis() - regulador_velocidad_teclas < limite_regulador_velocidad_teclas){
        return
    }

    limite_regulador_velocidad_teclas
    regulador_velocidad_teclas = millis()

    if (keyIsDown(RIGHT_ARROW)) {
        tetrimino.moverDerecha()
        regulador_de_caida = millis()
    }
    if (keyIsDown(LEFT_ARROW)) {
        tetrimino.moverIzquierda()
        regulador_de_caida = millis()
    }
    
    if (keyIsDown(DOWN_ARROW)) {
        tetrimino.moverAbajo()
        regulador_de_caida = millis()
    }

    if (keyIsDown(UP_ARROW)) {
        limite_regulador_velocidad_teclas = 150
        tetrimino.girar()
        regulador_de_caida = millis()
    }

    if (keyIsDown(32)) {
        limite_regulador_velocidad_teclas = 200
        tetrimino.ponerEnElFondo()
        regulador_de_caida = millis()
    }
}

class Tablero{
    constructor(){
        this.columnas = 10
        this.filas = 20
        this.lado_celda = 25
        this.ancho = this.columnas * this.lado_celda
        this.alto = this.filas * this.lado_celda
        this.posicion = createVector(Margen_Tablero, Margen_Tablero + this.lado_celda);
        /* Memoria es la variable que se encarga de representar los minos almacenados*/
        this.minosAlmacenados = [];
            for (let fila = 0; fila < this.filas; fila++) {
                this.minosAlmacenados[fila] = [];
            for (let columna = 0; columna < this.columnas; columna++) {
                this.minosAlmacenados[fila].push("");
                }
            }
    }

    set almacenarMino(tetrimino) {
        for (const pmino of tetrimino.mapaTablero){
            if (pmino.y < 0) {
                // Juego terminado
                tablero = new Tablero()
                tetrimino = new Tetrimino()
                lineas_hechas = 0
            }
            this.minosAlmacenados[pmino.x][pmino.y] = tetrimino.nombre;
        }

        this.buscarLineasHorizontalesParaBorrar()
    }

    buscarLineasHorizontalesParaBorrar() {
        let lineas = [];
        for (let fila = this.filas; fila >=0; fila--){
            let agregar = true
            for (let columna = 0; columna < this.columnas; columna++){
                if (!this.minosAlmacenados[columna][fila]) {
                    agregar = false
                    break
                }
            }
            if (agregar) {
                lineas.push (fila)
            }
        }
        this.borrarLineasHorizontales(lineas)
    }

    borrarLineasHorizontales(Lineas) {
        for (const linea of Lineas) {
            for (let fila = linea; fila > 0; fila--) {
                for (let columna = 0; columna < this.columnas; columna++) {
                    this.minosAlmacenados[columna][fila] = this.minosAlmacenados[columna][fila - 1];
                }
            }
            // Limpiar la fila superior
            for (let columna = 0; columna < this.columnas; columna++) {
                this.minosAlmacenados[columna][0] = "";
            }
        }
        lineas_hechas += Lineas.length;
    }


    coordenada(x, y){
        return createVector(x, y).mult(this.lado_celda).add(this.posicion)
    }

    /*Esto se encarga del procesamiento logico para el dibujo de este elemento*/
    dibujar(){
        push()
        noStroke()
        for (let columna = 0; columna < this.columnas;  columna++){
            for (let fila = 0; fila < this.filas; fila++)   {
                if (
                    (columna + fila)%2 === 0){
                        fill("black")
                    } else{
                        fill("#003")
                    }
                let c = this.coordenada(columna, fila)
                rect(c.x, c.y, this.lado_celda)
            }
        }
        pop()
        this.dibujarMinosAlmacenados()
    }

    dibujarMinosAlmacenados(){
        push()
        for (let columna = 0; columna < this.columnas; columna++) {
            for (let fila = 0; fila < this.filas; fila++) {
                let nombreMino = this.minosAlmacenados[columna][fila]
                if(nombreMino){
                    fill(tetriminosBase[nombreMino].color)
                    Tetrimino.dibujarMino(this.coordenada(columna, fila));
                }
            }
        }
        pop()
    }

}