import { Transform } from "./transform.js";

export class Square {
    constructor(
        corner,
        length,
        color
    ) {
        this.corner = corner
        this.length = length
        this.color = color
        this.iColor = [0, 0, 0, 0]
        this.type = 'square'
        this.center = [this.corner[0] + this.length/2, this.corner[1] + this.length/2, this.corner[2]]

        this.vertexList = []

        this.transform = new Transform()
        this.transform.rotPnt = [corner[0] + this.length/2, corner[1] + this.length/2, corner[2]]
        // console.log(corner)

        this.vertexList.push(this.corner[0], this.corner[1], this.corner[2])
        this.vertexList.push(this.corner[0] + this.length, this.corner[1], this.corner[2])
        this.vertexList.push(this.corner[0], this.corner[1] + this.length, this.corner[2])
        this.vertexList.push(this.corner[0], this.corner[1] + this.length, this.corner[2])
        this.vertexList.push(this.corner[0] + this.length, this.corner[1], this.corner[2])
        this.vertexList.push(this.corner[0] + this.length, this.corner[1] + this.length, this.corner[2])

        this.vertexList = new Float32Array(this.vertexList)
        // console.log(this.vertexList)
    }
}