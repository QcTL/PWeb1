export class GameScreen{

    _getWebGLContext(){
        var canvas = document.getElementById("gCanvas");
        try{
            return canvas.getContext("webgl2");
        }catch(e){
            alert("Something's wrong, I can feel it!");
            return null;
        }
    }

    constructor(){
        this.gl = this._getWebGLContext();
        this._bkgnColor =  [0.2235,0.0353,0.2784,1.0];
        if (!this.gl) {
            alert("WebGL 2.0 no está disponible");
            return;
        }

        this._cLoadedEntityes = [];
        this.iniShaders(this.gl);

        this._cTicketGen = 0;
    }
 
    iniShaders(gl){
        var vertexShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertexShader, document.getElementById("myVertexShader").text);
        gl.compileShader(vertexShader);
        
        var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragmentShader, document.getElementById("myFragmentShader").text);
        gl.compileShader(fragmentShader);
        
        this.program = gl.createProgram();
        gl.attachShader(this.program , vertexShader);
        gl.attachShader(this.program , fragmentShader);
        
        gl.linkProgram(this.program );
        
        gl.useProgram(this.program );

        this.program.vertexPositionAttribute = gl.getAttribLocation(this.program, "VertexPosition");
        gl.enableVertexAttribArray(this.program.vertexPositionAttribute);
    }

    mainLoop(){
        this.gl.clearColor(this._bkgnColor[0],this._bkgnColor[1],this._bkgnColor[2],this._bkgnColor[3]);
        //requestAnimationFrame(this.drawSceneLoop.bind(this));
    }

    drawSceneLoop(){
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this._cLoadedEntityes.forEach(x => x[1].drawInto(this.gl,this.program));
        this._cLoadedEntityes.forEach(x => x[1].update(this.gl));
    }

    addElement(e){
        let p = this._cTicketGen;
        this._cLoadedEntityes.push([p,e]);
        e.initGraphic(this.gl, this.program);
        e.initBuffer(this.gl);

        this._cTicketGen += 1;
        return p
    }

    removeElement(t){
        for(let i = 0; i < this._cLoadedEntityes.length; i++){
            if(this._cLoadedEntityes[i][0] == t){
                this._cLoadedEntityes.splice(i,1);
                break;
            }
        }
    }
}

class EntityProperties{
    constructor(properties){
        if(properties != null){
            this._pColor = properties.color     != undefined ? properties.color     : [0.0,0.0,0.0,1.0];
            this._pSize = properties.size       != undefined ? properties.size      : 1;
            this._pOffset = properties.offset   != undefined ? properties.offset    : [0.0,0.0,0.0];
        }else{
            this._pColor = [0.0,0.0,0.0,1.0];
            this._pSize = 1;
            this._pOffset = [0.0,0.0,0.0];
        
        }
    }
    
    setProperty(nProperty, vProperty){
        switch(nProperty){
            case "pColor":
                this._pColor = vProperty;    
                break;
            case "pSize":
                this._pSize = vProperty;
                break;
            case "pOffset":
                this._pOffset = vProperty;
                break;
            default:
                break;
        }
    }

    initGraphic(gl, program){
        this._sColor = gl.getUniformLocation(program,"pColor")
        this._sSize = gl.getUniformLocation(program,"pSize")
        this._sOffset = gl.getUniformLocation(program,"pOffset")
    }

    displayProperty(gl){
        gl.uniform4fv(this._sColor, this._pColor);    
        //gl.uniform1fv(this._sSize, this._pSize);
        gl.uniform3fv(this._sOffset, this._pOffset);
    }
    
}

export class EntitySprite extends EntityProperties{
    constructor(cVertexPoints, height, width,sizeP = 0.05, properties = null){
        super(properties)
        this.rVertices = [];
        this.rIndices = [];
        this._pSize = sizeP;
        this.constructBasicMesh(cVertexPoints, height,width);
    }

    setProperty(nProperty, vProperty){
        super.setProperty(nProperty,vProperty);
    }

    constructBasicMesh(cVertexPoints, height,width){
        if(cVertexPoints.length != height * width){
            alert("Back to the drawing board!");
        }
        let nIn = 0;
        for(let i = 0; i < height; i ++){
            for(let j = 0; j < width; j ++){
                if(cVertexPoints[j + i * height] == 1){
                    this.rVertices.push((width - j)*this._pSize,(height - i)*this._pSize-this._pSize,0.0);
                    this.rVertices.push((width - j)*this._pSize,(height - i)*this._pSize,0.0);
                    this.rVertices.push((width - j)*this._pSize+this._pSize,(height - i)*this._pSize,0.0);
                    this.rVertices.push((width - j)*this._pSize+this._pSize,(height - i)*this._pSize-this._pSize,0.0);
                    this.rIndices.push(nIn,nIn+1,nIn+3,nIn+1, nIn+2, nIn+3);
                    nIn += 4;
                }
            }    
        }
    }

