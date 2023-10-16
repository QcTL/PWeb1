import { Enemy, Player, Point } from "./EntityObjects.js";
import { GameScreen } from "./GameEngine.js";
import { CardSelector, HordeSpawner, InputManager, LifeCounter, PointCounter, ShowTextGUI, Timer } from "./MecanicObjects.js";
class GameManager{
    constructor(){
        this._gameScreen = new GameScreen(); 

        this._lvlProgression = [5,10,15,30,50,100,150,250,350,450];

        this._gmEnemies = []
        this._gmBullets = []
        this._gmPoints = []
        this._gmPlayer = new Player(this);

        this._gameScreen.addElement(this._gmPlayer.getVis());


        //STATES:
        this._gmGameLoop = true;
        this._gamePaused = false;
        this._gameSelectingCards = false;
        this._gameEnd = false;
        this._gameWon = true;

        this._mecHS = new HordeSpawner(this, this._gmPlayer, 2);

        //GUI
        this._mecTi = new Timer(this,600);
        this._mecTi.startTimer();
        this._mecPc = new PointCounter(this,this._lvlProgression);
        this._mecLc = new LifeCounter(this);
        this._gmPlayer.setDamageLabel(this._mecLc);
        
        
        this._mecCs = new CardSelector(this);

        this._mecIM = new InputManager(this, this._gmPlayer.getController(), this._mecCs.getController());

        // KEY BINDS:
        window.addEventListener('keydown',this.swapPauseGame.bind(this), false);
        //DEBUG:
        //this.startCardSelection()
    }

    wonGame(){
        this._gameWon = true;
        this.swapPauseGame(undefined);
        this._mecGameWon1 = new ShowTextGUI(this, "YOU WON!", [350,500], [300,300]);
        this._mecGameWon1.showText();
    }


    endGame(){
        this._gameEnd = true;
        this.swapPauseGame(undefined);
        this._mecGameEnd1 = new ShowTextGUI(this, "YOU LOST", [350,500], [300,300]);
        this._mecGameEnd2 = new ShowTextGUI(this, "F5 TO RETRY", [300,590], [300,300]);
        this._mecGameEnd1.showText();
        this._mecGameEnd2.showText();
    }

    startCardSelection(){
        this._mecIM.askSwapInputManager('cardSelector');
        this._mecCs.displayCards(this._gameScreen);
        
        this._gameSelectingCards = true;
        this.swapPauseGame(undefined);
    }
    endCardSelection(){
        this._mecIM.askSwapInputManager('charController');
        this._mecCs.removeCards(this._gameScreen);
        
        //ORDRE IMPORTANT
        this.swapPauseGame(undefined);
        this._gameSelectingCards = false;
    }


    swapPauseGame(e){
        if((e != undefined && e.key == 'p' && !this._gameEnd) || this._gameSelectingCards || this._gameEnd || this._gameWon){
            this._gamePaused = !this._gamePaused;
            this._gmPlayer.setPause(this._gamePaused);
            this._mecHS.setPause(this._gamePaused)
            this._mecTi.swapPause();
            if(this._gamePaused){
                document.getElementById("gCanvasText").classList.add("CanvasPause");
            }else{
                document.getElementById("gCanvasText").classList.remove("CanvasPause");
            }
        }
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
        if(!this._gamePaused && !this._gameSelectingCards && !this._gameEnd){
            this._gmEnemies.forEach(x => x[1].update());
            this._gmBullets.forEach(x => x[1].update());
            this._gmPoints.forEach(x => x[1].update());
            this._gmPlayer.update();
        }else if(this._gameSelectingCards){
            this._mecCs.update();
        }
    }

    addElementBullet(b){                    
        
        let t = this._gameScreen.addElement(b.getVis());
        b.setTicket(t);
        this._gmBullets.push([t,b]);

    }

    addElementPoint(pos){
        let p = new Point(this, this._gmPlayer,pos)
        let t = this._gameScreen.addElement(p.getVis())

        this._gmPoints.push([t,p]);
        p.setTicket(t);
    }

    addElementEnemy(diff, pos, life, type){
        let p = new Enemy(this, this._gmPlayer,life,type, pos)
        let t = this._gameScreen.addElement(p.getVis())

        this._gmEnemies.push([t,p]);
        p.setTicket(t);
    }

    addActiveObject(obj){
        this._gmPlayer.addObject(obj);
    }

    removeElement(vTicket,type){
        this._gameScreen.removeElement(vTicket);
        let lList = undefined;

        if(type == "Enemies")
            lList = this._gmEnemies;
        else if(type == "Bullets")
            lList = this._gmBullets;
        else if(type == "Points"){
            lList = this._gmPoints;
            this._mecPc.reducePoint();
        }

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

    getClosestEnemy(p){
        //Aquest l'hem de tenir aqui a causa que el GM es el que te el llistat de tots els enemics per triar el mes aprop
        if(this._gmEnemies.length > 0){
            //:( O(N) per obtenir quin element es el que esta mes aprop? sino com es faria per tenir un ranking.
                
                //- Pot ser que es dispari una altre bala abans de que l'altre hagui impactat, si fan referencia al matiex, estara undefined quant l'altre l'elimini.
                
                function distEnemy(e) {
                    let dX=p[0] - e.getPos()[0];
                    let dY=p[1] - e.getPos()[1];
                    return dX * dX + dY * dY;
                }
    
                let eMin = undefined;
                let lMin = -1;
                for(let i = 0; i < this._gmEnemies.length; i++){
                    if((!this._gmEnemies[i][1].isPursued() &&  distEnemy(this._gmEnemies[i][1]) < lMin) || eMin == undefined){
                        eMin = this._gmEnemies[i][1];
                        lMin = distEnemy(this._gmEnemies[i][1]);
                    }
                }
    
                // Pot ser que no quedi cap enemic que pugi ser apuntat...
                if(eMin != undefined){
                    return eMin;
                }
            }
    }

    getListEnemiesArea(collisionRectangle){
        return this._gmEnemies.filter(enemy => {
            const ar = enemy[1].getPos();
            return ar[0] >= collisionRectangle.x && ar[0] <= collisionRectangle.x + collisionRectangle.width &&
                   ar[1] >= collisionRectangle.y && ar[1] <= collisionRectangle.y + collisionRectangle.height;
          });
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