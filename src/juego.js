var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
// Necesario para que no se vea mal al escalar los sprites
ctx.imageSmoothingEnabled = false;

var sprite = new Image();
sprite.src = "recursos/Main Characters/Ninja Frog/Idle (32x32).png";

var FACTOR_ESCALADO = 2;

var cuadroActual = 0; //1

function borrarPantalla() {
  // borrar cuadrado
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function dibujarSprite() {
  var anchoCuadro = 32;
  var altoCuadro = 32;

  // Calculamos la cantidad de cuadros
  // de la animación dividiendo el ancho total por el ancho de un cuadro
  var cuadros = sprite.width / anchoCuadro;

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
    ctx.translate(-anchoCuadro * FACTOR_ESCALADO, 0);
  }

  ctx.drawImage(
    sprite,
    cuadroActual * anchoCuadro, // pos x de la imagen
    0, // pos y de la imagen
    anchoCuadro, // ancho de la imagen
    altoCuadro, // alto de la imagen
    jugador.direccion * jugador.x, // pos x del canvas
    0, // pos y del canvas
    anchoCuadro * FACTOR_ESCALADO, // ancho del canvas
    altoCuadro * FACTOR_ESCALADO // alto del canvas
  );

  ctx.restore();

  // Pasamos al siguiente cuadro
  cuadroActual++;

  // Reseteamos animación
  if (cuadroActual >= cuadros) {
    cuadroActual = 0;
  }
}

// Bucle Principal de Juego
function ejecutarBucle() {
  // Bucle que se ejecuta muchas veces por segundo

  borrarPantalla();
  dibujarSprite();
  procesarControles();

  window.requestAnimationFrame(ejecutarBucle);
}

// Requerir cuadro de animación
window.requestAnimationFrame(ejecutarBucle);
