import { Transform } from "./transform.js";

export class Circle {
    constructor(
        radius,
        center,
        color
    ) {
        // set the inputs
        this.radius = radius;
        this.center = center;
        this.color = color;

        // set the type of the object
        this.type = 'circle'
        
        // orientation changes with the orientation of the maze
        this.orientation = 0
        // number of triangles which makes the circle
        this.numTriangles = 24
        // vertex list of all the vertices of the circles
        this.vertexList = []
        this.mazeCoords = []

        // the transform object which handles all the vertices
        this.transform = new Transform()
        this.transform.rotPnt = center

        // the local translation vector which is used to handle rotation efficiently
        this.transVec = [this.transform.transVec[0], this.transform.transVec[1], this.transform.transVec[2]]
        // global angle is used for maze rotations
        this.globAngle = 0
        // local angle is used for all other rotations
        this.locAngle = 0

        // the triangles are calculated and stored
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

    // this updates the translation of the pacman
    update(rotFlg, coords, maze) {
        // current row and col of coordinates of pacman
        // in the original grid orientation
        var row = coords[0]
        var col = coords[1]
        // total rows and cols of the grid
        var n_rows = maze.layout.length
        var n_cols = maze.layout[0].length

        // pixel offset of the maze in the original orientation
        var oglOffset = [maze.mazeCenter[0] - maze.tileLength*n_cols/2,
        maze.mazeCenter[1] - maze.tileLength*n_rows/2, 0]

        // pixel coordinates of the pacman
        var oglScreenCoords = [oglOffset[0] + maze.tileLength*col + maze.tileLength/2,
        oglOffset[1] + maze.tileLength*row + maze.tileLength/2, oglOffset[2]]

        // if the maze is rotated
        if(rotFlg) {
            // the difference vector is calculated for the original orientation
            var transDiff = [oglScreenCoords[0] - this.center[0],
            oglScreenCoords[1] - this.center[1],
            oglScreenCoords[2] - this.center[2]]

            this.translateTo(transDiff[0], transDiff[1], transDiff[2])

            // the translation correction is made for the rotated pacman
            // according to the orientation
            if(this.orientation == 0) {
                this.transform.translateTo(this.transVec[0],
                this.transVec[1], this.transVec[2])
            } else if(this.orientation == 1) {
                this.transform.translateTo(-this.transVec[1],
                this.transVec[0], this.transVec[2])
            } else if(this.orientation == 2) {
                this.transform.translateTo(-this.transVec[0],
                -this.transVec[1], this.transVec[2])
            } else if(this.orientation == 3) {
                this.transform.translateTo(this.transVec[1],
                -this.transVec[0], this.transVec[2])
            }
        } else {
            // get the new screen coords according to the orientation of
            // the maze given the position of the pacman in the original grid
            var newScreenCoords = maze.getOrientationCoords(coords)

            var transDiff = [newScreenCoords[0] - this.center[0],
            newScreenCoords[1] - this.center[1], newScreenCoords[2] - this.center[2]]

            this.translateTo(transDiff[0], transDiff[1], transDiff[2])
            this.transform.translateTo(this.transVec[0], this.transVec[1], this.transVec[2])
        }
    }

    translate(x, y, z) {
        this.transVec = [this.transVec[0] + x, this.transVec[1] + y, this.transVec[2] + z]
    }

    translateTo(x, y, z) {
        this.transVec = [x, y, z]
    }

    locAddRot(angle) {
        this.locAngle += angle
    }

    locSetAngle(angle) {
        this.locAngle = angle
    }

    globAddRot(angle) {
        this.globAngle += angle
    }

    globSetAngle(angle) {
        this.globAngle = angle
    }
}