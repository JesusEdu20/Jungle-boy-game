import { Control } from "./kiwi-tools/controls.js"
import { Character } from "./kiwi-tools/character.js"
import { Universe } from "./kiwi-tools/universe.js"



// Canvas config
const canvas = document.getElementById("canvas");
const world = new Universe(canvas);
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

const spriteSheetObRock = new Image();
spriteSheetObRock.src = "./game-assets/sprite-sheets/bg/rock.png";


/* const enemy = new Image();
enemy.src = "./game-assets/sprite-sheets/enemy/snail/snail_00.png"

 */

// Mapeo de spriteheets para obtener los frames
const playerFrames = world.mapFrames({name:"dizzy", frames:2}, {name: "faint", frames:3}, {name:"idle", frames: 2}, {name: "run", frames: 4},{name: "jump-fall", frames:1}, {name:"jump-up", frames: 1}, {name:"sliding", frames:1}, {dimensions: {width: 531, height:  592}});

const bgFrames = world.mapFrames({name:"bg", frames:1}, {dimensions:{width:800, height:400}})
const bgTreeFrames = world.mapFrames({name:"bg", frames:1}, {dimensions:{width:801, height:401}})
const bgRockFrames = world.mapFrames({name:"ob", frames:1}, {dimensions:{width:167, height: 142}})
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
        displacementPhysics:{speedX:1, speedY:-20}
    },
    d: {
        startAnimation:"run",
        startEvent: "keydown",
        startLoop: true,
        endAnimation: "idle",
        endEvent: "keyup",
        endLoop: true,
        displacementPhysics:{speedX:2, speedY:0}
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
    positionX:0,
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

const obRock = new Character({

    speedX:0,
    speedY:0,
    spriteSheet: spriteSheetObRock,
    frameWidth: 167,
    frameHeight: 142,

    staggerFrames: 5, 
    animationName: "ob",
    frameCoordinates: bgRockFrames,

    universe:world,
    width: 200,
    height: 200,
    positionX: 400,
    positionY: 390,
    type: "map"
    
})


obRock.nickName="obRock"







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

    const obRock=request.universe.stackAnimations.find(animation=>{

        return animation.nickName==="obRock"
    })

   
    if(player[0].animationName==="run"){

        request.speedX=-2;

        if(request.position.x < - 800){
            request.position.x = 800 + request.speedX        
        }
        
    }
     
}) 
 



/* CARGA/CONF DE RECURSOS */

ob.configHitbox({positionX:0, positionY:world.canvas.height - 540, width:590, height:200, border:4, color:"blue", type:"map"})
ob.isVisibleHitbox=false;


obRock.configHitbox({positionX:10, positionY:50, width:148, height:80, border:4, color:"blue", type:"map"})
obRock.isVisibleHitbox=true;
/*   */

/* Seguir aca */


/* NIVELES */
world.maps.levelOne=[bg, bgTwo, bgTrees, bgTreesTwo, ob, obRock]
world.playMap("levelOne")



//Creacion de reels
const test = world.createReel(obRock)
const frame=test.createFrame(100, 100)
frame.position.x=world.canvas.width
frame.speedX=-2

//render de frames
test.renderFrame(frame)


//activando el renderizado aleatorio infinito
frame.behaviorStack.push((frame)=>{
    
    if(frame.position.x < - world.canvas.width){
        
        frame.position.x = world.canvas.width
        world.invertRandomOrder(frame.grid)
        world.orderGridRandom(frame.rows, frame.cols, frame.grid, [0 , 0])

         frame.grid.forEach(row => {
            
            row.forEach((elem, index)=>{
                elem.position.x = (index * elem.width) + world.canvas.width
                
            })
        }); 
        
    }
})








const controlsOfPlayer = new Control(player);
controlsOfPlayer.hookCharacter("idle", false)
player.configHitbox({positionX:40, positionY:30, width:76, height:140, border:0, color:"red", type:"player"})




/* INICIO DEL JUEGO */

console.log(world.stackAnimations)
world.drawSprites()


const soundtrack = new Audio("./soundtrack/carrapicho-nojodas.mp3");
soundtrack.loop=true
soundtrack.volume=0.5;
window.addEventListener("keydown", ()=>{
    soundtrack.play()

})