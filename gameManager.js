import { Enemy, Player, Point } from "./elements.js";
import { GameScreen } from "./mGame.js";
class GameManager{
    constructor(){
        this._gameScreen = new GameScreen(); 
    
        this._gmEnemies = []
        this._gmBullets = []
        this._gmPoints = []
        this._gmPlayer = new Player(this);

        for(let i = 0; i < 2; i ++){
            let p = new Point(this, this._gmPlayer)
            let t = this._gameScreen.addElement(p.getVis())

            this._gmPoints.push([t,p]);
            this._gmPoints[i][1].setTicket(t);
        }

        for(let i = 0; i < 20; i ++){
            let p = new Enemy(this, this._gmPlayer)
            let t = this._gameScreen.addElement(p.getVis())

            this._gmEnemies.push([t,p]);
            this._gmEnemies[i][1].setTicket(t);
        }      
        
        this._gameScreen.addElement(this._gmPlayer.getVis());

        this._gmGameLoop = true;
        this._gamePaused = false;

        // KEY BINDS:
        window.addEventListener('keydown',this.swapPauseGame.bind(this), false);
    }

    swapPauseGame(e){
        if(e.key == 'p') 
            this._gamePaused = !this._gamePaused;
    }

    isInsideAny(pX,pY, pSelf){
        for(let i = 0; i < this._gmEnemies.length; i++){ 
            if(((pX > this._gmEnemies[i][1].getPos()[0] - this._gmEnemies[i][1].getSize()/2
            && pX < this._gmEnemies[i][1].getPos()[0] + this._gmEnemies[i][1].getSize()/2)
            && (pY > this._gmEnemies[i][1].getPos()[1] - this._gmEnemies[i][1].getSize()/2
            && pY < this._gmEnemies[i][1].getPos()[1] + this._gmEnemies[i][1].getSize()/2))
            && pSelf != this._gmEnemies[i][1].getPos()){
                return true;
            }
        }
        return false;
    }

    update(){
        if(!this._gamePaused){
            this._gmEnemies.forEach(x => x[1].update());
            this._gmBullets.forEach(x => x[1].update());
            this._gmPoints.forEach(x => x[1].update());
            this._gmPlayer.update();
        }
    }

    /*
    drawInto(gl, program){
        this._gmEnemies.forEach(x => x.drawInto(gl, program));
        this._gmBullets.forEach(x => x.drawInto(gl, program));
        this._gmPlayer.drawInto(gl, program);
    } EN TEORIA NO CAL JA QUE ELS HI PASSEM A ENGINE*/ 

    addElementBullet(b){
        //Aquest l'hem de tenir aqui a causa que el GM es el que te el llistat de tots els enemics per triar el mes aprop
        let t = this._gameScreen.addElement(b.getVis())
        b.setTicket(t);
        this._gmBullets.push([t,b]);

    }

    removeElement(vTicket,type){
        this._gameScreen.removeElement(vTicket);
        let lList = undefined;

        if(type == "Enemies")
            lList = this._gmEnemies
        else if(type == "Bullets")
            lList = this._gmBullets
        else if(type == "Points")
            lList = this._gmPoints

        for(let i = 0; i < lList.length; i++){
            if(lList[i][0] == vTicket){
                lList.splice(i,1);
                break;
            }
        }
    }

    mainLoop(){
        //"START" del main loop
        this._gameScreen.mainLoop();

        requestAnimationFrame(this._sMainLoop.bind(this));
    }

    _sMainLoop(){
        this._gameScreen.drawSceneLoop();
        this.update();
        if(this._gmGameLoop)
            requestAnimationFrame(this._sMainLoop.bind(this));
    }
}

//let gm = new GameScreen();
//let t1 = new EntityOutLine([[0.0,0.0,0.0],[0.1,0.1,0.0]],0.01);
//gm.addElement(t1);
//let t2 = new EntityOutLine([[0.1,0.1,0.0],[-0.1,0.1,0.0]],0.01);
//gm.addElement(t2);

//let t1 = new EntityOutLine([[0.0,0.4,0.0],[0.1,0.1,0.0],[0.2,0.2,0.0],[-0.1,0.1,0.0]],0.01);
//gm.addElement(t1);
//gm.mainLoop();

let gm = new GameManager();
gm.mainLoop();