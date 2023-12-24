
/**
 * Represents a character object used in the game.
 */
export class Character { 
    /**
     * Creates a character object with specified attributes.
     * @param {Object} options - Object containing character attributes.
     * @param {number} options.speedX - Horizontal speed of the character.
     * @param {number} options.speedY - Vertical speed of the character.
     * @param {number} options.acceleration - Acceleration of the character.
     * @param {object} options.spriteSheet - Sprite sheet of the character.
     * @param {number} options.frameWidth - Width of the character frame.
     * @param {number} options.frameHeight - Height of the character frame.
     * @param {number} options.staggerFrames - Time to display each frame of the animation.
     * @param {string} options.animationName - Name of the animation.
     * @param {boolean} options.isLoopAnimation - Indicates if the animation should loop.
     * @param {string} options.cancelEvent - Event to cancel the animation.
     * @param {boolean} options.isAutoOffAnimation - Indicates if animation should turn off automatically.
     * @param {object} options.frameCoordinates - Coordinates of each frame in the sprite sheet.
     * @param {object} options.controls - Control configuration for the animation.
     * @param {object} options.universe - Universe object for the character.
     * @param {number} options.positionX - X-coordinate position of the character.
     * @param {number} options.positionY - Y-coordinate position of the character.
     * @param {number} options.width - Width of the character.
     * @param {number} options.height - Height of the character.
     * @param {string} options.type - Type of the character.
     */
    constructor({
        speedX,
        speedY,
        spriteSheet,
        frameWidth,
        frameHeight,
        staggerFrames,
        animationName,
        cancelEvent,
        isAutoOffAnimation,
        frameCoordinates,
        controls,
        universe,
        positionX,
        positionY,
        width,
        height,
        type,
    }) {
        // Assign default values to the character's attributes
        this.spriteId = undefined;
        this.speedX = speedX || 0;
        this.speedY = speedY || 0;
        this.nickName = "element";
        this.isShadow = false;
        this.isVisibleShadow = false;
        this.acceleration = 0;
        this.gameFrameCounter = 0;
        this.spriteSheet = spriteSheet;
        this.frameWidth = frameWidth;
        this.frameHeight = frameHeight;
        this.staggerFrames = staggerFrames || 5;
        this.animationName = animationName;
        this.isLoopAnimation = false;
        this.cancelEvent = cancelEvent;
        this.isAutoOffAnimation = isAutoOffAnimation;
        this.frameCoordinates = frameCoordinates;
        this.universe = universe;
        this.frame = 0;
        this.hitBox = undefined;
        this.isVisibleHitbox = false;
        this.width = width;
        this.height = height;
        this.position = { x: positionX || 0, y: positionY || 0 };
        this.type = type;
        this.collisionActionStack = [];
        this.behaviorStack = [];
        this.controls =  {

            w: {
                startAnimation:"jump-up",
                startEvent: "keydown",
                startLoop: false,
                endAnimation: "jump-fall",
                endEvent: "keyup",
                endLoop: false,
                displacementPhysics:{speedX:-2, speedY:-20}
            },
            d: {
                startAnimation:"run",
                startEvent: "keydown",
                startLoop: true,
                endAnimation: "idle",
                endEvent: "keyup",
                endLoop: true,
                displacementPhysics:{speedX:0, speedY:0}
            },
            a: {
                startAnimation: "sliding",
                startEvent: "keydown",
                startLoop: false,
                endAnimation:"idle",
                endEvent: "keyup",
                endLoop: false,
                displacementPhysics:{speedX:18, speedY:0}
            },
        
        };
        
    }

    /**
     * Configures the hitbox of the character.
     * @param {Object} options - Hitbox configuration options.
     * @param {number} options.width - Width of the hitbox.
     * @param {number} options.height - Height of the hitbox.
     * @param {number} options.border - Border size of the hitbox.
     * @param {string} options.color - Color of the hitbox.
     * @param {number} options.positionX - X-coordinate position of the hitbox.
     * @param {number} options.positionY - Y-coordinate position of the hitbox.
     */

    configHitbox({ width, height, border, color, positionX, positionY }) {

        this.hitBox = {
            x: 0,
            y: 0,
            positionX,
            positionY,
            width,
            height,
            border: border ?? 1,
            color: color ?? "black",
        };
    }

    /**
     * Reads the hitbox position based on the sprite's position.
     * @param {number} spritePositionX - X-coordinate position of the sprite.
     * @param {number} spritePositionY - Y-coordinate position of the sprite.
     */
    readHitbox(spritePositionX, spritePositionY) {
        this.hitBox.x = spritePositionX + this.hitBox.positionX;
        this.hitBox.y = spritePositionY + this.hitBox.positionY;
    }

    // pendiente por terminar
    setupKeyControl(...config) {
        try {
          const [
            key,
            startAnimation,
            startEvent,
            startLoop,
            endAnimation,
            endEvent,
            endLoop,
            displacementPhysics,
            addListenerToObject
          ] = config;
      
          if (key === undefined) {
            throw new Error("The key cannot be undefined");
          }
      
          if (typeof startAnimation !== "string") {
            throw new Error("startAnimation must be a string");
          }
      
          if (typeof endAnimation !== "string") {
            throw new Error("endAnimation must be a string");
          }
      
          if (typeof startEvent !== "string") {
            throw new Error("startEvent must be a string");
          }
      
          if (typeof endEvent !== "string") {
            throw new Error("endEvent must be a string");
          }
      
          this.controls[key] = {
            startAnimation,
            startEvent,
            startLoop,
            endAnimation,
            endEvent,
            endLoop,
            displacementPhysics: displacementPhysics || { speedX: 0, speedY: 0 },
            addListenerToObject
          };
        } catch (error) {
          console.error(error.message);
        }
      }
}
