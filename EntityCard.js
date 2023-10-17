class Card{
    constructor(gm, i, objDisplay){
        this._cPos = [0.0,0.0,0.0];

        this._cRectangle = {
            x: 0.7*i - 0.7 - 0.5/2,
            y: 0.6,   
            width: 0.5, 
            height: 0.9  
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
        this._cVisSprite = new SpriteController().getSpriteObject(objDisplay.idSprite != undefined? objDisplay.idSprite: "ID_SPR_UPGRADE", 0.015);

        this._cVisSprite.setProperty("pColor",[0.0,1.0,0.0,1.0]);
        this._cVisSprite.setProperty("pOffset", [this._cRectangle.x + this._cRectangle.width/2 + this._cPos[0],this._cRectangle.y- this._cRectangle.height/2  + this._cPos[1],0]);

        this._cVisBack.setProperty("pColor",[0.0,0.0,0.0,1.0]);
        this._cVisBack.setProperty("pOffset", this._cPos);

        this._cVisCont.setProperty("pColor",objDisplay.type  == "PROJECTILE" ? [0.2902,0.1882,0.3216,1.0] : [0.4274,0.502,0.9804,1.0]);
        this._cVisCont.setProperty("pOffset", this._cPos);

        //TEXT
        this._cText = new TextCard(gm, objDisplay.name,objDisplay.description,this._transformRectangleWebglToCanvas(this._cTextRect));

        this._cCardHovered = false;
    }
    
    setNewActiveObject(obj){
        this._cObject = obj;
        this._cText.changeObject(obj.name,obj.description);
        this._cVisSprite = new SpriteController().getSpriteObject(obj.idSprite != undefined? obj.idSprite: "ID_SPR_UPGRADE", 0.015);
        this._cVisSprite.setProperty("pColor",[0.0,1.0,0.0,1.0]);
        this._cVisSprite.setProperty("pOffset", [this._cRectangle.x + this._cRectangle.width/2 + this._cPos[0],this._cRectangle.y- this._cRectangle.height/2  + this._cPos[1],0]);
        
        //Aqui canviarem el color de la linia de la carta depenent si es un upgrade o es una nova habilitat
        this._cVisCont.setProperty("pColor",obj.type  == "PROJECTILE" ? [0.2902,0.1882,0.3216,1.0] : [0.4274,0.502,0.9804,1.0]);
    }
    
    getActiveObject(){
        return this._cObject;
    }

    _transformRectangleWebglToCanvas(rect){
        //A causa que el canvas superior funciona per mida del mateix i no per (-1,-1) a (1,1), l'hem de aplicar la transformacio
        // Utilitzarem el fet de que coneixem que la mida del canvas es 1000x1000
        return {
            x:  ((rect.x + 1) / 2) * 1000,
            y: ((rect.y + 1) / 2)  * (-1000) + 1000,
            width: rect.width  * 1000,
            height: rect.height * (1000),
        }
    }

    /**
     * Donat un rectangle es vol obtenir un rectangle interior a distancia diff.
     * @param {Rectangle} rectangle 
     * @param {Double} diff 
     * @returns 
     */
    _calculateInnerRectanglePoints(rectangle, diff) {
    
        const topLeft = [rectangle.x + diff,                        rectangle.y - diff,0.0];
        const topRight = [rectangle.x + rectangle.width - diff ,    rectangle.y - diff,0.0];
        const bottomLeft = [rectangle.x + diff,                     rectangle.y - rectangle.height + diff,0.0];
        const bottomRight = [rectangle.x + rectangle.width - diff , rectangle.y - rectangle.height + diff,0.0];
    
        return [topLeft, topRight, bottomRight, bottomLeft, topLeft];
    }

    //GETTERS I SETTERS

    getVisBack(){
        return this._cVisBack;
    }

    getVisCont(){
        return this._cVisCont;
    }

    getVisSprite(){
        return this._cVisSprite;
    }

    // END GETTERS I SETTERS

    update(){

        //Animacio de la carta pujant o baixant si esta o no amb el cursos a sobre
        //No es capaç de detectar-ho i es necessari activar la booleana _cCardHovered.
        if(this._cCardHovered){
            this._cPos[1] = Math.min(0.15, this._cPos[1] + 0.01);
        }else if(this._cPos[1] > 0.0){
            this._cPos[1] = Math.max(0.0, this._cPos[1] - 0.02); 
        }
        this._cText.update((((this._cTextRect.y  + this._cPos[1]) + 1) / 2) * (-1000) + 1000);
        this._cVisSprite.setProperty("pOffset", [this._cRectangle.x + this._cRectangle.width/2 + this._cPos[0],this._cRectangle.y- this._cRectangle.height/2  + this._cPos[1],0]);

    }

    //Eliminar el text de la pantalla.
    clearText(){
        this._cText.clear();
    }
    /**
     * Eliminar la carta de la pantalla utilitzant el sistema de tiquets.
     */
    destroy(){
        if(this._cTicket == undefined)
            alert("Eliminant un element que no s'està mostrant per pantalla");
        else this._gameEngine.removeElement(this._cTicket,"Enemies");
    }

    /**
     * Funcio per donat un punt i el rectangle de la carta, determinar si el punt es dins de la carta.
     * @param {Array} vP 
     * @returns {Bool}
     */
    isPointInside(vP) {
        return vP[0] >= this._cRectangle.x && 
               vP[0] <= this._cRectangle.x + this._cRectangle.width &&
               vP[1] <= this._cRectangle.y && 
               vP[1] <= this._cRectangle.y + this._cRectangle.height;
    }

    // Activacio de l'animacio de la carta.

    setActive(){
        this._cCardHovered = true;
    }

    setOff(){
        this._cCardHovered = false;
    }
}

/**
 * Classe que expressa la part de text de la carta, mostrant-ho en el canvas superior.
 * @param {GameManager} gm - GameManagerActiu
 * @param {String} txtName - Nom de l'objecte de la carta
 * @param {String} txtDes - Descripcio de l'objecte de la carta
 * @param {Rectangle} rectPos - Mida de la carta en rectangle per motius de eliminar nomes la part necessaria
 * del canvas superior
 */
class TextCard{
    constructor(gm,txtName, txtDes, rectPos) {
        this._tcTxtName = txtName;
        this._tcTxtDes = txtDes;
        this._tcGameManager = gm;
        this._tcRectPos = rectPos;
        //Canvas superior
        this._tcCanvas = document.querySelector("#gCanvasText");
        this._tcCtx = this._tcCanvas.getContext("2d");

    }
    clear(){
        //Nomes netajem la part que hem escrit.
        this._tcCtx.clearRect(this._tcRectPos.x, this._tcRectPos.y, this._tcRectPos.width, this._tcRectPos.height);
    }

    /**
     * Funcio per canviar el valor del text i de la descripcio que esta mostrat la carta
     * @param {String} name 
     * @param {String} description 
     */
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
        const cXN = this._tcRectPos.x + (this._tcRectPos.width - textWidthC) / 2; //Restem i dividim entre dos per centrar cada text.
        const cYN = this._tcRectPos.y + this._tcRectPos.height / 6;
        this._tcCtx.fillText(this._tcTxtName,cXN, cYN );
        //DESC

        this._tcCtx.font = 'bold 1em Montserrat';
        this._tcCtx.fillStyle = 'white';
        this._tcTxtDesComp = this._tcTxtDes.split("\n"); //En StrItems marcarem cada frase amb la separacio \n i aqui ho tractem.

        const cYD = this._tcRectPos.y + this._tcRectPos.height - this._tcRectPos.height / 6;
        for(var i = 0; i < this._tcTxtDesComp.length; i++){
            const textWidth = this._tcCtx.measureText(this._tcTxtDesComp[i]).width;    
            const cXD = this._tcRectPos.x + (this._tcRectPos.width - textWidth) / 2;
            this._tcCtx.fillText(this._tcTxtDesComp[i],cXD, cYD + 20*i ); // 20*i indica la distancia entre cada linia
        }
    }

    update(offSetY){
        this._tcRectPos.y = offSetY;
        this.showText();
    }
}