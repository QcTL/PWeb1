import { EntityLineStrip, EntityOutLine } from "./GameEngine.js";

export class Card{
    constructor(ge, i){
        this._cPos = [0.0,0.0,0.0];

        this._cRectangle = {
            x: 0.7*i - 0.7 - 0.5/2,     // 
            y: 0.6,     // y-coordinate of the top-left corner
            width: 0.5, // width of the rectangle
            height: 0.9  // height of the rectangle
        };


        this._cVisBack = new EntityOutLine([[0.7*i - 0.7,-0.3], [0.7*i - 0.7,0.6]],0.5);
        this._cVisCont = new EntityLineStrip(this._calculateInnerRectanglePoints(this._cRectangle, 0.03));

        this._cVisBack.setProperty("pColor",[0.0,0.0,0.0,1.0]);
        this._cVisBack.setProperty("pOffset", this._cPos);
   
        this._cVisCont.setProperty("pColor",[0.2902,0.1882,0.3216,1.0]);
        this._cVisCont.setProperty("pOffset", this._cPos);


        this._cCardHovered = false;
    }
    
    _calculateInnerRectanglePoints(rectangle, diff) {
    
        // Calculate the coordinates of the inner rectangle's points
        const topLeft = [rectangle.x + diff,                        rectangle.y - diff,0.0];
        const topRight = [rectangle.x + rectangle.width - diff ,    rectangle.y - diff,0.0];
        const bottomLeft = [rectangle.x + diff,                     rectangle.y - rectangle.height + diff,0.0];
        const bottomRight = [rectangle.x + rectangle.width - diff , rectangle.y - rectangle.height + diff,0.0];
    
        return [topLeft, topRight, bottomRight, bottomLeft, topLeft];
    }

    getVisBack(){
        return this._cVisBack;
    }

    getVisCont(){
        return this._cVisCont;
    }

    update(){
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

    isPointInside(vP) {
        return vP[0] >= this._cRectangle.x && 
               vP[0] <= this._cRectangle.x + this._cRectangle.width &&
               vP[1] <= this._cRectangle.y && 
               vP[1] <= this._cRectangle.y + this._cRectangle.height;
    }

    setActive(){
        this._cCardHovered = true;
    }

    setOff(){
        this._cCardHovered = false;
    }
}