import { Transform } from "./transform.js";
import { Triangle } from "./triangle.js";

export class Circle {
    constructor(
        radius,
        center,
        color
    ) {
        this.radius = radius;
        this.center = center;
        this.color = color;
        this.iColor = [0, 0, 0, 0]
        this.type = 'circle'
        this.config = 0

        this.numTriangles = 24
        this.vertexList = []

        this.transform = new Transform()
        this.transform.rotPnt = center
        this.transVec = [this.transform.transVec[0], this.transform.transVec[1], this.transform.transVec[2]]
        this.globAngle = 0
        this.locAngle = 0

        for(var i = 0;i < this.numTriangles;i++) {
            if(i >= this.numTriangles / 8 && i < 7 * this.numTriangles / 8) {
                this.vertexList.push(center[0], center[1], center[2]);
                this.vertexList.push(center[0] + radius * Math.cos(2*Math.PI*i/this.numTriangles),
                center[1] + radius * Math.sin(2*Math.PI*i/this.numTriangles), center[2]);
                this.vertexList.push(center[0] + radius * Math.cos(2*Math.PI*(i+1)/this.numTriangles),
                center[1] + radius * Math.sin(2*Math.PI*(i+1)/this.numTriangles), center[2]);
            }
        }

        this.vertexList = new Float32Array(this.vertexList)
    }

