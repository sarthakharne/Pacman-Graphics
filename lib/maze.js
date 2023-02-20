import { Transform } from "./transform.js";
import { Square } from "./square.js";
import { Pellet } from "./pellet.js";
import { Triangle } from "./triangle.js";

export class Maze {
    constructor(
        layout,
        tileLength,
        type,
        canvasDims
    ) {
        // handling inputs
        this.layout = layout
        this.tileLength = tileLength
        this.type = type

        // lists to save different objects and vertices
        this.vertexList = []
        this.primitiveList = []
        this.nPltList = []
        this.pPltList = []
        this.enemList = []
        this.wallList = []
        this.enemCnt = 0

        // initialising orientation
        this.orientation = 0

        // offsets and center of the maze
        this.widthOffset = canvasDims[0]/2 - tileLength * layout[0].length/2
        this.heightOffset = canvasDims[1]/2 - tileLength * layout.length/2
        this.mazeCenter = [canvasDims[0]/2, canvasDims[1]/2, canvasDims[2]]

        // maze coordinates of the pacman's initial point
        this.initPacmanMazeCoords = []

        for(var row = 0;row < layout.length;row++) {
            for(var col = 0;col < layout[0].length;col++) {
                // 1 in the layout denotes the walls
                if(layout[row][col] == 1) {
                    var wall = new Square([this.widthOffset + col*this.tileLength, this.heightOffset + row*this.tileLength, 0],
                        this.tileLength, [0.4, 0.4, 0.4, 1.0])
                    this.primitiveList.push(wall)
                    this.wallList.push(wall)
                }

                // 0 in the layout denotes normal pellets
                else if(layout[row][col] == 0) {
                    var nPlt = new Pellet([this.widthOffset + col*this.tileLength + this.tileLength/2, this.heightOffset + row*this.tileLength + this.tileLength/2, 0],
                        'normalPellet', 4, [1.0, 0.647, 0.0, 1.0], [0.0, 1.0, 0.5, 1.0], [row, col, 0])
                    this.primitiveList.push(nPlt)
                    this.nPltList.push(nPlt)
                    
                }

                // 2 in the layout denotes power pellets
                else if(layout[row][col] == 2) {
                    var pPlt = new Pellet([this.widthOffset + col*this.tileLength + this.tileLength/2, this.heightOffset + row*this.tileLength + this.tileLength/2, 0],
                        'powerPellet', 8, [1.0, 0.0, 0.0, 1.0], [1.0, 0.0, 0.0, 1.0], [row, col, 0])
                    this.primitiveList.push(pPlt)
                    this.pPltList.push(pPlt)
                }

                // 3 in the layout denotes enemies
                else if(layout[row][col] == 3) {
                    var enem = new Triangle([this.widthOffset + col*this.tileLength + this.tileLength/2, this.heightOffset + row*this.tileLength + this.tileLength/2 - 2*this.tileLength/4, 0],
                        [this.widthOffset + col*this.tileLength + this.tileLength/2 + 2*this.tileLength/4, this.heightOffset + row*this.tileLength + this.tileLength/2 + this.tileLength/4, 0],
                        [this.widthOffset + col*this.tileLength + this.tileLength/2 - 2*this.tileLength/4, this.heightOffset + row*this.tileLength + this.tileLength/2 + this.tileLength/4, 0],
                        [0.9-0.3*this.enemCnt, 0.3*this.enemCnt, 0.5, 1.0],
                        [row, col, 0])
                    this.primitiveList.push(enem)
                    this.enemList.push(enem)
                    this.enemCnt = this.enemCnt + 1
                }

                // 4 in the layout denotes the pacman's position
                else if(layout[row][col] == 4) {
                    this.initPacmanMazeCoords = [row, col, 0]
                }
            }
        }
    }

    // gives the screen coordinates according to the current orientation
    // given the grid coordinates from the original grid orientation
    getOrientationCoords(coords) {
        var row = coords[0]
        var col = coords[1]
		var newScreenCoords = []

        // offset of the grid in the current orientation is taken
		var offset = this.getOffset()
		var orientation = this.orientation
		var n_cols = this.layout[0].length
		var n_rows = this.layout.length
		
        // calculate the new screen coordinates using the offset as follows:
        // orientation 0:
        // // x = offset.x + col
        // // y = offset.y + row
        // orientation 1:
        // // x = offset.x + (n_rows - 1 - row)
        // // y = offset.y + col
        // orientation 2:
        // // x = offset.x + (n_cols - 1 - col)
        // // y = offset.y + (n_rows - 1 - row)
        // orientation 3:
        // // x = offset.x + row
        // // y = offset.y + (n_cols - 1 - col)
		if(orientation == 0) {
			newScreenCoords = [offset[0] + this.tileLength*col + this.tileLength/2,
			offset[1] + this.tileLength*row  + this.tileLength/2, offset[2]]
		} else if(orientation == 1) {
			newScreenCoords = [offset[0] + this.tileLength*(n_rows - 1 - row) + this.tileLength/2,
			offset[1] + this.tileLength*col + this.tileLength/2, offset[2]]
		} else if(orientation == 2) {
			newScreenCoords = [offset[0] + this.tileLength*(n_cols - 1 - col) + this.tileLength/2,
			offset[1] + this.tileLength*(n_rows - 1 - row) + this.tileLength/2, offset[2]]
		} else if(orientation == 3) {
			newScreenCoords = [offset[0] + this.tileLength*row + this.tileLength/2,
			offset[1] + this.tileLength*(n_cols - 1 - col) + this.tileLength/2, offset[2]]
		}

        return newScreenCoords
    }

    // gives the maze offset according to its current orientation
    getOffset() {
        var n_cols = this.layout[0].length
        var n_rows = this.layout.length
        
        // calculate the offset as follows:
        // orientation 0 and 2:
        // // [mazeCenter.x - n_cols/2, mazeCenter.y - n_rows/2]
        // orientation 1 and 2:
        // // [mazeCenter.x - n_rows/2, mazeCenter.y - n_cols/2]
        if(this.orientation == 0 || this.orientation == 2) {
            var offset = [this.mazeCenter[0] - this.tileLength*n_cols/2,
            this.mazeCenter[1] - this.tileLength*n_rows/2, 0]

            return offset          
        } else if(this.orientation == 1 || this.orientation == 3) {
            var offset = [this.mazeCenter[0] - this.tileLength*n_rows/2,
            this.mazeCenter[1] - this.tileLength*n_cols/2, 0]

            return offset
        }
    }

    // reset all the objects of the maze
    resetMaze() {
        this.orientation = 0
        for(var i = 0;i < this.primitiveList.length;i++) {
            this.primitiveList[i].transform.resetMatrix()
        }
    }
}