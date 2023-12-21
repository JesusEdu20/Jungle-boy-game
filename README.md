# Motor de Videojuegos Kiwi

El Motor de Videojuegos Kiwi es una potente herramienta de desarrollo para la creación de juegos en la web. Diseñado para simplificar la creación de juegos interactivos y atractivos, Kiwi proporciona una base sólida y versátil para dar vida a tus ideas.

## Características Destacadas

- **Sprites y Animaciones:** Crea personajes y objetos animados con facilidad utilizando sprites y hojas de sprites. El motor admite animaciones en bucle y ofrece control total sobre los fotogramas.

- **Detección de Colisiones:** Kiwi incluye detección de colisiones integrada para que puedas definir cómo interactúan los elementos del juego.

- **Física Simplificada:** Agrega físicas realistas a tus juegos con opciones de velocidad, aceleración y gravedad personalizables.

- **Controles y Eventos:** Implementa controles intuitivos y eventos personalizados para dar vida a tus personajes y objetos.

- **Fácil Configuración:** Kiwi es fácil de configurar y se integra perfectamente con tu entorno de desarrollo.

- **Debugging Amigable:** Depura tus juegos con facilidad utilizando herramientas de depuración visuales, incluida la visualización de hitboxes.

## Ejemplo de Uso

```javascript
import { Character, Universe, Control } from 'kiwi-game-engine';

// Crea un personaje
const player = new Character({
  speedX: 0,
  speedY: 0,
  // ... (configuración adicional)
});

// Configura el universo del juego
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const gameUniverse = new Universe(canvas, ctx);

// Agrega controles al personaje
const playerControls = {
  ArrowUp: { startEvent: 'keydown', startAnimation: 'run', endEvent: 'keyup', endAnimation: 'idle' },
  // ... (otros controles)
};
const playerController = new Control(player);
playerController.hookCharacter('idle', false);

// Inicia el juego
gameUniverse.requestSpriteAnimation(player);

// ... (continúa con tu lógica de juego)