    configChange(rotFlg, coords, maze) {
        var row = coords[0]
        var col = coords[1]
        var n_rows = maze.layout.length
        var n_cols = maze.layout[0].length

        var oglOffset = [maze.mazeCenter[0] - maze.tileLength*n_cols/2,
        maze.mazeCenter[1] - maze.tileLength*n_rows/2, 0]

        var oglScreenCoords = [oglOffset[0] + maze.tileLength*col + maze.tileLength/2,
        oglOffset[1] + maze.tileLength*row + maze.tileLength/2, oglOffset[2]]
        // up: x, y
        // right: -y, x
        // down: -x, -y
        // left: y, -x
        if(rotFlg) {
            var transDiff = [oglScreenCoords[0] - this.center[0],
            oglScreenCoords[1] - this.center[1], oglScreenCoords[2] - this.center[2]]

            this.translateTo(transDiff[0], transDiff[1], transDiff[2])   
            if(this.config == 0) {
                this.transform.translateTo(this.transVec[0], this.transVec[1], this.transVec[2])
            } else if(this.config == 1) {
                this.transform.translateTo(-this.transVec[1], this.transVec[0], this.transVec[2])
            } else if(this.config == 2) {
                this.transform.translateTo(-this.transVec[0], -this.transVec[1], this.transVec[2])
            } else if(this.config == 3) {
                this.transform.translateTo(this.transVec[1], -this.transVec[0], this.transVec[2])
            }
        } else {
            var newScreenCoords = []
            var offset = []
            // var n_rows = maze.layout.length
            // var n_cols = maze.layout[0].length
            // var row = coords[0]
            // var col = coords[1]
            
            if(this.config == 0) {
                offset = [maze.mazeCenter[0] - maze.tileLength*n_cols/2,
                maze.mazeCenter[1] - maze.tileLength*n_rows/2, 0]

                newScreenCoords = [offset[0] + maze.tileLength*col + maze.tileLength/2,
                offset[1] + maze.tileLength*row  + maze.tileLength/2, offset[2]]
            } else if(this.config == 1) {
                offset = [maze.mazeCenter[0] - maze.tileLength*n_rows/2,
                maze.mazeCenter[1] - maze.tileLength*n_cols/2, 0]
                
                newScreenCoords = [offset[0] + maze.tileLength*(n_rows - 1 - row) + maze.tileLength/2,
                offset[1] + maze.tileLength*col + maze.tileLength/2, offset[2]]
            } else if(this.config == 2) {
                offset = [maze.mazeCenter[0] - maze.tileLength*n_cols/2,
                maze.mazeCenter[1] - maze.tileLength*n_rows/2, 0]

                newScreenCoords = [offset[0] + maze.tileLength*(n_cols - 1 - col) + maze.tileLength/2,
                offset[1] + maze.tileLength*(n_rows - 1 - row) + maze.tileLength/2, offset[2]]
            } else if(this.config == 3) {
                offset = [maze.mazeCenter[0] - maze.tileLength*n_rows/2,
                maze.mazeCenter[1] - maze.tileLength*n_cols/2, 0]
                
                newScreenCoords = [offset[0] + maze.tileLength*row + maze.tileLength/2,
                offset[1] + maze.tileLength*(n_cols - 1 - col) + maze.tileLength/2, offset[2]]
            }

            // var oglOffset = [maze.mazeCenter[0] - maze.tileLength*n_cols/2,
            // maze.mazeCenter[1] - maze.tileLength*n_rows/2, 0]
            // var oglScreenCoords = [oglOffset[0] + maze.tileLength*col + maze.tileLength/2,
            // oglOffset[1] + maze.tileLength*row + maze.tileLength/2, oglOffset[2]]

            var transDiff = [newScreenCoords[0] - this.center[0],
            newScreenCoords[1] - this.center[1], newScreenCoords[2] - this.center[2]]

            this.translateTo(transDiff[0], transDiff[1], transDiff[2])
            this.transform.translateTo(this.transVec[0], this.transVec[1], this.transVec[2])
        }

        // var newScreenCoords = []
        // var offset = []
        // var n_rows = maze.layout.length
        // var n_cols = maze.layout[0].length
        // var row = coords[0]
        // var col = coords[1]
        
        // if(this.config == 0) {
        //     offset = [maze.mazeCenter[0] - maze.tileLength*n_cols/2,
        //     maze.mazeCenter[1] - maze.tileLength*n_rows/2, 0]

        //     newScreenCoords = [offset[0] + maze.tileLength*col + maze.tileLength/2,
        //     offset[1] + maze.tileLength*row  + maze.tileLength/2, offset[2]]
        // } else if(this.config == 1) {
        //     offset = [maze.mazeCenter[0] - maze.tileLength*n_rows/2,
        //     maze.mazeCenter[1] - maze.tileLength*n_cols/2, 0]
            
        //     newScreenCoords = [offset[0] + maze.tileLength*(n_rows - 1 - row) + maze.tileLength/2,
        //     offset[1] + maze.tileLength*col + maze.tileLength/2, offset[2]]
        // } else if(this.config == 2) {
        //     offset = [maze.mazeCenter[0] - maze.tileLength*n_cols/2,
        //     maze.mazeCenter[1] - maze.tileLength*n_rows/2, 0]

        //     newScreenCoords = [offset[0] + maze.tileLength*(n_cols - 1 - col) + maze.tileLength/2,
        //     offset[1] + maze.tileLength*(n_rows - 1 - row) + maze.tileLength/2, offset[2]]
        // } else if(this.config == 3) {
        //     offset = [maze.mazeCenter[0] - maze.tileLength*n_rows/2,
        //     maze.mazeCenter[1] - maze.tileLength*n_cols/2, 0]
            
        //     newScreenCoords = [offset[0] + maze.tileLength*row + maze.tileLength/2,
        //     offset[1] + maze.tileLength*(n_cols - 1 - col) + maze.tileLength/2, offset[2]]
        // }

        // var oglOffset = [maze.mazeCenter[0] - maze.tileLength*n_cols/2,
        // maze.mazeCenter[1] - maze.tileLength*n_rows/2, 0]
        // var oglScreenCoords = [oglOffset[0] + maze.tileLength*col,
        // oglOffset[1] + maze.tileLength*row, oglOffset[2]]

        // var transDiff = [newScreenCoords[0] - this.center[0],
        // newScreenCoords[1] - this.center[1], newScreenCoords[2] - this.center[2]]

        // this.translateTo(transDiff[0], transDiff[1], transDiff[2])
        // this.transform.translateTo(this.transVec[0], this.transVec[1], this.transVec[2])
    }

    translate(x, y, z) {
        this.transVec = [this.transVec[0] + x, this.transVec[1] + y, this.transVec[2] + z]
    }

    translateTo(x, y, z) {
        this.transVec = [x, y, z]
    }

    locRotAboutSetAxis(angle) {
        this.locAngle += angle
    }

    locSetAngleAboutSetAxis(angle) {
        this.locAngle = angle
    }

    globRotAboutSetAxis(angle) {
        this.globAngle += angle
    }

    globSetAngleAboutSetAxis(angle) {
        this.globAngle = angle
    }




    getPosition() {
        return [this.centre[0] + this.transform.translate[0],
        this.centre[1] + this.transform.translate[1],
        this.centre[2] + this.transform.translate[2]]
    }
}