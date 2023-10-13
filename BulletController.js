import { normalizeVector } from "./EntityObjects.js";
import { EntityLineStrip, EntityRegularPoligon, EntitySprite } from "./GameEngine.js";
import { SpriteController } from "./SpriteController.js";

export class BulletSpawner{
    constructor(parent, gm){
        this._bsIsShooting = true;
        this._bsGameManager = gm;
        this._bsPlayer = parent;
        this._bsPause = false;

        //this._bsListProjectiles = [ new BulletContainer(gm, parent)];
        this._bsListProjectiles = [ new WhipContainer(gm, parent)];
        this._bsListProjectilesId = [0];
    }

    start(){
        this._bsListProjectiles.forEach(x => this.recursiveShooting(x));
    }

    addObject(objSpawner){
        //this._bsListProjectiles.push(objSpawner);
        //this.recursiveShooting(objSpawner);
        var objElement = undefined
        if(objSpawner.type == 'PROJECTILE'){
            switch(objSpawner.id){
                case 0:
                    objElement = new BulletContainer(this._bsGameManager,this._bsPlayer);
                break;
                case 1:
                    objElement = new WhipContainer(this._bsGameManager,this._bsPlayer);
                    console.log("AFEGUIT ITEM");
                break;
                case 3:
                    objElement = new BulletContainer(this._bsGameManager,this._bsPlayer);
                break;
            }
            this._bsListProjectilesId.push(objSpawner.id);
            this.recursiveShooting(objElement);
        }else{
            this.applyUpgrade(objSpawner, this._bsListProjectiles[this._bsListProjectilesId.indexOf(objSpawner.upgradeElement.idToUpgrade)]);
        }  
    }

    applyUpgrade(obj, container){
        switch(obj.upgradeElement.valueToIncrement){
            case 'duration':
                container.changeDuration(obj.upgradeElement.increment);
            break;
            case 'freq':
                container.changeFreq(obj.upgradeElement.increment);
            break;
            case 'quantity':
                container.changeQuantity(obj.upgradeElement.increment);
            break;
        }
    }

    shootEnemy(proj){
        this._bsGameManager.addElementBullet(proj.getInstance()); //TODO COMPLETE
    }

    setPause(v){
        this._bsPause = v;
    }

    recursiveShooting(proj){
        console.log(proj)
        for(let i = 0; i < proj.getQuant(); i += 1){
            if(!this._bsPause && proj.canSpawn())
                this.shootEnemy(proj);
        }
        if(this._bsIsShooting)
            setTimeout(()=> this.recursiveShooting(proj),proj.getFreq());
    }
}


class ObjectProjectile{
    constructor(gm, player){

        this._gameManager = gm;
        this._opPlayer = player;
        this._opDuration = 1000;
        this._opFreq = 1000;
        this._opQuant = 1;
    }

    changeDuration(v){
        this._opDuration += v;
    }

    changeFreq(v){
        this._opFreq += v;
    }

    changeQuantity(v){
        this._opQuant += v;
    }

    getFreq(){
        return this._opFreq;
    }

    getQuant(){
        return this._opQuant;
    }

    getDuration(){
        return this._opDuration;
    }

    getInstance(){
        // ABSTARACT
    }

    canSpawn(){
        return true;
    }
}

class InstObjectProjectile{
    constructor(gm,player){
        this._gameManager = gm;
        this._iopPlayer = player;
        this._pPos = [player.getPos()[0],player.getPos()[1],0.0];
    }

    setTicket(t){
        this._pTicket = t;
    }

    getPos(){
        return this._pPos;
    }

    destroy(){
        if(this._pTicket == undefined)
            alert("Eliminant un element que no s'està mostrant per pantalla");
        else this._gameManager.removeElement(this._pTicket,"Bullets");
    }

    update(){}

    getVis(){
        return this._pVis;
    }
}


class WhipContainer extends ObjectProjectile{
    constructor(gm, player){
        super(gm,player);
    }

    getInstance(){
        var b = new this.WInst(this._gameManager, this._opPlayer);
        return b;
    }

