var FACTOR_ESCALADO = 2;

function actualizarSprite(actor) {
  var spritePrevio = actor.spriteActual;

  switch (actor.estado) {
    case "DESCANSANDO":
      actor.spriteActual = actor.sprites.DESCANSANDO;
      break;
    case "SALTANDO":
      actor.spriteActual = actor.sprites.SALTANDO;
      break;
    case "CORRIENDO":
      actor.spriteActual = actor.sprites.CORRIENDO;
      break;
    case "MUERTO":
      actor.spriteActual = actor.sprites.MUERTO;
      break;
  }

  // Resetear el cuadro si cambiamos de sprite
  if (spritePrevio !== actor.spriteActual) {
    actor.cuadroActual = 0;
  }
}

function actualizarEstado(actor) {
  if (actor.estado === "MUERTO") {
    return;
  }

  if (actor.velocidad.x !== 0) {
    actor.estado = "CORRIENDO";
  }

  if (actor.velocidad.y < 0) {
    actor.estado = "SALTANDO";
  }

  if (actor.velocidad.x === 0 && actor.velocidad.y === 0) {
    actor.estado = "DESCANSANDO";
  }
}

// Bucle Principal de Juego
function ejecutarBucle() {
  // Bucle que se ejecuta muchas veces por segundo

  actualizarPantalla();
  procesarControles();

  actualizarHongo();

  actualizarFisica(jugador);
  actualizarFisica(hongo);

  if (jugador.estado !== "MUERTO" && hongo.estado !== "MUERTO") {
    if (actoresColisionan(jugador, hongo)) {
      if (moviendoHaciaAbajo(jugador)) {
        hongo.velocidad.y = -15;
        hongo.estado = "MUERTO";
      } else {
        jugador.estado = "MUERTO";
        jugador.velocidad.y = -15;
      }
    }
  }

  actualizarEstado(jugador);
  actualizarEstado(hongo);

  actualizarSprite(jugador);
  actualizarSprite(hongo);

  window.requestAnimationFrame(ejecutarBucle);
}

// Requerir cuadro de animación
window.requestAnimationFrame(ejecutarBucle);
