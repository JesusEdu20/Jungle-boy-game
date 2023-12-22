import { Control } from "./kiwi-tools/controls.js"
import { Character } from "./kiwi-tools/character.js"
import { Universe } from "./kiwi-tools/universe.js"



// Canvas config
const canvas = document.getElementById("canvas");
const presentation = document.getElementById("letrero");
const world = new Universe(canvas);
world.menu = document.getElementById("menu");
world.activeCanvasResponsive(90);



// SpriteSheets
const spriteSheetPlayer = new Image();
spriteSheetPlayer.src = "./game-assets/sprite-sheets/player/boy.png"

const spriteSheetBg = new Image();
spriteSheetBg.src = "./game-assets/sprite-sheets/bg/bg.png";

const spriteSheetOb = new Image();
spriteSheetOb.src = "./game-assets/sprite-sheets/bg/ob1.png"; 

const spriteSheetTrees = new Image();
spriteSheetTrees.src = "./game-assets/sprite-sheets/bg/tree.png"

const spriteSheetBee = new Image();
spriteSheetBee.src = "./game-assets/sprite-sheets/enemy/bee/bee.png";


/* ENEMY */

const spriteSheetEgg = new Image();
spriteSheetEgg.src = "./game-assets/sprite-sheets/enemy/angry-egg/1x/enemy-egg.png";



// Mapeo de spriteheets para obtener los frames
const playerFrames = world.mapFrames({name:"dizzy", frames:2}, {name: "faint", frames:3}, {name:"idle", frames: 2}, {name: "run", frames: 4},{name: "jump-fall", frames:1}, {name:"jump-up", frames: 1}, {name:"sliding", frames:1}, {dimensions: {width: 531, height:  592}});

const bgFrames = world.mapFrames({name:"bg", frames:1}, {dimensions:{width:800, height:400}})
const bgTreeFrames = world.mapFrames({name:"bg", frames:1}, {dimensions:{width:801, height:401}})
const beeFrames = world.mapFrames({name:"ob", frames: 13}, {dimensions:{width:273, height: 282}})
const obFrames = world.mapFrames({name:"ob", frames:1}, {dimensions:{width:529, height:284}})



/* CONTROLES */

const playerControls = {

    w: {
        startAnimation:"jump-up",
        startEvent: "keydown",
        startLoop: false,
        endAnimation: "jump-fall",
        endEvent: "keyup",
        endLoop: false,
        displacementPhysics:{speedX:0, speedY:-20}
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
        displacementPhysics:{speedX:0, speedY:0}
    },
};

/* RECORD DEL JUGADOR/ LOCAL STORAGE*/ 
let tempProgress = 0
const PLAYER_RECORD = "000000000"; // formato base del récord
const recordContainer = document.getElementById("player-record")



function actualizarPuntaje(nuevoPuntaje, recordContainer) {
  const puntajeActual = localStorage.getItem('puntaje');
  const puntajeFormateado = puntajeActual ? puntajeActual : PLAYER_RECORD; // Si no hay puntaje actual, usar el formato base
    console.log(puntajeActual)

  // Convertir a número y comparar
  const puntajeNumerico = parseInt(puntajeFormateado);
  const nuevoPuntajeNumerico = parseInt(nuevoPuntaje);

  if (nuevoPuntajeNumerico > puntajeNumerico) {
    const nuevoPuntajeFormateado = nuevoPuntajeNumerico.toString().padStart(PLAYER_RECORD.length, '0'); // Asegurar que tenga la longitud necesaria
    localStorage.setItem('puntaje', nuevoPuntajeFormateado); // Actualizar el puntaje en localStorage
    recordContainer.innerHTML=nuevoPuntajeFormateado
    return true; // Indica que se ha actualizado el récord
    
  }

  recordContainer.innerHTML=puntajeActual
  return false; // No se actualizó el récord
}








/* CREACION DE  ELEMENTOS DEL JUEGO  */

