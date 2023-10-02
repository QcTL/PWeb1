import { EntityOutLine } from "./mGame.js";

export class Card{
    constructor(ge, i){
        this._cPos = [0.0,0.0,0.0];

        this._cVisBack = new EntityOutLine([[0.2+ i*0.3,0.9], [0.2+ i*0.3,0.6]],0.2);
       

        this._cVisBack.setProperty("pColor",[0.0,0.0,0.0,1.0]);
        this._cVisBack.setProperty("pOffset", this._cPos);
   
        //Rect Carta:
        this._cRectangle = {
            x: 0.1+ i*0.3,     // x-coordinate of the top-left corner
            y: 0.1,     // y-coordinate of the top-left corner
            width: 0.2, // width of the rectangle
            height: 0.3  // height of the rectangle
        };

        this._cCardHovered = false;
    }

    update(){
        //Animacio Carta:
        if(this._cCardHovered){
            this._cPos[1] = Math.min(0.15, this._cPos[1] + 0.01); 
        }else if(this._cPos[1] > 0.0){
            this._cPos[1] = Math.max(0.0, this._cPos[1] - 0.02); 
        }
    }

    destroy(){
        if(this._cTicket == undefined)
            alert("Eliminant un element que no s'està mostrant per pantalla");
        else this._gameEngine.removeElement(this._cTicket,"Enemies");
    }

    isPointInside(vP){
        return vP[0] >= this._cRectangle.x && vP[0] <= this._cRectangle.x + this._cRectangle.width &&
        vP[1] >= this._cRectangle.y && vP[1] <= this._cRectangle.y + this._cRectangle.height;
    }

    setActive(){
        this._cCardHovered = true;
    }

    setOff(){
        this._cCardHovered = false;
    }
}