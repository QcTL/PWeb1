/**
 * @param {Player} parent - El objecte que disparara els projectils, en aquest cas el jugador
 * @param {GameManager} gm - El GameManager actiu que s'esta mostrant en pantalla
 */
class BulletSpawner{
    constructor(parent, gm){
        this._bsIsShooting = true;
        this._bsGameManager = gm;
        this._bsPlayer = parent;

        //El valor de pausa que se li donara per poder deixar de generar projectils
        this._bsPause = false;

        // Llista dels containers que contenen la informacio necessaria per generar un projectil
        this._bsListProjectiles = [ new BulletContainer(gm, parent)];
        // El valor de les id de la llista anterior.
        this._bsListProjectilesId = [0];
    }

    start(){
        // Començament del bucle recursiu per els projectius associats en l'inici
        this._bsListProjectiles.forEach(x => this.recursiveShooting(x));
    }

    addObject(objSpawner){
        var objElement = undefined
        if(objSpawner.type == 'PROJECTILE'){
            //A causa que ens retornarant un objecte de classe StrItems, aquest no te la informacio de com generar, per aixo cada projectil te associat un container
            //En el seguent switch assosiarem els diversos id dels objectes que tenim a StrItems a Objectes JS XXXXContainer.
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
                case 7:
                    objElement = new SkyContainer(this._bsGameManager, this._bsPlayer);
                break;
                case 8:
                    objElement = new FireStickContainer(this._bsGameManager,this._bsPlayer);
                break;
            }

            //Un cop afeguits, començarem la seva execucio recursiva.
            this._bsListProjectilesId.push(objSpawner.id);
            this._bsListProjectiles.push(objElement);
            this.recursiveShooting(objElement);
        }else{
            var indexProjectile = this._bsListProjectilesId.indexOf(objSpawner.upgradeElement.idToUpgrade);
            this.applyUpgrade(objSpawner, this._bsListProjectiles[indexProjectile]);
        }  
    }

    applyUpgrade(obj, container){
        // L'altre cas es que sigui un objecte de millora de un projectil, per aixo tenim la llista de indexs, simplement aconseguim el container
        // donat el id i canviem els seus valors.
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
        proj.shoot();
    }

    setPause(v){
        this._bsPause = v;
    }

    /**
     * 
     * @param {Container} proj - Projectil que s'esta executant en aquell moment 
     */
    recursiveShooting(proj){
        // Si no esta en pausa, i pot disparar el projectil, crida la funcio del container que generara un projectil i l'afeguira a GameEngine.
        if(!this._bsPause && proj.canSpawn())
            this.shootEnemy(proj);
    
        //Crida recursiva temporal
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
            
            //Temps abans de desapareixer
            this._wiTimeToDespawn = false;
            setTimeout(()=> this._wiTimeToDespawn = true,this._opDuration );
        }

        // Funcio per generar el foc en un punt aleatori al voltant del personatge.
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
        this._opDuration = 2000;
    }

    shoot(){
        for (let i = 0; i < this._opQuant; i++)
            this._gameManager.addElementBullet(this.getInstance(i));
    }

    getInstance(pWip){
        var b = new this.WInst(this._gameManager, this._opPlayer, pWip);
        return b;
    }

    WInst = class WhipInst extends InstObjectProjectile{
        constructor(gm,player, pWip){
            super(gm,player);
            this._opDuration = 500;
            this._wiCollisonRectangle = {
                x: this._pPos[0] ,     // 
                y: this._pPos[1] -  0.01*20/2 - this._pWip*0.1,   // y-coordinate of the top-left corner
                width: 0.01*40, // width of the rectangle
                height: 0.01*20  // height of the rectangle
            };

            this._pWip = pWip;

            this._pVis = new SpriteController().getSpriteObject("ID_ELE_WHIP",0.01);
            this._pVis.setProperty("pOffset", [this._pPos[0] + 0.01*32/2 + 0.01*16/2, this._pPos[1]- 0.01*16/2 - this._pWip*0.1,0.0]);
            this._pVis.setProperty("pColor",[0.4588,0.0901,0.3372,1.0]);

            this._pPos = this._iopPlayer.getPos();
            this._wiTimeToDespawn = false;

            // Aquest objecte canviara de direccio en mitat de la seva execucio, aixi que tindrem un 
            // temportizador per aquest canvi i per el fet de desapareixer.
            this._isFlip = false;
            setTimeout(()=> this._wiTimeToDespawn = true,this._opDuration );
            setTimeout(()=> this._isFlip = true,this._opDuration/2);
        }

        update(){
            this._pPos = this._iopPlayer.getPos();
            var res =  this._isFlip ? this._wiCollisonRectangle.width: 0;
            this._wiCollisonRectangle.x = this._pPos[0] - res - this._pWip*0.1;
            this._wiCollisonRectangle.y = this._pPos[1] -  0.01*20/2;

            var sEnemies = this._gameManager.getListEnemiesArea(this._wiCollisonRectangle);
            sEnemies.forEach(x => x[1].destroy());
            
            if(!this._isFlip){
                this._pVis.setProperty("pOffset", [this._pPos[0] + 0.01*32/2 + 0.01*16/2,this._pPos[1] - 0.01*16/2 - this._pWip*0.1,0.0]);
            }else{
                this._pVis.setProperty("pOffset", [this._pPos[0] - 0.01*32/2 - 0.01*16/2,this._pPos[1] - 0.01*16/2 - this._pWip*0.1,0.0]);
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
        
        //Directament a enemic que ha estat assigant en la seva execucio.
        update(){
            this._pDir[0] = this._pEnemy.getPos()[0] - this._pPos[0];
            this._pDir[1] = this._pEnemy.getPos()[1] - this._pPos[1];
            
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
        // Si es dispara més d'un a la vegada, que tots surtin amb un angle lleugerament different.
        // El angle estara representat amb vectors unitaris per poder fer més senzill el seu calcul.
        var r = this._generateUnitaryVectors(0.2,[Math.cos(rA),Math.sin(rA)], this._opQuant);
        r.forEach(x => this._gameManager.addElementBullet(this.getInstance(x)));
    }

    _generateUnitaryVectors(thetaOffset, thetaStart, numProjectiles) {
        // Calcular el increment de l'angle que ha de tenir cada objecte
        const incrementAngle = (2 * thetaOffset) / (numProjectiles - 1);
      
        // Calculate the rotation matrix based on the normalized start vector
        // Calcular la matriu de rotacio que se li assignara a cada objecte.
        const rotationMatrix = [
          [Math.cos(incrementAngle), -Math.sin(incrementAngle)],
          [Math.sin(incrementAngle), Math.cos(incrementAngle)]
        ];
    
        const unitaryVectors = [];
      
        // Angle inicial al qual tot estara "offset"
        let currentVector = thetaStart;
      
        for (let i = 0; i < numProjectiles; i++) {
          unitaryVectors.push(currentVector);
          // Calcul de rotacio de cada un dels projectils.
          const x = currentVector[0] * rotationMatrix[0][0] + currentVector[1] * rotationMatrix[0][1];
          const y = currentVector[0] * rotationMatrix[1][0] + currentVector[1] * rotationMatrix[1][1];
          currentVector = [x, y];
        }
      
        return unitaryVectors;
    }

    getInstance(vStart){
        var b = new this.FSInst(this._gameManager, this._opPlayer, vStart);
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
            this._pPos[0] += this._pDir[0] * this._pVel;
            this._pPos[1] += this._pDir[1] * this._pVel;
            this._fsCollisonRectangle.x = this._pPos[0]- 0.01*10/2;
            this._fsCollisonRectangle.y = this._pPos[1]- 0.01*10/2;
           
            var sEnemies = this._gameManager.getListEnemiesArea(this._fsCollisonRectangle);
            sEnemies.forEach(x => x[1].destroy());
            
            this._pVis.setProperty("pOffset", [this._pPos[0],this._pPos[1],0.0]);
            this._fsActiveFrames += 10;
            
            const prog = this._fsActiveFrames / this._opDuration;
            //Canvi del color del foc de forma linial entre dos valors preseleccionats.
            this._pVis.setProperty("pColor",[0.9176 + (1-0.9176) * prog,0.3843 + (0.7215-0.3843) * prog,0.3843 + (0.4745-0.3843) * prog,1.0]);


            if(this._wiTimeToDespawn){
                this.destroy();
            }
        }
    }
}

class SkyContainer extends ObjectProjectile{
    constructor(gm, player){
        super(gm,player);
        
        //CANVIAR PER ACTUALITZAR ELS VALORS
        this._opFreq = 4000;
        this._opQuant = 1;
    }

    canSpawn(){
        return true;
    }

    shoot(){
        //Angle Inicial, Separats 
        const rA = Array.from({ length: this._opQuant }, (_, i) => (2 * Math.PI * i) / this._opQuant);
        console.log(rA);
        rA.forEach(x => this._gameManager.addElementBullet(this.getInstance(x)));
        //this._gameManager.addElementBullet(this.getInstance(sAngle));
    }

    getInstance(sAngle){
        var b = new this.SkyInst(this._gameManager, this._opPlayer, sAngle);
        return b;
    }

    SkyInst = class SkyOrbitalInst extends InstObjectProjectile{
        constructor(gm,player, sAngle){
            super(gm,player);
            this._pPos = this._iopPlayer.getPos();
            this._skyPos = [...this._pPos];

            this._skyCollisonRectangle = {
                x: this._skyPos[0]- 0.01*10/2,
                y: this._skyPos[1]- 0.01*10/2,
                width: 0.01*10,
                height: 0.01*10
            };

            this._pVel = 0.01;
            this._pAngle = sAngle;
            this._pRadius = 0.4;
            this._opDuration = 2000;

            this._pVis = new SpriteController().getSpriteObject("ID_ELE_SKY",0.01);

            this._pVis.setProperty("pOffset", [this._skyPos[0],this._skyPos[1],0.0]);
            this._pVis.setProperty("pColor",[0.9176 + (1-0.9176),0.3843 + (0.7215-0.3843),0.3843 + (0.4745-0.3843),1.0]);

            this._wiTimeToDespawn = false;

            setTimeout(()=> this._wiTimeToDespawn = true,this._opDuration );

            this._fsActiveFrames = 0
        }

        update(){
            this._pAngle += this._pVel;
            this._skyPos[0] = this._pPos[0] + this._pRadius * Math.cos(this._pAngle);
            this._skyPos[1] = this._pPos[1] + this._pRadius * Math.sin(this._pAngle); 
            
            this._skyCollisonRectangle.x = this._skyPos[0]- 0.01*10/2;
            this._skyCollisonRectangle.y = this._skyPos[1]- 0.01*10/2;
           
            var sEnemies = this._gameManager.getListEnemiesArea(this._skyCollisonRectangle);
            sEnemies.forEach(x => x[1].destroy());
            
            this._pVis.setProperty("pOffset", [this._skyPos[0],this._skyPos[1],0.0]);
            this._fsActiveFrames += 10;
            
            const prog = this._fsActiveFrames / this._opDuration;
            this._pVis.setProperty("pColor",[0.9176 + (1-0.9176) * prog,0.3843 + (0.7215-0.3843) * prog,0.3843 + (0.4745-0.3843) * prog,1.0]);


            if(this._wiTimeToDespawn){
                this.destroy();
            }
        }
    }
}

/**
 * Retorn el enemic més proxim a la bala disparada.
 * @param {GameEngine} gm 
 * @param {BulletContainer} b 
 * @returns {Enemy}
 */
function closestEnemy(gm, b){
    return gm.getClosestEnemy(b);
}
// Per ara aquesta funció només l'utilitza la Bullet.
