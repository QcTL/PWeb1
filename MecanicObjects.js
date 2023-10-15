import { Card } from "./EntityCard.js";
import { dataArray } from "./StrItems.js";

export class HordeSpawner{
    constructor(gm, player, distanceK){
        this._hsDistK = distanceK;
        this._hsPlayer = player; 
        this._hsGameManager = gm;
        
        this._hsSpawnRate = 1000;
        this._hsNSpawn = 2;

        this._hsWhileSpawning = true;
        this._hsPause = false;

        this._hsLevelProgression = [
            {
                _hsSpawnRate: 1000,
                _hsNSpawn : 1,
                _hsTypeEnemy: 2,
                _hsLife: 1,
            },
            {
                _hsSpawnRate: 750,
                _hsNSpawn : 1,
                _hsTypeEnemy: 1,
                _hsLife: 1,
            },{
                _hsSpawnRate: 1000,
                _hsNSpawn : 2,
                _hsTypeEnemy: 2,
                _hsLife: 2,
            },{
                _hsSpawnRate: 750,
                _hsNSpawn : 2,
                _hsTypeEnemy: 2,
                _hsLife: 2,
            },{
                _hsSpawnRate: 500,
                _hsNSpawn : 2,
                _hsTypeEnemy: 2,
                _hsLife: 2,   
            }
        ]
        this._hsDiffLevelList = [20,30,60,100,];
        this._hsDiffLevel = 0;
        this.recursiveSpawning();
    }

    setPause(v){
        this._hsPause = v;
    }

    recursiveSpawning(){
        for(let i = 0; i < this._hsLevelProgression[this._hsDiffLevel]._hsNSpawn; i += 1){
            if(!this._hsPause)
                this.spawnEnemy(this._hsLevelProgression[this._hsDiffLevel]._hsTypeEnemy,this._hsLevelProgression[this._hsDiffLevel]._hsLife);
                this._hsDiffLevelList[this._hsDiffLevel] -= 1;
                if(this._hsDiffLevelList[this._hsDiffLevel] < 0){
                    this._hsDiffLevel += 1;
                } 
            }
        if(this._hsWhileSpawning)
            setTimeout(()=> this.recursiveSpawning(),this._hsLevelProgression[this._hsDiffLevel]._hsSpawnRate);
    }

    spawnEnemy(type, life){
        let n = randomIntInterval(0,3);
        let p = [0,0]; 
        let varPos = randomDeciInterval(-this._hsDistK, this._hsDistK);
        if(n == 0){
            p = [this._hsDistK + this._hsPlayer.getPos()[0],varPos +  this._hsPlayer.getPos()[1]];
        }else if(n == 1){
            p = [-this._hsDistK + this._hsPlayer.getPos()[0],varPos +  this._hsPlayer.getPos()[1]];
        }else if(n == 2){
            p = [varPos +  this._hsPlayer.getPos()[0],this._hsDistK + this._hsPlayer.getPos()[1]];
        }else{
            p = [varPos +  this._hsPlayer.getPos()[0],-this._hsDistK + this._hsPlayer.getPos()[1]];
        }

        this._hsGameManager.addElementEnemy(this._hsDiffLevel, p,life, type);
    }
}

function randomIntInterval(min, max){
    return Math.floor(Math.random()* (max - min + 1) + min)
}

function randomDeciInterval(min, max){
    return Math.random()* (max - min) + min;
}

export class PointCounter{
    constructor(gm,lvlProg) {
        this._lvlProg = lvlProg;
        this._pcGameManager = gm;
        this._pcCanvas = document.querySelector("#gCanvasText");
        this._pcCtx = this._pcCanvas.getContext("2d");
        this._pcPointsToNext = this._lvlProg [0];
        this._pcIndexProg = 1;
        this.showPoints()
    }

    showPoints() {
        this._pcCtx.clearRect(0, 65, 1000, 100);
        this._pcCtx.font = 'bold 2em Montserrat';
        this._pcCtx.fillStyle = 'white';
        this._pcCtx.fillText(this._pcPointsToNext, 10, 100);
    }

    reducePoint(){
        this._pcPointsToNext -= 1;
        if(this._pcPointsToNext <= 0){
            this._pcGameManager.startCardSelection();
            this._pcPointsToNext = this._lvlProg [this._pcIndexProg];
            this._pcIndexProg += 1;
        }
        this.showPoints();
    }
}

