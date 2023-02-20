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
		// handling the inputs
		this.type = "triangle"
		this.color = color

		this.oColor = color
		// the color on a power pellet
		this.cColor = [0.0, 0.5, 1.0, 1.0]
		// the centroid is the center
		this.center = [(vert1[0] + vert2[0] + vert3[0])/3, (vert1[1] + vert2[1] + vert3[1])/3, (vert1[2] + vert2[2] + vert3[2])/3]

		// the transform object which handles the vertices
		this.transform = new Transform()
		this.transform.rotPnt = [this.center[0], this.center[1], this.center[2]]

		// the coordinates of the traingles in the original orientation
		this.coords = coords

		// vertex list
		this.vertexList = new Float32Array([
			//  x , y,  z
			vert1[0], vert1[1], vert1[2],
			vert2[0], vert2[1], vert2[2],
			vert3[0], vert3[1], vert3[2],
		])

	}

	// translation which takes place when the maze is rotated
	translate(maze) {
		// the screen coordinates are calculated according the orientation
		var newScreenCoords = maze.getOrientationCoords(this.coords)

		var transDiff = [newScreenCoords[0] - this.center[0],
		newScreenCoords[1] - this.center[1], newScreenCoords[2] - this.center[2]]

		// the triangles are translated to the new position
		this.transform.translateTo(transDiff[0], transDiff[1], transDiff[2])
	}

	// when the power pellet is accessed
	changeColor() {
		this.color = this.cColor
	}

	// when the power pellet is not accessed
	unchangeColor() {
		this.color = this.oColor
	}
}