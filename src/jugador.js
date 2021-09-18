var spritesJugador = {
  DESCANSANDO: crearSprite(
    "recursos/Main Characters/Ninja Frog/Idle (32x32).png",
    32,
    32
  ),
  CORRIENDO: crearSprite(
    "recursos/Main Characters/Ninja Frog/Run (32x32).png",
    32,
    32
  ),
  SALTANDO: crearSprite(
    "recursos/Main Characters/Ninja Frog/Jump (32x32).png",
    32,
    32
  ),
};

var jugador = {
  estado: "DESCANSANDO",
  x: 0,
  y: 300,
  velocidad: {
    x: 0,
    y: 0,
  },
  fuerzaSalto: -15,
  direccion: 1, // 1 -> derecha, -1 izquierda
  cuadroActual: 0,
  spriteActual: spritesJugador.DESCANSANDO,
  sprites: spritesJugador,
  puede: {
    saltar: false,
  },
};

function moverJugadorDerecha() {
  jugador.velocidad.x = 10;
  jugador.direccion = 1;
}

function moverJugadorIzquierda() {
  jugador.velocidad.x = -10;
  jugador.direccion = -1;
}

// Movimiento = velocidad x tiempo

function saltarJugador() {
  if (jugador.puede.saltar) {
    jugador.velocidad.y = jugador.fuerzaSalto;
    // Una vez que salto, ya no puede saltar
    // Hasta volver a tocar el suelo
    jugador.puede.saltar = false;
  }
}