    WInst = class WhipInst extends InstObjectProjectile{
        constructor(gm,player){
            super(gm,player);
            this._opDuration = 750;
            this._wiCollisonRectangle = {
                x: this._pPos[0] ,     // 
                y: this._pPos[1] -  0.01*20/2,     // y-coordinate of the top-left corner
                width: 0.01*40, // width of the rectangle
                height: 0.01*20  // height of the rectangle
            };
            this._pVis = new SpriteController().getSpriteObject("ID_ELE_WHIP",0.01);
            /*this._pVis = new EntityLineStrip([0.0,0.0,0.0,
                this._wiCollisonRectangle.width,0.0,0.0,
                this._wiCollisonRectangle.width,this._wiCollisonRectangle.height,0.0,
                0,this._wiCollisonRectangle.height,0.0,
                
                0,0,0.0,    
            ])*/
            this._pVis.setProperty("pOffset", [this._pPos[0] + 0.01*32/2 + 0.01*16/2,this._pPos[1]- 0.01*16/2,0.0]);

            this._pPos = this._iopPlayer.getPos();
            this._wiTimeToDespawn = false;
            this._isFlip = false;
            setTimeout(()=> this._wiTimeToDespawn = true,this._opDuration );
            setTimeout(()=> this._isFlip = true,this._opDuration/2);
        }

        update(){
            this._pPos = this._iopPlayer.getPos();
            var res =  this._isFlip ? this._wiCollisonRectangle.width: 0;
            //this._wiCollisonRectangle.x = this._pPos[0] - res;
            //this._wiCollisonRectangle.y = this._pPos[1] - 0.2/2;
            this._wiCollisonRectangle.x = this._pPos[0] - res;
            this._wiCollisonRectangle.y = this._pPos[1] -  0.01*20/2;

            var sEnemies = this._gameManager.getListEnemiesArea(this._wiCollisonRectangle);
            console.log(sEnemies);
            sEnemies.forEach(x => x[1].destroy());
            
            if(!this._isFlip){
                this._pVis.setProperty("pOffset", [this._pPos[0] + 0.01*32/2 + 0.01*16/2,this._pPos[1] - 0.01*16/2,0.0]);
            }else{
                this._pVis.setProperty("pOffset", [this._pPos[0] - 0.01*32/2 - 0.01*16/2,this._pPos[1] - 0.01*16/2,0.0]);
            }
            this._pVis.setProperty("pFlip",this._isFlip);
            
            //this._pVis.setProperty("pOffset", [0.0,0.0,0.0]);
            if(this._wiTimeToDespawn){
                this.destroy();
            }
        }
    }

}

class BulletContainer extends ObjectProjectile{
    constructor(gm, player){
        super(gm,player);
        this._bcNextEnemy = undefined;

        //CANVIAR PER ACTUALITZAR ELS VALORS
        this._opFreq = 1000;
        this._opQuant = 2;
    }

    canSpawn(){
        this._bcNextEnemy = closestEnemy(this._gameManager, this._opPlayer.getPos());
        return this._bcNextEnemy != undefined;
    }

    getInstance(){
        var b = new this.BInst(this._gameManager, this._opPlayer);
        b.setEnemy(this._bcNextEnemy);
        return b;
    }

    BInst = class BulletInst extends InstObjectProjectile{
        constructor(gm,player){
            super(gm,player);
            
            this._pDir = [0,0];
            this._pVel = 0.01;
            this._pSize = 0.03;
            this._pVis = new EntityRegularPoligon(6,this._pSize);
            this._pVis.setProperty("pOffset", [this._pPos[0] - (this._pSize )/2,this._pPos[1] - (this._pSize)/2,0.0])
        }
        
        setEnemy(enemy){
            this._pEnemy = enemy;
            enemy.setPursued();
        }
        
        //Directament a enemic
        update(){
            this._pDir[0] = this._pEnemy.getPos()[0] - this._pPos[0];
            this._pDir[1] = this._pEnemy.getPos()[1] - this._pPos[1];
            // ? this._pEnemy.destroy() : none;
            
            if((this._pDir[0]*this._pDir[0] + this._pDir[1]*this._pDir[1]) < 0.01){
                this._pEnemy.removePointLife(1);
                this.destroy();
            }

            normalizeVector(this._pDir);
            this._pPos[0] += this._pDir[0] * this._pVel;
            this._pPos[1] += this._pDir[1] * this._pVel;

            this._pVis.setProperty("pOffset", [this._pPos[0] - (this._pSize )/2,this._pPos[1]- (this._pSize)/2,0.0])
        }
    }
}

function closestEnemy(gm, b){
    return gm.getClosestEnemy(b);
}
