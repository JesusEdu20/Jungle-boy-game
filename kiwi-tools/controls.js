
export class Control{
    
    constructor(character){
        this.character = character
    }

    hookCharacter(defaultAnimationName, isVisibleHitbox = false){

        this.character.animationName = defaultAnimationName;
        this.character.isVisibleHitbox = isVisibleHitbox;
        this.character.universe.requestSpriteAnimation(this.character)

        //Character 
        let isDisplayed = false;
        this.character.spriteSheet.getAttribute("isDisplayed") === "false"

        for(const control in this.character.controls){

            const config=this.character.controls[control];
            const startAnimation=config.startAnimation;
            const startEvent=config.startEvent;
            const isLoopStartAnimation = config.startLoop;
            const endAnimation = config.endAnimation;
            const endEvent=config.endEvent;
            const isLoopEndAnimation=config.endLoop;
            const displacementPhysics=config.displacementPhysics

            window.addEventListener(startEvent, (e)=>{
                
                isDisplayed=this.character.spriteSheet.getAttribute("isDisplayed")==="true"? true : false;
                
                if(!isDisplayed){

                    if(e.key===control){

                        /*Change animation when object(Character) startEvent*/

                        this.character.frame=0;
                        this.character.animationName = startAnimation;
                        this.character.isLoopAnimation = isLoopStartAnimation;
                        
                        this.character.spriteSheet.setAttribute("isDisplayed", "true")

                        this.character.speedX = displacementPhysics.speedX;
                        this.character.speedY = displacementPhysics.speedY;
                        this.character.acceleration = this.character.universe.physics.gravity;
                        
                    }
                }
            })

            window.addEventListener(endEvent, (e)=>{
                
                isDisplayed=this.character.spriteSheet.getAttribute("isDisplayed")==="true"? true : false;

                if(isDisplayed){
                    if(e.key===control){

                       /*Change animation when object(Character) endEvent*/
                       
                       this.character.frame=0;
                       this.character.animationName=endAnimation;
                       this.character.isLoopAnimation=isLoopEndAnimation;

                       this.character.spriteSheet.setAttribute("isDisplayed", "false")

                       this.character.speedX = 0;
                       this.character.speedY = 0;
                        
                    }

                }    
            })
        }
    }
} 


