//PLAYER
const player= new Character({

    spriteSheet: spriteSheetPlayer,
    frameWidth: 531,
    frameHeight: 592, 

    staggerFrames: 5,
    animationName: "idle",
    isAutoOffAnimation: true,

    frameCoordinates: playerFrames,
    controls: playerControls,
    universe: world, 
    width: 150, 
    height: 200,
    positionX:65,
    /* positionY: */
    type:"player"

})





//ELEMENTOS DEL MAPA

const bg = new Character({

    speedX:0,
    speedY:0,
    spriteSheet: spriteSheetBg,
    frameWidth: 800,
    frameHeight: 400,

    staggerFrames: 5, 
    animationName: "bg",
    frameCoordinates: bgFrames,

    universe:world,
    width: 1000,
    height: 810,
    positionX: 0,
    type: "bg"

})

const bgTwo = new Character({

    speedX:0,
    speedY:0,
    spriteSheet: spriteSheetBg,
    frameWidth: 800,
    frameHeight: 400,

    staggerFrames: 5, 
    animationName: "bg",
    frameCoordinates: bgFrames,

    universe:world,
    width: 1000,
    height: 810,
    positionX: 1000,
    type: "bg"

})

bg.nickName="bg";
bgTwo.nickName="bgTwo";




const bgTrees = new Character({

    speedX:0,
    speedY:0,
    spriteSheet: spriteSheetTrees,
    frameWidth: 801,
    frameHeight: 401,

    staggerFrames: 5, 
    animationName: "bg",
    frameCoordinates: bgTreeFrames,

    universe:world,
    width: 800,
    height: 800,
    positionX: 0,
    type: "bg"

})

const bgTreesTwo = new Character({

    speedX:0,
    speedY:0,
    spriteSheet: spriteSheetTrees,
    frameWidth: 801,
    frameHeight: 401,

    staggerFrames: 5, 
    animationName: "bg",
    frameCoordinates: bgTreeFrames,

    universe:world,
    width: 800,
    height: 800,
    positionX: 800,
    type: "bg"

})

bgTrees.nickName="bgTree";
bgTreesTwo.nickName="bgTwoThree"

const ob = new Character({

    speedX:0,
    speedY:0,
    spriteSheet: spriteSheetOb,
    frameWidth: 529,
    frameHeight: 284,

    staggerFrames: 5, 
    animationName: "ob",
    frameCoordinates: obFrames,

    universe:world,
    width: 600,
    height: 400,
    positionX: 0,
    positionY: world.canvas.height - 400,
    type: "map"
    
})

const bee = new Character({

    speedX:0,
    speedY:0,
    spriteSheet: spriteSheetBee,
    frameWidth: 273,
    frameHeight: 282,

    staggerFrames: 5, 
    animationName: "ob",
    frameCoordinates: beeFrames,

    universe:world,
    width: 100,
    height: 100,
    positionX: 400,
    positionY: 390,
    type: "enemy"
    
})


bee.nickName="obBee"
bee.isLoopAnimation = true








/* ANIMACIONES AUTOMATICAS */

bg.behaviorStack.push((request)=>{


    const player=request.universe.stackAnimations.filter(animation=>{

        return animation.type=="player"
    })

    const bgTwo=request.universe.stackAnimations.find(animation=>{

        return animation.nickName==="bgTwo"
    })

    if(player[0].animationName==="run"){

        request.speedX=-1;
        bgTwo.speedX=-1;

        if(request.position.x < - 1000){
            request.position.x = 1000 + request.speedX

        }

        if(bgTwo.position.x < -1000){
            bgTwo.position.x = 1000  + bgTwo.speedX
            
        }
        
    }
     
    else{

        request.speedX=0;
        bgTwo.speedX=0;
       
    }

}) 
 
