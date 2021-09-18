var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
// Necesario para que no se vea mal al escalar los sprites
ctx.imageSmoothingEnabled = false;

function crearSprite(ruta, anchoCuadro, altoCuadro) {
  var sprite = new Image();
  sprite.src = ruta;

  return {
    sprite,
    anchoCuadro,
    altoCuadro,
  };
}

function borrarPantalla() {
  // borrar cuadrado
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function dibujarSprite() {
  // Calculamos la cantidad de cuadros
  // de la animación dividiendo el ancho total por el ancho de un cuadro
  var cuadros =
    jugador.spriteActual.sprite.width / jugador.spriteActual.anchoCuadro;

  ctx.save();
  // eje x, eje y
  ctx.scale(jugador.direccion, 1);

  /**
   *  Cuando el jugador mira hacia la izquierda
   *  El canvas se invierte sobre el eje X (lo positivo pasa a ser negativo)
   *  Y el punto de origen del sprite
   *  Pasa a ser del superior izquierdo al superior derecho
   *  Por lo tanto para que el sprite quede en el mismo lugar
   *  Necesitamos moverlo hacia atrás (derecha) el ancho del sprite
   * */
  if (jugador.direccion === -1) {
    ctx.translate(-jugador.spriteActual.anchoCuadro * FACTOR_ESCALADO, 0);
  }

  ctx.drawImage(
    jugador.spriteActual.sprite,
    jugador.cuadroActual * jugador.spriteActual.anchoCuadro, // pos x de la imagen
    0, // pos y de la imagen
    jugador.spriteActual.anchoCuadro, // ancho de la imagen
    jugador.spriteActual.altoCuadro, // alto de la imagen
    jugador.direccion * jugador.x, // pos x del canvas
    jugador.y, // pos y del canvas
    jugador.spriteActual.anchoCuadro * FACTOR_ESCALADO, // ancho del canvas
    jugador.spriteActual.altoCuadro * FACTOR_ESCALADO // alto del canvas
  );

  ctx.restore();

  // Pasamos al siguiente cuadro
  jugador.cuadroActual++;

  // Reseteamos animación
  if (jugador.cuadroActual >= cuadros) {
    jugador.cuadroActual = 0;
  }
}

var fondo = crearSprite("recursos/Background/Purple.png", 64, 64);
var terreno = crearSprite("recursos/Terrain/Terrain (16x16).png", 16, 16);

function dibujarFondo() {
  for (let i = 0; i < canvas.width / 64; i++) {
    for (let j = 0; j < canvas.height / 64; j++) {
      ctx.drawImage(fondo.sprite, i * 64, j * 64);
    }
  }
}

function dibujarNivel() {
  var DIMENSION_CELDA = 16;
  var ESCALA_CELDA = 2;
  ctx.fillStyle = "black";

  for (let i = 0; i < nivel.length; i++) {
    for (let j = 0; j < nivel[i].length; j++) {
      if (nivel[i][j] !== 0) {
        var celda = nivel[i][j] - 1;
        var columnas = terreno.sprite.width / DIMENSION_CELDA;
        // var filas = terreno.sprite.height / DIMENSION_CELDA
        // 2, 34, 45, 1, 10

        ctx.drawImage(
          terreno.sprite,
          DIMENSION_CELDA * Math.floor(celda % columnas), // pos x del sprite -> columna en la que esta
          DIMENSION_CELDA * Math.floor(celda / columnas), // pos y del sprite -> fila en la que esta
          DIMENSION_CELDA,
          DIMENSION_CELDA,
          j * DIMENSION_CELDA * ESCALA_CELDA,
          i * DIMENSION_CELDA * ESCALA_CELDA,
          DIMENSION_CELDA * ESCALA_CELDA,
          DIMENSION_CELDA * ESCALA_CELDA
        );
      }
    }
  }
}
