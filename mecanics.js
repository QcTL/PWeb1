export class HordeSpawner{
    constructor(gm, player, distanceK){
        this._hsDistK = distanceK;
        this._hsPlayer = player; 
        this._hsGameManager = gm;
        this._hsDiffLevel = 0;
        this._hsSpawnRate = 1000;
        this._hsWhileSpawning = true;
        this._hsNSpawn = 2;
        this.recursiveSpawning();
    }

    recursiveSpawning(){
        for(let i = 0; i < this._hsNSpawn; i += 1){this.spawnEnemy();}
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