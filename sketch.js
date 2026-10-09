/* eslint-disable no-undef, no-unused-vars */

//DECLARACIONES

// Variable donde se almacena el lienzo de p5
let canvas;
// Variable que almacena el alto del lienzo
let canvasHeight = 120;
// Variable que almacena el ancho del lienzo
let canvasWidth;

// Constante donde se almacena la URL desde donde se carga el audio
const URL_AUDIO = "aud/audio.ogg";
// Variable donde se almacena la velocidad a la cual se escucha el audio
let velocidad;
// Variable donde se almacena el volumen a la cual se escucha el audio
let volumen;
// Variable donde se almacena el archivo de audio
let soundFile;

// Variable donde se almacena el objeto que calcula la amplitud del audio
let medidaAmplitud;
// Variable donde se almacena el diámetro del círculo
let diametroCirculo;
// Variable donde se almacena el efecto de Reverberación
let reverberacion;

// Variables donde se almacena la posición actual del centro del círculo
let posX;
let posY;
// Variables donde se almacena la posición a la que se debe mover el círculo
let destinoX;
let destinoY;

// FUNCIÓN DE PRECARGA DE LOS RECURSOS
function preload() {
  // Se los formatos de audio válidos dentro de la aplicación
  soundFormats("ogg");
  // Carga el audio desde la URL y lo almacena en la variable
  soundFile = loadSound(URL_AUDIO);
}

// FUNCIÓN DE CONFIGURACIÓN
function setup() {
  // Asigna el ancho del lienzo
  canvasWidth = windowWidth;
  // Crear un lienzo (área de dibujo) del tamaño de la ventana del navegador Web
  canvas = createCanvas(canvasWidth, canvasHeight);
  // Adiciona el lienzo al div con el atributo id igual a canvas-container
  canvas.parent("canvas-container");
  // Se establece la velocidad y el volumen iniciales del audio
  velocidad = 1.0;
  volumen = 0.5;
  // Diámetro inicial del círculo (necesario para que lerp tenga un valor de partida)
  diametroCirculo = 20;
  // Posición inicial del círculo (centro del lienzo) y su destino
  posX = windowWidth / 2;
  posY = 60;
  destinoX = posX;
  destinoY = posY;
  // Inicialmente el audio comienza parado
  soundFile.pause();
  // Crea un objeto encargado de calcular la amplitud del audio reproducido
  medidaAmplitud = new p5.Amplitude();
  // Crea y configura el efecto de reverberación
  reverberacion = new p5.Reverb();
  reverberacion.disconnect();
  reverberacion.process(soundFile, 3, 2);
  reverberacion.drywet(1);

}

// FUNCIÓN DONDE SE PROGRAMA LA FUNCIONALIDAD
function draw() {
  // Pinta de blanco el color de fondo
  background(128, 128, 128);
  // Obtiene la amplitud del audio que se está reproduciendo
  amplitudAudio = medidaAmplitud.getLevel();
  // Convierte la amplitud en el diámetro del círculo que se va a pintar
  let diametroObjetivo = map(amplitudAudio, 0, 0.3, 20, 120);
  // Con lerp el diámetro se acerca poco a poco al objetivo (evita que parpadee y sea difícil de clicar)
  diametroCirculo = lerp(diametroCirculo, diametroObjetivo, 0.1);
  // Con lerp el centro del círculo se desplaza poco a poco hacia el destino (animación de movimiento)
  posX = lerp(posX, destinoX, 0.1);
  posY = lerp(posY, destinoY, 0.1);
  // Pinta un círculo con el diámetro variable según la amplitud del audio
  fill(255, 0, 0);
  circle(posX, posY, diametroCirculo);
}

// CAMBIA EL TAMAÑO DEL LIENZO SI LA VENTANA DEL NAVEGADOR WEB CAMBIA DE TAMAÑO
windowResized = function () {
  // Asigna el ancho del lienzo
  canvasWidth = windowWidth;
  // Redimenciona el tamaño del lienzo al tamaño del canvas
  resizeCanvas(canvasWidth, canvasHeight);
};

// FUNCIÓN QUE SE LLAMA AL PRESIONAR UNA TECLA
function keyTyped() {
  // Al presionar la tecla p se inicia o se para la reproducción
  if (key === "p") {
    if (soundFile.isPlaying()) {
      soundFile.pause();
    } else {
      soundFile.play();
    }
    // Con la tecla > se reproduce más rápido el audio
  } else if (key === ">" && soundFile.isPlaying()) {
    velocidad += 0.1;
    soundFile.rate(velocidad);
    // Con la tecla < se reproduce más lento el audio
  } else if (key === "<" && soundFile.isPlaying()) {
    velocidad -= 0.1;
    soundFile.rate(velocidad);
    // Con la tecla + se aumenta el volumen del audio
  } else if (key === "+" && soundFile.isPlaying()) {
    volumen += 0.1;
    soundFile.setVolume(volumen);
    // Con la tecla - se disminuye el volumen del audio
  } else if (key === "-" && soundFile.isPlaying()) {
    volumen -= 0.1;
    soundFile.setVolume(volumen);
  }
}

// FUNCIÓN QUE SE LLAMA AL PRESIONAR CLIC EN EL RATÓN
function mouseClicked() {
  // Verifica si el usuario hizo clic dentro del círculo rojo
  if (dist(posX, posY, mouseX, mouseY) <= diametroCirculo / 2) {
    // Permite que se escuche el efecto de reverberación
    reverberacion.connect();
  } else {
    // Evita que se escuche el efecto de reverberación
    reverberacion.disconnect();
    // Fija como destino la posición donde se hizo clic para mover el círculo hacia allí
    destinoX = mouseX;
    destinoY = mouseY;
  }
}