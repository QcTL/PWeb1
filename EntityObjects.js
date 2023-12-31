class BaseEntity{
    constructor(ge, IPos, IRealVect, IApunVect, IVis, ITopVel, ITurnVel){
        this._gameEngine = ge;
        this._pPos = IPos;
        this._pRealVect = IRealVect;
        this._pApunVect = IApunVect;
        this._pVis = IVis;
        this._pTopVel = ITopVel;
        this._pTurningVel = ITurnVel;
    }


    getVis(){
        return this._pVis;
    }

    getPos(){
        return this._pPos;
    }

    
    setTicket(t){
        this._pTicket = t;
    }
}

class Player extends BaseEntity{
    constructor(gm){
        let _sPS = 0.01
        super(gm,[0,0,0], [0,0], [0,0],
            new SpriteController().getSpriteObject("ID_PLAYER",_sPS),
            0.01);

        this._sPS = _sPS;
        this._pTurningVel = 0.5;
        this._pCurVel = 1;
        this._pMousePos = [0,0];

        this._pPlayerController = new PlayerController(this);
        this._pPlayerBulletSpawner = new BulletSpawner(this, gm);
        this._pPlayerBulletSpawner.start();

        this._pVis.setProperty("pColor",[0.4824,0.3294,0.502,1.0]);

        this._pLife = 100;
    }

    addObject(obj){
        this._pPlayerBulletSpawner.addObject(obj);
    }

    getController(){
        return this._pPlayerController;
    }

    setPause(v){
        this._pPlayerBulletSpawner.setPause(v);
    }

    setMousePos(vec){
        this._pMousePos = vec;
    }


    //LIFE
    tickDamage(){
        this._pLife -= 25;
        this._pDamageLabel.changeValue(this._pLife);
        if(this._pLife <= 0){
            this._gameEngine.endGame(undefined);
        }
    }

    setDamageLabel(dL){
        this._pDamageLabel = dL;
    }
    //END LIFE

    getRealVect(){
        return this._pRealVect;
    }

    update(){
        this._pPos[0] += this._pRealVect[0] * this._pCurVel;
        this._pPos[1] += this._pRealVect[1] * this._pCurVel;
        this._pRealVect[0] += (this._pApunVect[0] - this._pRealVect[0])* this._pTurningVel;
        this._pRealVect[1] += (this._pApunVect[1] - this._pRealVect[1])* this._pTurningVel;
        
        this._pApunVect[0] = this._pMousePos[0] - this._pPos[0];
        this._pApunVect[1] = this._pMousePos[1] - this._pPos[1];

        this._pCurVel = (this._pApunVect[0] * this._pApunVect[0] + this._pApunVect[1] * this._pApunVect[1]) > 0.0005?
                this._pTopVel : 0;

        normalizeVector(this._pApunVect);
        normalizeVector(this._pRealVect);
        this._pVis.setProperty("pFlip", this._pRealVect[0] < -0.1 );
        this._pVis.setProperty("pOffset", [this._pPos[0],this._pPos[1],0.0])
    }
}

class Point{
    constructor(ge, player,sPos){
        this._gameEngine = ge;
        this._pPlayer = player;
        this._pTicket = undefined;


        this._pTurningVel = 0.8;
        this._pRealVect = [0,0];
        this._pApunVect = [0,0];
        this._pPos = sPos;
        this._pVel = 0.02;
        this._pSize = 0.02;
        this._pWidth = 0.015;
        let s = this._pSize;
        this._pVis = new EntityOutLine([[-s,0],[s,0],[0,-s],[0,s]], this._pWidth);
        this._pVis.setProperty("pOffset", [this._pPos[0] - (3*0.03)/2,this._pPos[1]- (3*0.03)/2,0.0])
        this._pVis.setProperty("pColor",[1.0,0.7216,0.4745,0.0])
    }

    getVis(){
        return this._pVis;
    }

    distPlayer(){
        let x = this._pPos[0] - this._pPlayer.getPos()[0];
        let y = this._pPos[1] - this._pPlayer.getPos()[1];
        return x*x + y*y;
    }

    
    setTicket(t){
       this._pTicket = t;
    }

    destroy(){
        if(this._pTicket == undefined)
            alert("Eliminant un element que no s'està mostrant per pantalla");
        else this._gameEngine.removeElement(this._pTicket,"Points");
    }

