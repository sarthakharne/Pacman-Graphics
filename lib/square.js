import { Transform } from "./transform.js";

export class Square {
    constructor(
        corner,
        length,
        color
    ) {
        // handling the inputs
        this.corner = corner
        this.length = length
        this.color = color
        
        this.type = 'square'
        // calculating the center
        this.center = [this.corner[0] + this.length/2, this.corner[1] + this.length/2, this.corner[2]]

        this.vertexList = []

        // transform object
        this.transform = new Transform()
        this.transform.rotPnt = [corner[0] + this.length/2, corner[1] + this.length/2, corner[2]]

        // calculating the vertices for the triangles
        this.vertexList.push(this.corner[0], this.corner[1], this.corner[2])
        this.vertexList.push(this.corner[0] + this.length, this.corner[1], this.corner[2])
        this.vertexList.push(this.corner[0], this.corner[1] + this.length, this.corner[2])
        
        this.vertexList.push(this.corner[0], this.corner[1] + this.length, this.corner[2])
        this.vertexList.push(this.corner[0] + this.length, this.corner[1], this.corner[2])
        this.vertexList.push(this.corner[0] + this.length, this.corner[1] + this.length, this.corner[2])

        this.vertexList = new Float32Array(this.vertexList)
    }
}