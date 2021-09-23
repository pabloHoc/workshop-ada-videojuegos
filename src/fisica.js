/**
 * Si está cayendo (moviéndose hacia abajo)
 * - obtener las celda inferior izquierda e inferior derecha
 * - iterar sobre las intermedias entre ambas
 * - si existe alguna celda sólida en ellas
 * - tenemos una colisión
 *  - si hay una colisión
 *  - movemos el personaje de forma tal que quede parado sobre la celda
 *
 */

// jugador, monstruo, item, cofre, trampa -> actores (posicion, y se dibujan en pantalla)
// entidades
// gameObject -> objetos de juego

var EPSILON = 0.000001;

function celdaAPunto(celda) {
  return celda * DIMENSION_CELDA * FACTOR_ESCALADO;
}

function puntoACelda(punto) {
  return Math.floor(punto / (DIMENSION_CELDA * FACTOR_ESCALADO)); // 32
}

function moviendoHaciaIzquierda(actor) {
  return actor.velocidad.x < 0;
}

function moviendoHaciaDerecha(actor) {
  return actor.velocidad.x > 0;
}

function moviendoHaciaAbajo(actor) {
  return actor.velocidad.y > 0;
}

function moviendoHaciaArriba(actor) {
  return actor.velocidad.y < 0;
}

function obtenerLadoIzquierdo(actor) {
  return actor.x;
}

function obtenerLadoDerecho(actor) {
  return actor.x + actor.spriteActual.anchoCuadro * FACTOR_ESCALADO;
}

function obtenerLadoSuperior(actor) {
  return actor.y;
}

function obtenerLadoInferior(actor) {
  return actor.y + actor.spriteActual.altoCuadro * FACTOR_ESCALADO;
}

function estaColisionandoIzquierda(actor) {
  var comienzoCeldaY = puntoACelda(obtenerLadoSuperior(actor)); // 4
  var finCeldaY = puntoACelda(obtenerLadoInferior(actor)) - 1; // 6
  var x = puntoACelda(obtenerLadoIzquierdo(actor));

  for (let y = comienzoCeldaY; y <= finCeldaY; y++) {
    var celda = nivel[y][x];
    // Si es sólida
    if (celda !== 0) {
      return true;
    }
  }
  return false;
}

function estaColisionandoDerecha(actor) {
  var comienzoCeldaY = puntoACelda(obtenerLadoSuperior(actor)); // 4
  var finCeldaY = puntoACelda(obtenerLadoInferior(actor)) - 1; // 6
  var x = puntoACelda(obtenerLadoDerecho(actor) - EPSILON);

  for (let y = comienzoCeldaY; y <= finCeldaY; y++) {
    var celda = nivel[y][x];
    // Si es sólida
    if (celda !== 0) {
      return true;
    }
  }
  return false;
}

function estaColisionandoAbajo(actor) {
  var comienzoCeldaX = puntoACelda(obtenerLadoIzquierdo(actor)); // 4
  var finCeldaX = puntoACelda(obtenerLadoDerecho(actor) - EPSILON); // 6
  var y = puntoACelda(obtenerLadoInferior(actor));

  for (let x = comienzoCeldaX; x <= finCeldaX; x++) {
    var celda = nivel[y][x];
    // Si es sólida
    if (celda !== 0) {
      return true;
    }
  }
  return false;
}

function estaColisionandoArriba(actor) {
  var comienzoCeldaX = puntoACelda(obtenerLadoIzquierdo(actor)); // 4
  var finCeldaX = puntoACelda(obtenerLadoDerecho(actor) - EPSILON); // 6
  var y = puntoACelda(obtenerLadoSuperior(actor));

  for (let x = comienzoCeldaX; x <= finCeldaX; x++) {
    var celda = nivel[y][x];
    // Si es sólida
    if (celda !== 0) {
      return true;
    }
  }
  return false;
}

function chequearColisionX(actor) {
  if (moviendoHaciaIzquierda(actor) && estaColisionandoIzquierda(actor)) {
    actor.x =
      celdaAPunto(puntoACelda(obtenerLadoIzquierdo(actor))) +
      DIMENSION_CELDA * FACTOR_ESCALADO;
    actor.velocidad.x = 0;
  }

  if (moviendoHaciaDerecha(actor) && estaColisionandoDerecha(actor)) {
    actor.x =
      celdaAPunto(puntoACelda(obtenerLadoDerecho(actor))) -
      actor.spriteActual.anchoCuadro * FACTOR_ESCALADO;
    actor.velocidad.x = 0;
  }
}

function chequearColisionY(actor) {
  if (moviendoHaciaAbajo(actor) && estaColisionandoAbajo(actor)) {
    actor.y =
      celdaAPunto(puntoACelda(obtenerLadoInferior(actor))) -
      actor.spriteActual.altoCuadro * FACTOR_ESCALADO;
    actor.puede.saltar = true;
    actor.velocidad.y = 0;
  }

  if (moviendoHaciaArriba(actor) && estaColisionandoArriba(actor)) {
    actor.y =
      celdaAPunto(puntoACelda(obtenerLadoSuperior(actor))) +
      DIMENSION_CELDA * FACTOR_ESCALADO;
    actor.velocidad.y = 0;
  }
}

function aplicarGravedad() {
  jugador.velocidad.y += GRAVEDAD;
}

var VELOCIDAD_MAXIMA_X = 5;
var VELOCIDAD_MAXIMA_Y = 20;

function limitarVelocidad(actor) {
  if (actor.velocidad.x > VELOCIDAD_MAXIMA_X) {
    actor.velocidad.x = VELOCIDAD_MAXIMA_X;
  }
  if (actor.velocidad.x < -VELOCIDAD_MAXIMA_X) {
    actor.velocidad.x = -VELOCIDAD_MAXIMA_X;
  }
  if (actor.velocidad.y > VELOCIDAD_MAXIMA_Y) {
    actor.velocidad.y = VELOCIDAD_MAXIMA_Y;
  }
  if (actor.velocidad.y < -VELOCIDAD_MAXIMA_Y) {
    actor.velocidad.y = -VELOCIDAD_MAXIMA_Y;
  }
}

var FRICCION = 0.6;

function aplicarFriccion(actor) {
  if (!estaColisionandoAbajo(actor)) {
    return;
  }

  if (actor.velocidad.x > 0) {
    actor.velocidad.x -= FRICCION;

    if (actor.velocidad.x < 0) {
      actor.velocidad.x = 0;
    }
  }

  if (actor.velocidad.x < 0) {
    actor.velocidad.x += FRICCION;

    if (actor.velocidad.x > 0) {
      actor.velocidad.x = 0;
    }
  }
}
