import { normalizeVector } from "./EntityObjects.js";
import { EntityLineStrip, EntityRegularPoligon, EntitySprite } from "./GameEngine.js";
import { SpriteController } from "./SpriteController.js";

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
        var objElement = undefined
        if(objSpawner.type == 'PROJECTILE'){
            switch(objSpawner.id){
                case 0:
                    objElement = new BulletContainer(this._bsGameManager,this._bsPlayer);
                break;
                case 1:
                    objElement = new WhipContainer(this._bsGameManager,this._bsPlayer);
                break;
                case 3:
                    objElement = new FlaskContainer(this._bsGameManager,this._bsPlayer);
                break;
                case 8:
                    objElement = new FireStickContainer(this._bsGameManager,this._bsPlayer);
                    console.log("ADDED FIRE FIRE");
                break;
            }
            this._bsListProjectilesId.push(objSpawner.id);
            this._bsListProjectiles.push(objElement);
            this.recursiveShooting(objElement);
        }else{
            var indexProjectile = this._bsListProjectilesId.indexOf(objSpawner.upgradeElement.idToUpgrade);
            this.applyUpgrade(objSpawner, this._bsListProjectiles[indexProjectile]);
        }  
    }

    applyUpgrade(obj, container){
        console.log(container);
        switch(obj.upgradeElement.valueToIncrement){
            case 'duration':
                container.changeDuration(obj.upgradeElement.increment);
            break;
            case 'freq':
                container.changeFreq(obj.upgradeElement.increment);
                console.log("AUGMENTED!!!");
            break;
            case 'quantity':
                container.changeQuantity(obj.upgradeElement.increment);
            break;
        }
    }

    shootEnemy(proj){
        console.log(proj)
        proj.shoot();
    }

    setPause(v){
        this._bsPause = v;
    }

    recursiveShooting(proj){
        if(!this._bsPause && proj.canSpawn())
            this.shootEnemy(proj);
    
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

    shoot(){
        for (let i = 0; i < this._opQuant; i++)
            this._gameManager.addElementBullet(this.getInstance());
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

class FlaskContainer extends ObjectProjectile{
    constructor(gm, player){
        super(gm,player);
        this._opFreq = 4000;
    }

    getInstance(){
        var b = new this.FInst(this._gameManager, this._opPlayer);
        return b;
    }

    FInst = class FlaskInst extends InstObjectProjectile{
        constructor(gm,player){
            super(gm,player);

            //START VALUES
            this._opForce = 0.7;
            this._opDuration = 2000;

            this._opCPoint = this._generateRandomPointInCircle(this._pPos,this._opForce);

            this._wiCollisonRectangle = {
                x: this._opCPoint [0] - 0.01* 16/2,
                y: this._opCPoint [1] - 0.01* 16/2,
                width: 0.01*16,
                height: 0.01*16
            };
            this._pVis = new SpriteController().getSpriteObject("ID_ELE_FLASK",0.01);
            this._pVis.setProperty("pOffset", [this._opCPoint[0],this._opCPoint[1],0.0]);
            this._pVis.setProperty("pColor",[1,0.7215,0.4745,1.0]);
            
            this._wiTimeToDespawn = false;
            setTimeout(()=> this._wiTimeToDespawn = true,this._opDuration );
        }

        _generateRandomPointInCircle(posP , f) {
            const angle = Math.random() * 2 * Math.PI;
            const randomRadius = Math.sqrt(Math.random()) * f;
            return [ posP[0] + randomRadius * Math.cos(angle), posP[1] + randomRadius * Math.sin(angle) ];
        }
          

        update(){
            var sEnemies = this._gameManager.getListEnemiesArea(this._wiCollisonRectangle);
            sEnemies.forEach(x => x[1].destroy());

            if(this._wiTimeToDespawn){
                this.destroy();
            }
        }
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
            this._pVis.setProperty("pOffset", [this._pPos[0] + 0.01*32/2 + 0.01*16/2,this._pPos[1]- 0.01*16/2,0.0]);
            this._pVis.setProperty("pColor",[0.4588,0.0901,0.3372,1.0]);

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
        this._opQuant = 1;
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
            this._pVis = new EntityRegularPoligon(3,this._pSize);
            this._pVis.setProperty("pOffset", [this._pPos[0] - (this._pSize )/2,this._pPos[1] - (this._pSize)/2,0.0]);
            this._pVis.setProperty("pColor",[0.6392,0.1569,0.3451,1.0]);
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

class FireStickContainer extends ObjectProjectile{
    constructor(gm, player){
        super(gm,player);
        this._bcNextEnemy = undefined;

        //CANVIAR PER ACTUALITZAR ELS VALORS
        this._opFreq = 2000;
        this._opQuant = 1;
    }

    canSpawn(){
        return true;
    }

    shoot(){
        //Angle Inicial
        const rA = Math.random() * 2 * Math.PI; 
        var r = this._generateUnitaryVectors(0.2,[Math.cos(rA),Math.sin(rA)], this._opQuant);
        console.log(r);
        r.forEach(x => this._gameManager.addElementBullet(this.getInstance(x)))
        
    }

    _generateUnitaryVectors(thetaOffset, thetaStart, numProjectiles) {
        // Calculate the increment angle between projectiles
        const incrementAngle = (2 * thetaOffset) / (numProjectiles - 1);
      
        // Calculate the rotation matrix based on the normalized start vector
        const rotationMatrix = [
          [Math.cos(incrementAngle), -Math.sin(incrementAngle)],
          [Math.sin(incrementAngle), Math.cos(incrementAngle)]
        ];
      
        // Initialize an array to store the unitary vectors
        const unitaryVectors = [];
      
        // Calculate the initial vector based on the normalized start vector
        let currentVector = thetaStart;
      
        for (let i = 0; i < numProjectiles; i++) {
          unitaryVectors.push(currentVector);
          // Rotate the current vector for the next projectile
          const x = currentVector[0] * rotationMatrix[0][0] + currentVector[1] * rotationMatrix[0][1];
          const y = currentVector[0] * rotationMatrix[1][0] + currentVector[1] * rotationMatrix[1][1];
          currentVector = [x, y];
        }
      
        return unitaryVectors;
    }

    getInstance(vStart){
        var b = new this.FSInst(this._gameManager, this._opPlayer, vStart);
        console.log("INSTANCIA FIRE");
        return b;
    }

    FSInst = class FireStickInst extends InstObjectProjectile{
        constructor(gm,player, pDirVector ){
            super(gm,player);
            this._pPos = [...this._iopPlayer.getPos()];

            this._fsCollisonRectangle = {
                x: this._pPos[0]- 0.01*10/2,
                y: this._pPos[1]- 0.01*10/2,
                width: 0.01*10,
                height: 0.01*10
            };

            this._pDir = pDirVector;

            this._pVel = 0.01;
            this._opDuration = 1000;

            this._pVis = new SpriteController().getSpriteObject("ID_ELE_FIRE",0.01);

            this._pVis.setProperty("pOffset", [this._pPos[0],this._pPos[1],0.0]);
            this._pVis.setProperty("pColor",[0.9176 + (1-0.9176),0.3843 + (0.7215-0.3843),0.3843 + (0.4745-0.3843),1.0]);

            this._wiTimeToDespawn = false;

            setTimeout(()=> this._wiTimeToDespawn = true,this._opDuration );

            this._fsActiveFrames = 0
        }

        update(){

            console.log(this._pPos);
            this._pPos[0] += this._pDir[0] * this._pVel;
            this._pPos[1] += this._pDir[1] * this._pVel;
            this._fsCollisonRectangle.x = this._pPos[0]- 0.01*10/2;
            this._fsCollisonRectangle.y = this._pPos[1]- 0.01*10/2;
           
            var sEnemies = this._gameManager.getListEnemiesArea(this._fsCollisonRectangle);
            sEnemies.forEach(x => x[1].destroy());
            
            this._pVis.setProperty("pOffset", [this._pPos[0],this._pPos[1],0.0]);
            this._fsActiveFrames += 10;
            
            const prog = this._fsActiveFrames / this._opDuration;
            console.log(prog);
            this._pVis.setProperty("pColor",[0.9176 + (1-0.9176) * prog,0.3843 + (0.7215-0.3843) * prog,0.3843 + (0.4745-0.3843) * prog,1.0]);


            if(this._wiTimeToDespawn){
                this.destroy();
            }
        }
    }
}


function closestEnemy(gm, b){
    return gm.getClosestEnemy(b);
}
