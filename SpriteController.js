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
        this.pE2 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                    0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,
                    0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,
                    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                    0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,
                    0,0,1,1,0,1,1,0,1,1,1,0,0,0,0,0,
                    0,0,0,1,0,1,0,0,0,0,0,1,1,0,0,0,
                    0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,
                    0,1,0,0,0,0,1,0,1,0,0,0,0,0,1,0,
                    0,1,0,0,0,0,0,1,0,0,0,0,0,0,1,0,
                    0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,
                    0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,
                    0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0]
        this.pE2Size = [16,16];
        
        this.pO0 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                    0,0,0,0,1,1,1,0,0,0,1,1,1,0,0,0,
                    0,0,0,1,1,0,1,0,0,1,0,0,1,1,0,0,
                    0,0,0,1,0,1,1,1,0,1,0,1,1,1,0,0,
                    0,0,1,0,1,0,1,1,0,1,1,1,1,1,0,0,
                    0,0,1,1,1,1,1,0,0,0,1,1,1,0,0,0,
                    0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,
                    0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,
                    0,0,0,1,1,1,0,0,0,1,1,1,1,1,0,0,
                    0,0,1,1,1,1,1,0,1,1,0,1,0,1,0,0,
                    0,0,1,0,1,1,1,0,1,1,1,0,1,0,0,0,
                    0,0,1,0,0,1,1,0,0,1,0,1,1,0,0,0,
                    0,0,0,1,1,1,0,0,0,1,1,1,0,0,0,0,
                    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,]
        this.pO0Size = [16,16];

        this.pO1 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                    0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,
                    0,0,1,0,1,0,1,0,0,0,0,0,0,0,0,0,
                    0,1,0,1,0,1,0,1,0,0,0,0,0,0,0,0,
                    0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,
                    0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,
                    0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,
                    0,1,0,1,0,0,0,0,1,0,0,0,0,0,0,0,
                    0,0,1,0,1,0,0,1,0,1,0,0,0,0,0,0,
                    0,0,0,1,0,1,0,0,1,1,1,0,0,0,0,0,
                    0,0,0,0,1,0,1,0,0,1,1,1,1,0,0,0,
                    0,0,0,0,0,1,0,0,0,0,1,1,1,1,1,0,
                    0,0,0,0,1,0,1,0,0,0,1,1,1,1,1,0,
                    0,0,0,0,0,1,0,0,0,0,0,1,1,1,1,0,
                    0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,
                    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,]
        this.pO1Size = [16,16];

        this.pO2 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                    0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,
                    0,0,1,1,0,0,1,1,1,1,0,0,1,1,0,0,
                    0,1,1,0,0,0,1,0,0,1,0,0,0,1,1,0,
                    0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,
                    0,0,0,0,1,0,0,1,1,0,0,1,0,0,0,0,
                    0,0,1,1,0,0,1,0,0,1,0,0,1,1,0,0,
                    0,1,1,0,0,0,1,0,1,1,0,0,0,1,1,0,
                    0,1,1,0,0,0,1,1,1,1,0,0,0,1,1,0,
                    0,0,1,1,0,0,1,1,1,1,0,0,1,1,0,0,
                    0,0,0,1,0,0,0,1,1,0,0,1,0,0,0,0,
                    0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,
                    0,1,1,0,0,0,1,0,0,1,0,0,0,1,1,0,
                    0,0,1,1,0,0,1,1,1,1,0,0,1,1,0,0,
                    0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,
                    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,]
        this.pO2Size = [16,16];

        this.pO3 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                    0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,
                    0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,
                    0,0,1,1,1,0,1,0,0,0,0,0,0,0,0,0,
                    0,1,1,1,0,1,0,1,1,0,0,0,0,0,0,0,
                    0,0,1,0,1,0,0,0,0,1,1,1,0,0,0,0,
                    0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,
                    0,0,0,0,1,0,0,0,0,0,0,1,0,1,0,0,
                    0,0,0,0,1,0,0,0,0,0,1,0,1,0,1,0,
                    0,0,0,0,0,1,0,1,1,1,0,1,0,0,1,0,
                    0,0,0,0,0,1,0,1,1,1,1,0,1,0,1,0,
                    0,0,0,0,0,1,0,1,1,1,1,1,1,0,1,0,
                    0,0,0,0,0,0,1,0,1,1,1,1,0,1,0,0,
                    0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,
                    0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,
                    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
        this.pO3Size = [16,16];
        
        this.pO7 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                    0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,
                    0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,
                    0,0,0,1,1,1,1,1,0,1,0,0,0,0,0,0,
                    0,0,1,1,1,1,1,0,1,1,1,0,0,0,0,0,
                    0,1,0,1,1,1,1,1,1,1,1,1,1,0,0,0,
                    1,1,1,0,1,1,1,0,0,0,1,1,1,1,0,0,
                    1,1,1,0,1,1,0,1,1,1,0,1,1,1,1,0,
                    0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,
                    0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,
                    0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,
                    0,0,1,1,0,0,0,0,1,0,0,1,1,1,0,0,
                    0,1,1,1,0,0,0,1,1,1,0,0,1,1,0,0,
                    0,0,0,0,0,0,0,1,1,1,0,0,1,1,0,0,
                    0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,
                    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
        this.pO7Size = [16,16];

        this.pUp = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                    0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,
                    0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,
                    0,0,0,0,0,0,0,0,1,0,0,1,1,1,0,0,
                    0,0,0,0,0,0,0,1,1,0,1,1,1,1,1,0,
                    0,0,1,0,0,0,0,1,1,1,1,1,1,1,1,0,
                    0,1,0,1,0,0,0,0,0,1,1,1,1,0,0,0,
                    0,0,1,0,1,0,0,0,0,1,1,1,1,0,0,0,
                    0,1,0,1,0,0,0,0,1,1,1,1,1,0,0,0,
                    0,0,1,0,1,1,0,1,1,1,1,1,0,0,0,0,
                    0,0,1,1,1,0,1,1,1,1,1,1,0,0,0,0,
                    0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,
                    0,0,0,0,0,1,0,1,1,0,0,0,0,0,0,0,
                    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        this.pUpSize = [16,16];

        this.pT1 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                    0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,
                    0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,
                    0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                    0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                    0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,
                    0,0,0,1,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,1,1,0,1,1,1,1,
                    0,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,1,0,1,0,1,1,1,
                    0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,1,0,1,1,1,1,
                    0,0,1,0,0,0,0,0,1,0,1,0,1,0,1,0,1,0,0,0,1,0,1,0,0,0,0,1,0,0,0,0,
                    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        this.pT1Size = [32,16];

        this.pT3 = [0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,
                    0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,
                    0,0,0,0,1,0,0,1,0,0,0,1,1,0,1,0,
                    0,0,0,0,1,0,0,0,1,0,1,1,1,1,0,0,
                    0,0,1,0,0,0,1,0,0,1,1,0,1,1,0,0,
                    0,0,1,0,0,1,0,0,0,1,0,0,0,1,0,0,
                    0,0,0,0,1,1,0,0,0,1,1,0,1,1,0,0,
                    0,0,0,1,1,1,1,0,0,0,1,1,1,0,0,0,
                    0,0,1,1,0,1,1,0,1,1,0,0,0,0,0,0,
                    0,0,1,0,0,0,1,0,1,0,1,1,0,1,0,0,
                    0,0,1,1,0,1,1,0,0,1,1,1,1,0,1,0,
                    0,0,0,1,1,1,0,1,0,1,1,0,1,1,0,0,
                    0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,
                    0,0,1,0,0,1,0,0,0,1,1,0,1,1,0,0,
                    0,1,0,0,0,0,1,0,0,0,1,1,1,0,1,0,
                    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,]
        this.pT3Size = [16,16];
    }

    getSpriteObject(idS, sSize){
        switch (idS) {
            case "ID_PLAYER":
                return new EntitySprite(this.pS, this.pSSize[0], this.pSSize[1], sSize);
            case "ID_ENEMY1":
                return new EntitySprite(this.pE1, this.pE1Size[0], this.pE1Size[1], sSize);
            case "ID_ENEMY2":
                return new EntitySprite(this.pE2, this.pE2Size[0], this.pE2Size[1], sSize);

            // ICONS
            case "ID_SPR_WAND":
                return new EntitySprite(this.pO0, this.pO0Size[0], this.pO0Size[1], sSize);
            case "ID_SPR_SPLASH":
                return new EntitySprite(this.pO3, this.pO3Size[0], this.pO3Size[1], sSize);
            case "ID_SPR_WHIP":
                return new EntitySprite(this.pO1, this.pO1Size[0], this.pO1Size[1], sSize);
            case "ID_SPR_LIGHT":
                return new EntitySprite(this.pO7, this.pO7Size[0], this.pO7Size[1], sSize);
            // DEF:
            case "ID_ELE_WHIP":
                return new EntitySprite(this.pT1, this.pT1Size[0], this.pT1Size[1], sSize);
            case "ID_ELE_FLASK":
                return new EntitySprite(this.pT3, this.pT3Size[0], this.pT3Size[1], sSize);
            // UPGRADE:
            case "ID_SPR_UPGRADE":
                return new EntitySprite(this.pUp, this.pUpSize[0], this.pUpSize[1], sSize);
        }
    }
}