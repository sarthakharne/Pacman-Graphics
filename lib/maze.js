import { Transform } from "./transform.js";
import { Square } from "./square.js";
import { Pellet } from "./pellet.js";
import { Triangle } from "./triangle.js";

export class Maze {
    constructor(
        layout,
        tileLength,
        type,
        canvasDims,
        visible
    ) {
        this.layout = layout
        this.tileLength = tileLength
        this.type = type

        // POSSIBLE ERROR WHILE CONCAT
        this.vertexList = []
        this.primitiveList = []
        this.nPltList = []
        this.pPltList = []
        this.enemList = []
        this.wallList = []
        this.enemCnt = 0
        this.config = 0

        this.transform = new Transform()
        this.transform.rotPnt = [canvasDims[0]/2, canvasDims[1]/2, canvasDims[2]]

        // POSSIBLE ERROR
        this.widthOffset = canvasDims[0]/2 - tileLength * layout[0].length/2
        this.heightOffset = canvasDims[1]/2 - tileLength * layout.length/2
        this.mazeCenter = [canvasDims[0]/2, canvasDims[1]/2, canvasDims[2]]
        // console.log(layout)
        // console.log(this.widthOffset)

        // // for consistency
        // this.color = [0.0, 0.0, 0.0, 0.0]
        this.initPacmanMazeCoords = []


        for(var row = 0;row < layout.length;row++) {
            for(var col = 0;col < layout[0].length;col++) {
                // wall
                if(layout[row][col] == 1) {
                    var wall = new Square([this.widthOffset + col*this.tileLength, this.heightOffset + row*this.tileLength, 0],
                        this.tileLength, [0.0, 0.0, 0.0, 1.0])
                    // this.vertexList = this.vertexList.concat(Array.from(wall.vertexList))
                    // console.log(Array.from(wall.vertexList))
                    // console.log("hello")
                    // console.log(this.vertexList)
                    // console.log(wall.vertexList)
                    this.primitiveList.push(wall)
                    this.wallList.push(wall)
                }
                if(layout[row][col] == 0) {
                    var nPlt = new Pellet([this.widthOffset + col*this.tileLength + this.tileLength/2, this.heightOffset + row*this.tileLength + this.tileLength/2, 0],
                        'normalPellet', 4, [1.0, 0.647, 0.0, 1.0], [0.0, 1.0, 0.5, 1.0], [row, col, 0])
                    // this.vertexList = this.vertexList.concat(Array.from(nPlt.vertexList))
                    this.primitiveList.push(nPlt)
                    this.nPltList.push(nPlt)
                    
                }
                if(layout[row][col] == 2) {
                    var pPlt = new Pellet([this.widthOffset + col*this.tileLength + this.tileLength/2, this.heightOffset + row*this.tileLength + this.tileLength/2, 0],
                        'powerPellet', 8, [1.0, 0.0, 0.0, 1.0], [1.0, 0.0, 0.0, 1.0], [row, col, 0])
                    // this.vertexList = this.vertexList.concat(Array.from(pPlt.vertexList))
                    this.primitiveList.push(pPlt)
                    this.pPltList.push(pPlt)
                }
                if(layout[row][col] == 3) {
                    var enem = new Triangle([this.widthOffset + col*this.tileLength + this.tileLength/2, this.heightOffset + row*this.tileLength + this.tileLength/2 - 2*this.tileLength/4, 0],
                        [this.widthOffset + col*this.tileLength + this.tileLength/2 + 2*this.tileLength/4, this.heightOffset + row*this.tileLength + this.tileLength/2 + this.tileLength/4, 0],
                        [this.widthOffset + col*this.tileLength + this.tileLength/2 - 2*this.tileLength/4, this.heightOffset + row*this.tileLength + this.tileLength/2 + this.tileLength/4, 0],
                        [0.9-0.3*this.enemCnt, 0.3*this.enemCnt, 0.5, 1.0],
                        [row, col, 0])
                        // this.vertexList = this.vertexList.concat(Array.from(enem.vertexList))
                    this.primitiveList.push(enem)
                    this.enemList.push(enem)
                    this.enemCnt = this.enemCnt + 1
                }
                if(layout[row][col] == 4) {
                    this.initPacmanMazeCoords = [row, col, 0]
                }


            }
        }
        if(this.visible == false) {
            this.setInvisible()
        }
        // this.vertexList = new Float32Array(this.vertexList)
        // console.log("hello")
        // console.log(this.vertexList)
    }

    setVisible() {
        for(var i = 0;i < this.primitiveList.length;i++) {
            this.primitiveList[i].color = [this.primitiveList[i].color[0], this.primitiveList[i].color[1], this.primitiveList[i].color[2], 1.0]
        }
    }

    getOffset() {
        var n_cols = this.layout[0].length
        var n_rows = this.layout.length
        
        if(this.config == 0) {
            var offset = [this.mazeCenter[0] - this.tileLength*n_cols/2,
            this.mazeCenter[1] - this.tileLength*n_rows/2, 0]
            return offset          
        } else if(this.config == 1) {
            var offset = [this.mazeCenter[0] - this.tileLength*n_rows/2,
            this.mazeCenter[1] - this.tileLength*n_cols/2, 0]
            return offset
        } else if(this.config == 2) {
            var offset = [this.mazeCenter[0] - this.tileLength*n_cols/2,
            this.mazeCenter[1] - this.tileLength*n_rows/2, 0]
            return offset
        } else if(this.config == 3) {
            var offset = [this.mazeCenter[0] - this.tileLength*n_rows/2,
            this.mazeCenter[1] - this.tileLength*n_cols/2, 0]
            return offset
        }
    }

    setInvisible() {
        for(var i = 0;i < this.primitiveList.length;i++) {
            this.primitiveList[i].color = [this.primitiveList[i].color[0], this.primitiveList[i].color[1], this.primitiveList[i].color[2], 0.0]
        }
    }
}