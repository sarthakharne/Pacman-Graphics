import {Transform} from './transform.js'

export class Triangle
{
	constructor(
		vert1,
		vert2,
		vert3,
		color,
		coords
		) {
			this.type = "triangle"
			this.color = color
			this.oColor = color
			this.cColor = [0.0, 0.5, 1.0, 1.0]
			this.center = [(vert1[0] + vert2[0] + vert3[0])/3, (vert1[1] + vert2[1] + vert3[1])/3, (vert1[2] + vert2[2] + vert3[2])/3]
			this.transform = new Transform()
			this.transform.rotPnt = [this.center[0], this.center[1], this.center[2]]
			this.coords = coords
			this.locAngle = 0
			this.globAngle = 0

			this.vertexList = new Float32Array([
			//  x , y,  z
			vert1[0], vert1[1], vert1[2],
			vert2[0], vert2[1], vert2[2],
			vert3[0], vert3[1], vert3[2],
		])

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

	calcAngleGivenConfiguration(config) {
		// if(config == 0) {
		// 	this.locSetAngleAboutSetAxis(0)
		// } else if(config == 1) {
		// 	this.locSetAngleAboutSetAxis(-90 * Math.PI / 180)
		// } else if(config == 2) {
		// 	this.locSetAngleAboutSetAxis(-180 * Math.PI / 180)
		// } else if(config == 1) {
		// 	this.locSetAngleAboutSetAxis(-90 * Math.PI / 180)
		// }

		this.locSetAngleAboutSetAxis(config * -90 * Math.PI / 180)
	}

	translate(maze) {
		var row = this.coords[0]
		var col = this.coords[1]
		var newScreenCoords = []
		var offset = []
		var config = maze.config
		var n_cols = maze.layout[0].length
		var n_rows = maze.layout.length
		// var n_rows = maze.layout.length
		// var n_cols = maze.layout[0].length
		// var row = coords[0]
		// var col = coords[1]
		
		if(config == 0) {
			offset = [maze.mazeCenter[0] - maze.tileLength*n_cols/2,
			maze.mazeCenter[1] - maze.tileLength*n_rows/2, 0]

			newScreenCoords = [offset[0] + maze.tileLength*col + maze.tileLength/2,
			offset[1] + maze.tileLength*row  + maze.tileLength/2, offset[2]]
		} else if(config == 1) {
			offset = [maze.mazeCenter[0] - maze.tileLength*n_rows/2,
			maze.mazeCenter[1] - maze.tileLength*n_cols/2, 0]
			
			newScreenCoords = [offset[0] + maze.tileLength*(n_rows - 1 - row) + maze.tileLength/2,
			offset[1] + maze.tileLength*col + maze.tileLength/2, offset[2]]
		} else if(config == 2) {
			offset = [maze.mazeCenter[0] - maze.tileLength*n_cols/2,
			maze.mazeCenter[1] - maze.tileLength*n_rows/2, 0]

			newScreenCoords = [offset[0] + maze.tileLength*(n_cols - 1 - col) + maze.tileLength/2,
			offset[1] + maze.tileLength*(n_rows - 1 - row) + maze.tileLength/2, offset[2]]
		} else if(config == 3) {
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

		this.transform.translateTo(transDiff[0], transDiff[1], transDiff[2])
	}

	changeColor() {
		this.color = this.cColor
	}

	unchangeColor() {
		this.color = this.oColor
	}
}