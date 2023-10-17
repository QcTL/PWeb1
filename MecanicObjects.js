
/**
 * Objecte per fer apareixer els enemics al voltant del jugador
 * @param {GameManager} gm - GameManager actiu en el canvas WebGL
 * @param {Player} player -  Player, jugador actiu en el GameManager assignat
 * @param {Double} distanceK - Distancia a la que es vol que aparegin els enemics del jugador.
 */
class HordeSpawner{
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
                _hsNSpawn : 3,
                _hsTypeEnemy: 2,
                _hsLife: 1,
            },{
                _hsSpawnRate: 850,
                _hsNSpawn : 3,
                _hsTypeEnemy: 2,
                _hsLife: 1,
            },{
                _hsSpawnRate: 500,
                _hsNSpawn : 2,
                _hsTypeEnemy: 2,
                _hsLife: 2,   
            }
        ]
        this._hsDiffLevelList = [20,50,100,180,270];
        this._hsDiffLevel = 0;
        this.recursiveSpawning();
    }

    setPause(v){
        this._hsPause = v;
    }

    recursiveSpawning(){
        for(let i = 0; i < this._hsLevelProgression[this._hsDiffLevel]._hsNSpawn; i += 1){
            if(!this._hsPause){
                this.spawnEnemy(this._hsLevelProgression[this._hsDiffLevel]._hsTypeEnemy,this._hsLevelProgression[this._hsDiffLevel]._hsLife);
                this._hsDiffLevelList[this._hsDiffLevel] -= 1;
                if(this._hsDiffLevelList[this._hsDiffLevel] < 0){
                    this._hsDif
                    this._hsDiffLevel += 1;
                }
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

/**
 * Objecte per mostrar el valor de la puntuacio en el canvas superior.
 * @param {GameManager} gm - GameManager actiu en el canvas WebGL
 * @param {Array} lvlProg - Llista de punts necessaris per abançar al seguent nivell
 */
class PointCounter{
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

/**
 * Objecte per mostrar el valor del temps en el canvas superior.
 * @param {GameManager} gm - GameManager actiu en el canvas WebGL.
 * @param {Int} tSeconds - Valor en segons amb el que començarà el contador
 */
class Timer{
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
        } else if(this._tTotalSeconds <= 0) {
          clearInterval(this._tintId);
          this._tGameManager.wonGame();
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

/**
 * Objecte per mostrar el valor de la vida en el canvas superior.
 * @param {GameManager} gm - GameManager actiu en el canvas WebGL.
 * @param {String} txt - El text que vols que es mostri per pantalla
 * @param {Array} pos - La posicio on es vol que es mostri
 * @param {Array} size - La mida que tindra el objecte perque pugi ser eliminat de la pantalla sense afectar els altres textos.
 */
class ShowTextGUI{
    constructor(gm,txt, pos, size) {
        this._pcGameManager = gm;
        this._pcCanvas = document.querySelector("#gCanvasText");
        this._pcCtx = this._pcCanvas.getContext("2d");
        this._pcValue = txt;
        this._pcPos = pos;
        this._pcSize = size;
    }

    showText() {
        this._pcCtx.clearRect(this._pcPos[0], this._pcPos[1], this._pcPos[0] +  this._pcSize[0], this._pcPos[1] +  this._pcSize[1]);
        this._pcCtx.font = 'bold 4em Montserrat';
        this._pcCtx.fillStyle = 'white';
        this._pcCtx.fillText(this._pcValue, this._pcPos[0], this._pcPos[1]);
    }

    changeValue(v){
        this._pcValue = v;
        this.showPoints();
    }

}
/**
 * Objecte per mostrar el valor de la vida en el canvas superior.
 * @param {GameManager} gm - GameManager actiu en el canvas WebGL.
 */
class LifeCounter{
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
/**
 * 
 * Objecte per mostrar les 3 cartes quant sigui necessari
 * @param {GameManager} gm - GameManager actiu en el canvas WebGL.
 */
class CardSelector{
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

     /**
     * @return {Objecte Item} - Retorna un objecte valid de la llista this._csPossObjects
     */
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

    /**
     * Funcio per escollir un element aleatori
     * @param {Array} array - Donda una array qualsevol 
     * @returns {*} - Retorna una posicio aleatoria de la array entrada
     */
    _getRandomElementFromArray(array) {
        if (array.length === 0) {
          return null;  // Return null for an empty array
        }
        const randomIndex = Math.floor(Math.random() * array.length);
        return array[randomIndex];
    }

    // GETTER I SETTERS

    
     /**
     * @return {CardController} - Retorna el CardController assignat a la CardSelector
     */
    getController(){
        return this._csCardController;
    }

     /**
     * Funcio cridada per el CardController quant es mou el ratoli
     * @param {Array} v - Vector de dos posicions representant la posicio transformada WebGL del moviment
     */
    setMousePos(v){
        this._csMousePosition = v;
    }

     /**
     * Funcio cridada per el CardController quant es prem per pantalla
     * @param {Array} v - Vector de dos posicions representant la posicio transformada WebGL del click
     */
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
            x.setNewActiveObject(obj);
        });
    }
    // END GETTER I SETTERS
    
    /**
     * Mostra els objectes afeguint els seus diversos components al GameEngine per poder ser mostrats per pantalla
     * @param {GameEngine} gs - La GameEngine utilitzada en la que es mostrara els objectes 
     */
    displayCards(gs){
        this._csListCards.forEach(
            x => {
                this._csListTickets.push(gs.addElement(x.getVisBack())); //El fons de la carta
                this._csListTickets.push(gs.addElement(x.getVisCont())); //El contorn que pot tenir diferent color depenent si es una nova havilitat o una millora
                this._csListTickets.push(gs.addElement(x.getVisSprite())); //El sprite, siguent l'havilitat o el icone de millora
            });
        this._csIsActive = true; 
    }

    /**
     * Elimina les cartes de la GameEngine donada. Segons el sistema de tiquets explicat.
     * @param {GameEngine} gs - La GameEngine utilitzada en la que l'eliminaran els objectes, han de estar-hi presents per poder-se eliminar. 
     */
    removeCards(gs){
        this._csListTickets.forEach(x => gs.removeElement(x));
        this._csIsActive = false; 
        this._csListCards.forEach(x=> x.clearText());
    }

    /**
     * Funcio d'actualitzacio de cada frame de l'objecte. En aquest cas simplement cridara el update de cada carta i notificara si te el cursor sobre per
     * poder tenir una animaci.
     */
    update(){
        if(this._csIsActive){
            //Animacio Carta:
            this._csListCards.forEach(x => { 
                    x.update();
                    if(x.isPointInside(this._csMousePosition)){
                        x.setActive();
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
const TYPES_INPUT = {
    CHAR_CONTROLLER: 'charController',
    CARD_SELECTOR: 'cardSelector',
};

class InputManager{

    constructor(gm, pController, cController){
        this._imCurrentInput = TYPES_INPUT.CHAR_CONTROLLER;
    
        this._imPController = pController;
        this._imCController = cController;
        this._imGameManager = gm;

        this.askSwapInputManager(TYPES_INPUT.CHAR_CONTROLLER)
    }

    /**
     * Canvia el estat dels Inputs Managers, de CHAR_CONTROLER a CHAR_SELECTOR
     * @param {String} newType - Un dels string id continguts a l'objecte TYPES_INPUT, al qual vols canviar
     */
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

class CardController{
    constructor(parent){
        // Canvas superior, el que conte els elements de text, pero a causa que esta per sobre ell serà el que consumeix els events de moviment i de "click".
        this.gCanvas = document.getElementById("gCanvasText");
        const ctx = this.gCanvas.getContext("2d");
        this.gParent = parent;
        this.gActive = false;
        this.gCanvas.addEventListener('mousemove', this.mouseMoved.bind(this));
        this.gCanvas.addEventListener('click', this.mouseClicked.bind(this));
    }

    /**
     * Desactiva el Controlador de les cartes
     */
    turnOffController(){
        this.gActive = false;
    }

    /**
     * Activa el Controlador de les cartes
     */
    turnOnController(){
        this.gActive = true;
    }

   /**
     * Event cridat per el DOM quant el ratoli es mou
     */
    mouseMoved(event){
        if(this.gActive){
            const rectGCanvas = this.gCanvas.getBoundingClientRect();
            this.gParent.setMousePos([((event.clientX - rectGCanvas.left)/rectGCanvas.width*2) - 1, ((rectGCanvas.height - event.clientY - rectGCanvas.top)/rectGCanvas.height*2)-1]);
        }
    }

    /**
     * Event cridat per el DOM quant el ratoli prem un boto
     */
    mouseClicked(event) {
        if(this.gActive){
            const rectGCanvas = this.gCanvas.getBoundingClientRect();
            this.gParent.setClickPos([((event.clientX - rectGCanvas.left) / rectGCanvas.width * 2) - 1, ((rectGCanvas.height - event.clientY - rectGCanvas.top) / rectGCanvas.height * 2) - 1]);
        }
    }
}

class PlayerController{
    constructor(parent){
        // Canvas superior, el que conte els elements de text, pero a causa que esta per sobre ell serà el que consumeix els events de moviment i de "click".
        this.gCanvas = document.getElementById("gCanvasText");
        const ctx = this.gCanvas.getContext("2d");
        this.gParent = parent;
        this.gActive = false;
        this.gCanvas.addEventListener('mousemove', this.mouseMoved.bind(this));
    }

    /**
     * Desactiva el Controlador del personatge
     */
    turnOffController(){
        this.gActive = false;
    }

    /**
     * Activa el Controlador del personatge
     */
    turnOnController(){
        this.gActive = true;
    }

    /**
     * Event cridat per el DOM quant el ratoli es mou
     */
    mouseMoved(event){
        if(this.gActive){
            const rectGCanvas = this.gCanvas.getBoundingClientRect();
            this.gParent.setMousePos([((event.clientX - rectGCanvas.left)/rectGCanvas.width*2) - 1, ((rectGCanvas.height - event.clientY - rectGCanvas.top)/rectGCanvas.height*2)-1]);
        }
    }
}