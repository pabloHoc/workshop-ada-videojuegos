var camara = {
  x: 0,
  y: 0,
  ancho: canvas.width,
  alto: canvas.height,
};

function moverCamara() {
  // seguir al personaje
  // el personaje tiene que estar centrado en la mitad de la camara
  // si el personaje está más allá del centro de la cámara, actualizar la posición de la cámara
  var centroCamaraX = camara.x + camara.ancho / 2;
  var centroCamaraY = camara.y + camara.alto / 2;
  var centroPersonajeX =
    jugador.x + (jugador.spriteActual.anchoCuadro * FACTOR_ESCALADO) / 2;
  var centroPersonajeY =
    jugador.y + (jugador.spriteActual.altoCuadro * FACTOR_ESCALADO) / 2;

  if (centroPersonajeX > centroCamaraX || centroPersonajeX < centroCamaraX) {
    camara.x = centroPersonajeX - camara.ancho / 2;
  }

  if (centroPersonajeY > centroCamaraY || centroPersonajeY < centroCamaraY) {
    camara.y = centroPersonajeY - camara.alto / 2;
  }

  limitarCamara();
}

function limitarCamara() {
  // Limite izquierdo
  if (camara.x < 0) {
    camara.x = 0;
  }

  // Limite superior
  if (camara.y < 0) {
    camara.y = 0;
  }

  var limiteInferior = nivel.length * DIMENSION_CELDA * FACTOR_ESCALADO;
  var limiteDerecho = nivel[0].length * DIMENSION_CELDA * FACTOR_ESCALADO;

  if (camara.x + camara.ancho > limiteDerecho) {
    camara.x = limiteDerecho - camara.ancho;
  }

  if (camara.y + camara.alto > limiteInferior) {
    camara.y = limiteInferior - camara.alto;
  }
}
