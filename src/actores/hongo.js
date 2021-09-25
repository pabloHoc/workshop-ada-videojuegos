var spritesHongo = {
  DESCANSANDO: crearSprite(
    "recursos/Enemies/Mushroom/Idle (32x32).png",
    32,
    32
  ),
  CORRIENDO: crearSprite("recursos/Enemies/Mushroom/Run (32x32).png", 32, 32),
  MUERTO: crearSprite("recursos/Enemies/Mushroom/Hit.png", 32, 32),
};

var hongo = {
  estado: "DESCANSANDO",
  x: 120,
  y: 440,
  velocidad: {
    x: 0,
    y: 0,
  },
  direccion: 1,
  cuadroActual: 0,
  spriteActual: spritesHongo.DESCANSANDO,
  sprites: spritesHongo,
  puede: {
    caer: true,
  },
};

function actualizarHongo() {
  if (hongo.estado === "MUERTO") {
    return;
  }

  if (estaColisionandoDerecha(hongo)) {
    hongo.direccion = -1;
    hongo.velocidad.x = 0;
  }

  if (estaColisionandoIzquierda(hongo)) {
    hongo.direccion = 1;
    hongo.velocidad.x = 0;
  }

  hongo.velocidad.x = hongo.direccion * 3;
}