    update(){
        let d = this.distPlayer();
        if(d < 0.001){
            this.destroy();
        }else if(d < 0.1){
            this._pPos[0] += this._pRealVect[0] * this._pVel;
            this._pPos[1] += this._pRealVect[1] * this._pVel;
            this._pRealVect[0] += (this._pApunVect[0] - this._pRealVect[0])* this._pTurningVel;
            this._pRealVect[1] += (this._pApunVect[1] - this._pRealVect[1])* this._pTurningVel;
            
            this._pApunVect[0] = this._pPlayer.getPos()[0] - this._pPos[0];
            this._pApunVect[1] = this._pPlayer.getPos()[1] - this._pPos[1];
            normalizeVector(this._pApunVect);
            normalizeVector(this._pRealVect);
            this._pVis.setProperty("pOffset", [this._pPos[0] - (3*0.03)/2,this._pPos[1]- (3*0.03)/2,0.0])
       
        } 
    }
}

class Enemy extends BaseEntity{
    constructor(ge, player, life, type, pos = undefined){
        let tPos = pos != undefined ? pos : [Math.random()*2 - 1,Math.random()*2 - 1,0] 
        let _sPS = 0.01
        super(ge,tPos,[0,0],[0,0],new SpriteController().getSpriteObject("ID_ENEMY" + type,_sPS),1,0.5);
        this._pVel = 0.005;
        this._pPlayer = player; 
        this._pPursuedBullet = false;

        this._pLife = life;

        this._pVis.setProperty("pColor",[0.2902,0.1882,0.3216,1.0]);
        this._pVis.setProperty("pOffset", [this._pPos[0],this._pPos[1],0.0]);
    }

    setPursued(){
        this._pPursuedBullet = true;
    }

    isPursued(){
        return this._pPursuedBullet;
    }
 
    getSize(){
        return 0.10;
    }

    isInsideEnemies(pX,pY,sPos){
        return this._gameEngine.isInsideAny(pX,pY,sPos);
    }

    update(){
        if(!this.isInsideEnemies(this._pRealVect[0] * this._pVel + this._pPos[0],this._pRealVect[1] * this._pVel + this._pPos[1], this._pPos)){
            this._pPos[0] += this._pRealVect[0] * this._pVel;
            this._pPos[1] += this._pRealVect[1] * this._pVel;
        }

        if( (this._pPos[0] - this._pPlayer.getPos()[0])*(this._pPos[0] - this._pPlayer.getPos()[0]) + 
            (this._pPos[1] - this._pPlayer.getPos()[1])*(this._pPos[1] - this._pPlayer.getPos()[1]) < 0.01){
            this._pPlayer.tickDamage();
        }
    
        this._pRealVect[0] += (this._pApunVect[0] - this._pRealVect[0])* this._pTurningVel;
        this._pRealVect[1] += (this._pApunVect[1] - this._pRealVect[1])* this._pTurningVel;
        
        this._pApunVect[0] = this._pPlayer.getPos()[0] - this._pPos[0];
        this._pApunVect[1] = this._pPlayer.getPos()[1] - this._pPos[1];
        normalizeVector(this._pApunVect);
        normalizeVector(this._pRealVect);

        this._pVis.setProperty("pFlip", this._pRealVect[0] < -0.1 );
        this._pVis.setProperty("pOffset", [this._pPos[0],this._pPos[1],0.0]);
    }
    
    removePointLife(v){
        this._pLife -= v
        this._pPursuedBullet = false;
        if(this._pLife <= 0){
            this.destroy();
        }
    }

    destroy(){
        if(Math.random() > 0.5){
            this._gameEngine.addElementPoint([this._pPos[0],this._pPos[1], -0.1]);
        }

        if(this._pTicket == undefined)
            alert("Eliminant un element que no s'està mostrant per pantalla");
        else this._gameEngine.removeElement(this._pTicket,"Enemies");
    }
}

/**
 * Funció per normalitzar un vector
 * @param {Array} vect - Vector a normalitzar
 * Normalitza per referencia per evitar assignaments i creació de variables en cada cicle.
 */
function normalizeVector(vect){
    const mag = Math.sqrt(vect[0]*vect[0] + vect[1]*vect[1]);
    if(mag != 0){
        vect[0] /= mag;
        vect[1] /= mag; 
    }
}