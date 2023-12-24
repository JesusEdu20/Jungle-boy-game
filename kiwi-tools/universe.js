import { Character } from "./character.js"

    export class Universe{

        constructor(canvas){

            this.stackAnimations=[];
            this.canvas=canvas;
            this.menu = undefined;
            this.ctx=this.canvas.getContext("2d");
            this.physics = {gravity:1.0000002};
            this.maps={};
            this.synchronizedActionExecutionStack=[];
            this.stackCopiedModelObjects={};
        }

        syncWithRenderingCycle=(action)=>{
            this.synchronizedActionExecutionStack.push(action)
        }

        executeSynchronizedActions = ()=>{

            this.synchronizedActionExecutionStack.forEach(action=>{
                action()
            })
        }

        drawSprites=()=>{

            //limpieza del canvas
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

            this.stackAnimations.forEach(request => {

                const animationName= request.animationName;
                const staggerFrames= request.staggerFrames;
                const spriteSheet= request.spriteSheet;
                const isShadowObject = request.isShadowObject;
                const frameCoordinates= request.frameCoordinates;
                const frameWidth = request.frameWidth;
                const frameHeight = request.frameHeight;
                const position = request.position;
                const numberOfFrames=frameCoordinates[animationName].length;
                const isLoopAnimation= request.isLoopAnimation;
                let frame= request.frame;
                let speedY= request.speedY;
                const speedX=request.speedX
                
                this.executeSynchronizedActions()
                this.executeBehaviorStack(request)

                //Physics

                this.activePhysics(request)
                
                //seleccionar frame
                if( isLoopAnimation || frame != numberOfFrames-1){

                    //dibujar siguiente frame
                    frame = Math.floor(request.gameFrameCounter / staggerFrames) % numberOfFrames;
                    request.frame=frame;
                }

                else{
                    //dibujar ultimo frame de la lista de frames
                    request.frame=frame;
                }

                //debugHitbox
                if(request.hitBox){

                    request.readHitbox(position.x, position.y);

                    if(request.isVisibleHitbox){

                        const hitBox=request.hitBox
                        this.ctx.strokeStyle=hitBox.color;
                        this.ctx.lineWidth= hitBox.border;
                        this.ctx.strokeRect(hitBox.x, hitBox.y, hitBox.width, hitBox.height);
                    }
                }

                if(!request.isShadow){
                //Dibujar sprite
                this.ctx.drawImage(spriteSheet, frameCoordinates[animationName][frame].codX, frameCoordinates[animationName][frame].codY, frameWidth, frameHeight, position.x, position.y, request.width, request.height);
                }

                else if(request.isVisibleShadow){
                   //dibujar sombra
                    this.ctx.strokeRect(request.position.x, request.position.y, request.width, request.height);
                }

                request.gameFrameCounter++;
                
            }); 

            this.detectCollisions()
            requestAnimationFrame(this.drawSprites)
        }

        requestSpriteAnimation(request){

            //asignar id
            this.stackAnimations.push(request)
            request.spriteId=this.stackAnimations.indexOf(request) + Math.random().toString(36).substring(2,9) + Date.now()
            
        }

        removeSpriteAnimation(id){

            const index=this.stackAnimations.findIndex((request)=> id===request.spriteId)
            this.stackAnimations.splice(index,1)
            
        }

        detectCollisions(){
            
            for(let i=0; i<this.stackAnimations.length-1; i++ ){
    
                const sprite=this.stackAnimations[i];
                if(sprite.hitBox===undefined) continue;                
                
                for(let j=i+1; j<this.stackAnimations.length; j++){
 
                    const nextSprite=this.stackAnimations[j];
                    if(nextSprite.hitBox===undefined) continue;
                    if(nextSprite.type==="map") continue;

                    const hitBox=sprite.hitBox;
                    const nextHitBox=nextSprite.hitBox;

                    if( hitBox.x > nextHitBox.x + nextHitBox.width|| //derecha
                        hitBox.x + hitBox.width < nextHitBox.x || //izquierda
                        hitBox.y > nextHitBox.y + nextHitBox.height || //abajo
                        hitBox.y + hitBox.height < nextHitBox.y ){ //arriba
                        
                        //no collision 

                            if(sprite.type=="map" || nextSprite.type=="map"){
                                
                                const player= sprite.type=="player"? sprite : nextSprite;
                                const obstacle = sprite.type=="map"? sprite : nextSprite;
 
                                if(player.hitBox.y + player.hitBox.height <= obstacle.hitBox.y
                                    && player.hitBox.y + player.hitBox.height + player.speedY >= obstacle.hitBox.y
                                    
                                    && player.hitBox.x + player.hitBox.width > obstacle.hitBox.x
                                    && player.hitBox.x < obstacle.hitBox.x + obstacle.hitBox.width){

                                        console.log("aterrizaje perfecto")
                                        player.speedY=0;
                                }     
                            }

                            

                        } else {

                        //collision detected
                           
                        if(sprite.type=="map" || nextSprite.type=="map"){

                            const player= sprite.type=="player"? sprite : nextSprite;
                            const obstacle = sprite.type=="map"? sprite : nextSprite;

                            if(player.hitBox.y + player.hitBox.height >= obstacle.hitBox.y
                                && player.hitBox.y + player.hitBox.height + player.speedY >= obstacle.hitBox.y
                                
                                && player.hitBox.x + player.hitBox.width > obstacle.hitBox.x
                                && player.hitBox.x < obstacle.hitBox.x + obstacle.hitBox.width){
                                 
                                player.speedX=0;
                                player.position.x= (obstacle.hitBox.x + (player.position.x - player.hitBox.x )) - player.hitBox.width
                                
                               
                             }

                        }

                            sprite.collisionActionStack.forEach(action=>{
                                action(nextSprite)
                            })

                            nextSprite.collisionActionStack.forEach(action=>{
                                action(sprite)
                            })

                            console.log("colision")
                    
                        }  
                }
            }
        } 

        activePhysics (request){

            const acceleration = request.acceleration;
            const around = request.around;
            const position = request.position;
            let speedY = request.speedY;
            let speedX = request.speedX;

            request.speedY+=acceleration
            
            position.y+=speedY;
            position.x+=speedX;
            
        }

        setCanvasSize = (element, decimalPercentage, menu) => {

             // Comprueba si el ancho de la ventana es mayor que su altura
            let elementSize= window.innerWidth > window.innerHeight? window.innerHeight : window.innerWidth;
           
            // Ajusta el ancho y el alto del elemento en función del porcentaje decimal
            element.style.width = `${elementSize * (decimalPercentage / 100)}px`;
            element.style.height = `${elementSize * (decimalPercentage / 100)}px`;

            menu.style.width = `${elementSize * (decimalPercentage / 100)}px`;
            menu.style.height = `${elementSize * (decimalPercentage / 100)}px`;

            
        }

        activeCanvasResponsive(decimalPercentage){

             //* / Agrega un evento de escucha al objeto window para detectar cambios en el tamaño de la ventana
             window.addEventListener("resize", () => {
                // Cuando ocurre el evento "resize", llama a la función setElementSize para ajustar el tamaño del canvas al 70% de la ventana
                this.setCanvasSize(this.canvas, decimalPercentage, menu);
            });
            
            window.addEventListener("load", () => {
                // Cuando ocurre el evento "resize", llama a la función setElementSize para ajustar el tamaño del canvas al 70% de la ventana
                this.setCanvasSize(this.canvas, decimalPercentage, menu);
            });
        }

        playMap(mapName){

            const map=this.maps[mapName]
           
            map.forEach(elements=>{

                this.requestSpriteAnimation(elements)
            })
           
        }

        executeBehaviorStack(request){
            
            request.behaviorStack.forEach(action=>{
                action(request)
            })
        }

        mapFrames(...actions) {

            const dimensionsFrame=actions.find(elem=> elem.hasOwnProperty("dimensions"));
            const animationsState=actions.filter(frames=> frames.hasOwnProperty("frames"));   
            const animationsFrames={}
           
            animationsState.forEach((state, index)=>{
        
                let animationName=state.name
                animationsFrames[animationName]=[]
        
                for(let i=0; i<state.frames; i++){
        
                    let codX=i * dimensionsFrame.dimensions.width;
                    let codY=index * dimensionsFrame.dimensions.height;  
                    animationsFrames[animationName].push({codX, codY});   
                }  
            })
        
            return animationsFrames
            
        }

        /* funcionalidad experimental */

        createReel(objectModel){

            const reel={

                createFrame: (widthRange, heightRange) => {

                    const frame = new Character({

                        speedX:objectModel.speedX,
                        speedY:objectModel.speedY,
                        spriteSheet: objectModel.spriteSheet,
                        frameWidth: objectModel.frameWidth,
                        frameHeight: objectModel.frameHeight,

                        staggerFrames: objectModel.staggerFrames, 
                        animationName: objectModel.animationName,
                        frameCoordinates: objectModel.frameCoordinates,

                        universe: objectModel.universe,
                        width: objectModel.width,
                        height: objectModel.height,
                        positionX: objectModel.positionX,
                        positionY: objectModel.positionY,
                        type: objectModel.type}
                    )

                    frame.hitBox = objectModel.hitBox
                    frame.nickName = objectModel.nickName 

                    if(this.stackCopiedModelObjects[objectModel.nickName]){
                        //asignar
                        this.stackCopiedModelObjects[objectModel.nickName].frames.push(frame)
                    }

                    else{
                        
                        this.stackCopiedModelObjects[objectModel.nickName]={objectModel, frames:[frame]}; //reasignacion no necesaria
                    }

                    const longitud = this.stackCopiedModelObjects[objectModel.nickName].frames.length 
                    const object = this.stackCopiedModelObjects[objectModel.nickName].frames[longitud-1];

                    //crea o conf el area
                    const cols =  Math.floor(((widthRange / 100) * this.canvas.width ) / object.width) ;
                    const rows = Math.floor(((heightRange / 100) * this.canvas.height) / object.height) ; 

                    //Posicionan el frame en los puntos (0, 0) del canvas
                    object.position.x=0;
                    object.position.y=0;
                    
                    //adaptan el frame al tamano del array2d
                    object.width = cols * object.width;
                    object.height = rows * object.height; 

                    //convertir a sombra
                    const spriteSheet= object.spriteSheet;

                    this.requestSpriteAnimation(frame)
                    
                    frame.cols=cols;
                    frame.rows=rows;

                    return frame
                },

                select:(action, index)=>{

                    const model=this.stackCopiedModelObjects[objectModel.nickName]
                    
                    model.frames[index].grid.forEach(row=>{
                        row.forEach(elem=>{
                            action(elem)
                            
                        })
                    })

                },

                renderFrame:(frame)=>{

                    const {rows, cols, spriteSheet} = frame
                   
                   
                    const grid=this.createGrid(frame, rows, cols, spriteSheet);
                    frame.grid=grid;
                    this.renderGrid(grid)
                    this.invertRandomOrder(grid)
                    this.orderGridRandom(rows, cols, grid, [0, 0])

                    
                    frame.isShadow=true;
                    frame.spriteSheet=undefined 
                    frame.hitBox=undefined;
                    
                }
            }

            this.removeSpriteAnimation(objectModel.spriteId) 
            return reel
            
        }

        
        createGrid(object, rows, cols, spriteSheet){
            
            const grid=[]

            try{

                if(object.hitBox===undefined){
                    throw new Error(`This object does not have a defined hitbox`)
                }
                
                for(let i = 0; i < rows ; i++ ){

                    const arr = []
                    
                    for (let j = 0; j < cols; j++){

                        const copyObject = new Character( {
                            
                            speedX:object.speedX,
                            speedY:object.speedY,
                            spriteSheet: spriteSheet,
                            frameWidth: object.frameWidth,
                            frameHeight: object.frameHeight,

                            staggerFrames: object.staggerFrames, 
                            animationName: object.animationName,
                            frameCoordinates: object.frameCoordinates,

                            universe:object.universe,
                            width: 100,
                            height: 100,
                            positionX: (j * 100) + object.position.x,
                            positionY: (i * 100) + object.position.y,
                            type: object.type

                            }
                        )

                        copyObject.isLoopAnimation = true;
                        copyObject.configHitbox({positionX:object.hitBox.positionX, positionY:object.hitBox.positionY, width:object.hitBox.width, height:object.hitBox.height, border: object.hitBox.border, color: object.hitBox.color, type: object.hitBox.type})
                        copyObject.hitBoxCopy=copyObject.hitBox;
                        copyObject.nickName =`${object.nickName}-${"copy"}`
                       
                        copyObject.isVisibleHitbox=false

                    
                    arr.push(copyObject)
                    }
                    
                    grid.push(arr)
                }  

            }

            catch(error){
                console.error(error)
            }

            return grid
            
        }

        orderGridRandom(rows, cols, area, spacing){

            const sequence = this.getRandomSequence(rows, cols, spacing)

                for (let i = 1; i <= rows; i++) {
                    for (let j = 1; j <= cols; j++) {
                        if (i % sequence.rows === 0 && j % sequence.cols === 0) {
                            //convertir en sombra todos los elementos que hayan obtenido un residuo 0
                            area[i - 1][j - 1].hitBox = area[i - 1][j - 1].hitBoxCopy;
                            area[i - 1][j - 1].isShadow = false;
                        }
                    }
                }
            
            
        } 

        invertRandomOrder(grid){
            
                for (let i = 0; i < grid.length; i++) {
                  const row = grid[i];
                  for (let j = 0; j < row.length; j++) {
                    const object = row[j];
                    if (object.isShadow === false) {
                      object.hitBox = undefined;    
                      object.isShadow = true;
                    }
                  }
                }
        }
      
        renderGrid(grid){

            for(let i = 0; i < grid.length; i++){
                
                const  row = grid[i];
                
                for(let j = 0; j < row.length; j++){

                    const object = row[j] 
                    this.requestSpriteAnimation(object)
                    
                }
            }
        }
        
        getRandomSequence(rows, cols, minSpacing){
            
            const [minRow, minCol] = minSpacing;

           try{

            if(minRow > rows || minCol > cols ){
                throw new Error(`Spacing cannot exceed the available positions: Rows: ${minRow}/${rows}, Cols: ${minCol}/${cols}. `)
            }

            const ranges = minSpacing ? {rows: minRow + 1, cols: minCol + 1} : {rows: 1, cols: 1 };
            const sequence = {
                    rows: Math.floor(Math.random() * (rows - ranges.rows + 1)) + ranges.rows,
                    cols: Math.floor(Math.random() * (cols - ranges.cols + 1)) + ranges.cols
                    };

            return sequence;

            }
            catch(error){

                console.error("Error:", error.message)
            }
                
        }

    }


 






    
    
    
    
    
 
     