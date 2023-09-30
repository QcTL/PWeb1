import { EntityOutLine, EntityRegularPoligon, EntitySprite } from "./mGame.js"

class PlayerController{
    constructor(parent){
        this.gCanvas = document.getElementById("gCanvas");
        const ctx = this.gCanvas.getContext("2d");
        this.gParent = parent;

        this.gCanvas.addEventListener('mousemove', this.mouseMoved.bind(this));
    }

    mouseMoved(event){
        const rectGCanvas = this.gCanvas.getBoundingClientRect();
        this.gParent.setMousePos([((event.clientX - rectGCanvas.left)/rectGCanvas.width*2) - 1, ((rectGCanvas.height - event.clientY - rectGCanvas.top)/rectGCanvas.height*2)-1]);
    }
}

class BulletSpawner{
    constructor(parent, gm){
        this._bsFireRate = 5000;
        this._bsNFired = 1;
        this._bsLifeBullet = 1; //How many enemies does a single bullet kill

        this._bsIsShooting = true;
        this._bsGameManager = gm;
        this._bsPlayer = parent;
    }

    shootEnemy(){
        this._bsGameManager.addElementBullet(new Bullet(this._bsGameManager, this._bsPlayer)); //TODO COMPLETE
        console.log("SHOOTS FIRED");
    }

    recursiveShooting(){
        for(let i = 0; i < this._bsNFired; i += 1){this.shootEnemy();}
        if(this._bsIsShooting)
            setTimeout(()=> this.recursiveShooting(),this._bsFireRate);
    }
}


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

export class Player extends BaseEntity{
    constructor(ge){
        let _sPA = 16
        let _sPS = 0.01
        super(ge,[0,0,0], [0,0], [0,0],new EntitySprite(
            [0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,0,
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
             0,0,1,0,0,0,1,1,0,0,1,1,0,0,0,0],_sPA,_sPA,_sPS),
             0.01);

        this._sPA = _sPA;
        this._sPS = _sPS;
        this._pTurningVel = 0.5;
        this._pCurVel = 1;
        this._pMousePos = [0,0];

        this._pPlayerController = new PlayerController(this);
        this._pPlayerBulletSpawner = new BulletSpawner(this, ge);
        this._pPlayerBulletSpawner.recursiveShooting();

        this._pVis.setProperty("pColor",[0.4824,0.3294,0.502,1.0]);
    }


    setMousePos(vec){
        this._pMousePos = vec;
    }


    addPoint(){
        //A
    }

    update(){
        this._pPos[0] += this._pRealVect[0] * this._pCurVel;
        this._pPos[1] += this._pRealVect[1] * this._pCurVel;
        this._pRealVect[0] += (this._pApunVect[0] - this._pRealVect[0])* this._pTurningVel;
        this._pRealVect[1] += (this._pApunVect[1] - this._pRealVect[1])* this._pTurningVel;
        
        this._pApunVect[0] = this._pMousePos[0] - this._pPos[0];
        this._pApunVect[1] = this._pMousePos[1] - this._pPos[1];
        /*this._pCurVel = 
            Math.min(
                (this._pApunVect[0] * this._pApunVect[0] + this._pApunVect[1] * this._pApunVect[1])/ 10 + 0.0001,
                this._pTopVel);  
        */
        this._pCurVel = (this._pApunVect[0] * this._pApunVect[0] + this._pApunVect[1] * this._pApunVect[1]) > 0.0005?
                this._pTopVel : 0;

        normalizeVector(this._pApunVect);
        normalizeVector(this._pRealVect);

        //this._pVis.setProperty("pOffset", this._pPos)
        this._pVis.setProperty("pOffset", [this._pPos[0] - (this._sPA*this._sPS)/2,this._pPos[1]- (this._sPA*this._sPS)/2,0.0])
    }
}

class Bullet{
    constructor(ge, player){
        this._gameEngine = ge;
        this._pPos = [player.getPos()[0],player.getPos()[1],0.0 ];
        this._pDir = [0,0];
        this._pVel = 0.01;
        this._pSize = 0.03;
        this._pVis = new EntityRegularPoligon(6,this._pSize);
        this._pVis.setProperty("pOffset", [this._pPos[0] - (this._pSize )/2,this._pPos[1] - (this._pSize)/2,0.0])
    }

    setEnemy(enemy){
        this._pEnemy = enemy;
    }

    setTicket(t){
        this._pTicket = t;
    }

    getPos(){
        return this._pPos;
    }
    
    getVis(){
        return this._pVis;
    }

    destroy(){
        if(this._pTicket == undefined)
            alert("Eliminant un element que no s'està mostrant per pantalla");
        else this._gameEngine.removeElement(this._pTicket,"Bullets");
    }

    //Directament a enemic
    update(){
        this._pDir[0] = this._pEnemy.getPos()[0] - this._pPos[0];
        this._pDir[1] = this._pEnemy.getPos()[1] - this._pPos[1];
        // ? this._pEnemy.destroy() : none;
        
        if((this._pDir[0]*this._pDir[0] + this._pDir[1]*this._pDir[1]) < 0.01){
            this._pEnemy.destroy();
            this.destroy();
        }

        normalizeVector(this._pDir);
        this._pPos[0] += this._pDir[0] * this._pVel;
        this._pPos[1] += this._pDir[1] * this._pVel;

        this._pVis.setProperty("pOffset", [this._pPos[0] - (this._pSize )/2,this._pPos[1]- (this._pSize)/2,0.0])
    }

}

export class Point{
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
            this._pPlayer.addPoint();
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

export class Enemy extends BaseEntity{
    constructor(ge, player){
        super(ge,[Math.random()*2 - 1,Math.random()*2 - 1,0],[0,0],[0,0],new EntitySprite([0,1,0,1,1,1,0,1,0],3,3,0.03),1,0.5)
        this._pVel = 0.005;
        this._pPlayer = player; 
        this._pPursuedBullet = false;

        this._pVis.setProperty("pColor",[0.2902,0.1882,0.3216,1.0]);
        
    }

    setPursued(){
        this._pPursuedBullet= true;
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
    
        this._pRealVect[0] += (this._pApunVect[0] - this._pRealVect[0])* this._pTurningVel;
        this._pRealVect[1] += (this._pApunVect[1] - this._pRealVect[1])* this._pTurningVel;
        
        this._pApunVect[0] = this._pPlayer.getPos()[0] - this._pPos[0];
        this._pApunVect[1] = this._pPlayer.getPos()[1] - this._pPos[1];
        normalizeVector(this._pApunVect);
        normalizeVector(this._pRealVect);
        this._pVis.setProperty("pOffset", [this._pPos[0] - (3*0.03)/2,this._pPos[1]- (3*0.03)/2,0.0])
    }

    destroy(){

        if(Math.random() > 0.5){
            this._gameEngine.addElementPoint([this._pPos[0],this._pPos[1], 0.0]);
        }

        if(this._pTicket == undefined)
            alert("Eliminant un element que no s'està mostrant per pantalla");
        else this._gameEngine.removeElement(this._pTicket,"Enemies");
    }
}


function normalizeVector(vect){
    const mag = Math.sqrt(vect[0]*vect[0] + vect[1]*vect[1]);
    if(mag != 0){
        vect[0] /= mag;
        vect[1] /= mag; 
    }
}