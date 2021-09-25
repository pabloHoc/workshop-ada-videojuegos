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
var GRAVEDAD = 1;
var FRICCION = 0.6;

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
  var x = puntoACelda(obtenerLadoIzquierdo(actor) - EPSILON);

  for (let y = comienzoCeldaY; y <= finCeldaY; y++) {
    var celda = nivel[y] && nivel[y][x];
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
  var x = puntoACelda(obtenerLadoDerecho(actor));

  for (let y = comienzoCeldaY; y <= finCeldaY; y++) {
    var celda = nivel[y] && nivel[y][x];
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
    var celda = nivel[y] && nivel[y][x];
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
    var celda = nivel[y] && nivel[y][x];
    // Si es sólida
    if (celda !== 0) {
      return true;
    }
  }
  return false;
}

function chequearColisionX(actor) {
  if (actor.estado === "MUERTO") {
    return;
  }

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
  if (actor.estado === "MUERTO") {
    return;
  }

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

function aplicarGravedad(actor) {
  if (actor.puede.caer || actor.estado === "MUERTO") {
    actor.velocidad.y += GRAVEDAD;
  }
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

function aplicarFriccion(actor) {
  // Solo aplicamos fricción en el suelo
  if (!estaColisionandoAbajo(actor)) {
    return;
  }

  // La fricción es una fuerza en la dirección contraria
  if (actor.velocidad.x > 0) {
    actor.velocidad.x -= FRICCION;

    // Esto evita que entre en un loop infinito con el if
    // de abajo y efectivamente reduzca la velocidad a 0
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

function actoresColisionan(actorA, actorB) {
  var hayColisionX =
    obtenerLadoDerecho(actorA) > obtenerLadoIzquierdo(actorB) &&
    obtenerLadoIzquierdo(actorA) < obtenerLadoDerecho(actorB);
  var hayColisionY =
    obtenerLadoInferior(actorA) > obtenerLadoSuperior(actorB) &&
    obtenerLadoSuperior(actorA) < obtenerLadoInferior(actorB);
  return hayColisionX && hayColisionY;
}

function actualizarFisica(actor) {
  aplicarFriccion(actor);
  // DESPLAZAMIENTO = VELOCIDAD x TIEMPO
  actor.x += actor.velocidad.x;

  chequearColisionX(actor);

  actor.y += actor.velocidad.y;

  aplicarGravedad(actor);

  chequearColisionY(actor);

  limitarVelocidad(actor);
}
