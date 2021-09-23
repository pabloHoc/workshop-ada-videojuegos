var FACTOR_ESCALADO = 2;

var GRAVEDAD = 1;

function actualizarSprite() {
  switch (jugador.estado) {
    case "DESCANSANDO":
      jugador.spriteActual = jugador.sprites.DESCANSANDO;
      break;
    case "SALTANDO":
      jugador.spriteActual = jugador.sprites.SALTANDO;
      break;
    case "CORRIENDO":
      jugador.spriteActual = jugador.sprites.CORRIENDO;
      break;
  }
}

function actualizarEstado() {
  if (jugador.velocidad.x !== 0) {
    jugador.estado = "CORRIENDO";
  }

  if (jugador.velocidad.y < 0) {
    jugador.estado = "SALTANDO";
  }

  if (jugador.velocidad.x === 0 && jugador.velocidad.y === 0) {
    jugador.estado = "DESCANSANDO";
  }
}

// Bucle Principal de Juego
function ejecutarBucle() {
  // Bucle que se ejecuta muchas veces por segundo

  borrarPantalla();
  actualizarSprite();
  dibujarFondo();
  dibujarNivel();
  dibujarSprite();
  procesarControles();

  aplicarFriccion(jugador);
  // DESPLAZAMIENTO = VELOCIDAD x TIEMPO
  jugador.x += jugador.velocidad.x;

  chequearColisionX(jugador);

  jugador.y += jugador.velocidad.y;

  aplicarGravedad();

  chequearColisionY(jugador);

  limitarVelocidad(jugador);
  actualizarEstado();

  window.requestAnimationFrame(ejecutarBucle);
}

// Requerir cuadro de animación
window.requestAnimationFrame(ejecutarBucle);
