import { EntityLineStrip, EntityOutLine, EntitySprite } from "./GameEngine.js";
import { SpriteController } from "./SpriteController.js";

export class Card{
    constructor(gm, i, objDisplay){
        this._cPos = [0.0,0.0,0.0];

        this._cRectangle = {
            x: 0.7*i - 0.7 - 0.5/2,     // 
            y: 0.6,     // y-coordinate of the top-left corner
            width: 0.5, // width of the rectangle
            height: 0.9  // height of the rectangle
        };

        this._cTextRect = {
            x: 0.7*i - 0.7 - 0.5/2,
            y: 0.6,     
            width: 0.25,
            height: 0.45
        };

        this._cObject = objDisplay;

        this._cVisBack = new EntityOutLine([[0.7*i - 0.7,-0.3], [0.7*i - 0.7,0.6]],0.5);
        this._cVisCont = new EntityLineStrip(this._calculateInnerRectanglePoints(this._cRectangle, 0.03));
        this._cVisSprite = new SpriteController().getSpriteObject(objDisplay.idSprite, 0.015);



        this._cVisSprite.setProperty("pColor",[0.0,1.0,0.0,1.0]);
        this._cVisSprite.setProperty("pOffset", [this._cRectangle.x + this._cRectangle.width/2 + this._cPos[0],this._cRectangle.y- this._cRectangle.height/2  + this._cPos[1],0]);

        this._cVisBack.setProperty("pColor",[0.0,0.0,0.0,1.0]);
        this._cVisBack.setProperty("pOffset", this._cPos);
   
        this._cVisCont.setProperty("pColor",[0.2902,0.1882,0.3216,1.0]);
        this._cVisCont.setProperty("pOffset", this._cPos);

        //TEXT
        this._cText = new TextCard(gm, objDisplay.name,objDisplay.description,this._transformRectangleWebglToCanvas(this._cTextRect));

        this._cCardHovered = false;
    }
    
    setNewActiveObject(obj){
        this._cObject = obj;
        this._cText.changeObject(obj.name,obj.description);
        this._cVisSprite = new SpriteController().getSpriteObject(obj.idSprite, 0.015);
    }
    
    getActiveObject(){
        return this._cObject;
    }

    _transformRectangleWebglToCanvas(rect){
        return {
            x:  ((rect.x + 1) / 2) * 1000,
            y: ((rect.y + 1) / 2)  * (-1000) + 1000,
            width: rect.width  * 1000,
            height: rect.height * (1000),
        }
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

    getVisSprite(){
        console.log(this._cVisSprite);
        return this._cVisSprite;
    }

    update(){
        if(this._cCardHovered){
            this._cPos[1] = Math.min(0.15, this._cPos[1] + 0.01);
        }else if(this._cPos[1] > 0.0){
            this._cPos[1] = Math.max(0.0, this._cPos[1] - 0.02); 
        }
        this._cText.update((((this._cTextRect.y  + this._cPos[1]) + 1) / 2) * (-1000) + 1000);
        this._cVisSprite.setProperty("pOffset", [this._cRectangle.x + this._cRectangle.width/2 + this._cPos[0],this._cRectangle.y- this._cRectangle.height/2  + this._cPos[1],0]);

    }

    clearText(){
        this._cText.clear();
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

class TextCard{
    constructor(gm,txtName, txtDes, rectPos) {
        console.log(rectPos);
        this._tcTxtName = txtName;
        this._tcTxtDes = txtDes;
        this._tcGameManager = gm;
        this._tcRectPos = rectPos;
        this._tcCanvas = document.querySelector("#gCanvasText");
        this._tcCtx = this._tcCanvas.getContext("2d");
        //this.showText()
    }
    clear(){
        this._tcCtx.clearRect(this._tcRectPos.x, this._tcRectPos.y, this._tcRectPos.width, this._tcRectPos.height);
    }

    changeObject(name, description){
        this._tcTxtName = name;
        this._tcTxtDes = description;
    }

    showText() {
        this._tcCtx.clearRect(this._tcRectPos.x, this._tcRectPos.y, this._tcRectPos.width, this._tcRectPos.height);

        //NAME 
        this._tcCtx.font = 'bold 1.5em Montserrat';
        this._tcCtx.fillStyle = 'white';
        const textWidthC = this._tcCtx.measureText(this._tcTxtName).width;
        const cXN = this._tcRectPos.x + (this._tcRectPos.width - textWidthC) / 2;
        const cYN = this._tcRectPos.y + this._tcRectPos.height / 6;
        this._tcCtx.fillText(this._tcTxtName,cXN, cYN );
        //DESC

        this._tcCtx.font = 'bold 1em Montserrat';
        this._tcCtx.fillStyle = 'white';
        this._tcTxtDesComp = this._tcTxtDes.split("\n");

        const cYD = this._tcRectPos.y + this._tcRectPos.height - this._tcRectPos.height / 6;
        for(var i = 0; i < this._tcTxtDesComp.length; i++){
            const textWidth = this._tcCtx.measureText(this._tcTxtDesComp[i]).width;    
            const cXD = this._tcRectPos.x + (this._tcRectPos.width - textWidth) / 2;
            this._tcCtx.fillText(this._tcTxtDesComp[i],cXD, cYD + 20*i );
        }
    }

    update(offSetY){
        this._tcRectPos.y = offSetY;
        this.showText();
    }
}