export class Timer{
    constructor(gm, tSeconds) {
        this._tGameManager = gm;
        this._tTotalSeconds = tSeconds;
        this._tCanvas = document.querySelector("#gCanvasText");
        this._tCtx = this._tCanvas.getContext("2d");
        this._tPaused = false;
        this.updateTimer(); 
      }
    
      startTimer() {
        this._tintId = setInterval(this.updateTimer.bind(this), 1000);
      }
      
      swapPause(){
        this._tPaused = ! this._tPaused;
      }

      updateTimer() {
        if (!this._tPaused && this._tTotalSeconds > 0) {
            this._tTotalSeconds--;
            const minutes = Math.floor(this._tTotalSeconds / 60);
            const seconds = this._tTotalSeconds % 60;
            const formattedTime = this._padZero(minutes) + ':' + this._padZero(seconds);
        
            this.drawText(formattedTime);
        } else if(this._tTotalSeconds < 0) {
          clearInterval(this._tintId);
          console.log('Timer finished!');
        }
      }
    
      drawText(text) {
        this._tCtx.clearRect(0, 0, 500, 75);
        this._tCtx.font = 'bold 4em Montserrat';
        this._tCtx.fillStyle = 'white';
        this._tCtx.fillText(text, 10, 60);
      }
    
      _padZero(num) {
        return (num < 10 ? '0' : '') + num;
      }
      
}

export class LifeCounter{
    constructor(gm) {
        this._pcGameManager = gm;
        this._pcCanvas = document.querySelector("#gCanvasText");
        this._pcCtx = this._pcCanvas.getContext("2d");
        this._pcValue = 100;
        this.showPoints()
    }

    showPoints() {
        this._pcCtx.clearRect(500, 0, 1000, 1000); //TODO Canviar
        this._pcCtx.font = 'bold 4em Montserrat';
        this._pcCtx.fillStyle = 'white';
        this._pcCtx.fillText(this._pcValue, 850, 60);
    }

    changeValue(v){
        this._pcValue = v;
        this.showPoints();
    }
}

export class CardSelector{
    constructor(gm) {
        this._csGameManager = gm;

        this._csPresentObjectsId = [0];
        this._csPossObjects = dataArray;
        this._csCurrSelecteds = [];


        this._csListCards = [
            new Card(gm,0,this.selectOneRandomValidObject()),
            new Card(gm,1,this.selectOneRandomValidObject()),
            new Card(gm,2,this.selectOneRandomValidObject())];
        this._csListTickets = [];

        this._csCardController = new CardController(this);

        this._csIsActive = false;
        this._csMousePosition = [0.0,0.0];
    }

    selectOneRandomValidObject(){
        var isValid = false;
        while(!isValid){
            var allPresent = true
            var o = this._getRandomElementFromArray(this._csPossObjects);
            o.listPrereq.forEach(
                x => {
                    if(!allPresent || this._csPresentObjectsId.find(y=> y.id == x) == undefined){
                        allPresent = false;
                    }
                }
            );

            if(allPresent && this._csCurrSelecteds.find(y=> y.id == o.id) == undefined){
                this._csCurrSelecteds.push(o);
                return o;
                // Afeguir a CurrSelecteds
            }
        }
    }

    _getRandomElementFromArray(array) {
        if (array.length === 0) {
          return null;  // Return null for an empty array
        }
        const randomIndex = Math.floor(Math.random() * array.length);
        return array[randomIndex];
    }

    getController(){
        return this._csCardController;
    }

    setMousePos(v){
        this._csMousePosition = v;
    }

    setClickPos(v){
        this._csActiveCard = this._csListCards.find(x=> x.isPointInside(v));
        this._csGameManager.addActiveObject(this._csActiveCard.getActiveObject());
        this._csGameManager.endCardSelection();
        
        // Eliminar tots els elements que es mostren pero que no s'han truat
        // Todo, eliminar del possible quin s'hagui seleccionat
        this._csCurrSelecteds = []

        this._csPresentObjectsId.push(this._csActiveCard.getActiveObject());
        this._csPossObjects = this._csPossObjects.filter(x => x !== this._csActiveCard.getActiveObject());

        this._csListCards.forEach(x => {
            var obj = this.selectOneRandomValidObject();
            console.log(obj);
            x.setNewActiveObject(obj);
        });
    }