//Arboles
bgTrees.behaviorStack.push((request)=>{
    
    const player=request.universe.stackAnimations.filter(animation=>{

        return animation.type=="player"
    })

    const bgTwo=request.universe.stackAnimations.find(animation=>{

        return animation.nickName==="bgTwoThree"
    })

    if(player[0].animationName==="run"){

        request.speedX=-6;
        bgTwo.speedX=-6;

        if(request.position.x < - 800){
            request.position.x = 800 + request.speedX

        }

        if(bgTwo.position.x < - 800){
            bgTwo.position.x = 800  + bgTwo.speedX
           
            
        }

        
    }
     
    else{

        request.speedX=0;
        bgTwo.speedX=0;
       
    }

    
}) 

//Roca debajo
 ob.behaviorStack.push(request=>{

    const player=request.universe.stackAnimations.filter(animation=>{

        return animation.type=="player"
    })

   
    if(player[0].animationName==="run"){

        request.speedX=-2;
        

        if(request.position.x < - 800){
            request.position.x = 800 + request.speedX        
        }
        
    }
     
}) 

player.behaviorStack.push(request=>{
    
    if(request.position.y > world.canvas.height){
        console.log("cayendo")
        world.stackAnimations=[]
        presentation.classList.remove("letreroToUp")
        presentation.classList.add("letreroToBottom")
        soundtrack.pause()
    }
})

 
/* MUSICA */

const soundtrack = new Audio("./soundtrack/carrapicho-nojodas.mp3");
soundtrack.loop=true
soundtrack.volume=0.5;


function initGameData(){
    
/* CARGA/CONF DE RECURSOS */

ob.configHitbox({positionX:0, positionY:world.canvas.height - 540, width:590, height:200, border:4, color:"blue", type:"map"})
ob.isVisibleHitbox=false;


bee.configHitbox({positionX:10, positionY:30, width:80, height:58, border:4, color:"blue", type:"map"})
bee.isVisibleHitbox = true;


/* NIVELES */
world.maps.levelOne=[bg, bgTwo, bgTrees, bgTreesTwo, ob, bee]
world.playMap("levelOne")

//Creacion de reels
const reel = world.createReel(bee)
const frame = reel.createFrame(80, 80)

frame.position.x=world.canvas.width
frame.speedX= -4

frame.isLoopAnimation = true;

//render de frame
reel.renderFrame(frame) 

//activando el renderizado aleatorio infinito
frame.behaviorStack.push((frame)=>{
    
    if(frame.position.x < - world.canvas.width){

        tempProgress+=10;
        frame.speedX-=1
        
        actualizarPuntaje(tempProgress, recordContainer)
        
        frame.position.x = world.canvas.width
        world.invertRandomOrder(frame.grid)
        world.orderGridRandom(frame.rows, frame.cols, frame.grid, [1 , 0])

         frame.grid.forEach( row => {
            
            row.forEach((elem, index)=>{
                elem.position.x = (index * elem.width) + world.canvas.width
                elem.speedX-=1
            })
        }); 
        
    }
})







frame.grid.forEach((row)=>{
    row.forEach(bee=>{
        bee.collisionActionStack.push((elem)=>{
            world.stackAnimations=[]
            presentation.classList.remove("letreroToUp")
            presentation.classList.add("letreroToBottom")
            soundtrack.pause()
        })
    })
})


const controlsOfPlayer = new Control(player);
controlsOfPlayer.hookCharacter("idle", false)



}

initGameData()


window.addEventListener('load', function() {
    
    const preload = document.getElementById('preload');
    

    /* setTimeout(function() { */
        preload.style.display = 'none'; 
        canvas.style.display = 'block'; 
        world.drawSprites()
        
    /* }, 5000) */

});

/* INICIO DEL JUEGO */
window.addEventListener("keydown", (e)=>{


    if(e.code=="Space"){

         if(presentation.classList.contains('letreroToBottom')){
            player.position.x=60
            player.position.y=0
            ob.position.x=0

            tempProgress=0
            initGameData()
            presentation.classList.remove("letreroToBottom")
        }
       
        presentation.classList.add("letreroToUp")
        /* presentation.style.display="none" */
        
        soundtrack.play()
        player.configHitbox({positionX:40, positionY:30, width:76, height:140, border:0, color:"red", type:"player"})

       
    }   
    
})






