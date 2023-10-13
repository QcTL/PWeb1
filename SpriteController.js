import { EntitySprite } from "./GameEngine.js";

export class SpriteController{
    constructor(){
        if(typeof SpriteController.instance === "object"){
            return SpriteController.instance;
        }

        SpriteController.instance = this;
        this.loadSprites();
        return this;
    }

    /**
     * Carrega en memoria de la classe la informacio que descriu els sprites
     */
    loadSprites(){
        this.pS=   [0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,0,
                    0,1,1,1,0,0,1,1,0,0,1,1,1,1,1,1,
                    0,1,1,0,0,0,1,1,1,1,1,1,1,1,1,0,
                    0,1,1,0,0,0,0,0,1,1,1,1,1,1,0,0,
                    0,1,1,1,0,0,1,0,0,1,1,1,1,0,0,0,
                    0,1,1,1,0,1,1,0,1,0,1,1,1,1,0,0,
                    0,1,1,0,1,0,0,1,1,0,0,0,1,1,0,0,
                    0,1,1,0,1,1,0,0,0,0,0,1,0,0,0,0,
                    0,0,1,0,1,1,1,0,0,0,1,1,1,0,0,0,
                    0,1,1,0,0,1,1,1,1,1,1,1,1,1,0,0,
                    0,1,1,0,1,0,1,1,1,1,1,1,1,1,0,0,
                    0,1,0,0,1,1,0,1,1,1,0,1,1,1,0,0,
                    0,1,1,0,0,1,1,0,0,0,1,1,1,0,0,0,
                    0,1,1,0,0,1,1,1,1,1,1,1,1,0,0,0,
                    0,1,1,0,0,0,1,1,1,1,1,1,0,0,0,0,
                    0,0,1,0,0,0,1,1,0,0,1,1,0,0,0,0];
        this.pSSize = [16,16];
        this.pE1 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                    0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,
                    0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,
                    0,0,0,0,0,0,1,0,1,0,1,1,0,0,0,0,
                    0,0,0,0,0,0,1,0,1,0,1,1,0,0,0,0,
                    0,0,1,1,1,0,1,1,0,1,1,1,0,0,0,0,
                    0,1,1,1,1,0,1,0,1,0,1,0,0,0,0,0,
                    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                    0,1,1,1,1,1,1,0,0,1,0,1,0,0,0,0,
                    0,0,1,1,1,1,1,1,1,1,0,1,0,0,0,0,
                    0,0,0,0,0,0,1,1,1,0,1,1,0,0,0,0,
                    0,0,0,0,0,0,0,1,0,1,1,0,0,0,0,0,
                    0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,
                    0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,
                    0,0,0,0,0,0,1,1,0,1,1,1,0,0,0,0,
                    0,0,0,0,0,0,1,1,0,1,1,0,0,0,0,0]
        this.pE1Size = [16,16];
    }

    /**
     * Otorga objectes Entity donat la Id i la mida
     * @param {String} idS - El id del Sprite que es vol mostrar
     * @param {Float} sSize - La mida que tindra cada bloc del objecte a mostrar
     * @returns {EntitySprite} EntitySprite - Una classe mostrable
     */
    getSpriteObject(idS, sSize){
        switch (idS) {
            case "ID_PLAYER":
                return new EntitySprite(this.pS, this.pSSize[0], this.pSSize[1], sSize);
            case "ID_ENEMY1":
                return new EntitySprite(this.pE1, this.pE1Size[0], this.pE1Size[1], sSize);
        }
    }
}