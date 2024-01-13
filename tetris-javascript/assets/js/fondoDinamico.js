let angulo_fondo = Math.random() * 360
let tono_fondo = Math.random() * 360

setInterval(() => {
    document.body.style.background = `linear-gradient( ${angulo_fondo}deg, 
        hsl(${tono_fondo}, 100%, 50%), 
        hsl(${tono_fondo}, 100%, 5%))`
    angulo_fondo = Math.random()
    tono_fondo += Math.random()
}, 20)