    initBuffer(gl){
        this.idBufferVertices = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.idBufferVertices);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.rVertices), gl.STATIC_DRAW);
        
        this.idBufferIndixes = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.idBufferIndixes);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.rIndices),gl.STATIC_DRAW);
        // FALTA INICIALITZAR EL ALTRE
    }


    drawInto(gl, program){
        this.displayProperty(gl);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.idBufferVertices);
        gl.vertexAttribPointer(program.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
            //Si tingués indexes aniria aquí.
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.idBufferIndixes);
        gl.drawElements(gl.TRIANGLES, this.rVertices.length/6*3, gl.UNSIGNED_SHORT,0);
    }

    compactVertex(){
        //En comptes de tenir que cada pixel sigui en sí un quadrat, podem veure si un 3x3 són quadrats i fer un que agrupi aquests 3.
             
    }

    update(){

    }
}

export class EntityOutLine extends EntityProperties{
    // El input arrar cTotalVertices es comporta com un gl.LINES, agafant les linies (i,i+1), (i+2,i+3), ...
    constructor(cTotalVertices, width, properties = null){
        super(properties)
        this.rVertices = []
        for(let i = 0; i < cTotalVertices.length; i+=2){
            this.rVertices.push(this.transformToRectangles(cTotalVertices.slice(i,i+2), width))  
        }
        this.rVertices =  this.rVertices.flat();
    }

    initGraphic(gl, program){
        super.initGraphic(gl, program);
    }

    transformToRectangles(pairPoints, width){
        const p1 = pairPoints[0];
        const p2 = pairPoints[1];

        const isLeftToRight = p1[0] < p2[0];
        // Aixi farem que la cara que es mostra estigui mirant a la pantalla. 
        // Si només es fa de una forma, en alguna direcció no es mostra correctament.
    
        const diffX = isLeftToRight ? p2[0] - p1[0] : p1[0] - p2[0];
        const diffY = isLeftToRight ? p2[1] - p1[1] : p1[1] - p2[1];
        const length = Math.sqrt(diffX * diffX + diffY * diffY);
    
        const nX = (width / 2) * (diffY / length);
        const nY = (width / 2) * (-diffX / length);
    
        const vertices = isLeftToRight ?
            [p1[0] + nX, p1[1] + nY, 0,
             p1[0] - nX, p1[1] - nY, 0,
             p2[0] + nX, p2[1] + nY, 0,
             p1[0] - nX, p1[1] - nY, 0,
             p2[0] - nX, p2[1] - nY, 0,
             p2[0] + nX, p2[1] + nY, 0] :
            [p1[0] - nX, p1[1] - nY, 0,
             p1[0] + nX, p1[1] + nY, 0,
             p2[0] - nX, p2[1] - nY, 0,
             p1[0] + nX, p1[1] + nY, 0,
             p2[0] + nX, p2[1] + nY, 0,
             p2[0] - nX, p2[1] - nY, 0];
    
        return vertices;
    }

    initBuffer(gl){
        this.idBufferVertices = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.idBufferVertices);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.rVertices), gl.STATIC_DRAW);
    }

    update(gl){
        //Aqui modifiquem el this.rVertices.
        //this.initBuffer(gl);
    }

    drawInto(gl, program){
        this.displayProperty(gl);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.idBufferVertices);
        gl.vertexAttribPointer(program.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
            //Si tingués indexes aniria aquí.
        gl.drawArrays(gl.TRIANGLES, 0, this.rVertices.length/3);
    }
}

export class EntityRegularPoligon extends EntityProperties{
    constructor(nSides, radius, properties = null){
        super(properties)
        this._pNSides = nSides;
        this._pRadius = radius;
        this.rVertices =  [];
        this.calcPositionVertices();
        this.rVertices =  this.rVertices.flat();
    }  

    calcPositionVertices(){
        for(let i = 0; i < this._pNSides ; i++){
            this.rVertices.push([this._pRadius * Math.sin(this.deg2Rad(360/this._pNSides) * i),
                                 this._pRadius * Math.cos(this.deg2Rad(360/this._pNSides) * i),
                                 0.0])
        }
    }

    deg2Rad(val){
        return val * Math.PI / 180;
    }

    initBuffer(gl){
        this.idBufferVertices = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.idBufferVertices);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.rVertices), gl.STATIC_DRAW);
    }

    drawInto(gl, program){
        this.displayProperty(gl);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.idBufferVertices);
        gl.vertexAttribPointer(program.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, this._pNSides); 
    }

    update(){

    }
}