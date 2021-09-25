var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
// Necesario para que no se vea mal al escalar los sprites
ctx.imageSmoothingEnabled = false;

var DIMENSION_CELDA = 16;

function crearSprite(ruta, anchoCuadro, altoCuadro) {
  var sprite = new Image();
  sprite.src = ruta;

  return {
    sprite,
    anchoCuadro,
    altoCuadro,
  };
}

function actualizarPantalla() {
  borrarPantalla();
  dibujarFondo();
  dibujarNivel();

  dibujarSprite(hongo);
  dibujarSprite(jugador);

  moverCamara();
}

function borrarPantalla() {
  // borrar cuadrado
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function dibujarSprite(actor) {
  // Calculamos la cantidad de cuadros
  // de la animación dividiendo el ancho total por el ancho de un cuadro
  var cuadros =
    actor.spriteActual.sprite.width / actor.spriteActual.anchoCuadro;

  var direccion = actor.direccion;

  if (actor !== jugador) {
    direccion = -direccion;
  }

  ctx.save();
  // eje x, eje y
  ctx.scale(direccion, 1);

  /**
   *  Cuando el actor mira hacia la izquierda
   *  El canvas se invierte sobre el eje X (lo positivo pasa a ser negativo)
   *  Y el punto de origen del sprite
   *  Pasa a ser del superior izquierdo al superior derecho
   *  Por lo tanto para que el sprite quede en el mismo lugar
   *  Necesitamos moverlo hacia atrás (derecha) el ancho del sprite
   * */
  if (direccion === -1) {
    ctx.translate(-actor.spriteActual.anchoCuadro * FACTOR_ESCALADO, 0);
  }

  // Actualizo cámara
  ctx.translate(direccion * -camara.x, camara.y);

  // Descomentar para ver el sprite completo

  ctx.fillStyle = "green";
  ctx.fillRect(
    direccion * actor.x, // pos x del canvas
    actor.y, // pos y del canvas
    actor.spriteActual.anchoCuadro * FACTOR_ESCALADO, // ancho del canvas
    actor.spriteActual.altoCuadro * FACTOR_ESCALADO
  );

  ctx.drawImage(
    actor.spriteActual.sprite,
    Math.floor(actor.cuadroActual) * actor.spriteActual.anchoCuadro, // pos x de la imagen
    0, // pos y de la imagen
    actor.spriteActual.anchoCuadro, // ancho de la imagen
    actor.spriteActual.altoCuadro, // alto de la imagen
    direccion * actor.x, // pos x del canvas
    actor.y, // pos y del canvas
    actor.spriteActual.anchoCuadro * FACTOR_ESCALADO, // ancho del canvas
    actor.spriteActual.altoCuadro * FACTOR_ESCALADO // alto del canvas
  );

  ctx.restore();

  // Pasamos al siguiente cuadro
  actor.cuadroActual += 0.4;

  // Reseteamos animación
  if (actor.cuadroActual >= cuadros) {
    if (actor.estado !== "MUERTO") {
      actor.cuadroActual = 0;
    } else {
      actor.cuadroActual = cuadros - 1;
    }
  }
}

var fondo = crearSprite("recursos/Background/Purple.png", 64, 64);
var terreno = crearSprite("recursos/Terrain/Terrain (16x16).png", 16, 16);

function dibujarFondo() {
  for (let i = 0; i < canvas.width / 64; i++) {
    for (let j = 0; j < canvas.height / 64; j++) {
      ctx.drawImage(fondo.sprite, i * 64, j * 64);
    }
  }
}

function dibujarNivel() {
  var ESCALA_CELDA = 2;
  ctx.fillStyle = "black";

  for (let i = 0; i < nivel.length; i++) {
    for (let j = 0; j < nivel[i].length; j++) {
      if (nivel[i][j] !== 0) {
        var celda = nivel[i][j] - 1;
        var columnas = terreno.sprite.width / DIMENSION_CELDA;
        // var filas = terreno.sprite.height / DIMENSION_CELDA
        // 2, 34, 45, 1, 10

        ctx.drawImage(
          terreno.sprite,
          DIMENSION_CELDA * Math.floor(celda % columnas), // pos x del sprite -> columna en la que esta
          DIMENSION_CELDA * Math.floor(celda / columnas), // pos y del sprite -> fila en la que esta
          DIMENSION_CELDA,
          DIMENSION_CELDA,
          j * DIMENSION_CELDA * ESCALA_CELDA - camara.x, // pos x en el canvas
          i * DIMENSION_CELDA * ESCALA_CELDA - camara.y, // pos y en el canvas
          DIMENSION_CELDA * ESCALA_CELDA, // ancho en el canvas
          DIMENSION_CELDA * ESCALA_CELDA // alto en el canvas
        );
      }
    }
  }

  // dibujarGrilla();
}

function dibujarGrilla() {
  ctx.strokeStyle = "black";
  for (let i = 0; i < canvas.height / 32; i++) {
    ctx.beginPath();
    ctx.moveTo(0, i * 32);
    ctx.lineTo(canvas.width, i * 32);
    ctx.stroke();
  }
  for (let i = 0; i < canvas.width / 32; i++) {
    ctx.beginPath();
    ctx.moveTo(i * 32, 0);
    ctx.lineTo(i * 32, canvas.height);
    ctx.stroke();
  }
}
