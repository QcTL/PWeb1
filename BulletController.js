import { normalizeVector } from "./EntityObjects.js";
import { EntityRegularPoligon, EntitySprite } from "./GameEngine.js";

export class BulletSpawner{
    constructor(parent, gm){
        this._bsIsShooting = true;
        this._bsGameManager = gm;
        this._bsPlayer = parent;
        this._bsPause = false;

        this._bsListProjectiles = [ new BulletContainer(gm, parent)];
        this._bsListProjectilesId = [0];
    }

    start(){
        this._bsListProjectiles.forEach(x => this.recursiveShooting(x));
    }

    addObject(objSpawner){
        //this._bsListProjectiles.push(objSpawner);
        //this.recursiveShooting(objSpawner);
        objElement = undefined
        if(objSpawner.type == 'PROJECTILE'){
            switch(objSpawner.id){
                case 0:
                    objElement = new BulletContainer(his._bsGameManager,this._bsPlayer);
                break;
                case 1:
                    objElement = new WhipContainer(his._bsGameManager,this._bsPlayer);
                break;
                case 3:
                    objElement = new BulletContainer(his._bsGameManager,this._bsPlayer);
                break;
            }
            this._bsListProjectilesId.push(objSpawner.id);
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
            this._pVis = new EntitySprite(6,this._pSize); //TODO
            this._pVis.setProperty("pOffset", [this._pPos[0] - (this._pSize )/2,this._pPos[1] - (this._pSize)/2,0.0])

            this._pPos = player.getPos();
            this._wiCollisonRectangle = {
                x: this._pPos[0] - 0.2/2,     // 
                y: this._pPos[1] - 0.2/2,     // y-coordinate of the top-left corner
                width: 0.4, // width of the rectangle
                height: 0.4  // height of the rectangle
            };
            this._wiTimeToDespawn = false;
            setTimeout(()=> this._wiTimeToDespawn = true,1000);
        }

        update(){
            this._pPos = player.getPos();
            this._wiCollisonRectangle.x = this._pPos[0] - 0.2/2;
            this._wiCollisonRectangle.y = this._pPos[1] - 0.2/2;

            sEnemies = this._gameManager.getListEnemiesArea(this._wiCollisonRectangle); //TODO No existeix pero haria de ser facil, fes que tot sumi +1, aixi no hi ha negatiu.
            sEnemies.forEach(x => x.destroy());

            this._pVis.setProperty("pOffset", [this._pPos[0] - (this._pSize )/2,this._pPos[1] - (this._pSize)/2,0.0]);

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