    displayCards(gs){
        this._csListCards.forEach(
            x => {
                this._csListTickets.push(gs.addElement(x.getVisBack()));
                this._csListTickets.push(gs.addElement(x.getVisCont()));
                this._csListTickets.push(gs.addElement(x.getVisSprite()));
            });
        this._csIsActive = true; 
    }

    removeCards(gs){
        this._csListTickets.forEach(x => gs.removeElement(x));
        this._csIsActive = false; 
        this._csListCards.forEach(x=> x.clearText());
    }

    update(){
        if(this._csIsActive){
            //Animacio Carta:
            this._csListCards.forEach(x => { 
                    x.update();
                    if(x.isPointInside(this._csMousePosition)){
                        x.setActive();
                        //console.log("HELLO")
                    }else{x.setOff();}
                }); 
                //Es podria optimitzar, comprovar si es dins o estas actiu, i si ho estas torna a comprovar per si hauries de deixar-ho d'estar
            //this._csActiveCard = this._csListCards.find(x=> x.isPointInside(this._csMousePosition));
            //if(this._csActiveHoverCard != undefined){

            //}
        }
    }

}

/* INPUT MANAGER */
export const TYPES_INPUT = {
    CHAR_CONTROLLER: 'charController',
    CARD_SELECTOR: 'cardSelector',
};

export class InputManager{

    constructor(gm, pController, cController){
        this._imCurrentInput = TYPES_INPUT.CHAR_CONTROLLER;
    
        this._imPController = pController;
        this._imCController = cController;
        this._imGameManager = gm;

        this.askSwapInputManager(TYPES_INPUT.CHAR_CONTROLLER)
    }

    askSwapInputManager(newType){
        if(newType == TYPES_INPUT.CHAR_CONTROLLER || newType == TypeError.CARD_SELECTOR){
            this._imCurrentInput = newType;
        }

        if(newType == TYPES_INPUT.CHAR_CONTROLLER ){
            this._imPController.turnOnController();
            this._imCController.turnOffController();
        }else{
            this._imPController.turnOffController();
            this._imCController.turnOnController();
        }
    }

}

export class CardController{
    constructor(parent){
        this.gCanvas = document.getElementById("gCanvasText");
        const ctx = this.gCanvas.getContext("2d");
        this.gParent = parent;
        this.gActive = false;
        this.gCanvas.addEventListener('mousemove', this.mouseMoved.bind(this));
        this.gCanvas.addEventListener('click', this.mouseClicked.bind(this));
    }

    turnOffController(){
        this.gActive = false;
    }

    turnOnController(){
        this.gActive = true;
    }

    mouseMoved(event){
        if(this.gActive){
            const rectGCanvas = this.gCanvas.getBoundingClientRect();
            this.gParent.setMousePos([((event.clientX - rectGCanvas.left)/rectGCanvas.width*2) - 1, ((rectGCanvas.height - event.clientY - rectGCanvas.top)/rectGCanvas.height*2)-1]);
        }
    }

    mouseClicked(event) {
        if(this.gActive){
            const rectGCanvas = this.gCanvas.getBoundingClientRect();
            this.gParent.setClickPos([((event.clientX - rectGCanvas.left) / rectGCanvas.width * 2) - 1, ((rectGCanvas.height - event.clientY - rectGCanvas.top) / rectGCanvas.height * 2) - 1]);
        }
    }
}

export class PlayerController{
    constructor(parent){
        this.gCanvas = document.getElementById("gCanvasText");
        const ctx = this.gCanvas.getContext("2d");
        this.gParent = parent;
        this.gActive = false;
        this.gCanvas.addEventListener('mousemove', this.mouseMoved.bind(this));
    }

    turnOffController(){
        this.gActive = false;
    }

    turnOnController(){
        this.gActive = true;
    }

    mouseMoved(event){
        if(this.gActive){
            const rectGCanvas = this.gCanvas.getBoundingClientRect();
            this.gParent.setMousePos([((event.clientX - rectGCanvas.left)/rectGCanvas.width*2) - 1, ((rectGCanvas.height - event.clientY - rectGCanvas.top)/rectGCanvas.height*2)-1]);
        }
    }
}