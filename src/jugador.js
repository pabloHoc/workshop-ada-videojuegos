var jugador = {
  x: 0,
  y: 0,
  velocidad: 5,
  direccion: 1, // 1 -> derecha, -1 izquierda
};

function moverJugadorDerecha() {
  jugador.x += jugador.velocidad;
  jugador.direccion = 1;
}

function moverJugadorIzquierda() {
  jugador.x -= jugador.velocidad;
  jugador.direccion = -1;
}
