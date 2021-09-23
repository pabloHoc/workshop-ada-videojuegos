var Tecla = {
  Derecha: false,
  Izquierda: false,
  Salto: false,
};

function procesarControles() {
  if (Tecla.Derecha) {
    moverJugadorDerecha();
  } else if (Tecla.Izquierda) {
    moverJugadorIzquierda();
  }

  if (Tecla.Salto) {
    saltarJugador();
  }
}

// TAREA: Refactorizar el código repetido de abajo en una sola función

// Cuando se aprieta una tecla
document.addEventListener("keydown", function (evento) {
  // Chequeamos que tecla se aprieta y la guardamos
  switch (evento.code) {
    case "KeyA":
      Tecla.Izquierda = true;
      break;
    case "KeyW":
      Tecla.Salto = true;
      break;
    case "KeyD":
      Tecla.Derecha = true;
      break;
  }
});

document.addEventListener("keyup", function (evento) {
  switch (evento.code) {
    case "KeyA":
      Tecla.Izquierda = false;
      break;
    case "KeyW":
      Tecla.Salto = false;
      break;
    case "KeyD":
      Tecla.Derecha = false;
      break;
  }
});
