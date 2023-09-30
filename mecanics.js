export class HordeSpawner{
    constructor(gm, player, distanceK){
        this._hsDistK = distanceK;
        this._hsPlayer = player; 
        this._hsGameManager = gm;
        this._hsDiffLevel = 0;
        this._hsSpawnRate = 1000;
        this._hsWhileSpawning = true;
        this._hsNSpawn = 2;
        this._hsPause = false;
        this.recursiveSpawning();
    }

    setPause(v){
        this._hsPause = v;
    }

    recursiveSpawning(){
        for(let i = 0; i < this._hsNSpawn; i += 1){
            if(!this._hsPause)
                this.spawnEnemy();}
        if(this._hsWhileSpawning)
            setTimeout(()=> this.recursiveSpawning(),this._hsSpawnRate);
    }

    spawnEnemy(){
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

        this._hsGameManager.addElementEnemy(this._hsDiffLevel, p);
    }
}

function randomIntInterval(min, max){
    return Math.floor(Math.random()* (max - min + 1) + min)
}

function randomDeciInterval(min, max){
    return Math.random()* (max - min) + min;
}

export class PointCounter{
    constructor(gm) {
        this._pcGameManager = gm;
        this._pcCanvas = document.querySelector("#gCanvasText");
        this._pcCtx = this._pcCanvas.getContext("2d");
        this._pcPointsToNext = 10;
        this.showPoints()
    }

    showPoints() {
        this._pcCtx.clearRect(0, 65, 1000, 200);
        this._pcCtx.font = 'bold 2em Montserrat';
        this._pcCtx.fillStyle = 'white';
        this._pcCtx.fillText(this._pcPointsToNext, 10, 100);
    }

    reducePoint(){
        this._pcPointsToNext -= 1;
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
        console.log(this._tTotalSeconds );
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
        console.log("TIO ACTUALIZATE COJONES ")
        this._tCtx.clearRect(0, 0, 1000, 75);
        this._tCtx.font = 'bold 4em Montserrat';
        this._tCtx.fillStyle = 'white';
        this._tCtx.fillText(text, 10, 60);
      }
    
      _padZero(num) {
        return (num < 10 ? '0' : '') + num;
      }
      
}